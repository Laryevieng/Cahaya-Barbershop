'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Star, Calendar } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { BARBERS_DATA } from '@/data';

interface BarbersSectionProps {
  onSelectBarber: (barberId: string) => void;
}

export default function BarbersSection({ onSelectBarber }: BarbersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<ReturnType<typeof import('gsap')['gsap']['context']> | null>(null);

  // ─── Desktop GSAP horizontal scroll (lightweight) ───
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only run on desktop ≥1024px
    const mql = window.matchMedia('(min-width: 1024px)');

    const setup = async () => {
      if (!mql.matches) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = trackRef.current;
      const progressBar = progressRef.current;
      if (!section || !track) return;

      // Clean previous context
      ctxRef.current?.revert();

      ctxRef.current = gsap.context(() => {
        const getDistance = () => track.scrollWidth - window.innerWidth;

        // Single main horizontal scroll — only ONE ScrollTrigger
        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,              // smooth follow (1s lag)
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,      // prevents flicker on pin
            onUpdate: (self) => {
              // Lightweight progress bar update via transform (GPU only)
              if (progressBar) {
                progressBar.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        // Simple opacity reveal for cards — CSS-only, no extra ScrollTrigger
        // Cards start visible and use CSS transition on hover only
      }, section);
    };

    setup();

    // Handle resize (e.g. rotating tablet to landscape)
    const handleChange = () => {
      if (!mql.matches) {
        ctxRef.current?.revert();
        ctxRef.current = null;
      } else {
        setup();
      }
    };
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  // ─── Mobile/Tablet: drag-to-scroll hint ───
  const handleMobileScroll = useCallback(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress})`;
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="barbers"
      className="relative bg-[#050505] overflow-hidden"
    >
      {/* Ambient glow — static, no animation (zero cost) */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/5">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-300 origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* ═══════════════════════════════════════
          DESKTOP layout (≥1024px): GSAP horizontal scroll
      ═══════════════════════════════════════ */}
      <div
        ref={trackRef}
        className="
          hidden lg:flex
          flex-nowrap items-center min-h-screen
          will-change-transform
          gap-8
        "
      >
        {/* Header Panel */}
        <div
          ref={headerRef}
          className="
            w-[48vw] min-w-[48vw] max-w-[48vw]
            flex flex-col justify-center
            pl-[max(2rem,6vw)] pr-16
            shrink-0
          "
        >
          <HeaderContent />
        </div>

        {/* Cards */}
        {BARBERS_DATA.map((barber, index) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            index={index}
            onSelectBarber={onSelectBarber}
          />
        ))}

        {/* End spacer */}
        <div className="min-w-[8vw] shrink-0" />
      </div>

      {/* ═══════════════════════════════════════
          MOBILE / TABLET layout (<1024px): native scroll-snap
      ═══════════════════════════════════════ */}
      <div className="lg:hidden py-16 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <HeaderContent />
        </div>

        {/* Horizontal swipe carousel — native, buttery smooth */}
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="
            flex gap-4 sm:gap-5
            overflow-x-auto
            snap-x snap-mandatory
            scroll-smooth
            touch-pan-x
            overscroll-x-contain
            -mx-4 px-4 sm:-mx-6 sm:px-6
            pb-4
            scrollbar-hide
          "
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {BARBERS_DATA.map((barber, index) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              index={index}
              onSelectBarber={onSelectBarber}
              mobile
            />
          ))}

          {/* End spacer for last card visibility */}
          <div className="min-w-[1px] shrink-0" />
        </div>

        {/* Swipe hint dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {BARBERS_DATA.map((b) => (
            <div
              key={b.id}
              className="w-1.5 h-1.5 rounded-full bg-white/20"
            />
          ))}
        </div>

        {/* Swipe hint text */}
        <p className="text-center text-gray-600 text-[10px] mt-3 tracking-wider uppercase flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Geser untuk melihat semua barber
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Sub-components (memoized for performance)
═══════════════════════════════════════════ */

const HeaderContent = React.memo(function HeaderContent() {
  return (
    <div className="max-w-lg mx-auto lg:mx-0 lg:text-left space-y-5">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-[0.3em] uppercase">
        <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
          <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span>THE CRAFTSMEN</span>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.05]">
        Meet Our{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
          Master Barbers
        </span>
      </h2>

      {/* Description */}
      <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed max-w-md mx-auto lg:mx-0">
        Tim profesional dengan sertifikasi keahlian potongan rambut presisi, beard grooming, dan konsultasi gaya.
      </p>

      {/* Scroll hint — desktop only */}
      <div className="hidden lg:flex items-center space-x-3 pt-2">
        <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium tracking-wider uppercase">
          <span className="block w-8 h-[1px] bg-gradient-to-r from-blue-500 to-transparent" />
          <span>Scroll untuk menjelajahi</span>
          <svg className="w-4 h-4 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Team count badge */}
      <div className="inline-flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex -space-x-2">
          {BARBERS_DATA.slice(0, 4).map((b) => (
            <div key={b.id} className="w-8 h-8 rounded-full border-2 border-[#050505] overflow-hidden">
              <img
                src={b.image}
                alt={b.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: b.imagePosition || 'center top' }}
              />
            </div>
          ))}
        </div>
        <div className="text-left">
          <span className="text-white font-bold text-sm block leading-tight">{BARBERS_DATA.length} Master Barbers</span>
          <span className="text-gray-500 text-[10px] font-medium">Siap melayani di 3 cabang</span>
        </div>
      </div>
    </div>
  );
});

interface BarberCardProps {
  barber: (typeof BARBERS_DATA)[number];
  index: number;
  onSelectBarber: (barberId: string) => void;
  mobile?: boolean;
}

const BarberCard = React.memo(function BarberCard({
  barber,
  index,
  onSelectBarber,
  mobile,
}: BarberCardProps) {
  const isSquarePhoto = barber.name === 'Hera';

  return (
    <div
      className={`
        barber-card
        ${mobile
          ? 'w-[82vw] max-w-[320px] min-w-[260px] sm:w-[320px] sm:min-w-[320px] snap-center'
          : 'w-[360px] min-w-[360px]'
        }
        shrink-0 group
        bg-[#0a0a0e] rounded-2xl overflow-hidden border
        ${barber.isFounder
          ? 'border-amber-500/40 hover:border-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.1)] hover:shadow-[0_10px_35px_rgba(245,158,11,0.25)]'
          : 'border-white/10 hover:border-blue-500/50 hover:shadow-[0_10px_30px_rgba(30,94,255,0.2)]'
        }
        transition-[border-color,box-shadow] duration-300
        flex flex-col justify-between
        lg:hover:-translate-y-2 lg:transition-transform lg:duration-300
      `}
    >
      {/* Image Container — Spacious portrait aspect ratio so vertical subjects are fully visible */}
      <div className={`relative ${mobile ? 'h-[380px] sm:h-[420px]' : 'h-[440px] sm:h-[460px] lg:h-[480px]'} overflow-hidden bg-[#050508] border-b border-white/10 flex items-center justify-center`}>
        <img
          src={barber.image}
          alt={barber.name}
          loading="lazy"
          style={{ objectPosition: isSquarePhoto ? 'center center' : (barber.imagePosition || 'center 20%') }}
          className={`w-full h-full ${
            isSquarePhoto ? 'object-contain' : 'object-cover'
          } group-hover:scale-105 transition-transform duration-500 filter brightness-[1.02] contrast-[1.02]`}
        />
        {/* Top subtle vignette for badge contrast */}
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* Founder Badge */}
        {barber.isFounder && (
          <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1">
            <Star size={11} className="fill-black" />
            <span>LEAD FOUNDER</span>
          </span>
        )}

        {/* Experience Badge */}
        <span
          className={`absolute top-3.5 right-3.5 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border ${
            barber.isFounder
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
              : 'bg-black/75 text-blue-300 border-blue-500/30'
          }`}
        >
          {barber.exp}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3
              className={`font-serif text-lg sm:text-xl font-bold transition-colors duration-200 ${
                barber.isFounder ? 'text-white group-hover:text-amber-400' : 'text-white group-hover:text-blue-400'
              }`}
            >
              {barber.name}
            </h3>
            <span className="text-white/20 font-mono text-xs font-bold tracking-wider">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className={`text-xs font-semibold ${barber.isFounder ? 'text-amber-400' : 'text-blue-400'}`}>
            {barber.role}
          </p>
          <p className="text-xs text-gray-400 font-light leading-relaxed pt-1">
            {barber.specialty}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10">
          <a
            href={`https://instagram.com/${barber.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-gray-400 hover:text-pink-400 transition-colors duration-200"
          >
            <InstagramIcon size={14} className="text-pink-500" />
            <span>{barber.instagram}</span>
          </a>

          <button
            onClick={() => onSelectBarber(String(barber.id))}
            className={`font-bold uppercase text-[10px] tracking-wider flex items-center space-x-1 px-3 py-1.5 rounded border transition-colors duration-200 cursor-pointer ${
              barber.isFounder
                ? 'text-amber-300 bg-amber-950/60 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                : 'text-blue-400 bg-blue-950/60 border-blue-500/30 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <Calendar size={11} />
            <span>BOOK</span>
          </button>
        </div>
      </div>
    </div>
  );
});
