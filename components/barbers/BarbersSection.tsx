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

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

      ctxRef.current?.revert();

      ctxRef.current = gsap.context(() => {
        const getDistance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressBar) {
                progressBar.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      }, section);
    };

    setup();

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
      className="relative bg-[#0f1115] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/5">
        <div
          ref={progressRef}
          className="h-full bg-[#c89b3c] origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Desktop layout */}
      <div
        ref={trackRef}
        className="
          hidden lg:flex
          flex-nowrap items-center min-h-screen
          will-change-transform
          gap-8
        "
      >
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

        {BARBERS_DATA.map((barber, index) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            index={index}
            onSelectBarber={onSelectBarber}
          />
        ))}

        <div className="min-w-[8vw] shrink-0" />
      </div>

      {/* Mobile / Tablet layout */}
      <div className="lg:hidden py-16 px-4 sm:px-6">
        <div className="mb-10 text-center">
          <HeaderContent />
        </div>

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

          <div className="min-w-[1px] shrink-0" />
        </div>

        <div className="flex justify-center gap-1.5 mt-5">
          {BARBERS_DATA.map((b) => (
            <div
              key={b.id}
              className="w-1.5 h-1.5 rounded-full bg-white/20"
            />
          ))}
        </div>

        <p className="text-center text-[#9ca3af] text-[11px] mt-3 tracking-wider uppercase flex items-center justify-center gap-1.5">
          Geser untuk melihat seluruh kapster
        </p>
      </div>
    </section>
  );
}

const HeaderContent = React.memo(function HeaderContent() {
  return (
    <div className="max-w-lg mx-auto lg:mx-0 lg:text-left space-y-4">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#f1f1ed] leading-[1.1]">
        Temui Master Barber Kami
      </h2>

      <p className="text-[#9ca3af] text-sm sm:text-base font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
        Tujuh kapster berdedikasi dengan keahlian pangkas rambut presisi, penataan tekstur, dan konsultasi gaya pria.
      </p>

      <div className="hidden lg:flex items-center space-x-3 pt-1">
        <div className="flex items-center space-x-2 text-[#9ca3af] text-xs font-medium tracking-wider uppercase">
          <span className="block w-6 h-[1px] bg-[#c89b3c]" />
          <span>Gulir horizontal untuk melihat profil</span>
        </div>
      </div>

      <div className="inline-flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-[#181b22] border border-white/10">
        <div className="flex -space-x-2">
          {BARBERS_DATA.slice(0, 4).map((b) => (
            <div key={b.id} className="w-8 h-8 rounded-full border-2 border-[#181b22] overflow-hidden">
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
          <span className="text-white font-bold text-xs block leading-tight">
            {BARBERS_DATA.length} Master Barber
          </span>
          <span className="text-[#9ca3af] text-[10px]">
            Siap melayani di 3 cabang
          </span>
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
        bg-[#181b22] rounded-2xl overflow-hidden border
        ${barber.isFounder
          ? 'border-[#c89b3c]/50 hover:border-[#c89b3c] shadow-lg shadow-black/40'
          : 'border-white/10 hover:border-white/25'
        }
        transition-colors duration-200
        flex flex-col justify-between
      `}
    >
      <div className={`relative ${mobile ? 'h-[380px] sm:h-[420px]' : 'h-[440px] sm:h-[460px] lg:h-[480px]'} overflow-hidden bg-[#12141a] border-b border-white/10 flex items-center justify-center`}>
        <img
          src={barber.image}
          alt={barber.name}
          loading="lazy"
          style={{ objectPosition: isSquarePhoto ? 'center center' : (barber.imagePosition || 'center 20%') }}
          className={`w-full h-full ${
            isSquarePhoto ? 'object-contain' : 'object-cover'
          } filter brightness-[1.01] contrast-[1.01]`}
        />
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/50 via-black/10 to-transparent pointer-events-none" />

        {barber.isFounder && (
          <span className="absolute top-3.5 left-3.5 bg-[#c89b3c] text-[#0f1115] font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded-md shadow flex items-center space-x-1">
            <Star size={11} className="fill-[#0f1115]" />
            <span>FOUNDER</span>
          </span>
        )}

        <span className="absolute top-3.5 right-3.5 bg-[#0f1115]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-[#f1f1ed] border border-white/10">
          {barber.exp}
        </span>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f1f1ed]">
              {barber.name}
            </h3>
            <span className="text-[#9ca3af]/40 font-mono text-xs font-bold">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs font-medium text-[#c89b3c]">
            {barber.role}
          </p>
          <p className="text-xs text-[#9ca3af] leading-relaxed pt-1">
            {barber.specialty}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <a
            href={`https://instagram.com/${barber.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#9ca3af] hover:text-white transition-colors flex items-center gap-1.5"
            aria-label={`Instagram ${barber.name}`}
          >
            <InstagramIcon size={14} />
            <span>{barber.instagram}</span>
          </a>

          <button
            type="button"
            onClick={() => onSelectBarber(String(barber.id))}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#c89b3c] hover:text-[#0f1115] text-[#f1f1ed] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Calendar size={13} />
            <span>Pilih</span>
          </button>
        </div>
      </div>
    </div>
  );
});
