'use client'

import { useAccount, useReadContract } from 'wagmi'
import { formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">MonAsk</h1>
          <p className="text-muted-foreground max-w-md">
            Recurring deposit lending for students on Monad.
            Deposit monthly, earn yield, borrow against your savings.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/verify"><Button size="lg">Get Started</Button></Link>
          <Link href="/deposit"><Button variant="outline" size="lg">Deposit Now</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposited</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalDeposited ? formatNumber(totalDeposited, 6) : '0.00'}</p>
            <p className="text-xs text-muted-foreground mt-1">{monthsCompleted ? monthsCompleted.toString() : '0'} Deposits Made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Borrow Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${borrowLimit ? formatNumber(borrowLimit, 6) : '0.00'}</p>
            <p className="text-xs text-muted-foreground mt-1">70% LTV</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {healthFactor && healthFactor < 999999 ? `${healthFactor.toString()}%` : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">From staked deposits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deposit Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPlanActive ? (
              <div className="space-y-2">
                <p className="text-sm text-green-600 font-medium">Active Plan</p>
                <p className="text-sm text-muted-foreground">
                  Total deposited: ${totalDeposited ? formatNumber(totalDeposited, 6) : '0.00'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Deposits Made: {monthsCompleted ? monthsCompleted.toString() : '0'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active deposit plan. Start your recurring deposit to unlock borrowing.</p>
            )}
            <Link href="/deposit"><Button>{isPlanActive ? 'Deposit More' : 'Create Plan'}</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthFactor && healthFactor < 999999 ? (
              <div className="space-y-2">
                <p className="text-sm text-yellow-600 font-medium">Active Loan</p>
                <p className="text-sm text-muted-foreground">Health factor: {healthFactor.toString()}%</p>
                <p className="text-sm text-muted-foreground">
                  Borrow limit: ${borrowLimit ? formatNumber(borrowLimit, 6) : '0.00'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active loans. Complete 3 months of deposits to start borrowing.</p>
            )}
            <Link href="/borrow"><Button variant="outline">{healthFactor && healthFactor < 999999 ? 'Repay' : 'Borrow Now'}</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
