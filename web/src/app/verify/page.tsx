'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CONTRACT_ADDRESSES } from '@/lib/contracts'

const STUDENT_IDENTITY_ABI = [
  {
    inputs: [{ internalType: 'string', name: 'emailDomain', type: 'string' }],
    name: 'selfVerify',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isVerified',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function VerifyPage() {
  const { address, isConnected, chainId } = useAccount()
  const [email, setEmail] = useState('')

  const isTestnet = chainId === 10143
  const addresses = isTestnet ? CONTRACT_ADDRESSES.monadTestnet : CONTRACT_ADDRESSES.monad

  const { writeContract: selfVerify, isPending: isVerifying } = useWriteContract()

  const { data: isVerified } = useReadContract({
    address: addresses.studentIdentity as `0x${string}`,
    abi: STUDENT_IDENTITY_ABI,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const handleVerify = () => {
    if (!email) return
    const domain = email.split('@')[1]
    if (!domain) return
    selfVerify({
      address: addresses.studentIdentity as `0x${string}`,
      abi: STUDENT_IDENTITY_ABI,
      functionName: 'selfVerify',
      args: [domain],
    })
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Connect Wallet</h1>
        <p className="text-muted-foreground mt-2">Connect your wallet to verify your student identity.</p>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center space-y-4">
        <Badge className="text-lg px-4 py-2">Verified Student</Badge>
        <h1 className="text-3xl font-bold">You're Verified!</h1>
        <p className="text-muted-foreground">You can now create a deposit plan and start borrowing.</p>
        <div className="flex gap-4 justify-center pt-4">
          <a href="/deposit"><Button>Create Deposit Plan</Button></a>
          <a href="/borrow"><Button variant="outline">Borrow Now</Button></a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Verification</h1>
        <p className="text-muted-foreground">
          Verify your student identity to start using MonAsk. Only students with .edu or .ac.id emails are eligible.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Self Verification</CardTitle>
          <CardDescription>
            Enter your university email to verify instantly on-chain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>University Email</Label>
            <Input
              type="email"
              placeholder="student@ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Must be .edu or .ac.id domain
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-1">
            <p className="text-sm font-medium">Verification Process</p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Enter your university email</li>
              <li>Click verify — proof stored on-chain instantly</li>
              <li>Start depositing and borrowing</li>
            </ol>
          </div>

          <Button className="w-full" size="lg" onClick={handleVerify} disabled={isVerifying || !email}>
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
