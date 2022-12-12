import type { SafeEventEmitterProvider } from '@web3auth/base'
import { ethers } from 'ethers'

export const createEthereumRpc = (
  externalProvider: SafeEventEmitterProvider
) => {
  const getAccounts = async (): Promise<string> => {
    try {
      const provider = new ethers.providers.Web3Provider(externalProvider)
      const signer = provider.getSigner()
      const account = await signer.getAddress()

      return account
    } catch (error: unknown) {
      return error as string
    }
  }

  return {
    getAccount: getAccounts,
  }
}
