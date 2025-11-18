import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, MousePointer, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { getAllAds, createAd, updateAd, deleteAd } from '../../lib/mongodb-storage';
import type { Ad } from '../../lib/mongodb-storage';
import { toast } from 'sonner';

export function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    clickUrl: '',
    position: 'banner' as 'banner' | 'sidebar' | 'between-rows' | 'pre-roll',
    active: true
  });

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    const all = await getAllAds();
    // Normalize Mongo _id to id for frontend convenience
    const normalized = (all || []).map((a: any) => ({ ...a, id: a._id || a.id }));
    setAds(normalized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Ad title is required');
      return;
    }
    if (!formData.imageUrl.trim()) {
      toast.error('Ad image URL or upload is required');
      return;
    }
    if (!formData.clickUrl.trim()) {
      toast.error('Click URL is required');
      return;
    }

    if (editingAd) {
      const adId = editingAd.id || editingAd._id;
      const updated = await updateAd(adId, { ...editingAd, ...formData });
      if (updated) toast.success('Ad updated successfully!');
      else toast.error('Failed to update ad');
    } else {
      const newAd: Partial<Ad> = {
        ...formData,
        impressions: 0,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      const created = await createAd(newAd);
      if (created) toast.success('Ad created successfully!');
      else toast.error('Failed to create ad');
    }

    await loadAds();
    resetForm();
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      imageUrl: ad.imageUrl,
      clickUrl: ad.clickUrl,
      position: ad.position,
      active: ad.active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      const ok = await deleteAd(id);
      if (ok) {
        await loadAds();
        toast.success('Ad deleted successfully!');
      } else {
        toast.error('Failed to delete ad');
      }
    }
  };

  const toggleActive = async (id: string) => {
    const current = ads.find(a => (a.id || a._id) === id);
    if (!current) return;
    const updated = await updateAd(id, { active: !current.active });
    if (updated) {
      await loadAds();
      toast.success(`Ad ${!current.active ? 'activated' : 'deactivated'}`);
    } else {
      toast.error('Failed to update ad status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      clickUrl: '',
      position: 'banner',
      active: true
    });
    setEditingAd(null);
    setIsModalOpen(false);
    setUploadedImage('');
  };

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1D] border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A0A0A0]">Total Ads</p>
                <p className="text-2xl text-white">{ads.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A0A0A0]">Active Ads</p>
                <p className="text-2xl text-white">{ads.filter(a => a.active).length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#FFB800] to-[#FF7E00] rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A0A0A0]">Impressions</p>
                <p className="text-2xl text-white">{totalImpressions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#FF007A] to-[#FF4500] rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A0A0A0]">CTR</p>
                <p className="text-2xl text-white">{ctr}%</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-white">Ad Management</h1>
          <p className="text-[#A0A0A0]">Manage advertisements and track performance</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {/* Ads Table */}
      <Card className="bg-[#1A1A1D] border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Position</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Impressions</TableHead>
                <TableHead className="text-white">Clicks</TableHead>
                <TableHead className="text-white">CTR</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => {
                const adCtr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0';
                const adId = ad.id || ad._id;
                return (
                  <TableRow key={adId} className="border-white/10">
                    <TableCell className="text-white">{ad.title}</TableCell>
                    <TableCell className="text-[#A0A0A0] capitalize">{ad.position}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${ad.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">{ad.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-white">{ad.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-white">{adCtr}%</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleActive(adId)}
                          className="hover:bg-white/10"
                        >
                          {ad.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(ad)}
                          className="hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(adId)}
                          className="hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {ads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#A0A0A0]">No ads yet. Create your first ad to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1A1A1D] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingAd ? 'Edit Ad' : 'Create New Ad'}
            </DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              {editingAd ? 'Update ad details' : 'Fill in the details to create a new advertisement'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">Ad Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="Summer Sale 2025"
                required
              />
            </div>

            <div>
              <Label className="text-white">Ad Image</Label>
              <div className="mt-2 space-y-3">
                {/* Image Upload Option */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-[#6C00FF]/50 hover:bg-[#6C00FF]/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image (Auto-Resize & Crop)
                  </Button>
                </div>
                
                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-[#A0A0A0]">OR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                
                {/* Image URL Option */}
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="bg-[#0E0E10] border-white/10"
                  placeholder="Enter image URL (https://...)"
                />
                
                {/* Preview */}
                {(uploadedImage || formData.imageUrl) && (
                  <div className="relative mt-3 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={uploadedImage || formData.imageUrl}
                      alt="Ad preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage('');
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="clickUrl" className="text-white">Click URL</Label>
              <Input
                id="clickUrl"
                value={formData.clickUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, clickUrl: e.target.value }))}
                className="mt-1 bg-[#0E0E10] border-white/10"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <Label htmlFor="position" className="text-white">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="mt-1 bg-[#0E0E10] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1D] border-white/10">
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="between-rows">Between Rows</SelectItem>
                  <SelectItem value="pre-roll">Pre-roll Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
              >
                {editingAd ? 'Update' : 'Create'} Ad
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}