import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monadscan', url: 'https://testnet.monadscan.xyz' },
  },
  testnet: true,
} as const

const monad = {
  id: 143,
  name: 'Monad',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
    public: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monadscan', url: 'https://monadscan.xyz' },
  },
} as const

export const config = getDefaultConfig({
  appName: 'MonAsk',
  projectId: '1026fa5dd36949d144ef5a9d4f135bb1',
  chains: [monad as any, monadTestnet as any],
  transports: {
    [monad.id]: http('https://rpc.monad.xyz'),
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
  ssr: true,
})
