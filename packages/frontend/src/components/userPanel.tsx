import { useState, ChangeEvent } from "react";
import { useUserInfoContext } from "@/context/user-ctx";
import { json } from '@helia/json'
import { useLibp2pContext } from "@/context/ctx";
import { copyToClipboard } from "@/utils/helpers";

function UserPanel(/* {topicSelected, setTopicSelected}: TopicsControlProps */) {
    const { name, setName } = useUserInfoContext()
    const { helia, fs } = useLibp2pContext()
    const [nameTo, setNameTo] = useState<string>(name)
    const [dataCid, setDataCid] = useState<string | undefined>()
    const [selectedFile, setSelectedFile] = useState<File | undefined>();

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
        setDataCid(cid.toString())
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
        
    async function loadFile() {
        if(selectedFile) {
            readFileAsUint8Array(selectedFile)
                .then(async(uint8Array) => {
                    const cid = await fs.addBytes(uint8Array)
                    console.log(`${selectedFile?.name} loaded in CID: ${cid}`)
                    setDataCid(cid.toString())
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
            <h3 className="text-xl">
            {' '}
            Your info
            </h3>
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
            <hr />
            {dataCid &&
                <div>
                    {dataCid}
                    <button
                        onClick={() => copyToClipboard(dataCid)}
                    >Copy</button>
                </div>
            }
            <hr />
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

export default UserPanel;