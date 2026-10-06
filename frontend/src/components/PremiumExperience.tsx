"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { isAgreementRoute } from "@/lib/product-navigation";

/** Progressive motion: content stays visible without JavaScript or animation support. */
export default function PremiumExperience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const search = useSearchParams();
  const agreement = isAgreementRoute(pathname, search.toString());
  const workspace = /^\/(dashboard|admin|partner|owner|tenant|shop)(\/|$)/.test(pathname);

  useEffect(() => {
    const container = root.current;
    if (!container || reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
    const animations: Animation[] = [];
    const seen = new WeakSet<Element>();
    let sequence = 0;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // Avoid layering a second animation onto existing Framer Motion elements.
        const element = entry.target as HTMLElement;
        if (element.style.transform || element.style.opacity || !element.animate) return;
        const animation = element.animate([
          { opacity: .65, transform: "translate3d(0, 14px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ], { duration: 520, delay: (sequence++ % 3) * 45, easing: "cubic-bezier(.22,1,.36,1)" });
        animations.push(animation);
      });
    }, { threshold: .08 });
    const scan = () => {
      container.querySelectorAll('main section, main article, main .premium-page-heading, main [data-premium-surface], main [class~="bg-white"][class~="rounded-2xl"], main [class~="bg-white"][class~="rounded-3xl"]').forEach(element => {
        if (seen.has(element) || element.closest('[role="dialog"], .leaflet-container') || element.parentElement?.closest('section, article, [data-premium-surface]') || element.getBoundingClientRect().height > 1100) return;
        seen.add(element);
        observer.observe(element);
      });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(container, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [pathname, reduceMotion]);

  return <MotionConfig reducedMotion="user"><div ref={root} className="premium-app" data-product={agreement ? "agreement" : "rental"} data-workspace={workspace ? "true" : "false"}>{children}</div></MotionConfig>;
}
