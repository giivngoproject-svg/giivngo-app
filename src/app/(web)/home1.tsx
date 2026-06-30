'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Lock,
  Shield,
  Users,
  ChevronRight,
  Heart,
  MapPin,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { poppins } from '@/components/landing/fonts';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';

const FEATURED_CARDS = [
  {
    id: 1,
    title: 'Weekend away',
    image: '/weekend-away.webp',
    icon: '🏖️',
    stats: '8 friends • $1,850 contributed',
    badge: 'Trip booked! ✈️',
    badgeColor: '#00C29A',
  },
  {
    id: 2,
    title: '30th birthday surprise',
    image: '/birthday-surprise.webp',
    icon: '🎂',
    stats: '18 friends • $1,200 contributed',
    badge: 'Gift delivered! 🎉',
    badgeColor: '#FF6B6B',
  },
  {
    id: 3,
    title: 'Footy tipping',
    image: '/footy-tipping.webp',
    icon: '🏈',
    stats: '24 mates • $650 prize pool',
    badge: 'Season underway 🏈',
    badgeColor: '#7C5CFF',
  },
  {
    id: 4,
    title: 'Lotto syndicate',
    image: '/lotto-syndicate.webp',
    icon: '🎰',
    stats: '14 members • Weekly pool ready',
    badge: 'Next draw Sat 🎰',
    badgeColor: '#FFC857',
  },
  {
    id: 5,
    title: 'Wedding gift',
    image: '/wedding-gift.webp',
    icon: '💍',
    stats: '20 guests • $3,000 contributed',
    badge: 'Celebration sorted! 🥂',
    badgeColor: '#00C29A',
  },
];

export default function Home1() {
  return (
    <div className="bg-white scroll-smooth">


      {/* Hero Section */}
      <section
        className="relative pb-0 overflow-hidden min-h-screen  flex items-center py-14"
        style={{
          backgroundImage:
            'url(/giivngo-hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C5CFF]/40 bg-[#7C5CFF]/20 mb-6">
              <Heart size={14} className="text-[#f01dc2]" />
              <span className="text-xs font-semibold text-white tracking-wider">
                SOCIAL GIFTING FOR LIFE'S HAPPY MOMENTS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Turn dreams into reality.{' '}
              <span className="relative inline-block text-[#7C5CFF]">
                Together.
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6">
                  <defs>
                    <linearGradient id="underline" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" stopColor="#7C5CFF" />
                      <stop offset="50%" stopColor="#FF6B6B" />
                      <stop offset="100%" stopColor="#FFC857" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 3 Q 50 0 100 3 T 200 3" stroke="url(#underline)" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Sub Headline */}
            <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
              Create a pool, invite your people, and make life's happiest moments happen.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-[#7C5CFF] hover:bg-[#6b4ce8] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors">
                Start a pool – it's free
                <ArrowRight size={18} />
              </button>
              <button className="border-2 border-white/80 hover:border-white text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors bg-white/10 hover:bg-white/20">
                <Play size={18} />
                See how it works
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-6 text-xs text-center md:text-sm md:text-left text-white ">
              <span className="flex items-center gap-2">
                <Lock size={16} />
                Safe & secure
              </span>
              <span className="flex items-center gap-2">
                <Shield size={16} />
                Bank-level security
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} />
                Loved by thousands
              </span>
            </div>
          </div>
          {/* Floating Card - Bali Trip */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Bali group trip 🌴</h3>
              </div>
              <div className="space-y-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">12 friends joined in</span>
                  <TrendingUp size={18} className="text-[#00C29A]" />
                </div>
                <div className="bg-gradient-to-r from-[#00C29A] to-teal-400 rounded-full px-4 py-2 text-white font-semibold text-sm">
                  $2,400 contributed
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#00C29A]/10 border border-[#00C29A]/20">
                  <span className="text-xs font-semibold text-[#00C29A]">Trip ready! ✈️</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* Social Proof Banner */}
      <section className="relative -mt-12 z-30 mb-24 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-16 md:gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i}`}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-[#7C5CFF] text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                24K+
              </div>
            </div>
            <span className="font-semibold text-gray-900 text-xs md:text-inherit">
              24,000+ happy groups making moments happen together
            </span>
          </div>
          <a href="#" className="text-[#7C5CFF] font-semibold whitespace-nowrap hover:underline flex items-center gap-1">
            See their stories
            <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* What People Are Making Possible */}
      <section id="use-cases" className={`${poppins.variable} scroll-mt-20 py-24 bg-gray-50`}>
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-poppins)] text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              What people are making{' '}
              <span className="text-[#7C5CFF]">possible</span>
            </h2>
            <p className="text-gray-600 text-lg">Real moments. Real people.</p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {FEATURED_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 w-80 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-64">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute -bottom-5 left-6 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white"
                      style={{ backgroundColor: card.badgeColor }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{card.stats}</p>
                    <div
                      className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: card.badgeColor }}
                    >
                      {card.badge}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned landing sections (Poppins-scoped) */}
      <div className={poppins.variable}>
        <div id="how-it-works" className="scroll-mt-20">
          <HowItWorks />
        </div>
        <div id="pricing" className="scroll-mt-20">
          <Pricing />
        </div>
        <Testimonials />
      </div>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 py-12">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 sm:px-12 lg:px-20"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(30, 27, 75, 0.65) 45%, rgba(30, 27, 75, 0.3) 100%), url(/giivngo-footer.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Together, we go{' '}
                <span className="relative">
                  further.
                  <span className="text-[#FFC857] ml-2">💛</span>
                </span>
              </h2>
              <p className="text-xl text-white/80 mb-8">
                From birthdays and weddings to dream vacations and big wins, Giivngo helps you
                turn meaningful moments into lasting memories.
              </p>

              <button className="bg-[#7C5CFF] hover:bg-[#6b4ce8] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-colors mb-8">
                Start your pool today – it's free
                <ArrowRight size={18} />
              </button>

              {/* <div className="flex gap-4">
                <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg text-white text-sm font-medium">
                  App Store
                </div>
                <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg text-white text-sm font-medium">
                  Google Play
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
