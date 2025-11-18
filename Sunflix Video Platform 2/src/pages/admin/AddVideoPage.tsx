import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// Video type imported from types, API calls replace storage.ts functions
import type { Video } from '../../types';
import { getVideoThumbnail, convertToEmbedUrl, detectVideoPlatform, getVideoPlatformName } from '../../lib/video-utils';
import { toast } from 'sonner';
import apiClient from '../../lib/api-client';

export function AddVideoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
    category: 'Entertainment',
    status: 'published' as 'draft' | 'published',
    featured: false,
    trending: false,
    viral: false,
    sponsored: false,
  });

  const categories = ['Entertainment', 'Music', 'Gaming', 'Tech', 'Comedy', 'Education'];
  
  // Load video for editing
  useEffect(() => {
    if (isEditing && id) {
      // Fetch video from API
      apiClient
        .get(`/api/videos/${id}`)
        .then(res => res.data)
        .then(video => {
          setFormData({
            title: video.title || '',
            url: video.url || '',
            description: video.description || '',
            tags: Array.isArray(video.tags) ? video.tags.join(', ') : '',
            category: video.category || 'Entertainment',
            status: video.status || 'published',
            featured: video.featured || false,
            trending: video.trending || false,
            viral: video.viral || false,
            sponsored: video.sponsored || false,
          });
        })
        .catch(error => {
          console.error('Error fetching video:', error);
          toast.error('Failed to load video');
        });
    }
  }, [isEditing, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate thumbnail from URL (supports multiple platforms)
    const thumbnail = getVideoThumbnail(formData.url, 'hq');
    
    // Auto-convert URL to embed format with ad-blocking
    const embedUrl = convertToEmbedUrl(formData.url, true);
    
    if (isEditing) {
      // Update existing video via API
      const videoData = {
        title: formData.title,
        url: embedUrl,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        thumbnail: thumbnail,
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        trending: formData.trending,
        viral: formData.viral,
        sponsored: formData.sponsored,
      };
      
      try {
        const response = await apiClient.put(`/api/videos/${id}`, videoData);
        if (!response || response.status >= 400) throw new Error('Failed to update video');
        
        toast.success('Video updated successfully!');
        navigate('/admin/videos');
      } catch (error) {
        console.error('Error updating video:', error);
        toast.error('Failed to update video');
      }
    } else {
      // Add new video via API
      const newVideo = {
        title: formData.title,
        url: embedUrl,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        thumbnail: thumbnail,
        views: 0,
        likes: 0,
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        trending: formData.trending,
        viral: formData.viral,
        sponsored: formData.sponsored,
      };
      
      try {
        const response = await apiClient.post('/api/videos', newVideo);
        if (!response || response.status >= 400) throw new Error('Failed to add video');
        
        toast.success('Video added successfully!');
        navigate('/admin/videos');
      } catch (error) {
        console.error('Error adding video:', error);
        toast.error('Failed to add video');
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get preview embed URL
  const previewEmbedUrl = formData.url ? convertToEmbedUrl(formData.url) : '';
  const previewThumbnail = formData.url ? getVideoThumbnail(formData.url, 'hq') : '';

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-8">{isEditing ? 'Edit Video' : 'Add New Video'}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Video Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-foreground">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="mt-1 bg-background border-border"
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="url" className="text-foreground">Video URL *</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="mt-1 bg-background border-border"
                    placeholder="https://www.youtube.com/watch?v=... or Vimeo, Dailymotion, etc."
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports YouTube, Vimeo, Dailymotion, and more (auto-converted with ad-blocking)
                  </p>
                  {previewThumbnail && (
                    <div className="mt-2 text-xs text-green-500">
                      ✓ Valid video URL detected - Thumbnail will be auto-generated
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="mt-1 bg-background border-border min-h-[100px]"
                    placeholder="Enter video description"
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-foreground">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    className="mt-1 bg-background border-border"
                    placeholder="tech, review, gadgets (comma-separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-foreground">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-foreground">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => handleChange('status', value)}
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="text-foreground">Featured Video</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleChange('featured', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="trending" className="text-foreground">Mark as Trending</Label>
                    <Switch
                      id="trending"
                      checked={formData.trending}
                      onCheckedChange={(checked) => handleChange('trending', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="viral" className="text-foreground">Mark as Viral</Label>
                    <Switch
                      id="viral"
                      checked={formData.viral}
                      onCheckedChange={(checked) => handleChange('viral', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sponsored" className="text-foreground">Sponsored Video</Label>
                    <Switch
                      id="sponsored"
                      checked={formData.sponsored}
                      onCheckedChange={(checked) => handleChange('sponsored', checked)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Video' : 'Add Video'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-8">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewEmbedUrl && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={previewEmbedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="Preview"
                  />
                </div>
              )}
              {previewThumbnail && (
                <div className="mb-4">
                  <Label className="text-foreground text-sm mb-2 block">Auto-Generated Thumbnail:</Label>
                  <img 
                    src={previewThumbnail} 
                    alt="Thumbnail preview" 
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {formData.title && (
                <h3 className="text-foreground mb-2">{formData.title}</h3>
              )}
              {formData.description && (
                <p className="text-muted-foreground text-sm">{formData.description}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}