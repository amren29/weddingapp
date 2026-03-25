import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sparkles,
  Users,
  MessageSquare,
  Mic,
  QrCode,
  Gift,
  ImageIcon,
  Download,
  ArrowRight,
  Check,
  Star,
  Globe,
  Zap,
  Shield,
} from "lucide-react";
import {
  BASIC_FEATURES_LIST,
  PREMIUM_FEATURES_LIST,
  BASIC_PRICE,
  PREMIUM_PRICE,
} from "@/config/plans";
import { HeroPrompt } from "@/components/wedding/hero-prompt";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Nikah Invite</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">AI-Powered Wedding Invitations</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
              Beautiful invitations,
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                effortlessly created
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Design stunning wedding cards with AI. Manage RSVPs, collect wishes,
              share photos, and receive gifts — all in one link.
            </p>

            <HeroPrompt />

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> No account needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> AI-powered
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> 2 min setup
              </span>
            </div>
          </div>

          {/* Hero visual - Mock invitation card */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-1 shadow-2xl shadow-gray-200/50">
              <div className="rounded-xl bg-white overflow-hidden">
                {/* Mock browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-400 font-mono">
                      nikahinvite.com/w/ahmad-and-sarah-2026
                    </div>
                  </div>
                </div>
                {/* Mock card content */}
                <div className="p-12 md:p-20 text-center bg-gradient-to-b from-[#FAF8F5] to-white">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#BFA980] mb-6">We&apos;re Getting Married</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-3" style={{ fontFamily: "Georgia, serif" }}>Ahmad</h2>
                  <div className="flex items-center justify-center gap-4 my-4">
                    <div className="w-12 h-px bg-[#D4AF37]" />
                    <Heart className="h-5 w-5 text-[#D4AF37]" />
                    <div className="w-12 h-px bg-[#D4AF37]" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: "Georgia, serif" }}>Sarah</h2>
                  <div className="w-20 h-px bg-[#D4AF37] mx-auto my-8" />
                  <p className="text-[#2C3E50]/70 text-sm">Saturday, June 15th, 2026 at 7:00 PM</p>
                  <p className="text-[#2C3E50]/70 text-sm mt-1">The Grand Ballroom, Kuala Lumpur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,500+", label: "Weddings created" },
              { value: "50K+", label: "Guests managed" },
              { value: "4.9/5", label: "User rating" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything for your big day
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From AI-designed themes to guest management, QR payments to photo sharing — one platform for it all.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, title: "AI Theme Design", desc: "Describe your dream theme in words and watch AI create it instantly", free: true },
              { icon: Users, title: "RSVP Management", desc: "Track guest responses, dietary needs, plus-ones in real time", free: true },
              { icon: MessageSquare, title: "Guest Messages", desc: "Collect heartfelt wishes and messages from all your guests", free: false },
              { icon: Mic, title: "Voice Notes", desc: "Guests record personal voice wishes for the couple", free: false },
              { icon: QrCode, title: "QR Payment", desc: "Generate payment QR codes for easy monetary gifts", free: false },
              { icon: Gift, title: "Gift Registry", desc: "Create a wishlist and let guests claim gifts they want to give", free: false },
              { icon: ImageIcon, title: "Photo Gallery", desc: "Guests upload and share photos from the celebration", free: false },
              { icon: Download, title: "Data Export", desc: "Download all memories — messages, photos, data — before expiry", free: true },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <feature.icon className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">How it works</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Three steps to your perfect invitation
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Zap,
                title: "Create & Design",
                desc: "Enter your wedding details, pick a theme or describe one to AI. Your invitation is live in minutes.",
              },
              {
                step: "02",
                icon: Globe,
                title: "Share & Collect",
                desc: "Send your unique link to guests. They RSVP, leave messages, upload photos, and send gifts.",
              },
              {
                step: "03",
                icon: Shield,
                title: "Celebrate & Export",
                desc: "Enjoy your wedding. Your page stays live 30 days after, then export all data and memories.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 h-full">
                  <span className="text-5xl font-bold text-gray-100">{item.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mt-4 mb-4">
                    <item.icon className="h-5 w-5 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Loved by couples
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Aisha & Farhan", text: "The AI theme generator is incredible! It created exactly what we imagined. Our guests loved the RSVP experience.", rating: 5 },
              { name: "Nurul & Hafiz", text: "So easy to set up. The QR payment feature was perfect — guests could gift money without any awkwardness.", rating: 5 },
              { name: "Siti & Ahmad", text: "The photo gallery and voice notes made our wedding feel even more special. We still listen to the voice messages!", rating: 5 },
            ].map((review) => (
              <div key={review.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <p className="font-semibold text-sm text-gray-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-500">
              Choose the plan that fits your celebration. Prices in MYR.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Basic */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
                <p className="text-sm text-gray-500 mt-1">Simple and elegant invitation</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">RM{BASIC_PRICE}</span>
                <span className="text-gray-500 ml-1">/card</span>
              </div>
              <ul className="space-y-3 mb-8">
                {BASIC_FEATURES_LIST.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-gray-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full rounded-full h-11">
                  Get Basic
                </Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="relative bg-gray-900 rounded-2xl p-8 text-white">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-1 rounded-full border border-gray-200">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Premium</h3>
                <p className="text-sm text-gray-400 mt-1">Full experience for your big day</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">RM{PREMIUM_PRICE}</span>
                <span className="text-gray-400 ml-1">/card</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PREMIUM_FEATURES_LIST.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-gray-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full rounded-full h-11 bg-white text-gray-900 hover:bg-gray-100">
                  Get Premium
                </Button>
              </Link>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Are you a wedding planner?{" "}
              <Link href="/partner" className="text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700">
                Join our Partner Program
              </Link>
              {" "}— get premium cards from RM4 each.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-8 py-20 text-center">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to create your invitation?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of couples who made their wedding invitation unforgettable.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 h-12 text-base">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              <span className="font-bold text-sm">Nikah Invite</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/partner" className="hover:text-gray-900 transition-colors">Partner</Link>
              <Link href="/login" className="hover:text-gray-900 transition-colors">Login</Link>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Nikah Invite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
