'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';

export default function PublicNewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (!res.ok) {
                    console.error("Error fetching news:", await res.text());
                    return;
                }
                const data = await res.json();
                setNews(data);
            } catch (error) {
                console.error("Failed to load news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="page-container section-padding">
            {/* Header */}
            <header className="mb-12 sm:mb-16 animate-fade-up">
                <span className="text-crimson-red font-black text-xs sm:text-sm uppercase tracking-[0.25em] block mb-3">
                    Sala de Prensa
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-midnight-blue tracking-tighter uppercase leading-tight mb-4">
                    Noticias <span className="text-crimson-red">FECOKA</span>
                </h1>
                <p className="max-w-2xl text-steel-gray text-base sm:text-lg font-medium leading-relaxed">
                    Comunicados oficiales, resultados de selecciones nacionales y cobertura de eventos federados.
                </p>
                <div className="h-1.5 w-20 bg-midnight-blue mt-6 rounded-full" />
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl sm:rounded-3xl h-96 border border-silver-accent animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {news.length > 0 ? (
                        news.map((item: any, idx) => (
                            <article
                                key={item._id}
                                className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-silver-accent hover:shadow-xl transition-all duration-300 flex flex-col justify-between animate-fade-up"
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            >
                                <div>
                                    {/* Image */}
                                    <div className="relative h-52 sm:h-56 rounded-xl sm:rounded-2xl bg-silver-accent overflow-hidden mb-5">
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-midnight-blue/20 font-black text-2xl italic bg-mist-white">
                                                FECOKA
                                            </div>
                                        )}
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black text-crimson-red uppercase tracking-wider bg-crimson-red/10 px-2.5 py-0.5 rounded-full">
                                            {item.category}
                                        </span>
                                        <span className="text-[11px] font-bold text-steel-gray">
                                            {new Date(item.publishedAt).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-lg sm:text-xl font-bold text-midnight-blue mb-3 group-hover:text-crimson-red transition-colors leading-snug line-clamp-2">
                                        {item.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-steel-gray text-xs sm:text-sm leading-relaxed font-medium line-clamp-3 mb-6">
                                        {item.content}
                                    </p>
                                </div>

                                <Link
                                    href={`/news/${item._id}`}
                                    className="inline-flex items-center gap-2 text-midnight-blue font-black text-xs uppercase tracking-wider hover:text-crimson-red transition-colors pt-3 border-t border-silver-accent/60 mt-auto group/link"
                                >
                                    <span>Leer artículo completo</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-silver-accent shadow-xs p-8 max-w-md mx-auto">
                            <Newspaper className="w-12 h-12 text-silver-accent mx-auto mb-3" />
                            <p className="text-steel-gray font-bold text-base">No hay noticias publicadas</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
