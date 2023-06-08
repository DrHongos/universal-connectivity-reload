import Head from 'next/head'
import { useLibp2pContext } from '@/context/ctx'
import { useState } from 'react'
import Image from 'next/image'
import ChatContainer from '@/components/chat'
import PeerInfo from '@/components/peerInfo'
import PeerControl from '@/components/peerControl'
import TopicsControl from '@/components/topicsControl'
import { CHAT_TOPIC } from '@/lib/constants'
import Account from '@/components/account'
import ValidateAccount from '@/components/validateButton'
import HeliaPanel from '@/components/heliaPanel'

export default function Home() {
  const { libp2p } = useLibp2pContext()
  const [topicSelected, setTopicSelected] = useState<string>(CHAT_TOPIC)
  const [tool, setTool] = useState<string>("chat")
  return (
    <>
      <Head>
        <title>Universal Connectivity</title>
        <meta name="description" content="universal connectivity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-full">
        <div className="py-10">
          <main>
            <div style={{display: "flex"}}>
              <div style={{width: '60%'}}>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div style={{
                  border: "1px solid gray",
                  padding: "10px",
                  borderRadius: "10px"
                }}>
                  <Account />
                  <ValidateAccount />
                </div>

                <div style={{
                  border: "1px solid gray",
                  padding: "10px",
                  borderRadius: "10px"
                }}>
                  <div style={{
                    width:"100%",
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <h3 className="text-xl">
                      {' '}
                      Libp2p
                    </h3>
                    <Image
                      src="/libp2p-hero.svg"
                      alt="libp2p logo"
                      height="40"
                      width="40"
                      style={{margin: "auto", marginRight: "5px"}}
                    />
                  </div>
                  <PeerInfo
                    peerId={libp2p.peerId.toString()}
                    protocols={[]}
                  />
                  <PeerControl />
                  <button
                    onClick={() => {
                      if(tool === "chat") setTool("")
                      else setTool("chat")
                    }}
                  >CHAT</button>
                  <TopicsControl
                    topicSelected={topicSelected}
                    setTopicSelected={setTopicSelected}
                  />
                </div>
                <HeliaPanel />
              </div>

              </div>
              <div style={{width: '70%'}}>
              {tool === "chat" &&
                <ChatContainer
                  topic={topicSelected}
                />
              }
              </div>
            </div>
          </main>
        </div>
      </main>
    </>
  )
}

