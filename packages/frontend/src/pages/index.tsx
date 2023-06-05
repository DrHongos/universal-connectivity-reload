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

export default function Home() {
  const { libp2p } = useLibp2pContext()
  const [topicSelected, setTopicSelected] = useState<string>(CHAT_TOPIC)

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
                <Account />
                <h3 className="text-xl">
                  {' '}
                  Your node
                </h3>
                <PeerInfo
                  peerId={libp2p.peerId.toString()}
                  protocols={[]}
                />
                <PeerControl />
                <TopicsControl
                  topicSelected={topicSelected}
                  setTopicSelected={setTopicSelected}
                />

                <Image
                  src="/libp2p-hero.svg"
                  alt="libp2p logo"
                  height="240"
                  width="240"
                  style={{margin: "auto", marginTop: "15px"}}
                />
              </div>

              </div>
              <div style={{width: '70%'}}>
                <ChatContainer
                  topic={topicSelected}
                />
              </div>
            </div>
          </main>
        </div>
      </main>
    </>
  )
}

