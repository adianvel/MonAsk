'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Header() {
  const { isConnected } = useAccount()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            MonAsk
          </Link>
          {isConnected && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/deposit" className="transition-colors hover:text-primary">
                Deposit
              </Link>
              <Link href="/borrow" className="transition-colors hover:text-primary">
                Borrow
              </Link>
              <Link href="/verify" className="transition-colors hover:text-primary">
                Verify
              </Link>
            </nav>
          )}
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}
