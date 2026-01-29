import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-secondary md:text-6xl">
          Mwenaro Tech Academy
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Empowering the next generation of tech leaders.
        </p>
      </header>

      <main className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Get Started
        </Button>
        <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
          View Courses
        </Button>
      </main>

      <footer className="mt-16 text-sm text-muted-foreground">
        <p>&copy; 2026 Mwenaro Tech Academy. All rights reserved.</p>
      </footer>
    </div>
  )
}
