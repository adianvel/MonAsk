'use client'

import { useAccount, useReadContract } from 'wagmi'
import { formatNumber } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CONTRACT_ADDRESSES, DEPOSIT_POOL_ABI, MONASK_ABI } from '@/lib/contracts'

export default function Dashboard() {
  const { address, isConnected, chainId } = useAccount()

  const isTestnet = chainId === 10143
  const addresses = isTestnet ? CONTRACT_ADDRESSES.monadTestnet : CONTRACT_ADDRESSES.monad

  const { data: totalDeposited } = useReadContract({
    address: addresses.depositPool as `0x${string}`,
    abi: DEPOSIT_POOL_ABI,
    functionName: 'getTotalDeposited',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: monthsCompleted } = useReadContract({
    address: addresses.depositPool as `0x${string}`,
    abi: DEPOSIT_POOL_ABI,
    functionName: 'getMonthsCompleted',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: borrowLimit } = useReadContract({
    address: addresses.monAsk as `0x${string}`,
    abi: MONASK_ABI,
    functionName: 'getBorrowLimit',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: healthFactor } = useReadContract({
    address: addresses.monAsk as `0x${string}`,
    abi: MONASK_ABI,
    functionName: 'getHealthFactor',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: isPlanActive } = useReadContract({
    address: addresses.depositPool as `0x${string}`,
    abi: DEPOSIT_POOL_ABI,
    functionName: 'isPlanActive',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-white">MonAsk</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            The universal lending network for students. 
            Deposit monthly, earn yield, borrow against your savings.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/deposit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              Launch App
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-12 mt-12 text-center">
          <div>
            <p className="text-3xl font-bold text-white">$0.00</p>
            <p className="text-sm text-muted-foreground mt-1">Deposits</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">$0.00</p>
            <p className="text-sm text-muted-foreground mt-1">Loans</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-muted-foreground text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Deposited</p>
            <p className="text-3xl font-bold text-white">${totalDeposited ? formatNumber(totalDeposited, 6) : '0.00'}</p>
            <p className="text-xs text-muted-foreground mt-2">{monthsCompleted ? monthsCompleted.toString() : '0'} deposits made</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Borrow Limit</p>
            <p className="text-3xl font-bold text-white">${borrowLimit ? formatNumber(borrowLimit, 6) : '0.00'}</p>
            <p className="text-xs text-muted-foreground mt-2">70% LTV ratio</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Health Factor</p>
            <p className="text-3xl font-bold text-white">
              {healthFactor && healthFactor < 999999 ? `${healthFactor.toString()}%` : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Safe above 100%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">Deposit Plan</p>
              {isPlanActive && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>}
            </div>
            {isPlanActive ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Total deposited: ${totalDeposited ? formatNumber(totalDeposited, 6) : '0.00'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Deposits made: {monthsCompleted ? monthsCompleted.toString() : '0'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active deposit plan. Create one to start saving.</p>
            )}
            <Link href="/deposit">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                {isPlanActive ? 'Deposit More' : 'Create Plan'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">Active Loan</p>
              {healthFactor && healthFactor < 999999 && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Active</span>}
            </div>
            {healthFactor && healthFactor < 999999 ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Health factor: {healthFactor.toString()}%</p>
                <p className="text-sm text-muted-foreground">
                  Borrow limit: ${borrowLimit ? formatNumber(borrowLimit, 6) : '0.00'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active loans. Deposit 3 times to unlock borrowing.</p>
            )}
            <Link href="/borrow">
              <Button variant="outline" className="w-full border-border/50 hover:bg-secondary">
                {healthFactor && healthFactor < 999999 ? 'Repay Loan' : 'Borrow Now'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
