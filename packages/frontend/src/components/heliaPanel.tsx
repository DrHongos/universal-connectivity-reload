import { useState, ChangeEvent } from "react";
import { useUserInfoContext } from "@/context/user-ctx";
import { json } from '@helia/json'
import { useLibp2pContext } from "@/context/ctx";
import { copyToClipboard, short_text } from "@/utils/helpers";
import Image from 'next/image'
import { car } from '@helia/car'
import { CarWriter } from '@ipld/car'
import { CarBlockIterator } from '@ipld/car'
import { type CID } from 'multiformats'
import toIterable from 'stream-to-it'

function HeliaPanel(/* {topicSelected, setTopicSelected}: TopicsControlProps */) {
    const { name, setName } = useUserInfoContext()
    const { helia, fs } = useLibp2pContext()
    const [nameTo, setNameTo] = useState<string>(name)
    const [dataCid, setDataCid] = useState<CID | undefined>()
    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [carset, setCarset] = useState<any>()
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setSelectedFile(file);
    };

    async function createDAG() {        
        const j = json(helia)
        const cid = await j.add(
            { 
                name: nameTo 
            }
        )
        setDataCid(cid)
    }
    function readFileAsUint8Array(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            resolve(uint8Array);
          };
      
          reader.onerror = (error) => {
            reject(error);
          };
      
          reader.readAsArrayBuffer(file);
        });
      }

    async function importCar() {
        if(selectedFile) {
            const inStream = selectedFile.stream()
            const CarIterator = await CarBlockIterator.fromIterable(toIterable.source(inStream))
            for await (const { cid, bytes } of CarIterator) {
              // add blocks to helia to ensure they are available while navigating children
              await helia.blockstore.put(cid, bytes)
            }
            const cidRoots = await CarIterator.getRoots()
            let cidB = cidRoots[0]
            console.log(`cid: ${cidB}`)
            setDataCid(cidB)
            let carB = helia.blockstore.get(cidB)
            console.log(`car: ${JSON.stringify(carB)}`)
            
            
        }
    }

    async function loadFile() {
        if(selectedFile) {
            readFileAsUint8Array(selectedFile)
                .then(async(uint8Array) => {
                    const cid = await fs.addBytes(uint8Array)
                    console.log(`${selectedFile?.name} loaded in CID: ${cid}`)
                    setDataCid(cid)
                    // try to create CAR
                    if (await helia.blockstore.has(cid)) {
                        const { writer, out } = CarWriter.create(cid)
//                        let blocks = await helia.blockstore.get(cid)
                        writer.put({
                            cid: cid,
                            bytes: uint8Array
                        })
                        writer.close()
//                        console.log(`writer ${JSON.stringify(writer)}`)
                        let c = car(helia)
                        let carF = await c.export(cid, writer)
                        console.log(`CAR? ${carF}`)

                        setCarset(carF)
                    } else {
                        console.error("Helia does not have this CID")
                    }
                  
            
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("No file selected")
        }
    }

    return (
        <>  
        <div
            style={{border: "1px solid gray", padding: "10px", borderRadius: "10px"}}
        >
            <div style={{
                width:"100%",
                display: "flex",
                justifyContent: "space-between"
            }}>

                <h3 className="text-xl">
                {' '}
                Helia (IPFS)
                </h3>
                <Image
                    src="/helia.png"
                    alt="helia logo"
                    height="40"
                    width="40"
                    style={{margin: "auto", marginRight: "5px"}}
                />
            </div>
{/*
             <hr style={{marginBottom: "15px"}}></hr>
            <input 
                style={{
                    borderRadius: "10px",
                    padding: "5px",
                    marginRight: "15px",
                    border: "1px solid magenta",
                    width: "40%"
                }}
                value={nameTo}
                onChange={e => setNameTo(e.target.value)}
            />
            <button
                disabled={nameTo.length === 0 || nameTo === name}
                onClick={() => createDAG()}
            >
            {nameTo.length > 0 && nameTo != name ? "Edit!" : "Change your information"}
            </button>
             */}
            <hr />
            {dataCid &&
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    {short_text(dataCid.toString())}
                    <button
                        onClick={() => copyToClipboard(dataCid.toString())}
                    >Copy</button>

                </div>
            }
            <hr />
            {/* send to component */}
            <h3>Load file</h3>
            <input type="file" onChange={handleFileChange} />
            {selectedFile && (
                <div>
                    <h4>Selected File:</h4>
                    <p>Name: {selectedFile.name}</p>
                    <p>Size: {selectedFile.size} bytes</p>
                    <p>Type: {selectedFile.type}</p>
                    <button
                        onClick={() => loadFile()}
                    >Load to IPFS</button>
                </div>
            )}



      </div>
    </>
    )
}

export default HeliaPanel;