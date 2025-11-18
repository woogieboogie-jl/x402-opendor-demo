'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

export function NavHeader() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress] = useState('0x742d...4e89')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">O</span>
            </div>
            <span className="text-xl font-bold">Opend&apos;Or</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/create" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Create Agent
            </Link>
            <Link href="/my-agents" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              My Agents
            </Link>
            <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Public Agents
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <Button variant="outline" className="font-mono text-sm">
              {walletAddress}
            </Button>
          ) : (
            <Button onClick={() => setIsConnected(true)}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
