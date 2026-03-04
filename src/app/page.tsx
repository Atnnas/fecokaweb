"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Globe } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface Sponsor {
  _id?: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoFile, setLogoFile] = useState<{ file: File, preview: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: ''
  });

  // Use the new useApi hook for standardized fetching
  const {
    data: dbSponsors,
    loading: sponsorsLoading
  } = useApi<Sponsor[]>('/api/sponsors');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Defensive data selection: only use DB sponsors
  const sponsors = Array.isArray(dbSponsors) ? dbSponsors : [];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0d] flex flex-col items-center">

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-32">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none top-0">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src="/assets/seleccion-integrantes.jpg"
              alt="Fondo FECOKA"
              fill
              className="object-cover saturate-[1.2] brightness-[0.7] contrast-[1.1]"
              style={{ objectPosition: "center 0%" }}
              priority
            />
          </motion.div>
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0d]" />
        </div>

        <main className="relative z-10 flex flex-col items-center text-center w-full max-w-screen-2xl px-6">
          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="max-w-2xl mb-16 md:mb-24"
          >
            <p className="text-white/60 font-outfit text-sm md:text-lg font-medium tracking-[0.15em] leading-relaxed uppercase">
              Excelencia & Disciplina <br className="hidden md:block" />
              <span className="text-white/40 tracking-[0.4em] text-[10px]">Pura Vida · Costa Rica</span>
            </p>
          </motion.div>


        </main>

        {/* Decorative Floating Info */}
        <div className="absolute left-10 bottom-10 hidden xl:flex flex-col gap-4 opacity-20 pointer-events-none">
          <div className="flex items-center gap-4 text-white">
            <Globe className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Official Federation</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Olympic Certified</span>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="w-full py-24 bg-[#0a0a0d] border-t border-white/5 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white/90 mb-3 italic">Partners</h2>
            <div className="w-16 h-1 bg-crimson mx-auto md:mx-0 shadow-[0_0_15px_rgba(217,4,41,0.5)]" />
          </div>
          <p className="max-w-sm text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] text-center md:text-right leading-relaxed">
            Impulsando el karate costarricense hacia el escenario mundial.
          </p>
        </div>

        {/* Sponsors Refined Ticker (One-at-a-time, Seamless Loop) */}
        <div className="relative w-full overflow-hidden py-12">
          {/* Edge Gradients for Premium Look */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#0a0a0d] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#0a0a0d] to-transparent z-20 pointer-events-none" />

          <motion.div
            className="flex items-center w-max"
            animate={{
              x: [0, `-${sponsors.length * 100}vw`],
            }}
            transition={{
              duration: Math.max(15, sponsors.length * 15),
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...sponsors, ...sponsors].map((sponsor, i) => (
              <div
                key={`${sponsor._id}-${i}`}
                className="w-[100vw] flex items-center justify-center shrink-0 px-12"
              >
                <div className="relative h-12 md:h-24 w-48 md:w-80 flex items-center justify-center grayscale invert opacity-30 hover:opacity-100 hover:grayscale-0 hover:invert-0 transition-all duration-700 group cursor-pointer">
                  {sponsor.websiteUrl ? (
                    <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="h-full w-full flex items-center justify-center">
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain filter group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      />
                    </a>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain filter group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Background Brand Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none opacity-[0.03]">
        <span className="text-[30vw] font-black uppercase leading-none italic select-none text-white">FECOKA</span>
      </div>
    </div>
  );
}
