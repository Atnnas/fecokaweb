"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          // Solo mostrar las 3 últimas
          setNews(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      {/* Fixed Centered Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <Image
          src="/assets/seleccion-integrantes.jpg"
          alt="Selección Nacional de Karate"
          fill
          priority
          className="object-cover object-center opacity-40 brightness-90 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/20 to-midnight-blue/40" />
      </div>

      {/* Premium Hero Section */}
      <section className="relative z-10 w-full h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-transparent">

        {/* Architectural Background Accents */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-midnight-blue/[0.03] -skew-x-12 translate-x-1/4" />
        <div className="absolute top-1/2 left-0 w-[40%] h-[1px] bg-crimson-red/20" />

        {/* Subtle Federation Graphic */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
          <Image
            src="/assets/fecoka-logo.jpg"
            alt="Federation Background"
            width={800}
            height={800}
            className="object-contain scale-[1.5] rotate-6 blur-[2px]"
          />
        </div>

        <div className="relative z-10 text-center px-8 md:px-6 max-w-5xl animate-fade-up">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-8 rounded-full bg-white border border-silver-accent shadow-premium">
            <span className="w-2 h-2 rounded-full bg-crimson-red animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-midnight-blue">
              Karate Do Oficial Costa Rica
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-midnight-blue mb-8 leading-[0.85] tracking-tighter">
            KARATE <br />
            <span className="text-crimson-red">EXCELENCIA</span>
          </h1>

          <p className="text-lg md:text-2xl text-steel-gray mb-14 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight px-6 md:px-8">
            Forjando el carácter nacional a través de la disciplina, el respeto inquebrantable y la tradición milenaria del Karate-Do.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link href="/rankings" className="btn-premium bg-midnight-blue hover:bg-crimson-red text-white group px-8 py-5">
              Explorar Rankings
              <svg
                className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/events" className="btn-premium bg-white border border-silver-accent hover:border-midnight-blue text-midnight-blue px-8 py-5 shadow-sm hover:shadow-premium">
              Catálogo de Eventos
            </Link>
          </div>
        </div>

        {/* Scroll affordance */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-40">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase rotate-90 origin-left translate-x-2 text-midnight-blue">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-midnight-blue to-transparent" />
        </div>
      </section>

      {/* Featured News / Grid Section */}
      <section className="relative z-10 section-padding max-w-[1440px] mx-auto w-full px-8 lg:px-12 bg-transparent">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="animate-fade-up">
            <span className="text-crimson-red font-black text-sm uppercase tracking-widest block mb-4 flex items-center gap-3">
              <div className="w-8 h-[2px] bg-crimson-red" /> Sala de Prensa
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-midnight-blue tracking-tighter leading-none">Ecos del Tatami</h2>
          </div>
          <Link href="/news" className="text-midnight-blue font-bold text-lg hover:text-crimson-red transition-all flex items-center gap-3 group border-b border-transparent hover:border-crimson-red pb-1">
            Ver todas las publicaciones
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {!loading ? (
            news.map((item: any, i) => (
              <div key={item._id} className="group relative bg-white rounded-[32px] p-2 border border-silver-accent shadow-sm hover:shadow-premium hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-64 md:h-80 rounded-[24px] bg-mist-white overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-midnight-blue/10 font-black text-5xl tracking-tighter italic">FECOKA</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson-red" />
                    <span className="text-[10px] font-black text-midnight-blue uppercase tracking-[0.2em]">{item.category || "Cobertura Nacional"}</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-crimson-red transition-colors text-midnight-blue line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-steel-gray font-medium text-sm line-clamp-2 mb-8">
                    {item.content}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-silver-accent/50">
                    <span className="text-[10px] font-bold text-steel-gray uppercase tracking-widest">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <Link href={`/news/${item._id}`} className="w-10 h-10 rounded-full border border-silver-accent flex items-center justify-center text-midnight-blue group-hover:bg-crimson-red group-hover:text-white group-hover:border-crimson-red transition-all shadow-sm">
                      <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white/50 rounded-[32px] p-2 border border-silver-accent h-[500px]" />
            ))
          )}
        </div>
      </section>

      {/* Institutional Mission Accent */}
      <section className="relative z-10 w-full bg-midnight-blue/90 py-32 md:py-48 px-8 md:px-6 mt-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
            <polygon points="0,100 100,0 100,100" />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-16 tracking-tighter leading-[1.1]">
            "El Karate no es solo para la academia, <br />
            <span className="text-crimson-red">es para toda la vida.</span>"
          </h2>
          <div className="flex justify-center gap-12 md:gap-24 flex-wrap">
            <div className="flex flex-col items-center group">
              <span className="text-white/40 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.3em] mb-4">Disciplina</span>
              <div className="w-[2px] h-12 bg-crimson-red group-hover:h-16 transition-all duration-300" />
            </div>
            <div className="flex flex-col items-center group">
              <span className="text-white/40 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.3em] mb-4">Respeto</span>
              <div className="w-[2px] h-12 bg-white group-hover:h-16 transition-all duration-300" />
            </div>
            <div className="flex flex-col items-center group">
              <span className="text-white/40 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.3em] mb-4">Honor</span>
              <div className="w-[2px] h-12 bg-crimson-red group-hover:h-16 transition-all duration-300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
