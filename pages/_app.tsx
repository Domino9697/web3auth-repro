import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3AuthContextProvider } from '../lib/web3authcontext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3AuthContextProvider>
      <Component {...pageProps} />
    </Web3AuthContextProvider>

  )
}
