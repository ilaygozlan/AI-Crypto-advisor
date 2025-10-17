import { useEffect, useMemo, useState } from 'react';
import { IconTabs } from '@/components/ui/IconTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, LineChart, Bot, PartyPopper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MarketNewsPanel from './panels/MarketNewsPanel';
import CoinPricesPanel from './panels/CoinPricesPanel';
import AiInsightPanel from './panels/AiInsightPanel';
import MemePanel from './panels/MemePanel';

// Content type mapping from database to tab IDs
const CONTENT_TYPE_MAPPING = {
  'Market News': 'news',
  'articles': 'news',
  'charts': 'prices', 
  'social': 'ai',
  'Fun': 'meme'
} as const;

const ALL_TABS = [
  { id: 'news',   label: 'Market News',     icon: <Newspaper className="h-4 w-4" /> },
  { id: 'prices', label: 'Coin Prices',     icon: <LineChart className="h-4 w-4" /> },
  { id: 'ai',     label: 'AI Insight',      icon: <Bot className="h-4 w-4" /> },
  { id: 'meme',   label: 'Fun Crypto Meme', icon: <PartyPopper className="h-4 w-4" /> },
] as const;

export default function DashboardView() {
  const { user } = useAuth();
  const url = new URL(window.location.href);
  const initial = (url.searchParams.get('tab') as string) || 'news';
  const [tab, setTab] = useState<string>(initial);

  // Filter tabs based on user's selected content types
  const availableTabs = useMemo(() => {
    if (!user?.preferences?.selectedContentTypes) {
      // If no preferences, show all tabs
      return ALL_TABS;
    }

    const selectedTabIds = user.preferences.selectedContentTypes
      .map(contentType => CONTENT_TYPE_MAPPING[contentType as keyof typeof CONTENT_TYPE_MAPPING])
      .filter(Boolean);

    return ALL_TABS.filter(tab => selectedTabIds.includes(tab.id));
  }, [user?.preferences?.selectedContentTypes]);

  // Ensure current tab is available in filtered tabs
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some(t => t.id === tab)) {
      // If current tab is not available, switch to the first available tab
      setTab(availableTabs[0].id);
    }
  }, [availableTabs, tab]);

  useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.set('tab', tab);
    window.history.replaceState(null, '', u.toString());
  }, [tab]);

  const panel = useMemo(() => {
    switch (tab) {
      case 'news':   return <MarketNewsPanel />;
      case 'prices': return <CoinPricesPanel />;
      case 'ai':     return <AiInsightPanel autoFetch={true} />;
      case 'meme':   return <MemePanel />;
      default:       return null;
    }
  }, [tab]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <div className="sticky top-16 z-10 mb-4 bg-transparent pt-2">
        <IconTabs tabs={availableTabs as any} value={tab} onChange={setTab} />
      </div>

      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur
                       dark:border-slate-800 dark:bg-slate-900/70"
          >
            {panel}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
