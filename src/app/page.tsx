"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  School,
  Tags,
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  MapPin,
  Newspaper,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface Sponsor {
  _id?: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
  images?: string[];
}

interface EventItem {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  scope?: "Nacional" | "Internacional";
  type?: "Tournament" | "Seminar" | "Meeting";
}

export default function Home() {
  const { data: dbSponsors } = useApi<Sponsor[]>("/api/sponsors");
  const { data: dbNews } = useApi<NewsItem[]>("/api/news");
  const { data: dbEvents } = useApi<EventItem[]>("/api/events");

  const sponsors = Array.isArray(dbSponsors) ? dbSponsors : [];
  const newsList = Array.isArray(dbNews) ? dbNews.slice(0, 3) : [];
  const eventsList = Array.isArray(dbEvents)
    ? [...dbEvents]
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3)
    : [];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-mist-white flex flex-col">
      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#001433] text-white pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 12, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src="/assets/seleccion-integrantes.jpg"
              alt="Selección Nacional FECOKA"
              fill
              className="object-cover saturate-[1.15] brightness-[0.45] contrast-[1.12]"
              style={{ objectPosition: "center 20%" }}
              priority
            />
          </motion.div>
          {/* Gradients for elite contrast & readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001433] via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001433]/80 via-transparent to-[#001433]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Institutional Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-crimson-red animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-white/95">
              Federación Costarricense de Karate
            </span>
          </motion.div>

          {/* Master Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] mb-6 max-w-4xl"
          >
            Forjando el Honor y la Excelencia del Karate Costarricense
          </motion.h1>

          {/* Subtitle / Mission */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-white/80 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mb-10 text-balance"
          >
            Órgano oficial rector del Karate-Do olímpico y tradicional. Impulsando el desarrollo técnico, el ranking nacional y las selecciones de Costa Rica hacia el escenario mundial.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/rankings"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-crimson-red text-white font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-midnight-blue transition-all duration-300 shadow-xl shadow-crimson-red/30 hover:-translate-y-0.5 active:scale-95 group"
            >
              <Trophy className="w-4 h-4 text-white group-hover:text-midnight-blue transition-colors" />
              <span>Ver Rankings Oficiales</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-crimson-red" />
              <span>Calendario de Torneos</span>
            </Link>
          </motion.div>

          {/* Floating Trust Certifications */}
          <div className="mt-14 pt-8 border-t border-white/10 w-full max-w-2xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/60 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-crimson-red" />
              <span>Miembro WKF & CCONK</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-crimson-red" />
              <span>Aval Comité Olímpico</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-crimson-red" />
              <span>Entidad ICODER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* IMPACT METRICS STRIP                                         */}
      <section className="relative z-20 -mt-8 sm:-mt-10 page-container w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-silver-accent/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center md:border-r border-silver-accent/60 md:last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-midnight-blue tracking-tight">40+</p>
            <p className="text-xs sm:text-sm font-bold text-steel-gray uppercase tracking-wider mt-1">Categorías Oficiales</p>
          </div>
          <div className="text-center md:border-r border-silver-accent/60 md:last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-crimson-red tracking-tight">150+</p>
            <p className="text-xs sm:text-sm font-bold text-steel-gray uppercase tracking-wider mt-1">Atletas Federados</p>
          </div>
          <div className="text-center md:border-r border-silver-accent/60 md:last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-midnight-blue tracking-tight">25+</p>
            <p className="text-xs sm:text-sm font-bold text-steel-gray uppercase tracking-wider mt-1">Academias Afiliadas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-black text-midnight-blue tracking-tight">7</p>
            <p className="text-xs sm:text-sm font-bold text-steel-gray uppercase tracking-wider mt-1">Provincias del País</p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACTION PILLARS / SERVICES                                    */}
      {/* ============================================================ */}
      <section className="page-container section-padding">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em] block mb-2">
            Plataforma Digital FECOKA
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight-blue tracking-tight uppercase">
            Servicios e Información Oficial
          </h2>
          <p className="text-steel-gray text-base mt-3 leading-relaxed">
            Acceso directo y transparente a todas las herramientas y recursos de la federación.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Rankings */}
          <Link
            href="/rankings"
            className="group bg-white rounded-3xl p-7 border border-silver-accent/70 hover:border-midnight-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-midnight-blue/5 group-hover:bg-midnight-blue text-midnight-blue group-hover:text-white flex items-center justify-center transition-colors mb-6">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-midnight-blue group-hover:text-crimson-red transition-colors mb-2">
                Ranking Nacional
              </h3>
              <p className="text-steel-gray text-sm leading-relaxed mb-6 font-medium">
                Puntuaciones oficiales actualizadas por torneos en modalidades Kata y Kumite desde U12 hasta Senior.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-midnight-blue group-hover:text-crimson-red transition-colors pt-4 border-t border-silver-accent/50">
              <span>Explorar Podio</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Calendario */}
          <Link
            href="/events"
            className="group bg-white rounded-3xl p-7 border border-silver-accent/70 hover:border-midnight-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-midnight-blue/5 group-hover:bg-midnight-blue text-midnight-blue group-hover:text-white flex items-center justify-center transition-colors mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-midnight-blue group-hover:text-crimson-red transition-colors mb-2">
                Calendario Oficial
              </h3>
              <p className="text-steel-gray text-sm leading-relaxed mb-6 font-medium">
                Cronograma de campeonatos nacionales, seminarios de arbitraje, topes preparatorios y copas mundiales.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-midnight-blue group-hover:text-crimson-red transition-colors pt-4 border-t border-silver-accent/50">
              <span>Ver Fechas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Academias */}
          <Link
            href="/academies"
            className="group bg-white rounded-3xl p-7 border border-silver-accent/70 hover:border-midnight-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-midnight-blue/5 group-hover:bg-midnight-blue text-midnight-blue group-hover:text-white flex items-center justify-center transition-colors mb-6">
                <School className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-midnight-blue group-hover:text-crimson-red transition-colors mb-2">
                Dojos Afiliados
              </h3>
              <p className="text-steel-gray text-sm leading-relaxed mb-6 font-medium">
                Directorio nacional de academias y clubes acreditados con instructores certificados por FECOKA.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-midnight-blue group-hover:text-crimson-red transition-colors pt-4 border-t border-silver-accent/50">
              <span>Buscar Dojos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Categorías */}
          <Link
            href="/categories"
            className="group bg-white rounded-3xl p-7 border border-silver-accent/70 hover:border-midnight-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-midnight-blue/5 group-hover:bg-midnight-blue text-midnight-blue group-hover:text-white flex items-center justify-center transition-colors mb-6">
                <Tags className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-midnight-blue group-hover:text-crimson-red transition-colors mb-2">
                Categorías & Reglas
              </h3>
              <p className="text-steel-gray text-sm leading-relaxed mb-6 font-medium">
                Estatutos oficiales, divisiones de peso, edades y reglamentos de competencia avalados por la WKF.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-midnight-blue group-hover:text-crimson-red transition-colors pt-4 border-t border-silver-accent/50">
              <span>Ver Normativas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LATEST NEWS & EVENTS SECTION                                 */}
      {/* ============================================================ */}
      <section className="w-full bg-white border-y border-silver-accent/70 py-16 sm:py-24">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em] block mb-2">
                Actualidad Federada
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight-blue tracking-tight uppercase">
                Noticias Recientes
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-midnight-blue hover:text-crimson-red font-black text-xs uppercase tracking-wider transition-colors"
            >
              <span>Ver todas las noticias</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {newsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {newsList.map((item) => (
                <article
                  key={item._id}
                  className="group bg-mist-white rounded-3xl p-5 border border-silver-accent/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 rounded-2xl bg-silver-accent overflow-hidden mb-5">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-midnight-blue/20 font-black text-2xl italic bg-white">
                          FECOKA
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-crimson-red uppercase tracking-wider bg-crimson-red/10 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-steel-gray">
                        {new Date(item.publishedAt).toLocaleDateString("es-CR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-midnight-blue group-hover:text-crimson-red transition-colors line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-steel-gray text-xs sm:text-sm font-medium line-clamp-3 mb-6 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  <Link
                    href={`/news/${item._id}`}
                    className="inline-flex items-center gap-2 text-midnight-blue font-black text-xs uppercase tracking-wider hover:text-crimson-red transition-colors pt-4 border-t border-silver-accent/60 group/link"
                  >
                    <span>Leer comunicado</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-mist-white rounded-3xl border border-silver-accent/70 p-8">
              <Newspaper className="w-10 h-10 text-steel-gray/40 mx-auto mb-3" />
              <p className="text-steel-gray font-bold text-sm">Próximamente nuevas noticias federadas.</p>
            </div>
          )}

          {/* Upcoming Events Preview */}
          {eventsList.length > 0 && (
            <div className="mt-16 pt-16 border-t border-silver-accent/70">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em] block mb-1">
                    Próximas Fechas
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-midnight-blue uppercase">
                    Torneos & Seminarios en Agenda
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-midnight-blue hover:text-crimson-red font-black text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Ver calendario completo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventsList.map((evt) => {
                  const d = new Date(evt.startDate);
                  return (
                    <Link
                      key={evt._id}
                      href="/events"
                      className="group bg-mist-white p-5 rounded-2xl border border-silver-accent/70 hover:border-midnight-blue hover:shadow-md transition-all flex items-center gap-4"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white border border-silver-accent/70 flex flex-col items-center justify-center shrink-0 text-center shadow-xs">
                        <span className="text-[10px] font-black uppercase text-steel-gray">
                          {d.toLocaleDateString("es-CR", { month: "short" }).replace(".", "")}
                        </span>
                        <span className="text-lg font-black text-midnight-blue leading-none">
                          {d.getDate()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-midnight-blue text-white mb-1">
                          {evt.scope || "Nacional"}
                        </span>
                        <h4 className="text-sm font-bold text-midnight-blue group-hover:text-crimson-red transition-colors truncate">
                          {evt.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-steel-gray mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-crimson-red shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARTIAL VALUES & TRADITION                                    */}
      {/* ============================================================ */}
      <section className="page-container section-padding">
        <div className="relative bg-gradient-to-br from-midnight-blue to-[#000d26] text-white rounded-3xl p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle Background Badge */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-5">
            <span className="text-[35vw] font-black italic select-none">道</span>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-red/20 border border-crimson-red/40 text-crimson-red text-xs font-black uppercase tracking-widest mb-6">
              <Flame className="w-3.5 h-3.5 text-crimson-red" />
              <span>Filosofía Marcial & Olímpica</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-6">
              Más que un deporte, un compromiso de vida
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed font-normal mb-8">
              El Karate-Do combina la máxima exigencia atlética con los principios ancestrales del respeto, el esfuerzo continuo y el autocontrol. En FECOKA, guiamos a cada practicante desde su primer cinturón hasta el podio internacional.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-midnight-blue font-black text-xs uppercase tracking-wider hover:bg-crimson-red hover:text-white transition-all duration-300 shadow-md"
              >
                <span>Conoce Nuestra Historia</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/academies"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-300"
              >
                <span>Afiliar mi Academia</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SPONSORS & PARTNERS CAROUSEL                                 */}
      {/* ============================================================ */}
      {sponsors.length > 0 && (
        <section className="w-full py-16 bg-white border-t border-silver-accent/70 overflow-hidden">
          <div className="page-container mb-10 text-center">
            <span className="text-crimson-red font-black text-xs uppercase tracking-[0.25em] block mb-2">
              Patrocinadores Oficiales
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-midnight-blue uppercase">
              Aliados del Deporte Costarricense
            </h3>
          </div>

          {/* Marquee Ticker */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Edge Gradients for Soft Fades */}
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

            <div className="animate-marquee flex items-center gap-12 sm:gap-16">
              {[...sponsors, ...sponsors, ...sponsors].map((sponsor, i) => (
                <div
                  key={`${sponsor._id}-${i}`}
                  className="h-14 sm:h-16 w-36 sm:w-48 relative flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 group cursor-pointer"
                >
                  {sponsor.websiteUrl ? (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-full w-full flex items-center justify-center"
                      title={sponsor.name}
                    >
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        fill
                        sizes="192px"
                        className="object-contain"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="relative h-full w-full flex items-center justify-center" title={sponsor.name}>
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        fill
                        sizes="192px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
