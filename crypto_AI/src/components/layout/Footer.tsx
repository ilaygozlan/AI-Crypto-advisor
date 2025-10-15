export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Moveo AI Crypto Advisor. Built with React, TypeScript, and Tailwind CSS.
          </p>
          <p className="text-xs text-muted-foreground">
            This is a demo application for the Moveo coding task.
          </p>
        </div>
      </div>
    </footer>
  )
}
