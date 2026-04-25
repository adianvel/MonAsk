'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseUnits } from 'viem'
import { formatNumber } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CONTRACT_ADDRESSES, MONASK_ABI, DEPOSIT_POOL_ABI } from '@/lib/contracts'

export default function BorrowPage() {
  const { address, isConnected, chainId } = useAccount()
  const [borrowAmount, setBorrowAmount] = useState('')
  const [repayAmount, setRepayAmount] = useState('')

  const isTestnet = chainId === 10143
  const addresses = isTestnet ? CONTRACT_ADDRESSES.monadTestnet : CONTRACT_ADDRESSES.monad

  const { writeContract: borrow, isPending: isBorrowing } = useWriteContract()
  const { writeContract: repay, isPending: isRepaying } = useWriteContract()

  const { data: totalDeposited } = useReadContract({
    address: addresses.depositPool as `0x${string}`,
    abi: DEPOSIT_POOL_ABI,
    functionName: 'getTotalDeposited',
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

  const { data: canBorrow } = useReadContract({
    address: addresses.monAsk as `0x${string}`,
    abi: MONASK_ABI,
    functionName: 'canBorrow',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const handleBorrow = () => {
    borrow({
      address: addresses.monAsk as `0x${string}`,
      abi: MONASK_ABI,
      functionName: 'borrow',
      args: [parseUnits(borrowAmount, 6)],
    })
  }

  const handleRepay = () => {
    repay({
      address: addresses.monAsk as `0x${string}`,
      abi: MONASK_ABI,
      functionName: 'repay',
      args: [parseUnits(repayAmount, 6)],
    })
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Connect Wallet</h1>
        <p className="text-muted-foreground mt-2">Connect your wallet to borrow.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Borrow</h1>
        <p className="text-muted-foreground">Borrow against your recurring deposit collateral.</p>
      </div>

      <Tabs defaultValue="borrow" className="space-y-6">
        <TabsList>
          <TabsTrigger value="borrow">New Loan</TabsTrigger>
          <TabsTrigger value="repay">Repay</TabsTrigger>
        </TabsList>

        <TabsContent value="borrow">
          <Card>
            <CardHeader>
              <CardTitle>Borrow Against Your Deposits</CardTitle>
              <CardDescription>Loan-to-Value ratio: 70%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Total Deposited</p>
                  <p className="text-xl font-bold">${totalDeposited ? formatNumber(totalDeposited, 6) : '0.00'}</p>
                </div>
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Borrow Limit</p>
                  <p className="text-xl font-bold">${borrowLimit ? formatNumber(borrowLimit, 6) : '0.00'}</p>
                </div>
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Health Factor</p>
                  <p className="text-xl font-bold">
                    {healthFactor ? (
                      <Badge variant={healthFactor > 150 ? "default" : healthFactor > 100 ? "secondary" : "destructive"}>
                        {healthFactor.toString()}%
                      </Badge>
                    ) : (
                      <Badge variant="secondary">N/A</Badge>
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Borrow Amount (USDC)</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="0"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                />
                {canBorrow === false && (
                  <p className="text-xs text-red-500">You are not eligible to borrow yet. Need 3+ months of deposits.</p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">Loan Terms</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Interest rate: 7.5% APR (variable)</p>
                  <p>Duration: 1 year (auto-renewing)</p>
                  <p>Repayment: Monthly or lump sum</p>
                  <p className="text-xs mt-2 text-yellow-600 dark:text-yellow-400">
                    Requirements: 3+ months of deposits, active plan, no existing loan
                  </p>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleBorrow} 
                disabled={isBorrowing || canBorrow === false}
              >
                {isBorrowing ? 'Borrowing...' : 'Borrow'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repay">
          <Card>
            <CardHeader>
              <CardTitle>Repay Loan</CardTitle>
              <CardDescription>Pay back your borrowed amount plus interest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">Current Loan</p>
                <p className="text-xs text-muted-foreground">
                  {healthFactor && healthFactor < 999999 ? 'Active loan detected' : 'No active loan to repay.'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Repay Amount (USDC)</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="0"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleRepay}
                disabled={isRepaying}
              >
                {isRepaying ? 'Repaying...' : 'Repay'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
