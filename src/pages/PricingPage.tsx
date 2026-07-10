import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for casual studying.',
    features: ['Basic Notes', 'Up to 3 Flashcard Decks', '50 AI Messages / mo', 'Community Access'],
    tier: 'Free'
  },
  {
    name: 'Plus',
    price: '$9',
    period: '/mo',
    description: 'For dedicated students.',
    features: ['Advanced Notes', 'Unlimited Flashcards', '500 AI Messages / mo', 'PDF Extraction (up to 50 pages)'],
    tier: 'Plus'
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'The ultimate study toolkit.',
    features: ['Everything in Plus', 'Unlimited AI Messages', 'Advanced Analytics', 'PDF Extraction (unlimited)', 'Priority Support'],
    tier: 'Pro',
    popular: true
  },
  {
    name: 'Max',
    price: '$49',
    period: '/mo',
    description: 'For power users and researchers.',
    features: ['Everything in Pro', 'Early Access to features', 'Custom AI Models', '1-on-1 Onboarding'],
    tier: 'Max'
  }
];

export function PricingPage() {
  const { user } = useAuthStore();
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async (tier: string) => {
    if (!user || upgrading) return;
    
    // Stub payment integration
    if (tier !== 'Free') {
      const confirmPayment = window.confirm(`This is a payment stub. Simulate a $ payment for ${tier} plan?`);
      if (!confirmPayment) return;
    }

    setUpgrading(true);
    setTimeout(() => {
      alert(`Successfully subscribed to ${tier}!`);
      setUpgrading(false);
      navigate('/app/settings');
    }, 1000);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Choose your plan</h1>
        <p className="text-xl text-[var(--color-text-body)] max-w-2xl mx-auto">
          Unlock the full potential of your study workspace. 
          Upgrade your plan to get more AI power and unlimited resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`p-8 flex flex-col relative ${plan.popular ? 'border-[var(--color-accent)] shadow-[0_0_30px_rgba(139,92,246,0.15)]' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-accent)] text-white text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-[14px] text-[var(--color-text-meta)] h-10">{plan.description}</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
              {plan.period && <span className="text-[var(--color-text-meta)]">{plan.period}</span>}
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-[var(--color-text-body)]">
                  <Check className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant={plan.popular ? 'primary' : 'secondary'} 
              className="w-full"
              onClick={() => handleUpgrade(plan.tier)}
              disabled={upgrading}
            >
              Select {plan.name}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
