'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Lock,
  Shield,
  Users,
  ChevronRight,
  Star,
  Heart,
  Zap,
  TrendingUp,
  Eye,
  Clock,
  ArrowRight,
  PalmtreeIcon,
  Gift,
  Cake,
  Sparkles,
  Award,
  Users2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const USE_CASES = [
  {
    id: 1,
    title: 'Dream Trips',
    icon: PalmtreeIcon,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    color: '#00C29A',
  },
  {
    id: 2,
    title: 'Birthdays',
    icon: Cake,
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=400&h=300&fit=crop',
    color: '#FF6B6B',
  },
  {
    id: 3,
    title: 'Weddings',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    color: '#7C5CFF',
  },
  {
    id: 4,
    title: 'Graduations',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1523050854058-7bfb8faf0bba?w=400&h=300&fit=crop',
    color: '#FFC857',
  },
  {
    id: 5,
    title: 'Team & Club Funds',
    icon: Users2,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    color: '#4DB6FF',
  },
  {
    id: 6,
    title: 'Gifts & Celebrations',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1513651857529-b2276d25b741?w=400&h=300&fit=crop',
    color: '#00C29A',
  },
  {
    id: 7,
    title: 'Community Projects',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    color: '#FF6B6B',
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'No more chasing people',
    desc: 'One link does all the work',
    color: '#00C29A',
  },
  {
    icon: Eye,
    title: 'Easy for everyone',
    desc: 'No account needed to contribute',
    color: '#4DB6FF',
  },
  {
    icon: TrendingUp,
    title: 'Real-time tracking',
    desc: 'See contributions happen live',
    color: '#7C5CFF',
  },
  {
    icon: Globe,
    title: 'Works anywhere',
    desc: 'Desktop, mobile, anywhere',
    color: '#FF6B6B',
  },
  {
    icon: Lock,
    title: 'Safe & secure',
    desc: 'Bank-level encryption always',
    color: '#4DB6FF',
  },
  {
    icon: Users,
    title: 'Built for groups',
    desc: 'Scale from 2 to 2,000 people',
    color: '#00C29A',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Event Organizer',
    text: 'Organized my wedding gift registry in minutes. Everyone knew exactly what to contribute.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    name: 'James L.',
    role: 'Travel Enthusiast',
    text: 'Group trips are now so easy. No more Venmo chains or awkward conversations.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    name: 'Emma R.',
    role: 'Community Leader',
    text: 'We raised $5,000 for our local cause in just two weeks with Giivngo.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
];

function Globe({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

export default function Home2() {
  const scroll = (direction: string) => {
    const element = document.getElementById('carousel');
    if (element) {
      const scrollAmount = 400;
      if (direction === 'left') {
        element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-[#1E1B4B]">G</span>
              <span className="text-[#00C29A]">i</span>
              <span className="text-[#FF6B6B]">i</span>
              <span className="text-[#7C5CFF]">v</span>
              <span className="text-[#FFC857]">n</span>
              <span className="text-[#4DB6FF]">go</span>
            </div>
            <Heart size={20} className="text-[#FF6B6B]" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              How It Works
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Use Cases
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              About Us
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Log In
            </a>
            <button className="bg-[#1E1B4B] hover:bg-[#2d2855] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-24">
            {/* Left Column - Text */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#1E1B4B] mb-6 leading-tight">
                Turn dreams into reality.{' '}
                <span className="text-[#FF6B6B]">Together.</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Social gifting for life's happy moments. Create a pool, share a link, and bring friends,
                family, or communities together to celebrate, support, and make amazing things happen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-[#1E1B4B] hover:bg-[#2d2855] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors">
                  Create a Pool – It's Free
                  <ArrowRight size={18} />
                </button>
                <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Play size={18} />
                  See How It Works
                </button>
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <Lock size={16} />
                  Secure Payments
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={16} />
                  Bank-Level Security
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  Trusted by Thousands
                </span>
              </p>
            </div>

            {/* Right Column - Phone Mockups */}
            <div className="relative h-96 flex items-center justify-center">
              {/* Left Phone */}
              <div className="absolute left-0 top-0 z-20 transform -rotate-12 w-48 h-96">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-3 shadow-2xl h-full">
                  <div className="bg-white rounded-2xl h-full overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-b from-[#00C29A] to-teal-400 text-white p-4">
                      <h3 className="font-bold text-sm mb-2">Trip to Bali</h3>
                      <div className="w-full bg-white/30 rounded-full h-2 mb-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <p className="text-xs">62% of $5,000</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Alex paid</span>
                        <span className="text-green-600 font-bold">$125.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Jordan paid</span>
                        <span className="text-green-600 font-bold">$200.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Casey paid</span>
                        <span className="text-green-600 font-bold">$150.00</span>
                      </div>
                    </div>
                    <div className="p-4 border-t flex gap-2">
                      <button className="flex-1 bg-[#00C29A] text-white text-xs font-bold py-2 rounded-lg">
                        Share
                      </button>
                      <button className="flex-1 bg-[#1E1B4B] text-white text-xs font-bold py-2 rounded-lg">
                        Contribute
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Phone */}
              <div className="absolute right-0 top-0 z-10 transform rotate-12 w-48 h-96">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-3 shadow-2xl h-full">
                  <div className="bg-white rounded-2xl h-full overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-b from-[#FF6B6B] to-rose-400 text-white p-4">
                      <h3 className="font-bold text-sm mb-2">Sarah's 30th Birthday</h3>
                      <div className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Goal reached! 🎉
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total raised</span>
                        <span className="text-[#FF6B6B] font-bold">$1,200.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">18 contributors</span>
                        <span className="text-[#FF6B6B] font-bold">✓</span>
                      </div>
                      <div className="pt-2 border-t text-gray-600">
                        <p className="font-medium mb-2">Contributors</p>
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((i) => (
                            <img
                              key={i}
                              src={`https://i.pravatar.cc/32?img=${i}`}
                              alt="Avatar"
                              className="w-6 h-6 rounded-full border-2 border-white"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t flex gap-2">
                      <button className="flex-1 bg-[#FF6B6B] text-white text-xs font-bold py-2 rounded-lg">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heart Icon Bridge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <Heart size={24} className="text-[#FF6B6B] fill-[#FF6B6B]" />
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Below Hero */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Heart size={16} className="text-[#FF6B6B]" />
              Join thousands of happy groups making moments happen
            </p>
          </div>
        </div>
      </section>

      {/* Perfect for Life's Moments - Carousel */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1B4B] mb-4">
              Perfect for life's{' '}
              <span className="text-[#FF6B6B]">happy moments</span>
            </h2>
          </div>

          <div className="relative">
            <div
              id="carousel"
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {USE_CASES.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <div
                    key={useCase.id}
                    className="flex-shrink-0 w-80 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={useCase.image}
                        alt={useCase.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg"
                        style={{ color: useCase.color }}
                      >
                        <Icon size={24} />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900">
                        {useCase.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight size={20} className="text-[#1E1B4B]" />
            </button>
          </div>
        </div>
      </section>

      {/* How Giivngo Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1E1B4B] text-center mb-16">
            How Giivngo works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Create a Pool', desc: 'Set up your pool in under 30 seconds.', color: '#00C29A' },
              { num: 2, title: 'Share the Link', desc: 'Send one link to the group.', color: '#FF6B6B' },
              { num: 3, title: 'Collect Money', desc: 'Everyone contributes. You track in real time.', color: '#7C5CFF' },
              { num: 4, title: 'Reach Your Goal', desc: 'Close the pool and enjoy the moment!', color: '#FFC857' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why People Love Giivngo */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1E1B4B] text-center mb-16">
            Why people love Giivngo
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: feature.color + '20', color: feature.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1E1B4B] text-center mb-4">
            Trusted by thousands of{' '}
            <span className="text-[#FF6B6B]">happy groups</span>
          </h2>

          <div className="text-center mb-12 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                className="fill-[#FFC857] text-[#FFC857]"
              />
            ))}
            <span className="font-semibold text-gray-900 ml-2">
              4.9/5 from 10,000+ reviews
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Footer CTA */}
      <section className="bg-[#1E1B4B] text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Dream it.
                <br />
                Share it.
                <br />
                Achieve it.
                <br />
                <span className="text-[#FFC857]">Together.</span>
              </h2>
            </div>

            <div className="text-center">
              <p className="text-xl text-white/80 mb-8">
                Start your pool today and turn dreams into reality together.
              </p>
              <button className="bg-white text-[#1E1B4B] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors mx-auto">
                Create Your Pool – It's Free
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-white/60 mb-4">Download the app</p>
              <div className="flex flex-col gap-3">
                <div className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  App Store
                </div>
                <div className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Google Play
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-2xl font-bold">
              <span className="text-[#1E1B4B]">G</span>
              <span className="text-[#00C29A]">i</span>
              <span className="text-[#FF6B6B]">i</span>
              <span className="text-[#7C5CFF]">v</span>
              <span className="text-[#FFC857]">n</span>
              <span className="text-[#4DB6FF]">go</span>
            </div>

            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">
                How it works
              </a>
              <a href="#" className="hover:text-gray-900">
                Use cases
              </a>
              <a href="#" className="hover:text-gray-900">
                Security
              </a>
              <a href="#" className="hover:text-gray-900">
                Pricing
              </a>
              <a href="#" className="hover:text-gray-900">
                About us
              </a>
              <a href="#" className="hover:text-gray-900">
                Help
              </a>
            </div>

            <div className="flex gap-4 text-gray-600 justify-end">
              <a href="#" className="hover:text-gray-900">
                f
              </a>
              <a href="#" className="hover:text-gray-900">
                in
              </a>
              <a href="#" className="hover:text-gray-900">
                𝕏
              </a>
              <a href="#" className="hover:text-gray-900">
                📷
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © 2024 Giivngo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
