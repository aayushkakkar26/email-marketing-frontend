import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Users, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#020416] via-[#0A1429] to-[#020416]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
        `,
      }}
    >
      {/* Header */}
      <header
        className="border-b border-[#1a2332] backdrop-blur-sm"
        style={{ backgroundColor: "rgba(10, 20, 41, 0.8)" }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Mail className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">EmailPro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-[#1a2332] text-gray-300 hover:bg-[#1a2332] hover:text-white transition-all duration-200 hover:border-[#2a3441] bg-transparent"
                >
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Professional Email Marketing
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Create, manage, and track email campaigns with our powerful platform. Verify domains, upload contacts, and
              automate your outreach with enterprise-grade tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <SignInButton>
                <Button
                  size="lg"
                  className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/25 hover:scale-105"
                >
                  Get Started Free
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/25 hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-[#1a2332] text-gray-300 hover:bg-[#1a2332] hover:text-white transition-all duration-300 hover:border-[#2a3441] hover:shadow-lg bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card
            className="border-[#1a2332] hover:border-[#2a3441] transition-all duration-300 hover:shadow-xl hover:shadow-[#0A1429]/20 hover:-translate-y-1 group"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 w-fit group-hover:bg-blue-500/20 transition-colors duration-300">
                <Shield className="h-12 w-12 text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Domain Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center leading-relaxed">
                Verify your sending domains with DNS records for better deliverability and inbox placement
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="border-[#1a2332] hover:border-[#2a3441] transition-all duration-300 hover:shadow-xl hover:shadow-[#0A1429]/20 hover:-translate-y-1 group"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20 w-fit group-hover:bg-green-500/20 transition-colors duration-300">
                <Users className="h-12 w-12 text-green-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Contact Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center leading-relaxed">
                Upload and manage your contact lists with CSV import functionality and advanced segmentation
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="border-[#1a2332] hover:border-[#2a3441] transition-all duration-300 hover:shadow-xl hover:shadow-[#0A1429]/20 hover:-translate-y-1 group"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 w-fit group-hover:bg-purple-500/20 transition-colors duration-300">
                <Mail className="h-12 w-12 text-purple-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center leading-relaxed">
                Create multi-step email sequences with personalization, scheduling, and A/B testing capabilities
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="border-[#1a2332] hover:border-[#2a3441] transition-all duration-300 hover:shadow-xl hover:shadow-[#0A1429]/20 hover:-translate-y-1 group"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 w-fit group-hover:bg-orange-500/20 transition-colors duration-300">
                <BarChart3 className="h-12 w-12 text-orange-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">Analytics & Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center leading-relaxed">
                Track opens, clicks, and campaign performance with detailed analytics and real-time reporting
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Section */}
        <div className="text-center py-16">
          <div
            className="max-w-4xl mx-auto p-8 rounded-2xl border border-[#1a2332] backdrop-blur-sm"
            style={{ backgroundColor: "rgba(10, 20, 41, 0.6)" }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">Trusted by 10,000+ Businesses Worldwide</h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Join thousands of companies that trust EmailPro for their email marketing needs. From startups to
              enterprises, we deliver results that matter.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">10M+</div>
                <div className="text-sm text-gray-400">Emails Sent</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a2332] mt-20" style={{ backgroundColor: "rgba(10, 20, 41, 0.8)" }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">© 2025 EmailPro. All rights reserved. Built with ❤️ for email marketers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
