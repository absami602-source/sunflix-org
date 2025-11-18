import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
// Video type and API calls replace storage.ts functions
import type { Video } from '../../types';
import { toast } from 'sonner';
import apiClient from '../../lib/api-client';

export function ManageVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    apiClient
      .get('/api/videos')
      .then(res => res.data)
      .then((videos: any[]) => {
        // Normalize MongoDB _id to id for frontend consistency
        const normalized = (videos || []).map(v => ({ ...v, id: v._id || v.id }));
        setVideos(normalized as Video[]);
      })
      .catch(error => {
        console.error('Error loading videos:', error);
        toast.error('Failed to load videos');
      });
  };

  const handleDelete = (id: string) => {
    apiClient
      .delete(`/api/videos/${id}`)
      .then(() => {
        setVideos(videos.filter(v => v._id !== id && v.id !== id));
        toast.success('Video deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video');
      });
  };

  const handleEdit = (video: Video) => {
    navigate(`/admin/edit-video/${video._id || video.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-white">Manage Videos</h1>
        <Button
          onClick={() => navigate('/admin/add-video')}
          className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
        >
          Add New Video
        </Button>
      </div>

      <div className="bg-[#1A1A1D] rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-[#0E0E10]">
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Views</TableHead>
              <TableHead className="text-white">Likes</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video._id || video.id} className="border-white/10 hover:bg-[#0E0E10]">
                <TableCell className="text-white max-w-xs truncate">
                  {video.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-[#FF7E00] text-[#FF7E00]">
                    {video.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#A0A0A0]">
                  {(video.views ?? 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-[#A0A0A0]">
                  {(video.likes ?? 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={video.status === 'published' ? 'default' : 'secondary'}
                    className={
                      video.status === 'published'
                        ? 'bg-[#FFB800] hover:bg-[#FFB800]'
                        : 'bg-[#FF7E00] hover:bg-[#FF7E00]'
                    }
                  >
                    {video.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/video/${video._id || video.id}`)}
                    className="hover:bg-[#0E0E10] hover:text-[#FFB800]"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(video)}
                    className="hover:bg-[#0E0E10] hover:text-[#FFB800]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#FF1744]/20 hover:text-[#FF1744]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1A1A1D] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Video</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#A0A0A0]">
                          Are you sure you want to delete this video? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#0E0E10] border-white/10">
                          Cancel
                        </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(video._id || video.id)}
                                className="bg-[#FF1744] hover:bg-[#FF1744]/90"
                              >
                                Delete
                              </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {videos.length === 0 && (
          <div className="text-center text-[#A0A0A0] py-12">
            No videos found. Add your first video to get started!
          </div>
        )}
      </div>
    </div>
  );
}
