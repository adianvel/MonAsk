# MonAsk

> Recurring Deposit Lending Protocol for Students on Monad

## Problem

College students have **future income potential** but **no collateral**. Traditional DeFi lending won't accept them because they can't post crypto assets as collateral. Banks offer Recurring Deposit (RD) products where you save monthly and can borrow against it — but there's no DeFi equivalent for students.

## Solution

**MonAsk** brings the bank RD model on-chain for students:

1. **Verify** student identity with `.edu` / `.ac.id` email + student ID card
2. **Deposit** stablecoins monthly (like a bank RD/SIP)
3. **Earn yield** from auto-staked deposits
4. **Borrow** up to 70% of total deposits after 3 months of saving

The 4-year tenor matches a standard Bachelor's degree timeline — students save throughout college and graduate with savings + credit history.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Chain | Monad (EVM, testnet chainId: 10143) |
| Smart Contracts | Foundry + Solidity 0.8.28 + OpenZeppelin |
| Frontend | Next.js 16 + shadcn/ui + Wagmi v2 + RainbowKit |
| Stablecoin | MockUSDC (for demo) |

## Smart Contracts (Monad Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| MockUSDC | `0x738BdF6a38f28453e07bDeFB5221aFf682965C76` | Demo stablecoin |
| StudentIdentity | `0x36DD5320540e03Bc5d2A28A57CF680C64C4DAa70` | Student verification registry |
| DepositPool | `0x4619cd5838ee884538367fFd82033DF0e5CC1e37` | RD plan creation & monthly deposits |
| MonAsk | `0x182628cA13d3769C107B9b75A6617b281DE6ac08` | Lending engine (borrow/repay/liquidate) |

## Key Parameters

- **LTV**: 70%
- **Minimum deposits before borrow**: 3 months
- **Base interest rate**: 7.5% APR
- **Grace period**: 30 days
- **Liquidation**: After 60 days no deposit
- **Tenor**: 4 years (48 months) for Bachelor's

## Project Structure

```
├── contracts/           # Foundry smart contracts
│   ├── src/
│   │   ├── MockUSDC.sol
│   │   ├── StudentIdentity.sol
│   │   ├── DepositPool.sol
│   │   ├── MonAsk.sol
│   │   └── interfaces/
│   ├── script/Deploy.s.sol
│   └── test/MonAsk.t.sol
├── web/                 # Next.js frontend
│   ├── src/app/         # Pages (dashboard, deposit, borrow, verify)
│   ├── src/components/  # UI components
│   └── src/lib/         # Contract ABIs & addresses
└── AGENTS.md            # Project context
```

## How to Run

### Contracts

```bash
cd contracts
forge install
forge build
forge test
```

### Frontend

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`

## Demo Flow

1. Connect wallet on **Monad Testnet**
2. Go to `/deposit` → Mint free MockUSDC
3. Create a deposit plan (48 months, $10/month minimum)
4. Make monthly deposits
5. After 3 deposits, go to `/borrow` to take a loan

## Monad Integration

- **Fast finality**: Monad's 400ms blocks make deposit/borrow transactions feel instant
- **Low fees**: Students can deposit small amounts ($10/month) without high gas costs
- **EVM compatible**: Used Foundry + Wagmi with zero chain-specific modifications

## Team

Built for **Monad Blitz Jogja** hackathon.
