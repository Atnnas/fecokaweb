"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MenuBarItem {
    label: string
    href: string
}

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
    items: MenuBarItem[]
}

const springConfig = {
    duration: 0.3,
    ease: "easeOut" as const
}

export function MenuBar({ items, className, ...props }: MenuBarProps) {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
    const menuRef = React.useRef<HTMLDivElement>(null)
    const [tooltipPosition, setTooltipPosition] = React.useState({ left: 0, width: 0 })
    const tooltipRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (activeIndex !== null && menuRef.current && tooltipRef.current) {
            const menuItem = menuRef.current.children[activeIndex] as HTMLElement
            const menuRect = menuRef.current.getBoundingClientRect()
            const itemRect = menuItem.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()

            const left = itemRect.left - menuRect.left + (itemRect.width - tooltipRect.width) / 2

            setTooltipPosition({
                left: Math.max(0, Math.min(left, menuRect.width - tooltipRect.width)),
                width: tooltipRect.width
            })
        }
    }, [activeIndex])

    return (
        <div className={cn("relative z-50", className)} {...props}>
            <AnimatePresence>
                {activeIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={springConfig}
                        className="absolute left-0 right-0 -bottom-[36px] pointer-events-none z-50 flex justify-center"
                    >
                        <motion.div
                            ref={tooltipRef}
                            className={cn(
                                "h-7 px-3 rounded-lg inline-flex justify-center items-center overflow-hidden",
                                "bg-mist-white backdrop-blur shadow-sm",
                                "border border-silver-accent text-midnight-blue"
                            )}
                            initial={{ x: tooltipPosition.left - (menuRef.current?.getBoundingClientRect().width || 0) / 2 }}
                            animate={{ x: tooltipPosition.left - (menuRef.current?.getBoundingClientRect().width || 0) / 2 }}
                            transition={springConfig}
                            style={{ width: "auto" }}
                        >
                            <p className="text-[12px] font-bold tracking-widest uppercase leading-tight whitespace-nowrap text-crimson-red">
                                {items[activeIndex].label}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                ref={menuRef}
                className={cn(
                    "h-14 px-4 inline-flex justify-center items-center gap-2 overflow-hidden z-20",
                    "rounded-full bg-white/95 backdrop-blur-xl",
                    "border border-silver-accent/60",
                    "shadow-premium"
                )}
            >
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className="px-6 py-2.5 rounded-full flex justify-center items-center hover:bg-mist-white transition-all text-midnight-blue hover:text-crimson-red font-bold text-[13px] whitespace-nowrap"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </div>
    )
}
