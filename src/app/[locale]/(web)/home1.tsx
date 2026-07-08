'use client';

import { Link } from '@/i18n/navigation';
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
import { useTranslation } from '@/lib/useTranslation';

const FEATURED_CARDS = [
  {
    id: 1,
    titleKey: 'landing.showcase.cards.1.title',
    image: '/weekend-away.webp',
    icon: '🏖️',
    statsKey: 'landing.showcase.cards.1.stats',
    badgeKey: 'landing.showcase.cards.1.badge',
    badgeColor: '#00C29A',
  },
  {
    id: 2,
    titleKey: 'landing.showcase.cards.2.title',
    image: '/birthday-surprise.webp',
    icon: '🎂',
    statsKey: 'landing.showcase.cards.2.stats',
    badgeKey: 'landing.showcase.cards.2.badge',
    badgeColor: '#FF6B6B',
  },
  {
    id: 3,
    titleKey: 'landing.showcase.cards.3.title',
    image: '/baby-shower.webp',
    icon: '🍼',
    statsKey: 'landing.showcase.cards.3.stats',
    badgeKey: 'landing.showcase.cards.3.badge',
    badgeColor: '#7C5CFF',
  },
  {
    id: 4,
    titleKey: 'landing.showcase.cards.4.title',
    image: '/xmas-work-party.webp',
    icon: '🎄',
    statsKey: 'landing.showcase.cards.4.stats',
    badgeKey: 'landing.showcase.cards.4.badge',
    badgeColor: '#FFC857',
  },
  {
    id: 5,
    titleKey: 'landing.showcase.cards.5.title',
    image: '/wedding-gift.webp',
    icon: '💍',
    statsKey: 'landing.showcase.cards.5.stats',
    badgeKey: 'landing.showcase.cards.5.badge',
    badgeColor: '#00C29A',
  },
];

export default function Home1() {
  const t = useTranslation();

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
                {t('landing.tagline')}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold text-white mb-6 leading-tight">
              {t('landing.hero.title')}<br />
              {t('landing.hero.headline.line1')}
              <br />
              <span className="relative inline-block text-[#7C5CFF]">
                {t('landing.hero.headline.line2')}
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
              </span>{' '}
              {t('landing.hero.headline.line3')}
            </h1>

            {/* Sub Headline */}
            <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
              {t('landing.hero.description')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/sign-up"
                className="bg-[#7C5CFF] hover:bg-[#6b4ce8] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {t('landing.hero.cta')}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/#how-it-works"
                className="border-2 border-white/80 hover:border-white text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors bg-white/10 hover:bg-white/20"
              >
                <Play size={18} />
                {t('landing.hero.secondary_cta')}
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-6 text-xs text-center md:text-sm md:text-left text-white ">
              <span className="flex items-center gap-2">
                <Lock size={16} />
                {t('landing.features.secure')}
              </span>
              <span className="flex items-center gap-2">
                <Shield size={16} />
                {t('landing.features.banking')}
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} />
                {t('landing.features.loved')}
              </span>
            </div>
          </div>
          {/* Floating Card - Bali Trip */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">🌴 {t('landing.example.bali')}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex -space-x-3">
                  {[1, 3, 4, 5, 7].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">12 {t('landing.example.floating_card.friends')}</span>
                  <TrendingUp size={18} className="text-[#00C29A]" />
                </div>
                <div className="bg-gradient-to-r from-[#00C29A] to-teal-400 rounded-full px-4 py-2 text-white font-semibold text-sm">
                  $2,400 {t('landing.example.floating_card.amount')}
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#00C29A]/10 border border-[#00C29A]/20">
                  <span className="text-xs font-semibold text-[#00C29A]">{t('landing.example.floating_card.badge')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* Social Proof Banner */}
      <section className="relative -mt-12 z-30 mb-24 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex -space-x-3 shrink-0">
              {[1, 3, 4, 5, 7, 8].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i}`}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ))}
              {/* <div className="w-10 h-10 rounded-full bg-[#7C5CFF] text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                {t('landing.social.total_users_count')}
              </div> */}
            </div>
            <span className="font-semibold text-gray-900 text-xs md:text-inherit">
              {t('landing.social.count')}
            </span>
          </div>
          {/* <a href="#" className="text-[#7C5CFF] font-semibold whitespace-nowrap hover:underline flex items-center gap-1">
            {t('landing.social.stories')}
            <ChevronRight size={16} />
          </a> */}
        </div>
      </section>

      {/* What People Are Making Possible */}
      <section id="use-cases" className={`${poppins.variable} scroll-mt-20 py-24 bg-gray-50`}>
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-poppins)] text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              {t('landing.showcase.title')}{' '}
              <span className="text-[#7C5CFF]">{t('landing.showcase.subtitle')}</span>
            </h2>
            <p className="text-gray-600 text-lg">{t('landing.showcase.description')}</p>
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
                      alt={t(card.titleKey as any)}
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
                      {t(card.titleKey as any)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{t(card.statsKey as any)}</p>
                    <div
                      className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: card.badgeColor }}
                    >
                      {t(card.badgeKey as any)}
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
                {t('landing.cta.title')}{' '}
                <span className="relative">
                  {t('landing.cta.subtitle')}
                  <span className="text-[#FFC857] ml-2">💛</span>
                </span>
              </h2>
              <p className="text-xl text-white/80 mb-8">
                {t('landing.cta.description')}
              </p>

              <Link
                href="/sign-up"
                className="bg-[#7C5CFF] hover:bg-[#6b4ce8] text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 transition-colors mb-8"
              >
                {t('landing.cta.button')}
                <ArrowRight size={18} />
              </Link>

              {/* <div className="flex gap-4">
                <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg text-white text-sm font-medium">
                  {t('landing.app.store')}
                </div>
                <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg text-white text-sm font-medium">
                  {t('landing.app.google_play')}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
