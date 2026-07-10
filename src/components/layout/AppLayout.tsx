import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, UtensilsCrossed, ScanLine,
  BarChart3, User, Settings, Crown, LogOut, Menu, X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Logo } from '../ui/Logo';
import { useAuthStore } from '../../store/useAuthStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: UtensilsCrossed, label: 'Meals', path: '/app/meals' },
  { icon: ScanLine, label: 'Food Scanner', path: '/app/scanner' },
  { icon: MessageSquare, label: 'AI Coach', path: '/app/assistant' },
  { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
  { icon: User, label: 'Profile', path: '/app/profile' },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user && !loading && !location.pathname.startsWith('/auth')) {
      navigate('/');
    }
  }, [user, loading, navigate, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--color-bg-base)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[var(--color-text-meta)]">Loading...</span>
        </div>
      </div>
    );
  }

  const sidebar = (
    <>
      <div className="p-6 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-[var(--color-text-meta)] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300',
              isActive
                ? 'bg-[rgba(46,204,154,0.08)] text-[var(--color-accent)] shadow-[inset_3px_0_0_0_var(--color-accent)]'
                : 'text-[var(--color-text-meta)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--color-text-page-title)]'
            )}
          >
            <item.icon strokeWidth={1.5} className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-1 border-t border-[var(--color-border-subtle)]">
        <NavLink
          to="/app/pricing"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300',
            isActive
              ? 'bg-[rgba(201,169,98,0.08)] text-[var(--color-accent-gold)]'
              : 'text-[var(--color-text-meta)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--color-accent-gold)]'
          )}
        >
          <Crown strokeWidth={1.5} className="w-[18px] h-[18px]" />
          Upgrade
        </NavLink>
        <NavLink
          to="/app/settings"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300',
            isActive
              ? 'bg-[rgba(46,204,154,0.08)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-meta)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--color-text-page-title)]'
          )}
        >
          <Settings strokeWidth={1.5} className="w-[18px] h-[18px]" />
          Settings
        </NavLink>

        <div className="flex items-center gap-3 px-4 py-3 mt-2 group">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full ring-2 ring-[var(--color-border-subtle)]" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-gold)]/20 flex items-center justify-center text-sm text-[var(--color-text-page-title)] font-medium ring-2 ring-[var(--color-border-subtle)]">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[var(--color-text-page-title)] truncate">
              {user?.displayName || 'Member'}
            </p>
            <p className="text-[12px] text-[var(--color-text-meta)] truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[var(--color-text-meta)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)] text-[var(--color-text-body)] overflow-hidden noise-overlay">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] border-r border-[var(--color-border-subtle)] glass-strong flex-col z-20 shrink-0">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[280px] glass-strong border-r border-[var(--color-border-subtle)] flex flex-col z-50 lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] glass shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[var(--color-text-meta)] hover:text-white transition-colors p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <div className="w-7" />
        </header>

        <div className="flex-1 overflow-y-auto relative" data-lenis-prevent>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(46,204,154,0.04),transparent_50%)] pointer-events-none" />
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto w-full min-h-full relative z-10"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
