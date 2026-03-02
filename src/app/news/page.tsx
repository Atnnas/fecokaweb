'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PublicNewsPage = () => {
    const [news, setNews] = useState([]);

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
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="max-w-7xl mx-auto section-padding px-8 md:px-6">
            <div className="mb-20 animate-fade-up">
                <span className="text-crimson-red font-black text-sm uppercase tracking-widest block mb-4">Sala de Prensa</span>
                <h1 className="text-6xl md:text-8xl font-black text-midnight-blue tracking-tighter lowercase leading-[0.85]">
                    noticias_ <br />
                    <span className="text-crimson-red">fecoka</span>
                </h1>
                <div className="h-2 w-32 bg-midnight-blue mt-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {news.length > 0 ? news.map((item: any, idx) => (
                    <article
                        key={item._id}
                        className="group relative bg-white rounded-[48px] p-3 border border-silver-accent hover:shadow-premium hover:-translate-y-4 transition-all duration-500 animate-fade-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                        <div className="relative h-64 rounded-[38px] bg-silver-accent overflow-hidden">
                            {item.images && item.images.length > 0 ? (
                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-midnight-blue/10 font-black text-3xl italic">FECOKA PR</div>
                            )}
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-crimson-red uppercase tracking-[0.2em]">{item.category}</span>
                                <span className="text-[10px] font-bold text-steel-gray uppercase tracking-widest">{new Date(item.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <h2 className="text-2xl font-black text-midnight-blue mb-5 group-hover:text-crimson-red transition-colors leading-tight">
                                {item.title}
                            </h2>
                            <p className="text-steel-gray text-sm leading-relaxed font-medium line-clamp-3 mb-8">
                                {item.content}
                            </p>
                            <Link
                                href={`/news/${item._id}`}
                                className="flex items-center gap-3 text-midnight-blue font-black text-xs uppercase tracking-widest hover:text-crimson-red transition-colors inline-block"
                            >
                                Leer artículo completo
                                <div className="w-8 h-[2px] bg-current" />
                            </Link>
                        </div>
                    </article>
                )) : (
                    <div className="col-span-full py-40 text-center">
                        <p className="text-steel-gray font-black text-2xl uppercase tracking-widest opacity-20">No hay noticias publicadas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicNewsPage;
