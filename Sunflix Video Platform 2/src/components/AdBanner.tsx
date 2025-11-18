import React, { useEffect } from 'react';
import { getAllAds, updateAd } from '../lib/mongodb-storage';
import { motion } from 'framer-motion';

interface AdBannerProps {
  position: 'banner' | 'sidebar' | 'between-rows';
  className?: string;
}

export function AdBanner({ position, className = '' }: AdBannerProps) {
  const [ad, setAd] = React.useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ads = await getAllAds();
      const available = (ads || []).filter((a: any) => a.active && a.position === position);
      if (!mounted) return;
      if (available.length === 0) {
        setAd(null);
        return;
      }
      const picked = available[Math.floor(Math.random() * available.length)];
      setAd(picked);
      // increment impression count (best-effort)
      try {
        const adId = picked.id || picked._id;
        await updateAd(adId, { impressions: (picked.impressions || 0) + 1 });
      } catch (e) {
        // ignore
        // eslint-disable-next-line no-console
        console.error('Failed to track ad impression', e);
      }
    })();
    return () => { mounted = false; };
  }, [position]);

  const handleClick = async () => {
    if (ad) {
      try {
        const adId = ad.id || ad._id;
        await updateAd(adId, { clicks: (ad.clicks || 0) + 1 });
      } catch (e) {
        // ignore
        // eslint-disable-next-line no-console
        console.error('Failed to track ad click', e);
      }
      if (ad.clickUrl) window.open(ad.clickUrl, '_blank');
    }
  };
  // If no ad available for this position, render nothing (avoids runtime errors)
  if (!ad) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white z-10">
        Sponsored
      </div>
      <img
        src={ad.imageUrl || ''}
        alt={ad.title || 'Sponsored'}
        className="w-full h-auto rounded-lg border border-white/10 group-hover:border-[#FFB800]/50 transition-all"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
    </motion.div>
  );
}
