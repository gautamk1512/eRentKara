"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import Link from "next/link";

export function PremiumSurface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section data-premium-surface className={`premium-surface ${className}`}>{children}</section>;
}

export function PremiumPageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return <div className="premium-page-heading"><div>{eyebrow && <p className="premium-kicker">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{children && <div className="premium-page-actions">{children}</div>}</div>;
}

export function PremiumEmptyState({ icon: Icon, title, description, href, action }: { icon: LucideIcon; title: string; description: string; href?: string; action?: string }) {
  return <div className="premium-empty"><span className="premium-empty-icon"><Icon size={28} strokeWidth={1.5} /></span><h2>{title}</h2><p>{description}</p>{href && action && <Link href={href} className="premium-primary mt-6">{action}<ArrowUpRight size={16} /></Link>}</div>;
}

export function PremiumReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : {opacity: 0, y: 18}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: .1}} transition={{duration: .65, delay: reduce ? 0 : delay, ease: [.22, 1, .36, 1]}}>{children}</motion.div>;
}
