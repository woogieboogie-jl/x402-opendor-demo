import { NavHeader } from '@/components/nav-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Bot, Sparkles, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            AI-Powered Autonomous Trading
          </div>
          
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl">
            Create Your Own
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Trading Agent
            </span>
          </h1>
          
          <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl max-w-2xl">
            Customize triggers, context, and strategy to launch your autonomous crypto trader. 
            Publish successful agents and earn from other users' deposits.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/create">
                Create Your First Agent
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/marketplace">
                Explore Public Agents
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-24 grid max-w-5xl gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customize Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Select triggers, context, and define your unique trading strategy with natural language
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Track Performance</h3>
              <p className="text-sm text-muted-foreground">
                Monitor Sharpe ratio, P&L, win rate, and all transactions via x402 protocol
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Sparkles className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Publish & Earn</h3>
              <p className="text-sm text-muted-foreground">
                Reach Sharpe ratio targets, stake collateral, and earn fees from public deposits
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
