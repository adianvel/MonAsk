'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function VerifyPage() {
  const { isConnected } = useAccount()
  const [email, setEmail] = useState('')
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [isVerified, setIsVerified] = useState(false)

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
          <CardTitle>Submit Verification</CardTitle>
          <CardDescription>
            Your data is verified off-chain. Only a verification proof is stored on-chain.
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

          <div className="space-y-2">
            <Label>Student ID Card</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCardFile(e.target.files?.[0] ?? null)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a clear photo of your student ID card
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-1">
            <p className="text-sm font-medium">Verification Process</p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Submit email + student ID card</li>
              <li>Admin verifies your identity</li>
              <li>Verification proof minted on-chain</li>
              <li>Start depositing and borrowing</li>
            </ol>
          </div>

          <Button className="w-full" size="lg">Submit for Verification</Button>
        </CardContent>
      </Card>
    </div>
  )
}
