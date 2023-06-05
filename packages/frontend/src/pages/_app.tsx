import { AppWrapper } from '@/context/ctx'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
 
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)
 
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </WagmiConfig>
  )
}
