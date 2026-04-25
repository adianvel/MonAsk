'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Header() {
  const { isConnected } = useAccount()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            MonAsk
          </Link>
          {isConnected && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-white">
                Dashboard
              </Link>
              <Link href="/deposit" className="transition-colors hover:text-white">
                Deposit
              </Link>
              <Link href="/borrow" className="transition-colors hover:text-white">
                Borrow
              </Link>
              <Link href="/verify" className="transition-colors hover:text-white">
                Verify
              </Link>
            </nav>
          )}
        </div>
        <ConnectButton 
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
    </header>
  )
}
