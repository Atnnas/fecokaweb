"use client";

import React, { useRef, useState, useCallback } from "react";

interface GlareHoverProps {
    children: React.ReactNode;
    glareColor?: string;
    glareOpacity?: number;
    glareAngle?: number;
    glareSize?: number;
    transitionDuration?: number;
    playOnce?: boolean;
    className?: string;
}

export default function GlareHover({
    children,
    glareColor = "#ffffff",
    glareOpacity = 0.3,
    glareAngle = -30,
    glareSize = 300,
    transitionDuration = 800,
    playOnce = false,
    className = "",
}: GlareHoverProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (playOnce && hasPlayed) return;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            setGlarePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        },
        [playOnce, hasPlayed]
    );

    const handleMouseEnter = useCallback(() => {
        if (playOnce && hasPlayed) return;
        setIsHovering(true);
    }, [playOnce, hasPlayed]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        if (playOnce) setHasPlayed(true);
    }, [playOnce]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ isolation: "isolate" }}
        >
            {children}

            {/* Glare overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-30"
                style={{
                    opacity: isHovering ? 1 : 0,
                    transition: `opacity ${transitionDuration / 2}ms ease`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: glarePosition.y - glareSize / 2,
                        left: glarePosition.x - glareSize / 2,
                        width: glareSize,
                        height: glareSize,
                        background: `radial-gradient(circle, ${glareColor} 0%, transparent 70%)`,
                        opacity: glareOpacity,
                        transform: `rotate(${glareAngle}deg)`,
                        transition: isHovering
                            ? `top ${transitionDuration}ms ease, left ${transitionDuration}ms ease`
                            : "none",
                        pointerEvents: "none",
                        borderRadius: "50%",
                        filter: "blur(20px)",
                    }}
                />
            </div>

            {/* Edge shine on hover */}
            <div
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                    boxShadow: isHovering
                        ? `inset 0 0 40px 0 ${glareColor}15, inset 0 1px 0 0 ${glareColor}20`
                        : "none",
                    transition: `box-shadow ${transitionDuration}ms ease`,
                }}
            />
        </div>
    );
}
