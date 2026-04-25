'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { formatNumber } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CONTRACT_ADDRESSES, DEPOSIT_POOL_ABI, USDC_ABI } from '@/lib/contracts'

const TENOR_OPTIONS = [
  { value: '48', label: '4 Years (Bachelor)' },
  { value: '24', label: '2 Years (Master)' },
  { value: '12', label: '1 Year' },
  { value: '6', label: '6 Months' },
]

export default function DepositPage() {
  const { address, isConnected, chainId } = useAccount()
  const [tenor, setTenor] = useState('48')
  const [minDeposit, setMinDeposit] = useState('10')
  const [depositAmount, setDepositAmount] = useState('')
  const [mintAmount, setMintAmount] = useState('1000')
  const [lastHash, setLastHash] = useState<`0x${string}` | undefined>(undefined)

  const isTestnet = chainId === 10143
  const addresses = isTestnet ? CONTRACT_ADDRESSES.monadTestnet : CONTRACT_ADDRESSES.monad

  const { writeContract: mintUsdc, isPending: isMinting, data: mintHash } = useWriteContract()
  const { writeContract: approveUsdc, isPending: isApproving, data: approveHash } = useWriteContract()
  const { writeContract: createPlan, isPending: isCreating, data: createHash } = useWriteContract()
  const { writeContract: deposit, isPending: isDepositing, data: depositHash } = useWriteContract()

  useWaitForTransactionReceipt({
    hash: mintHash,
    query: {
      enabled: !!mintHash,
      meta: { refresh: true },
    },
  })

  useWaitForTransactionReceipt({
    hash: approveHash,
    query: {
      enabled: !!approveHash,
      meta: { refresh: true },
    },
  })

  useWaitForTransactionReceipt({
    hash: createHash,
    query: {
      enabled: !!createHash,
      meta: { refresh: true },
    },
  })

  useWaitForTransactionReceipt({
    hash: depositHash,
    query: {
      enabled: !!depositHash,
      meta: { refresh: true },
    },
  })

  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: addresses.usdc as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: totalDeposited, refetch: refetchDeposited } = useReadContract({
    address: addresses.depositPool as `0x${string}`,
    abi: DEPOSIT_POOL_ABI,
    functionName: 'getTotalDeposited',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: monthsCompleted, refetch: refetchMonths } = useReadContract({
    address: addresses.depositPool as `0x${string}`,
    abi: DEPOSIT_POOL_ABI,
    functionName: 'getMonthsCompleted',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: addresses.usdc as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, addresses.depositPool] : undefined,
    query: { enabled: !!address },
  })

  const handleMint = () => {
    if (!address) return
    mintUsdc({
      address: addresses.usdc as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'mint',
      args: [address, parseUnits(mintAmount, 6)],
    }, {
      onSuccess: () => {
        setTimeout(() => refetchBalance(), 2000)
      }
    })
  }

  const handleCreatePlan = () => {
    createPlan({
      address: addresses.depositPool as `0x${string}`,
      abi: DEPOSIT_POOL_ABI,
      functionName: 'createPlan',
      args: [BigInt(tenor), parseUnits(minDeposit, 6)],
    }, {
      onSuccess: () => {
        setTimeout(() => {
          refetchDeposited()
          refetchMonths()
        }, 2000)
      }
    })
  }

  const handleApprove = () => {
    if (!address) return
    approveUsdc({
      address: addresses.usdc as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [addresses.depositPool, parseUnits(depositAmount || '0', 6)],
    }, {
      onSuccess: () => {
        setTimeout(() => refetchAllowance(), 2000)
      }
    })
  }

  const handleDeposit = () => {
    deposit({
      address: addresses.depositPool as `0x${string}`,
      abi: DEPOSIT_POOL_ABI,
      functionName: 'deposit',
      args: [parseUnits(depositAmount, 6)],
    }, {
      onSuccess: () => {
        setTimeout(() => {
          refetchBalance()
          refetchDeposited()
          refetchMonths()
          refetchAllowance()
        }, 2000)
      }
    })
  }

  const needsApproval = allowance !== undefined && parseUnits(depositAmount || '0', 6) > allowance

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Connect Wallet</h1>
        <p className="text-muted-foreground mt-2">Connect your wallet to start depositing.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deposit</h1>
        <p className="text-muted-foreground">Set up your recurring deposit plan and start saving.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">USDC Balance</p>
            <p className="text-2xl font-bold">${formatNumber(usdcBalance, 6)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Deposited</p>
            <p className="text-2xl font-bold">${formatNumber(totalDeposited, 6)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Months Completed</p>
            <p className="text-2xl font-bold">{monthsCompleted ? monthsCompleted.toString() : '0'}</p>
          </CardContent>
        </Card>
      </div>

      {isTestnet && (
        <Card className="border-dashed border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-600">Testnet Faucet</CardTitle>
            <CardDescription>Mint free MockUSDC for testing</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="w-48"
            />
            <Button onClick={handleMint} disabled={isMinting}>
              {isMinting ? 'Minting...' : 'Mint USDC'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="deposit">Monthly Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>New Deposit Plan</CardTitle>
              <CardDescription>Choose your tenor and minimum monthly deposit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Plan Duration (Tenor)</Label>
                <Select value={tenor} onValueChange={(v) => setTenor(v || '48')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TENOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Monthly Deposit (USDC)</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You must deposit at least this amount every 30 days
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">Plan Summary</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Tenor: {parseInt(tenor)} months</p>
                  <p>Minimum: ${minDeposit}/month</p>
                  <p>Total at maturity: ${parseInt(minDeposit) * parseInt(tenor)}</p>
                  <p>Yield: Variable (from staking)</p>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleCreatePlan} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Plan'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Deposit</CardTitle>
              <CardDescription>Make your recurring monthly deposit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Amount (USDC)</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Your deposit will be auto-staked to earn yield.
                  You can borrow up to 70% of your total deposits.
                </p>
                {needsApproval && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    You need to approve USDC spending before depositing.
                  </p>
                )}
              </div>

              {needsApproval ? (
                <Button className="w-full" size="lg" onClick={handleApprove} disabled={isApproving}>
                  {isApproving ? 'Approving...' : 'Approve USDC'}
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handleDeposit} disabled={isDepositing || !depositAmount}>
                  {isDepositing ? 'Depositing...' : 'Deposit'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
