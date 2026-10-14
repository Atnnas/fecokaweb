"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Shield, User } from "lucide-react";

import type { Session } from "next-auth";

interface MenuItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  menuItems: MenuItem[];
  pathname: string;
  session: Session | null;
  onSignOut: () => void;
  onLoginClick?: () => void;
}

/**
 * High-definition user avatar with automatic resolution upgrade,
 * no-referrer policy to avoid CDN 403 blocks, and fallback initials.
 */
function UserAvatar({
  image,
  name,
}: {
  image?: string | null;
  name?: string | null;
}) {
  const [hasError, setHasError] = useState(false);

  // Upgrade Google/OAuth avatar URL to high resolution (e.g. =s256-c)
  const highResImage = useMemo(() => {
    if (!image) return null;
    return image.replace(/=s\d+(-c)?/i, "=s256-c");
  }, [image]);

  const initials = useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  return (
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm overflow-hidden aspect-square flex items-center justify-center bg-slate-100">
        {highResImage && !hasError ? (
          <img
            src={highResImage}
            alt={name || "Usuario"}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-midnight-blue via-[#002b66] to-crimson-red text-white flex items-center justify-center font-black text-xs uppercase shadow-inner">
            {initials}
          </div>
        )}
      </div>
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full z-10" />
    </div>
  );
}

export default function DesktopNav({
  menuItems,
  pathname,
  session,
  onSignOut,
  onLoginClick,
}: DesktopNavProps) {
  return (
    <div className="hidden lg:flex items-center justify-between w-full max-w-[96%] 2xl:max-w-[1840px] mx-auto h-full px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 gap-4">
      {/* Official FECOKA Brand Identity */}
      <div className="flex items-center shrink-0 gap-4">
        <Link
          href="/"
          className="flex items-center transition-transform duration-300 hover:scale-[1.02] shrink-0"
          title="Federación Costarricense de Karate - Inicio"
        >
          <Image
            src="/assets/fecoka-logo-blanco-transparente.png"
            alt="FECOKA - Federación Costarricense de Karate"
            width={240}
            height={56}
            className="h-11 sm:h-12 xl:h-13 w-auto object-contain shrink-0"
            priority
          />
        </Link>

        {/* Institutional Accreditation Divider & Official WKF Partner */}
        <div className="hidden xl:flex items-center gap-2.5 border-l border-slate-200/90 pl-3.5 py-0.5">
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-midnight-blue leading-tight">
              Federación Oficial
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-crimson-red tracking-wider uppercase">
                Costa Rica · WKF
              </span>
              <a
                href="https://www.wkf.net"
                target="_blank"
                rel="noopener noreferrer"
                title="World Karate Federation (WKF)"
                className="inline-flex items-center hover:scale-110 transition-transform duration-200"
              >
                <Image
                  src="/assets/wkf-logo.png"
                  alt="World Karate Federation (WKF)"
                  width={22}
                  height={22}
                  className="h-[18px] w-[18px] object-contain drop-shadow-sm"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Desktop Navigation Menu - Enhanced Legibility & Size */}
      <nav className="flex items-center justify-center">
        <ul className="flex items-center gap-1.5 xl:gap-2 2xl:gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label} className="list-none">
                <Link
                  href={item.href}
                  className={`relative inline-flex items-center justify-center px-3.5 xl:px-4 2xl:px-5 py-2.5 rounded-xl text-[15px] xl:text-[16px] 2xl:text-[17px] transition-all duration-200 ${
                    isActive
                      ? "text-midnight-blue bg-midnight-blue/[0.09] font-black shadow-inner"
                      : "text-steel-gray hover:text-midnight-blue hover:bg-slate-100/90 font-bold"
                  }`}
                >
                  <span className="whitespace-nowrap tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[2.5px] bg-crimson-red rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Executive User Actions & Profile */}
      <div className="flex items-center shrink-0 gap-3">
        {session ? (
          <div className="flex items-center gap-2.5 2xl:gap-3">
            {/* User Profile Pill with Repaired High-Res Avatar */}
            <div
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 shadow-xs transition-colors"
              title={session.user?.email || "Usuario autenticado"}
            >
              <UserAvatar image={session.user?.image} name={session.user?.name} />
              <div className="flex flex-col text-left justify-center pr-1">
                <span className="text-sm font-black text-midnight-blue leading-tight truncate max-w-[110px] 2xl:max-w-[140px]">
                  {session.user?.name?.split(" ")[0]}
                </span>
                {session.user?.role === "admin" || session.user?.role === "edit" ? (
                  <span className="text-[10px] font-black uppercase text-crimson-red tracking-wider">
                    Administrador
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-steel-gray/80 tracking-wider">
                    Federado
                  </span>
                )}
              </div>
            </div>

            {/* Admin Portal Quick Action Button */}
            {(session.user?.role === "admin" || session.user?.role === "edit") && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs xl:text-sm font-black uppercase tracking-wider text-white bg-midnight-blue hover:bg-crimson-red transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                title="Ir al Panel de Administración"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden xl:inline">Panel</span>
              </Link>
            )}

            {/* Logout Action */}
            <button
              onClick={onSignOut}
              className="p-2.5 text-steel-gray hover:text-crimson-red hover:bg-crimson-red/10 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer"
              title="Cerrar Sesión"
              aria-label="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          onLoginClick && (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm xl:text-[15px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-midnight-blue to-[#002b66] hover:from-crimson-red hover:to-[#b70322] rounded-full shadow-md shadow-midnight-blue/15 hover:shadow-lg hover:shadow-crimson-red/25 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Ingresar</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
