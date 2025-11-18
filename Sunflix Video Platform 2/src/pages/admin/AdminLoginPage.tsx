import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await adminLogin(email, password);
    if (success) {
      toast.success('Admin login successful!');
      navigate('/admin');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7E00]/20 via-[#0E0E10] to-[#6C00FF]/20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1A1A1D] rounded-lg shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent mb-2">
                Admin Panel Login
              </h1>
              <p className="text-[#A0A0A0]">Enter your admin credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-white">Admin Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@sunflix.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#0E0E10] border-white/10 focus:border-[#FF7E00]"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-password" className="text-white">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#0E0E10] border-white/10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
              >
                Login to Admin Panel
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-[#A0A0A0] hover:text-white"
              >
                Back to Homepage
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}