import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getSettings, updateSettings, Settings } from '../../lib/mongodb-storage';
import { toast } from 'sonner';

export function SettingsPage() {
  const [formData, setFormData] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    logo: '',
    favicon: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    }
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const settings = await getSettings();
      if (mounted && settings) setFormData(settings);
    })();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateSettings(formData);
    if (updated) {
      toast.success('Settings saved successfully!');
    } else {
      toast.error('Failed to save settings');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };

  return (
    <div>
      <h1 className="text-3xl text-white mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <Card className="bg-[#1A1A1D] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-white">Site Name</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="SUNFLIX"
              />
            </div>

            <div>
              <Label htmlFor="siteDescription" className="text-white">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="All the fun, all the spice — one place to watch it all."
              />
            </div>

            <div>
              <Label htmlFor="logo" className="text-white">Logo URL</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <Label htmlFor="favicon" className="text-white">Favicon URL</Label>
              <Input
                id="favicon"
                value={formData.favicon}
                onChange={(e) => handleChange('favicon', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card className="bg-[#1A1A1D] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook" className="text-white">Facebook</Label>
              <Input
                id="facebook"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://facebook.com/sunflix"
              />
            </div>

            <div>
              <Label htmlFor="twitter" className="text-white">Twitter</Label>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://twitter.com/sunflix"
              />
            </div>

            <div>
              <Label htmlFor="instagram" className="text-white">Instagram</Label>
              <Input
                id="instagram"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://instagram.com/sunflix"
              />
            </div>

            <div>
              <Label htmlFor="youtube" className="text-white">YouTube</Label>
              <Input
                id="youtube"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://youtube.com/@sunflix"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </form>
    </div>
  );
}