import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles, ScanLine, MessageCircle, BarChart3, ArrowRight, ChevronDown,
} from 'lucide-react';
import FoodScene from '../components/FoodScene';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Badge } from '../components/ui/Badge';
import { useLenis } from '../hooks/useLenis';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMouseParallax } from '../hooks/useMouseParallax';

gsap.registerPlugin(ScrollTrigger);

const journeySteps = [
  {
    num: '01',
    title: 'Scan your meal',
    desc: 'Point your camera at any dish. Our AI instantly recognizes ingredients, portions, and nutritional composition.',
  },
  {
    num: '02',
    title: 'Understand deeply',
    desc: 'Receive precise macro breakdowns, calorie counts, and personalized insights tailored to your goals.',
  },
  {
    num: '03',
    title: 'Elevate every bite',
    desc: 'Track progress effortlessly. Your AI nutritionist adapts recommendations as your body transforms.',
  },
];

const features = [
  {
    icon: ScanLine,
    title: 'AI Food Scanner',
    desc: 'Instant recognition of any meal with 98% accuracy across 50,000+ food items.',
  },
  {
    icon: MessageCircle,
    title: 'Personal AI Coach',
    desc: '24/7 nutrition guidance powered by advanced language models trained on dietary science.',
  },
  {
    icon: BarChart3,
    title: 'Macro Analytics',
    desc: 'Beautiful visualizations of your protein, carbs, fats, and micronutrient trends over time.',
  },
  {
    icon: Sparkles,
    title: 'Smart Meal Plans',
    desc: 'AI-generated weekly plans that adapt to your preferences, allergies, and fitness goals.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);
  const heroRef = useMouseParallax(0.02);
  const journeyRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
      });

      gsap.from('.hero-sub', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6,
      });

      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.9,
      });

      if (journeyRef.current) {
        gsap.from('.journey-step', {
          scrollTrigger: {
            trigger: journeyRef.current,
            start: 'top 75%',
          },
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      if (featuresRef.current) {
        gsap.from('.feature-card', {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      if (statsRef.current) {
        gsap.from('.stat-item', {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
          scale: 0.9,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'back.out(1.4)',
        });
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="noise-overlay">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <FoodScene />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-bg-base)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,204,154,0.06),transparent_60%)] pointer-events-none" />

        <header className="relative z-20 flex items-center justify-between p-6 md:px-10 max-w-7xl mx-auto w-full">
          <Logo size="md" />
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')}>Sign In</Button>
            <Button size="sm" onClick={() => navigate('/auth/signup')}>Get Started</Button>
          </nav>
        </header>

        <div ref={heroRef} className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full pb-24">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Badge variant="accent">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              AI-Powered Nutrition
            </Badge>
          </motion.div>

          <h1 className="hero-title display-heading text-[clamp(3rem,8vw,6.5rem)] text-[var(--color-text-page-title)] mb-8 text-balance">
            Nourish with<br />
            <span className="gradient-text">intelligence</span>
          </h1>

          <p className="hero-sub text-lg md:text-xl text-[var(--color-text-body)] max-w-2xl mx-auto leading-relaxed mb-12 text-balance">
            The premium nutrition platform that transforms how you eat.
            Scan, track, and optimize every meal with cinematic precision.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth/signup')}>
              Start your journey
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => {
              document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore features
            </Button>
          </div>
        </div>

        <motion.div
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative z-10 flex justify-center pb-8"
        >
          <ChevronDown className="w-5 h-5 text-[var(--color-text-meta)]" />
        </motion.div>
      </section>

      {/* Journey */}
      <section id="journey" ref={journeyRef} className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="label-caps mb-4 block">Your nutrition journey</span>
            <h2 className="display-heading text-[clamp(2.5rem,5vw,4rem)] text-[var(--color-text-page-title)] text-balance">
              From plate to progress,<br />effortlessly
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {journeySteps.map((step) => (
              <div key={step.num} className="journey-step group">
                <div className="glass rounded-[24px] p-8 md:p-10 h-full transition-all duration-500 group-hover:border-[var(--color-border-glow)] group-hover:glow-emerald">
                  <span className="text-[var(--color-accent-gold)] font-display text-5xl font-light mb-6 block opacity-60">
                    {step.num}
                  </span>
                  <h3 className="text-2xl font-display font-light text-[var(--color-text-page-title)] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-text-body)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(46,204,154,0.06),transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: 50000, suffix: '+', label: 'Foods recognized' },
              { value: 98, suffix: '%', label: 'Scan accuracy' },
              { value: 2, suffix: 'M+', label: 'Meals tracked', prefix: '' },
              { value: 4.9, suffix: '', label: 'User rating', decimals: 1 },
            ].map((stat) => (
              <div key={stat.label} className="stat-item text-center">
                <div className="text-4xl md:text-5xl font-display font-light text-[var(--color-text-page-title)] mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    decimals={stat.decimals}
                  />
                </div>
                <span className="label-caps">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="label-caps mb-4 block">Capabilities</span>
              <h2 className="display-heading text-[clamp(2.5rem,5vw,4rem)] text-[var(--color-text-page-title)]">
                Precision meets<br />elegance
              </h2>
            </div>
            <p className="text-[var(--color-text-body)] max-w-md leading-relaxed">
              Every feature designed with the same attention to detail as a luxury experience — intuitive, beautiful, and powerful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card glass rounded-[24px] p-8 md:p-10 group hover:border-[var(--color-border-glow)] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-[rgba(46,204,154,0.1)] flex items-center justify-center mb-6 group-hover:glow-emerald transition-all duration-500">
                  <feature.icon className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-display font-light text-[var(--color-text-page-title)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-body)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,98,0.08),transparent_70%)] pointer-events-none" />
          <span className="label-caps mb-6 block">Begin today</span>
          <h2 className="display-heading text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--color-text-page-title)] mb-8 text-balance">
            Make every meal as<br />
            <span className="gradient-text">refined as your goals</span>
          </h2>
          <p className="text-lg text-[var(--color-text-body)] mb-10 max-w-xl mx-auto">
            Join thousands who've elevated their nutrition with AI-powered precision.
          </p>
          <Button size="lg" variant="gold" onClick={() => navigate('/auth/signup')}>
            Start free trial
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p className="text-[13px] text-[var(--color-text-meta)]">
            &copy; {new Date().getFullYear()} 9RITFIH AI. Premium nutrition intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
