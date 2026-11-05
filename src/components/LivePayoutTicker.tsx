import React, { useEffect, useState } from 'react';
import { ShieldAlert, Zap } from 'lucide-react';

interface TickerItem {
  id: string;
  user: string;
  city: string;
  amount: string;
  method: string;
}

const INITIAL_ITEMS: TickerItem[] = [
  { id: '1', user: 'Chad W.', city: 'Miami, FL', amount: '$42,069.00', method: 'Instant Doge' },
  { id: '2', user: 'Karen B.', city: 'Austin, TX', amount: '$150,000.00', method: 'Meme Wire' },
  { id: '3', user: 'CryptoBro99', city: 'London, UK', amount: '$789,120.50', method: 'Quantum Bot' },
  { id: '4', user: 'Elena R.', city: 'Berlin, DE', amount: '$34,500.00', method: 'Dropship Vault' },
  { id: '5', user: 'Grandma Betty', city: 'Cleveland, OH', amount: '$999,999.00', method: 'Monopoly Transfer' },
  { id: '6', user: 'Satoshi N.', city: 'Cyber Tokyo', amount: '$21,000,000.00', method: 'Laser Eyes Payout' },
];

export const LivePayoutTicker: React.FC = () => {
  const [items, setItems] = useState<TickerItem[]>(INITIAL_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Brad M.', 'Tiffany S.', 'GigaChad42', 'LunaMooner', 'Auntie Sarah', 'PixelWhale', 'DogeMaster'];
      const cities = ['Toronto, CA', 'Sydney, AU', 'Dubai, UAE', 'Paris, FR', 'Singapore', 'Seoul, KR', 'Chicago, IL'];
      const methods = ['Instant Cloud Bot', 'Simulated Wire', 'Venture Myth Payout', 'Laser Cash', 'NFT Ghost Transfer'];
      const randomAmount = (Math.random() * 850000 + 5000).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      const newItem: TickerItem = {
        id: Date.now().toString(),
        user: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        amount: randomAmount,
        method: methods[Math.floor(Math.random() * methods.length)],
      };

      setItems((prev) => [newItem, ...prev.slice(0, 9)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs">
      {/* Awareness Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-center text-amber-300 font-medium flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          Educational Satire Simulator · All cash &amp; earnings are 100% virtual play figures. Never send money or private data to get-rich-quick sites!
        </span>
      </div>

      {/* Live Payout Marquee */}
      <div className="py-2 px-4 flex items-center overflow-hidden">
        <div className="flex items-center gap-2 text-amber-400 font-bold whitespace-nowrap shrink-0 pr-4 border-r border-slate-800">
          <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>SIMULATED PAYOUT FEED:</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-hidden whitespace-nowrap ml-4 text-slate-300">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 transition-all">
              <span className="font-semibold text-white">{item.user}</span>
              <span className="text-slate-500">({item.city})</span>
              <span className="text-emerald-400 font-mono font-bold">{item.amount}</span>
              <span className="text-slate-500 text-[11px]">via {item.method}</span>
              <span className="text-slate-700" aria-hidden="true">·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
