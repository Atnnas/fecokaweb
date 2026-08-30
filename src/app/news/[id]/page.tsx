"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const NewsDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [newsItem, setNewsItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await fetch(`/api/news`);
                if (res.ok) {
                    const data = await res.json();
                    const item = data.find((n: any) => n._id === id);
                    if (item) {
                        setNewsItem(item);
                    } else {
                        router.push("/news");
                    }
                }
            } catch (error) {
                console.error("Error fetching news detail:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchNewsDetail();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mist-white">
                <div className="w-12 h-12 border-4 border-midnight-blue border-t-crimson-red rounded-full animate-spin" />
            </div>
        );
    }

    if (!newsItem) return null;

    return (
        <div className="bg-mist-white min-h-screen pb-32">
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": newsItem.title,
                        "image": newsItem.images?.[0] ? [newsItem.images[0]] : [],
                        "datePublished": newsItem.publishedAt,
                        "dateModified": newsItem.updatedAt || newsItem.publishedAt,
                        "author": [{
                            "@type": "Organization",
                            "name": "FECOKA",
                            "url": "https://fecoka.org"
                        }]
                    })
                }}
            />

            {/* Article Hero */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-end overflow-hidden">
                {newsItem.images && newsItem.images.length > 0 ? (
                    <Image
                        src={newsItem.images[0]}
                        alt={newsItem.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-midnight-blue" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-blue via-midnight-blue/40 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-16 animate-fade-up">
                    <Link href="/news" className="inline-flex items-center gap-2 text-white/60 hover:text-crimson-red transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        Volver a noticias
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-crimson-red text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            {newsItem.category}
                        </span>
                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                            {new Date(newsItem.publishedAt).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight max-w-4xl">
                        {newsItem.title}
                    </h1>
                </div>
            </section>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 animate-fade-up">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-silver-accent relative overflow-hidden">
                    {/* Decorative bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-midnight-blue via-crimson-red to-midnight-blue" />

                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="text-steel-gray text-lg sm:text-xl leading-relaxed font-medium mb-8 italic border-l-4 border-crimson-red pl-5 sm:pl-6">
                            {newsItem.content.substring(0, 200)}...
                        </p>

                        <div className="text-midnight-blue text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                            {newsItem.content}
                        </div>
                    </div>

                    {/* Image Gallery if any */}
                    {newsItem.images && newsItem.images.length > 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 sm:mt-12">
                            {newsItem.images.slice(1).map((img: string, i: number) => (
                                <div key={i} className="relative h-60 sm:h-72 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-silver-accent group">
                                    <Image
                                        src={img}
                                        alt={`Imagen ${i + 2}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Share / Footer of Article */}
                <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-between items-center bg-midnight-blue rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white gap-6 shadow-md">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black tracking-tight mb-1">¿Te gustó esta noticia?</h3>
                        <p className="text-white/60 text-xs sm:text-sm font-medium">Comparte el orgullo de nuestro Karate nacional.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                            className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-wider hover:bg-crimson-red hover:border-crimson-red transition-all cursor-pointer"
                        >
                            Copiar enlace
                        </button>
                        <Link href="/news" className="px-5 py-2.5 rounded-xl bg-crimson-red text-xs font-black uppercase tracking-wider hover:bg-white hover:text-midnight-blue transition-all shadow-xs">
                            Más noticias
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetailPage;
