import Link from "next/link"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"

import { MobileNav } from '@/components/mobile-nav'

import { ThemeToggle } from "@/components/theme-toggle"
import ConnectButton from "./connect-button"


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

<div className="container flex h-14 max-w-screen-2xl items-center">
 
<MainNav items={siteConfig.mainNav} />
    
<MobileNav/>

<div className="flex flex-1 items-center justify-between space-x-2 xs:flex-end sm:justify-end md:justify-end"> 
<nav className="flex items-center">
           <ConnectButton/>
        <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
               "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
  <Link
              href={siteConfig.links.discord}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
                "w-9 px-0"
               )}
              >
                <Icons.discord className="h-4 w-4" />
                <span className="sr-only">Discord</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
