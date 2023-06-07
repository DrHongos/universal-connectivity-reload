import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { Libp2p, ServiceMap } from '@libp2p/interface-libp2p';
import { startLibp2p } from '../lib/libp2p';
import { ChatProvider } from './chat-ctx';
import { PeerProvider } from './peer-ctx';
import { UserProvider } from './user-ctx';
import { ListenAddressesProvider } from './listen-addresses-ctx';
import { PubSub } from '@libp2p/interface-pubsub';
import { createHelia } from 'helia';
import { unixfs, UnixFS } from '@helia/unixfs'
import type { Helia } from '@helia/interface';
// 👇 The context type will be avilable "anywhere" in the app
interface Libp2pContextInterface {
  libp2p: Libp2p<{pubsub: PubSub}>,
  helia: Helia<Libp2p<ServiceMap>>,
  fs: UnixFS
}
export const libp2pContext = createContext<Libp2pContextInterface>({
  // @ts-ignore to avoid having to check isn't undefined everywhere. Can't be undefined because children are conditionally rendered
  libp2p: undefined,
  // @ts-ignore 
  helia: undefined,
  // @ts-ignore
  fs: undefined
})

interface WrapperProps {
  children?: ReactNode
}
let loaded = false
export function AppWrapper({ children }: WrapperProps) {
  const [libp2p, setLibp2p] = useState<Libp2p<{pubsub: PubSub}>>()
  const [helia, setHelia] = useState<Helia>()
  const [fs, setFs] = useState<UnixFS>()
  useEffect(() => {
    const init = async () => {
      if (loaded) return
      try {
        loaded = true
        const libp2p = await startLibp2p()    // this are two independent implementations of libp2p
        const helia = await createHelia({     // here is created a new one (non compliant)
          libp2p: libp2p
        })
        // @ts-ignore
        window.ipfs = helia // ??
        // @ts-ignore
        window.libp2p = libp2p
        setHelia(helia)
        setLibp2p(libp2p)
        setFs(unixfs(helia))
      } catch (e) {
        console.error('failed to start libp2p', e)
      }
    }

    init()
  }, [])

  if (!libp2p || !helia || !fs) {
    return (
      <div>
        <h2>Initializing libp2p peer...</h2>
      </div>
    )
  }

  return (
    <libp2pContext.Provider value={{ libp2p, helia, fs }}>
        <ChatProvider>
          <PeerProvider>
            <UserProvider>
              <ListenAddressesProvider>
                {children}
              </ListenAddressesProvider>
            </UserProvider>
          </PeerProvider>
        </ChatProvider>
    </libp2pContext.Provider>
  )
}

export function useLibp2pContext() {
  return useContext(libp2pContext)
}
