# MonAsk - Student Lending Protocol on Monad

## Project Overview
MonAsk is a recurring deposit (RD) lending protocol for college students on Monad. Students verify with .ac.id/.edu emails, deposit stablecoins monthly (like a bank RD), earn yield from staking, and borrow against their deposits.

## Stack
- **Chain**: Monad (EVM) - testnet chainId: 10143, mainnet: 143
- **Contracts**: Foundry (Solidity 0.8.28)
- **Frontend**: Next.js 16.2 + shadcn/ui + Wagmi v2 + RainbowKit
- **Stablecoin**: USDC on Monad

## Smart Contracts (`contracts/`)
| Contract | Path | Purpose |
|----------|------|---------|
| StudentIdentity | `src/StudentIdentity.sol` | Off-chain verification, stores hash proof |
| DepositPool | `src/DepositPool.sol` | RD plan creation, monthly deposits, grace/liquidation |
| MonAsk | `src/MonAsk.sol` | Lending: borrow against deposits, repay, liquidate |

## Key Parameters
- LTV: 70%
- Min deposits before borrow: 3 months
- Base interest rate: 7.5% APR
- Grace period: 30 days
- Liquidation: after 60 days no deposit

## Setup
```bash
# Contracts
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
forge build

# Frontend
cd web
npm install
npm run dev
```

## Environment
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID (required for wallet connect to work)
- `PRIVATE_KEY` - Deployer private key (for contract deployment)
- `STABLECOIN_ADDR` - USDC address on Monad testnet

## Deployed Contracts (Monad Testnet - Chain ID 10143)
| Contract | Address |
|----------|---------|
| MockUSDC | `0x738BdF6a38f28453e07bDeFB5221aFf682965C76` |
| StudentIdentity | `0x36DD5320540e03Bc5d2A28A57CF680C64C4DAa70` |
| DepositPool | `0x4619cd5838ee884538367fFd82033DF0e5CC1e37` |
| MonAsk | `0x182628cA13d3769C107B9b75A6617b281DE6ac08` |

## Monad Addresses
- WMON (mainnet): 0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A
- USDC on testnet: verify via agents.devnads.com/v1/verify
