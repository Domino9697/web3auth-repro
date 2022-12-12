import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from '@web3auth/base'
import { Web3AuthCore } from '@web3auth/core'
import { MetamaskAdapter } from '@web3auth/metamask-adapter'
import React, { useEffect, useState } from 'react'

import { createEthereumRpc } from './evm.ethers'

export interface Web3AuthContextType {
  provider: SafeEventEmitterProvider | null
  web3auth: Web3AuthCore | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const Web3AuthContext = React.createContext<Web3AuthContextType>({
  provider: null,
  web3auth: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
})

export const Web3AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  )

  const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID ?? ''

  useEffect(() => {
    const init = async () => {
      try {
        const web3authCore = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1',
            rpcTarget:
              'https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c',
          },
        })

        const metamaskAdapter = new MetamaskAdapter({
          clientId,
        })

        web3authCore.configureAdapter(metamaskAdapter)

        setWeb3auth(web3authCore)

        await web3authCore.init()

        if (web3authCore.provider) {
          setProvider(web3authCore.provider)
        }
      } catch (error) {
        console.error(error)
      }
    }
    void init()
  }, [])

  const login = React.useCallback(async () => {
    if (!web3auth) {
      throw new Error('web3auth not initialized yet')
    }

    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.METAMASK)

    if (!web3authProvider) {
      throw new Error('provider not initialized yet')
    }
    const rpc = createEthereumRpc(web3authProvider)
    const walletId = await rpc.getAccount()

    // Retrieve the ID token from web3auth
    const { idToken } = await web3auth.authenticateUser()

    // Login with the backend
    // await loginWeb3Auth({ walletId, jwt: idToken })

    setProvider(web3authProvider)
  }, [web3auth])


  const logout = React.useCallback(async () => {
    if (!web3auth) {
      throw new Error('web3auth not initialized yet')
    }
    await web3auth.logout()
    setProvider(null)
  }, [web3auth])

  const value = React.useMemo(
    () => ({
      web3auth,
      provider,
      login,
      logout,
    }),
    [
      web3auth,
      provider,
      login,
      logout,
    ]
  )

  return (
    <Web3AuthContext.Provider value={value} >
      {children}
    </Web3AuthContext.Provider>
  )
}
