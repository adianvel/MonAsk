export const CONTRACT_ADDRESSES = {
  monadTestnet: {
    studentIdentity: '0x524A7436505E247BEA8FDfFd4c933343a1A4C9b8',
    depositPool: '0x8Ff874Ae06a7B9894782A7d7117614812d89168A',
    monAsk: '0x5ff0B56cBBE60d19A6C61afD0A6fA8C2C9D8FaaE',
    usdc: '0x738BdF6a38f28453e07bDeFB5221aFf682965C76',
  },
  monad: {
    studentIdentity: '0x...',
    depositPool: '0x...',
    monAsk: '0x...',
    usdc: '0x...',
  },
} as const

export const DEPOSIT_POOL_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tenorMonths', type: 'uint256' }, { internalType: 'uint256', name: 'minimumDeposit_', type: 'uint256' }],
    name: 'createPlan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'student', type: 'address' }],
    name: 'getTotalDeposited',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'student', type: 'address' }],
    name: 'getMonthsCompleted',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'student', type: 'address' }],
    name: 'isPlanActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const MONASK_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'student', type: 'address' }],
    name: 'getBorrowLimit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'student', type: 'address' }],
    name: 'getHealthFactor',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'student', type: 'address' }],
    name: 'canBorrow',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'repay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const USDC_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'address', name: 'spender', type: 'address' }],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'value', type: 'uint256' }],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
