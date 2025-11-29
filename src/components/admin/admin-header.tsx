"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-md shadow-sm">
      <div className="px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden hover:bg-muted/50 transition-all duration-300 text-xl"
        >
          ☰
        </Button>

        <div className="hidden md:flex flex-1 max-w-md items-center">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">🔍</span>
            <Input
              placeholder="Search products..."
              className="pl-10 bg-muted/50 border-border/50 placeholder:text-muted-foreground focus:bg-card transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50 transition-all duration-300 relative text-xl"
          >
            🔔
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </Button>

          <div className="hidden sm:block text-sm text-muted-foreground px-3 py-2 bg-muted/30 rounded-lg border border-border/50">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
