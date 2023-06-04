import Head from 'next/head'
//import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
//import Nav from '@/components/nav'
import { useLibp2pContext } from '@/context/ctx'
import type { Connection } from '@libp2p/interface-connection'
import { usePeerContext } from '../context/peer-ctx'
import { useCallback, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { multiaddr } from '@multiformats/multiaddr'
import { connectToMultiaddr } from '../lib/libp2p'
import ChatContainer from '@/components/chat'
import { createIcon } from '@download/blockies'

type PeerProtoTuple = {
  peerId: string
  protocols: string[]
}

function short_text(text: string): string {
  return `${text.slice(0, 5)}...${text.slice(-5)}`
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch((error) => {
      console.error('Error copying text to clipboard:', error);
    });
}

function PeerData({peerId, protocols}: PeerProtoTuple) {
  const msgref = useRef<HTMLLIElement>(null)
  useEffect(() => {
    const icon = createIcon({
      seed: peerId,
      size: 15,
      scale: 3,
    })
    icon.className = 'rounded mr-2 max-h-8 max-w-8'
    const childrenCount = msgref.current?.childElementCount
    // Prevent inserting an icon more than once.
    if (childrenCount && childrenCount < 2) {
      msgref.current?.insertBefore(icon, msgref.current?.firstChild)
    }
  }, [peerId])

  return (
    <li ref={msgref} className={`flex justify-start`}>
      <div
        className="flex relative max-w-xl px-4 py-2 text-gray-700 rounded shadow bg-white"
        style={{justifyContent: 'space-between', width: '100%'}}
      >
        {short_text(peerId)}
        <button
          style={{
            border: '1px solid gray',
            borderRadius: '5px',
            backgroundColor: 'lightgray',
            padding: '5px'
          }} 
          onClick={() => copyToClipboard(`${peerId}`)}
        >Copy</button>
      </div>
    </li>
  )
}

export default function Home() {
  const { libp2p } = useLibp2pContext()
  const { peerStats, setPeerStats } = usePeerContext()
  const [maddr, setMultiaddr] = useState('')

  const msgref = useRef<HTMLLIElement>(null)
  useEffect(() => {
    const icon = createIcon({
      seed: libp2p.peerId,
      size: 15,
      scale: 3,
    })
    icon.className = 'rounded mr-2 max-h-10 max-w-10'
    const childrenCount = msgref.current?.childElementCount
    // Prevent inserting an icon more than once.
    if (childrenCount && childrenCount < 2) {
      msgref.current?.insertBefore(icon, msgref.current?.firstChild)
    }
  }, [libp2p])

  useEffect(() => {
    const peerConnectedCB = (evt: any) => {
      const connection = evt.detail
      setPeerStats({ ...peerStats, peerIds: [...peerStats.peerIds, connection.remotePeer], connections: [...peerStats.connections, connection], connected: true })
    }

    libp2p.addEventListener('peer:connect', peerConnectedCB)

    return () => {
      libp2p.removeEventListener('peer:connect', peerConnectedCB)
    }
  }, [libp2p, peerStats, setPeerStats])

  const getFormattedConnections = (connections: Connection[]): PeerProtoTuple[] => {
    const protoNames: Map<string, string[]> = new Map()

    connections.forEach((conn) => {
      const exists = protoNames.get(conn.remotePeer.toString())
      const dedupedProtonames = [...new Set(conn.remoteAddr.protoNames())]

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

  const handleConnectToMultiaddr = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!maddr) {
        return
      }

      try {
        const connection = await connectToMultiaddr(libp2p)(multiaddr(maddr))
        console.log('connection: ', connection)

        return connection
      } catch (e) {
        console.error(e)
      }
    },
    [libp2p, maddr],
  )

  const handleMultiaddrChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMultiaddr(e.target.value)
    },
    [setMultiaddr],
  )

  return (
    <>
      <Head>
        <title>Universal Connectivity</title>
        <meta name="description" content="universal connectivity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-full">
{/*         <Nav /> */}
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 flex flex-row">
                <p className="mr-4">Universal Connectivity</p>
                <Image
                  src="/libp2p-hero.svg"
                  alt="libp2p logo"
                  height="46"
                  width="46"
                />
              </h1>
            </div>
          </header>
          <main>
            <div style={{display: "flex"}}>
              <div style={{width: '30%'}}>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h3 className="text-xl">
                  {' '}
                  Your node
                </h3>
                <PeerData
                  peerId={libp2p.peerId.toString()}
                  protocols={[]}
                />
                <h3 className="text-xl">
                  {' '}
                  Your topics
                </h3>
                <ul>
                  {libp2p.pubsub.getTopics().map((d) => 
                    <li>{d}</li>
                  )}
                </ul>
{/* make it an expandable tool
                <div className="my-6 w-1/2">
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
                </div>
 */}
                <div>
                  {peerStats.peerIds.length > 0 ? (
                    <>
                      <h3 className="text-xl">
                        {' '}
                        Connected peers ({getFormattedConnections(peerStats.connections).length}){' '}
                      </h3>
                      <pre className="px-2">
                        {getFormattedConnections(peerStats.connections)
                          .map(
                            (pair) =>
                              <PeerData
                                key={pair.peerId}
                                peerId={pair.peerId}
                                protocols={pair.protocols}
                              />                            
                          )}
                      </pre>
                    </>
                  ) : null}
                </div>
              </div>

              </div>
              <div style={{width: '70%'}}>
                <ChatContainer />
              </div>
            </div>
          </main>
        </div>
      </main>
    </>
  )
}

