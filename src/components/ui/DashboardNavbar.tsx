import Link from "next/link";
import { useRouter } from "next/router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart3, Users, Globe, Send, Zap } from "lucide-react"
import { useState } from "react";
import { usePathname } from "next/navigation"
export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const linkStyle = (href: string) => {
    return pathname === href
      ? "bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg"
      : "hover:bg-slate-800/50 hover:border-slate-600 text-slate-300 hover:text-white"
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/dashboard/contacts", label: "Contacts", icon: Users },
    { href: "/dashboard/domains", label: "Domains", icon: Globe },
    { href: "/dashboard/senders", label: "Senders", icon: Send },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: Zap },
  ]

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white px-4 lg:px-6 py-4 border-b border-slate-700/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkStyle(item.href)} px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium border border-transparent`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Logo/Brand for mobile */}
        <div className="md:hidden flex-1 text-center">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Email Campaign
          </span>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent hover:border-slate-500 transition-all duration-200"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent hover:border-slate-500 transition-all duration-200 hidden sm:inline-flex"
              >
                Home
              </Button>
            </Link>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50">
          <div className="flex flex-col space-y-2 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${linkStyle(item.href)} px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium border border-transparent`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile User Actions */}
          <div className="pt-4 mt-4 border-t border-slate-700/50">
            <SignedIn>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent hover:border-slate-500 transition-all duration-200"
                >
                  Home
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
