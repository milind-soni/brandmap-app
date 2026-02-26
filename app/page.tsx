"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeroMap } from "@/components/hero-map";

export default function Homepage() {
  const [scrolled, setScrolled] = useState(false);

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
            brandmap.
          </span>
        </div>
        <div className="flex gap-6 items-center text-sm font-bold uppercase tracking-wide">
          <a href="#pricing" className="hover:underline underline-offset-4">
            Pricing
          </a>
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
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-32 md:pb-24 min-h-[85vh] flex flex-col justify-end bg-[#1a1a1a] text-[#f0f0e8] border-b-2 border-[#1a1a1a] overflow-x-clip overflow-y-clip">
        {/* Live map background */}
        <HeroMap />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <h1
            className="text-[22vw] sm:text-[18vw] font-black leading-[0.75] tracking-tighter ml-[-0.5vw]"
            style={{
              textShadow: "8px 8px 0 #8b4513, 0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            brand
            <br />
            map
          </h1>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 mt-20 md:mt-24">
            <div className="flex flex-col items-start gap-4 md:gap-6 max-w-full">
              <div className="bg-[#f0f0e8] text-[#1a1a1a] px-5 py-3 md:px-8 md:py-4 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_var(--shadow-accent)] md:shadow-[8px_8px_0px_0px_var(--shadow-accent)] -rotate-2 origin-bottom-left max-w-full">
                <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight md:leading-none">
                  Beautiful maps that match your brand.
                </p>
              </div>
              <div className="bg-[#8b4513] text-[#f0f0e8] px-5 py-3 md:px-8 md:py-4 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_var(--shadow-color)] md:shadow-[8px_8px_0px_0px_var(--shadow-color)] rotate-1 origin-top-left ml-2 md:ml-8 max-w-full">
                <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase leading-tight md:leading-none">
                  No code. No Mapbox. Just paste the embed.
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
                href="/sign-up"
                className="bg-[#8b4513] text-[#f0f0e8] px-6 py-4 md:px-8 md:py-5 border-2 border-[#1a1a1a] font-black text-lg md:text-xl hover:bg-[#a0522d] transition-colors flex items-center justify-center shadow-[6px_6px_0px_0px_var(--shadow-color)] md:shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] md:hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] self-start sm:self-auto"
              >
                START FREE TRIAL &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b-2 border-[#1a1a1a] bg-[#f0f0e8]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1a1a1a]">
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
              className="p-8 lg:p-12 group hover:bg-[#1a1a1a] hover:text-[#f0f0e8] transition-colors flex flex-col"
            >
              <div className="text-sm font-black text-[#888] group-hover:text-[#cd8c52] mb-8">
                /{item.id}
              </div>
              <h3 className="text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tighter leading-none">
                {item.title}
              </h3>
              <p className="text-lg font-medium opacity-80 mt-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b-2 border-[#1a1a1a] bg-[#e8e8e0] px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-16 text-center">
            HOW IT WORKS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
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
              <div
                key={i}
                className="bg-[#f0f0e8] border-2 border-[#1a1a1a] shadow-[12px_12px_0px_0px_var(--shadow-color)] flex flex-col hover:-translate-y-2 hover:translate-x-2 hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
              >
                <div className="border-b-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#f0f0e8] p-6 flex justify-between items-end">
                  <span className="text-7xl font-black leading-none">
                    {item.step}
                  </span>
                  <span className="text-xl font-bold tracking-widest text-[#888] mb-1">
                    STEP
                  </span>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-[#8b4513]">
                    {item.action}
                  </h3>
                  <p className="text-lg font-medium text-[#1a1a1a]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-24 md:py-32 border-b-2 border-[#1a1a1a] bg-[#f0f0e8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                THE
                <br />
                DEFAULT.
              </h2>
              <p className="text-xl text-[#888] font-medium max-w-sm">
                Google Maps is free. But it looks like Google, not like you.
              </p>
            </div>

            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-[#1a1a1a] shadow-[12px_12px_0px_0px_var(--shadow-color)]">
                {/* Google Maps */}
                <div className="p-8 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-[#1a1a1a] bg-[#ffffff]">
                  <div className="text-sm font-bold tracking-widest text-[#888] mb-2">
                    THE DEFAULT
                  </div>
                  <div className="text-5xl font-black tracking-tighter mb-8">
                    Google Maps
                  </div>

                  <div className="mb-8">
                    <div className="text-3xl font-black">$0</div>
                    <div className="text-[#888] font-bold uppercase text-sm tracking-wider">
                      Free (with strings)
                    </div>
                  </div>

                  <ul className="space-y-4 text-lg font-medium text-[#1a1a1a]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#dc2626] font-black">&times;</span>
                      Google branding everywhere
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#dc2626] font-black">&times;</span>
                      Competitor ads on your map
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#dc2626] font-black">&times;</span>
                      Zero style customization
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#dc2626] font-black">&times;</span>
                      Looks like every other site
                    </li>
                  </ul>
                </div>

                {/* brandmap */}
                <div className="p-8 md:p-12 bg-[#1a1a1a] text-[#f0f0e8]">
                  <div className="text-sm font-bold tracking-widest text-[#cd8c52] mb-2">
                    THE UPGRADE
                  </div>
                  <div className="text-5xl font-black tracking-tighter mb-8 text-[#cd8c52]">
                    brandmap
                  </div>

                  <div className="mb-8">
                    <div className="text-3xl font-black text-[#cd8c52]">$5</div>
                    <div className="text-[#888] font-bold uppercase text-sm tracking-wider">
                      Flat total / month
                    </div>
                  </div>

                  <ul className="space-y-4 text-lg font-medium">
                    <li className="flex items-start gap-3">
                      <span className="text-[#cd8c52] font-black">
                        &#10003;
                      </span>
                      Your brand colors
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#cd8c52] font-black">
                        &#10003;
                      </span>
                      No branding or ads
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#cd8c52] font-black">
                        &#10003;
                      </span>
                      Full style control
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#cd8c52] font-black">
                        &#10003;
                      </span>
                      Looks like your site
                    </li>
                  </ul>

                  <div className="mt-12 pt-6 border-t border-[#333]">
                    <span className="block text-sm font-bold text-[#888] uppercase tracking-wider mb-1">
                      vs Mapbox custom
                    </span>
                    <span className="text-4xl font-black text-[#cd8c52]">
                      10x cheaper
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 py-32 bg-[#8b4513] text-[#f0f0e8] border-b-2 border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
            &ldquo;We spent 3 hours trying to make Google Maps match our site.
            With brandmap it took 2 minutes.&rdquo;
          </blockquote>
          <div className="inline-block border-2 border-[#f0f0e8] px-6 py-3 font-bold uppercase tracking-wider">
            &mdash; A restaurant that got it
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="px-6 py-24 md:py-32 border-b-2 border-[#1a1a1a] bg-[#e8e8e0]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-16 text-center">
            PRICING.
          </h2>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Basic */}
            <div className="bg-[#f0f0e8] border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-8 w-full max-w-md flex flex-col hover:-translate-y-2 hover:translate-x-2 hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all">
              <div className="text-xl font-bold uppercase tracking-widest text-[#888] mb-2">
                Basic
              </div>
              <div className="text-6xl font-black tracking-tighter mb-4">
                $5
                <span className="text-2xl text-[#888]">/mo</span>
              </div>
              <p className="text-lg font-medium text-[#1a1a1a] mb-8">
                Everything you need to ditch Google Maps.
              </p>

              <ul className="space-y-4 text-lg font-bold flex-grow mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-[#8b4513] text-2xl">&#10003;</span>{" "}
                  Unlimited maps
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#8b4513] text-2xl">&#10003;</span>{" "}
                  Custom brand colors
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#8b4513] text-2xl">&#10003;</span>{" "}
                  Embed code
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#8b4513] text-2xl">&#10003;</span> No
                  brandmap branding
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="bg-[#1a1a1a] text-[#f0f0e8] text-center py-4 border-2 border-[#1a1a1a] font-black uppercase hover:bg-[#8b4513] transition-colors"
              >
                Get Basic
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-[#1a1a1a] text-[#f0f0e8] border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_var(--shadow-color)] p-8 w-full max-w-md flex flex-col transform md:-translate-y-4 hover:-translate-y-6 hover:translate-x-2 hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xl font-bold uppercase tracking-widest text-[#cd8c52]">
                  Pro
                </div>
                <div className="bg-[#8b4513] text-xs font-black px-2 py-1 uppercase tracking-wider -rotate-3">
                  Popular
                </div>
              </div>
              <div className="text-6xl font-black tracking-tighter mb-4">
                $25
                <span className="text-2xl text-[#888]">/mo</span>
              </div>
              <p className="text-lg font-medium mb-8">
                For teams and agencies that need more.
              </p>

              <ul className="space-y-4 text-lg font-bold flex-grow mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                  Everything in Basic
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                  Custom fonts
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                  Custom markers & icons
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#cd8c52] text-2xl">&#10003;</span>{" "}
                  Embed analytics
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="bg-[#f0f0e8] text-[#1a1a1a] text-center py-4 border-2 border-[#f0f0e8] font-black uppercase hover:bg-[#d8d8d0] transition-colors"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 bg-[#f0f0e8]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
            START
            <br />
            NOW.
          </h2>
          <p className="text-2xl text-[#888] font-medium mb-12">
            Your map should look like your site, not like Google.
          </p>
          <Link
            href="/sign-up"
            className="bg-[#1a1a1a] text-[#f0f0e8] px-12 py-6 border-2 border-[#1a1a1a] text-2xl font-black uppercase tracking-wider hover:bg-[#8b4513] hover:border-[#8b4513] transition-colors shadow-[12px_12px_0px_0px_var(--shadow-accent)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[8px_8px_0px_0px_var(--shadow-accent)]"
          >
            CREATE YOUR MAP
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#1a1a1a] px-6 py-12 bg-[#e8e8e0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-black text-3xl tracking-tighter">
            brandmap.
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
