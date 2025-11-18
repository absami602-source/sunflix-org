import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Lock, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#0E0E10] to-[#1A1A1D] border-t border-white/10 mt-20 relative overflow-hidden z-0">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur-3xl opacity-5" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-l from-[#FFB800] to-[#FF7E00] rounded-full blur-3xl opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] blur-lg opacity-50" />
                <Sparkles className="w-10 h-10 text-[#FFB800] relative z-10" />
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-[#FF7E00] via-[#C85FFF] to-[#6C00FF] bg-clip-text text-transparent">
                SUNFLIX
              </div>
            </motion.div>
            <p className="text-[#A0A0A0] mb-6 max-w-md">
              Watch. Shine. Repeat. — Your ultimate destination for entertainment that brightens your day.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#', color: 'from-[#1877F2] to-[#0D5DBF]' },
                { icon: Twitter, href: '#', color: 'from-[#1DA1F2] to-[#0C85D0]' },
                { icon: Instagram, href: '#', color: 'from-[#E4405F] to-[#C13584]' },
                { icon: Youtube, href: '#', color: 'from-[#FF0000] to-[#CC0000]' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-[#1A1A1D] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <social.icon className="w-5 h-5 text-[#A0A0A0] group-hover:text-white transition-colors relative z-10" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FF7E00] to-[#6C00FF] rounded-full" />
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore' },
                { to: '/categories', label: 'Categories' },
                { to: '/about', label: 'About' },
                { to: '/help', label: 'Help Center' },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="text-[#A0A0A0] hover:text-[#FFB800] transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] transition-all mr-0 group-hover:mr-2 rounded-full" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Admin & Legal */}
          <div>
            <h3 className="text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FF7E00] to-[#6C00FF] rounded-full" />
              More
            </h3>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/partner"
                  className="text-[#A0A0A0] hover:text-[#FFB800] transition-colors inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] transition-all mr-0 group-hover:mr-2 rounded-full" />
                  Partner with SUNFLIX
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  to="/admin-login"
                  className="text-[#A0A0A0] hover:text-[#FFB800] transition-colors inline-flex items-center group"
                >
                  <Lock className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Admin Login
                </Link>
              </motion.li>
              {[
                { label: 'Privacy Policy' },
                { label: 'Terms of Service' },
                { label: 'Contact Us' },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 2) * 0.05 }}
                >
                  <a
                    href="#"
                    className="text-[#A0A0A0] hover:text-[#FFB800] transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] transition-all mr-0 group-hover:mr-2 rounded-full" />
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#A0A0A0] text-sm text-center md:text-left"
            >
              © {currentYear} SUNFLIX. All rights reserved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm text-[#A0A0A0]"
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-[#FF7E00] fill-[#FF7E00]" />
              <span>by SUNFLIX Team</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7E00]/10 to-[#6C00FF]/10 border border-white/10"
            >
              <p className="text-xs bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent">
                Powered by SUNFLIX
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
