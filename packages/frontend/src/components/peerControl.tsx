import { useCallback, useEffect, useState } from "react"
import { PeerProtoTuple } from '@/utils/types'
import { usePeerContext } from '../context/peer-ctx'
import { useLibp2pContext } from '@/context/ctx'
import { multiaddr } from '@multiformats/multiaddr'
import { connectToMultiaddr } from '../lib/libp2p'
import PeerInfo from "./peerInfo"
import type { Connection } from '@libp2p/interface-connection'
import { useListenAddressesContext } from '@/context/listen-addresses-ctx'

function PeerControl() {
    const { libp2p } = useLibp2pContext()
    const { peerStats, setPeerStats } = usePeerContext()
    const { listenAddresses, setListenAddresses } = useListenAddressesContext()
    const [maddr, setMultiaddr] = useState('')
    const [peersListOpen, setPeersListOpen] = useState<boolean>(false)
    const [manuallySet, setManuallySet] = useState<boolean>(false)

    useEffect(() => {
      const interval = setInterval(() => {
        const connections = libp2p.getConnections()
        setPeerStats({
          ...peerStats,
          peerIds: connections.map(conn => conn.remotePeer),
          connections: connections,
          connected: true
        })
      })
      //  libp2p.addEventListener('peer:connect', peerConnectedCB)    
        return () => {
//          libp2p.removeEventListener('peer:connect', peerConnectedCB)
        clearInterval(interval)   
      }
    }, [libp2p, peerStats, setPeerStats])

    const handleConnectToMultiaddr = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!maddr) {
            return
            }

            try {
            const connection = await connectToMultiaddr(libp2p)(multiaddr(maddr))
            //console.log('connection: ', connection)

            return connection
            } catch (e) {
            console.error(e)
            }
        },
        [libp2p, maddr],
    )

    useEffect(() => {
      const interval = setInterval(() => {
        const multiaddrs = libp2p.getMultiaddrs()
  
        setListenAddresses({
          ...listenAddresses,
          multiaddrs
        })
      }, 1000)
  
      return () => {
        clearInterval(interval)
      }
    }, [libp2p, listenAddresses, setListenAddresses])
  
    const getFormattedConnections = (connections: Connection[]): PeerProtoTuple[] => {
        const protoNames: Map<string, string[]> = new Map()
    
        connections.forEach((conn) => {
//          console.log(`connection ${JSON.stringify(conn)}`)
          const exists = protoNames.get(conn.remotePeer.toString())
          const dedupedProtonames = [...new Set(conn.remotePeer.toString())]
    
          if (exists?.length) {
            const namesToAdd = dedupedProtonames.filter((name) => !exists.includes(name))
            // console.log('namesToAdd: ', namesToAdd)
            protoNames.set(conn.remotePeer.toString(), [...exists, ...namesToAdd])
    
          } else {
            protoNames.set(conn.remotePeer.toString(), dedupedProtonames)
          }
        })
    
        return [...protoNames.entries()].map(([peerId, protocols]) => ({
          peerId,
          protocols,
        }))
    
    }
/*     
    useEffect(() => {
      getFormattedConnections(peerStats.connections)
      .map(
        (pair) =>
          console.log(`peer ${JSON.stringify(pair)}`)                            
      )
    },[])
 */
    const handleMultiaddrChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
        setMultiaddr(e.target.value)
    },
    [setMultiaddr],
    )
    return (
        <>
        <button
            onClick={() => setManuallySet(!manuallySet)}
        >Manual connect</button>
        {manuallySet &&
            <>
                <label
                htmlFor="peer-id"
                className="block text-sm font-medium leading-6 text-gray-900"
                >
                multiaddr to connect to
                </label>
                <div className="mt-2">
                <input
                    value={maddr}
                    type="text"
                    name="peer-id"
                    id="peer-id"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="12D3Koo..."
                    aria-describedby="multiaddr-id-description"
                    onChange={handleMultiaddrChange}
                />
                </div>
                <button
                type="button"
                className="rounded-md bg-indigo-600 my-2 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleConnectToMultiaddr}
                >
                Connect to multiaddr
                </button>
            </>
        }

      <div>
        {peerStats.peerIds.length > 0 ? (
          <>
            <h3 
              className="text-xl"
              onClick={() => setPeersListOpen(!peersListOpen)}
              style={{
                margin: "15px",
                cursor: "pointer"
              }}
            >
              {' '}
              Connected peers ({getFormattedConnections(peerStats.connections).length}){' '}
            </h3>
            {peersListOpen &&
              <pre className="px-2">
                {getFormattedConnections(peerStats.connections)
                  .map(
                    (pair) =>
                      <PeerInfo
                        key={pair.peerId}
                        peerId={pair.peerId}
                        protocols={pair.protocols}
                      />                            
                  )}
              </pre>
            }
          </>
        ) : null}
      </div>
    </>
    )
}

export default PeerControl;