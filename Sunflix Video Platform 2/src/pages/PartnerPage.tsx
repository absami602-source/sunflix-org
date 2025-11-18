import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Video, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import apiClient from '../lib/api-client';

export function PartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    message: ''
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Send partnership request to API
    try {
      apiClient.post('/api/messages', {
        name: formData.name,
        email: formData.email,
        message: `Partnership Request\n\nCompany: ${formData.company}\nWebsite: ${formData.website}\n\n${formData.message}`
      }).then(() => {
        toast.success('Partnership request sent! We\'ll be in touch soon.');
        setFormData({ name: '', email: '', company: '', website: '', message: '' });
      }).catch(err => {
        console.error('Partner request failed:', err);
        toast.error('Failed to send request');
      });
    } catch (error) {
      console.error('Partner request exception:', error);
      toast.error('Failed to send request');
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Revenue Sharing',
      description: 'Earn competitive revenue from ads and sponsorships on your content'
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Access detailed analytics to track your content performance'
    },
    {
      icon: Users,
      title: 'Large Audience',
      description: 'Reach millions of engaged viewers on the SUNFLIX platform'
    },
    {
      icon: Video,
      title: 'Creator Tools',
      description: 'Access professional tools to create and manage your content'
    }
  ];

  const features = [
    'Dedicated account manager',
    'Priority content promotion',
    'Custom branding opportunities',
    'Early access to new features',
    'Monthly revenue reports',
    'Sponsored content options'
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0E0E10]">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent">
            Partner with SUNFLIX
          </h1>
          <p className="text-xl text-[#A0A0A0] max-w-3xl mx-auto mb-8">
            Join our partner program and monetize your content with one of the fastest-growing video platforms.
            Reach millions of viewers and earn revenue from your creativity.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-[#1A1A1D] border-white/10 hover:border-[#FFB800]/50 transition-all">
              <CardContent className="pt-6">
                <div className="p-3 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-lg w-fit mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl text-white mb-2">{benefit.title}</h3>
                <p className="text-[#A0A0A0]">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#1A1A1D] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">What You Get</CardTitle>
                <CardDescription className="text-[#A0A0A0]">
                  As a SUNFLIX partner, you'll receive exclusive benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 text-white"
                    >
                      <CheckCircle className="w-5 h-5 text-[#FFB800] flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gradient-to-r from-[#FF7E00]/10 to-[#6C00FF]/10 rounded-lg border border-white/10">
                  <h4 className="text-white mb-2">Monetization Options</h4>
                  <p className="text-[#A0A0A0] text-sm mb-4">
                    We offer multiple ways to earn revenue from your content:
                  </p>
                  <ul className="text-sm text-[#A0A0A0] space-y-2">
                    <li>• Pre-roll video ads</li>
                    <li>• Banner advertisements</li>
                    <li>• Sponsored content partnerships</li>
                    <li>• Revenue share from premium subscriptions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#1A1A1D] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Apply Now</CardTitle>
                <CardDescription className="text-[#A0A0A0]">
                  Fill out the form below and we'll get back to you within 48 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 bg-[#0E0E10] border-white/10"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 bg-[#0E0E10] border-white/10"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-white">Company / Channel Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="mt-1 bg-[#0E0E10] border-white/10"
                      placeholder="Your Company or Channel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-white">Website / Social Media</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="mt-1 bg-[#0E0E10] border-white/10"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white">Tell us about yourself *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="mt-1 bg-[#0E0E10] border-white/10 min-h-[120px]"
                      placeholder="Tell us about your content, audience, and why you want to partner with SUNFLIX..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90 group"
                  >
                    Submit Application
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Active Viewers', value: '10M+' },
            { label: 'Partner Creators', value: '50K+' },
            { label: 'Revenue Paid', value: '$5M+' }
          ].map((stat, index) => (
            <Card key={index} className="bg-gradient-to-r from-[#1A1A1D] to-[#0E0E10] border-white/10 text-center">
              <CardContent className="pt-6">
                <div className="text-4xl bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-[#A0A0A0]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}