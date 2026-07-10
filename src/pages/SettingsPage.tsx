import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Bell, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [plan, setPlan] = useState('Free');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPlan('Free'); // Mapped locally
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      setUser({ ...user, displayName });
      alert('Profile updated');
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Settings</h1>
        <p className="text-[var(--color-text-body)]">Manage your account, preferences, and subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-[rgba(139,92,246,0.1)] text-[var(--color-accent)] font-medium">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" /> Account
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg text-[var(--color-text-meta)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" /> Billing & Plan
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg text-[var(--color-text-meta)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" /> Notifications
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg text-[var(--color-text-meta)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" /> Privacy & Security
            </div>
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-meta)] mb-1">Display Name</label>
                <input 
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-meta)] mb-1">Email Address</label>
                <input 
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-2.5 text-[var(--color-text-meta)] cursor-not-allowed"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Current Plan</h3>
                <p className="text-[14px] text-[var(--color-text-meta)]">You are currently on the {plan} plan.</p>
              </div>
              <div className="px-3 py-1 bg-[rgba(139,92,246,0.1)] text-[var(--color-accent)] border border-[rgba(139,92,246,0.2)] rounded-full text-sm font-bold uppercase tracking-wide">
                {plan}
              </div>
            </div>
            
            <div className="bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-subtle)] rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">AI Assistant Limits</span>
                <span className="text-sm text-[var(--color-text-meta)]">15 / 50 messages</span>
              </div>
              <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-accent)] w-[30%]" />
              </div>
            </div>

            <Button className="w-full justify-between" onClick={() => navigate('/app/pricing')}>
              <span>Upgrade Plan</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
