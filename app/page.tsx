"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroMap } from "@/components/hero-map";
import { EmailSignup } from "@/components/email-signup";
import { authClient } from "@/lib/auth-client";

export default function Homepage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-mono selection:bg-[#8b4513] selection:text-[#f0f0e8]">
      {/* Nav */}
      <nav
        className={`fixed w-full top-0 z-50 px-6 py-4 flex justify-between items-center border-b-2 transition-[background-color,color,border-color] duration-200 ${
          scrolled
            ? "bg-[#f0f0e8] text-[#1a1a1a] border-[#1a1a1a]"
            : "bg-transparent text-[#f0f0e8] border-transparent drop-shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <span
            className={`text-xl font-black tracking-tighter transition-opacity duration-200 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            factmaps.
          </span>
        </div>
        <div className="flex gap-6 items-center text-sm font-bold uppercase tracking-wide">
          <a href="#pricing" className="hover:underline underline-offset-4">
            Pricing
          </a>
          {session ? (
            <>
              <button
                onClick={async () => {
                  await authClient.signOut();
                  router.refresh();
                }}
                className="hover:underline underline-offset-4"
              >
                Sign out
              </button>
              <Link
                href="/maps"
                className={`px-4 py-2 border-2 transition-colors ${
                  scrolled
                    ? "border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f0f0e8]"
                    : "border-[#f0f0e8] hover:bg-[#f0f0e8] hover:text-[#1a1a1a]"
                }`}
              >
                My Maps
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:underline underline-offset-4">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className={`px-4 py-2 border-2 transition-colors ${
                  scrolled
                    ? "border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f0f0e8]"
                    : "border-[#f0f0e8] hover:bg-[#f0f0e8] hover:text-[#1a1a1a]"
                }`}
              >
                Start
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-32 md:pb-24 min-h-[85vh] flex flex-col justify-end bg-[#1a1a1a] text-[#f0f0e8] border-b-2 border-[#1a1a1a] overflow-x-clip overflow-y-clip">
        <HeroMap />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <h1
            className="text-[22vw] sm:text-[18vw] font-black leading-[0.75] tracking-tighter ml-[-0.5vw]"
            style={{
              textShadow: "8px 8px 0 #8b4513, 0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            fact
            <br />
            maps
          </h1>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 mt-20 md:mt-24">
            <div className="flex flex-col items-start gap-4 md:gap-6 max-w-full">
              <div className="bg-[#f0f0e8] text-[#1a1a1a] px-5 py-3 md:px-8 md:py-4 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_var(--shadow-accent)] md:shadow-[8px_8px_0px_0px_var(--shadow-accent)] -rotate-2 origin-bottom-left max-w-full">
                <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight md:leading-none">
                  Beautiful maps created with AI.
                </p>
              </div>
              <div className="bg-[#8b4513] text-[#f0f0e8] px-5 py-3 md:px-8 md:py-4 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_var(--shadow-color)] md:shadow-[8px_8px_0px_0px_var(--shadow-color)] rotate-1 origin-top-left ml-2 md:ml-8 max-w-full">
                <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase leading-tight md:leading-none">
                  One prompt. Embed anywhere.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 lg:justify-end pb-2 mt-4 lg:mt-0">
              <div className="bg-[#f0f0e8] text-[#1a1a1a] px-6 py-4 md:px-8 md:py-5 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_var(--shadow-color)] md:shadow-[8px_8px_0px_0px_var(--shadow-color)] self-start sm:self-auto">
                <span className="text-3xl md:text-4xl font-black block leading-none">
                  $5/mo
                </span>
                <span className="block text-xs md:text-sm font-bold uppercase tracking-wider text-[#888] mt-1 md:mt-2">
                  Unlimited maps
                </span>
              </div>
              <Link
                href="/editor"
                className="bg-[#8b4513] text-[#f0f0e8] px-6 py-4 md:px-8 md:py-5 border-2 border-[#1a1a1a] font-black text-lg md:text-xl hover:bg-[#a0522d] transition-colors flex items-center justify-center shadow-[6px_6px_0px_0px_var(--shadow-color)] md:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] md:hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] self-start sm:self-auto"
              >
                START FREE TRIAL &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props — 2x2 grid */}
      <section className="border-b-2 border-[#1a1a1a] bg-[#f0f0e8]">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 divide-[#1a1a1a]">
          {[
            {
              id: "01",
              title: "YOUR COLORS",
              desc: "Your brand palette. Your map. Not Google's grey.",
            },
            {
              id: "02",
              title: "EMBED ANYWHERE",
              desc: "One line of code. Works on any website.",
            },
            {
              id: "03",
              title: "ZERO CODE",
              desc: "Point, click, style. No developer needed.",
            },
            {
              id: "04",
              title: "FLAT PRICING",
              desc: "$5/mo. Unlimited maps, unlimited views.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-10 lg:p-14 group hover:bg-[#1a1a1a] hover:text-[#f0f0e8] transition-colors flex flex-col ${
                i < 2 ? "md:border-b-2 md:border-[#1a1a1a]" : ""
              } ${i % 2 === 0 ? "md:border-r-2 md:border-r-[#1a1a1a]" : ""}`}
            >
              <div className="text-sm font-black text-[#888] group-hover:text-[#cd8c52] mb-6">
                /{item.id}
              </div>
              <h3 className="text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tighter leading-none">
                {item.title}
              </h3>
              <p className="text-lg font-medium opacity-80 mt-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works — horizontal flow */}
      <section className="border-b-2 border-[#1a1a1a] bg-[#e8e8e0] px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-16 text-center">
            HOW IT WORKS.
          </h2>

          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {[
              {
                step: "1",
                action: "PROMPT",
                desc: "Describe your map. Location, style, vibe. We handle the rest.",
              },
              {
                step: "2",
                action: "STYLE",
                desc: "Choose your brand colors. Customize roads, water, buildings.",
              },
              {
                step: "3",
                action: "EMBED",
                desc: "Copy one line. Paste it on your site. Done.",
              },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col md:flex-row items-stretch">
                <div className="bg-[#f0f0e8] border-2 border-[#1a1a1a] flex-1 flex flex-col">
                  <div className="p-8 flex-grow">
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-6xl font-black leading-none text-[#8b4513]">
                        {item.step}
                      </span>
                      <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                        {item.action}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-[#1a1a1a]">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex items-center justify-center px-4 text-4xl font-black text-[#888]">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 py-32 bg-[#8b4513] text-[#f0f0e8] border-b-2 border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
            &ldquo;I dragged, dropped, and prompted some data.
            It gave me a beautiful map.&rdquo;
          </blockquote>
          <div className="inline-block border-2 border-[#f0f0e8] px-6 py-3 font-bold uppercase tracking-wider">
            &mdash; An early user
          </div>
        </div>
      </section>

      {/* Pricing + CTA combined */}
      <section
        id="pricing"
        className="px-6 py-24 md:py-32 bg-[#e8e8e0]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left — messaging */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
                ONE
                <br />
                PLAN.
              </h2>
              <p className="text-xl text-[#888] font-medium max-w-md mx-auto lg:mx-0">
                No tiers. No per-view charges. No surprise bills.
                Your map should look like your site, not like Google.
              </p>
            </div>

            {/* Right — pricing card */}
            <div className="lg:w-1/2 w-full max-w-md">
              <div className="bg-[#1a1a1a] text-[#f0f0e8] border-2 border-[#1a1a1a] shadow-[12px_12px_0px_0px_var(--shadow-accent)] p-10 md:p-14 flex flex-col">
                <div className="text-8xl md:text-9xl font-black tracking-tighter mb-2">
                  $5
                </div>
                <div className="text-xl font-bold uppercase tracking-widest text-[#888] mb-8">
                  Per month. That&apos;s it.
                </div>

                <ul className="space-y-5 text-xl font-bold flex-grow mb-10">
                  <li className="flex items-center gap-3">
                    <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                    Unlimited maps
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                    Unlimited views
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                    Custom brand colors
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                    Embed anywhere
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                    No factmaps branding
                  </li>
                </ul>

                <Link
                  href="/editor"
                  className="bg-[#8b4513] text-[#f0f0e8] text-center py-5 border-2 border-[#8b4513] font-black text-xl uppercase hover:bg-[#a0522d] transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="border-b-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#f0f0e8] px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            STAY IN
            <br />
            THE LOOP.
          </h2>
          <p className="text-lg font-medium text-[#888] max-w-md">
            Get updates on new features, map styles, and early access to what we&apos;re building next.
          </p>
          <EmailSignup source="factmaps" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#1a1a1a] px-6 py-12 bg-[#e8e8e0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-black text-3xl tracking-tighter">
            factmaps.
          </span>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-wider">
            <a
              href="https://github.com/milind-soni"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8b4513] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8b4513] transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
