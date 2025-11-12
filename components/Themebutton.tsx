"use client"

import * as React from "react"
import { Moon, Palette, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("calm")}>
          Simple
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("cute")}>
          Cute
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("mono")}>
          Mono
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunset")}>
          Sunrise
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>
          Forest
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Black
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("enthusiasm")}>
          Enthusiasm
        </DropdownMenuItem>  
        <DropdownMenuItem onClick={() => setTheme("matcha")}>
          Matcha
        </DropdownMenuItem>       
        <DropdownMenuItem onClick={() => setTheme("paste")}>
          Paste
        </DropdownMenuItem>     
        <DropdownMenuItem onClick={() => setTheme("neon")}>
          Neon
        </DropdownMenuItem>     
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
