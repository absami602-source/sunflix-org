import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  videoCount: number;
  isActive?: boolean;
  onClick: () => void;
}

export function CategoryCard({ name, icon: Icon, color, videoCount, isActive, onClick }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-[#FF7E00] to-[#6C00FF] border-[#FFB800] shadow-2xl shadow-[#FF7E00]/50' 
            : 'bg-card hover:bg-card/80 border-border hover:border-[#FF7E00]/50'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div 
              className={`p-3 rounded-xl ${
                isActive 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : `bg-gradient-to-br ${color} backdrop-blur-sm`
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white'}`} />
            </div>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 bg-white rounded-full"
              />
            )}
          </div>
          <h3 className={`text-xl mb-1 ${isActive ? 'text-white' : 'text-foreground'}`}>
            {name}
          </h3>
          <p className={`text-sm ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
            {videoCount} {videoCount === 1 ? 'video' : 'videos'}
          </p>
        </div>
        {!isActive && (
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 hover:opacity-10 transition-opacity duration-300`} 
          />
        )}
      </Card>
    </motion.div>
  );
}
