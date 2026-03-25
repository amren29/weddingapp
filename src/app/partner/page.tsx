import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Check,
  ArrowRight,
  Handshake,
  CreditCard,
  BarChart3,
  Users,
  ArrowLeft,
} from "lucide-react";

export default function PartnerPage() {
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
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">
            Partner Program
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Resell premium wedding
            <br />
            invitations to your clients
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            For licensed wedding planners who want to offer beautiful digital
            invitations as part of their service. Get premium cards at a
            fraction of the retail price.
          </p>
          <Link href="#apply">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12 text-base">
              Apply to become a Partner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            How the Partner Program works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Handshake,
                title: "Apply & Get Verified",
                desc: "Submit your business details, website, and license. We verify that you are a registered wedding planner.",
              },
              {
                icon: CreditCard,
                title: "Pay RM400/year",
                desc: "Get access to 100 premium invitation cards per year. That is only ~RM4 per card vs RM80 retail.",
              },
              {
                icon: BarChart3,
                title: "Create & Manage",
                desc: "Use your partner dashboard to create invitations for your clients, manage cards, and track usage.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-8">
                <item.icon className="h-6 w-6 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Partner pricing vs retail
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-8">
              <p className="text-sm text-gray-500 mb-1">Retail price</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">RM80 <span className="text-base font-normal text-gray-500">/card</span></p>
              <p className="text-sm text-gray-500">Per premium card for individual customers</p>
            </div>
            <div className="rounded-2xl bg-gray-900 p-8 text-white">
              <p className="text-sm text-gray-400 mb-1">Partner price</p>
              <p className="text-3xl font-bold mb-4">~RM4 <span className="text-base font-normal text-gray-400">/card</span></p>
              <p className="text-sm text-gray-400">RM400/year for 100 premium cards</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            * Prices are subject to change. Additional cards available for RM20 each.
          </p>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Requirements
          </h2>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <ul className="space-y-4">
              {[
                "Registered wedding planning business",
                "Valid business license or SSM registration",
                "Active business website or social media presence",
                "Minimum 5 weddings handled previously",
              ].map((req) => (
                <li key={req} className="flex items-center gap-3 text-gray-700">
                  <Check className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Apply form CTA */}
      <section id="apply" className="py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <Users className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to become a partner?
          </h2>
          <p className="text-gray-500 mb-8">
            Fill out the application form and we will review your details
            within 2-3 business days.
          </p>
          <a href="mailto:partner@nikahinvite.com">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12 text-base">
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Or email us directly at partner@nikahinvite.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">Nikah Invite</span>
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
