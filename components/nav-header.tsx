'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export function NavHeader() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress] = useState('0x742d...4e89')
  const pathname = usePathname()

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
            <Link 
              href="/marketplace" 
              className={`text-sm font-medium transition-colors relative ${
                pathname === '/marketplace' 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Marketplace
              {pathname === '/marketplace' && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link 
              href="/create" 
              className={`text-sm font-medium transition-colors relative ${
                pathname === '/create' 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Agent
              {pathname === '/create' && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link 
              href="/my-agents" 
              className={`text-sm font-medium transition-colors relative ${
                pathname === '/my-agents' 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Agents
              {pathname === '/my-agents' && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link 
              href="/trade" 
              className={`text-sm font-medium transition-colors relative ${
                pathname === '/trade' 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Manual Trading
              {pathname === '/trade' && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
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
