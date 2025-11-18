import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import apiClient from '../../lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  approved: boolean;
  favorites: string[];
  subscriptions: string[];
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    apiClient
      .get('/api/users')
      .then(res => res.data)
      .then(users => {
        setUsers(users);
        setPendingCount(users.filter((u: User) => !u.approved && u.role === 'user').length);
      })
      .catch(error => {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      });
  };

  const toggleApproval = (userId: string) => {
    const isApproving = !users.find(u => u.id === userId || u._id === userId)?.approved;
    
    apiClient
      .post(`/api/users/${userId}/approve`)
      .then(() => {
        toast.success(isApproving ? 'User approved!' : 'User approval revoked');
        loadUsers();
      })
      .catch(error => {
        console.error('Error toggling approval:', error);
        toast.error('Failed to update user');
      });
  };

  return (
    <div>
      <h1 className="text-3xl text-white mb-8">User Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1A1A1D] border-white/10">
          <CardHeader>
            <CardTitle className="text-sm text-[#A0A0A0]">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{users.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-white/10">
          <CardHeader>
            <CardTitle className="text-sm text-[#A0A0A0]">Approved Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-[#00E676]">
              {users.filter(u => u.approved).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1D] border-white/10">
          <CardHeader>
            <CardTitle className="text-sm text-[#A0A0A0]">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-[#FFC400]">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="bg-[#1A1A1D] rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-[#0E0E10]">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id || user.id} className="border-white/10 hover:bg-[#0E0E10]">
                <TableCell className="text-white">{user.name}</TableCell>
                <TableCell className="text-[#A0A0A0]">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.role === 'admin'
                        ? 'border-[#6C00FF] text-[#6C00FF]'
                        : 'border-[#FFB800] text-[#FFB800]'
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.approved ? (
                    <Badge className="bg-[#00E676] hover:bg-[#00E676]">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-[#FFC400] hover:bg-[#FFC400]">
                      <XCircle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {user.role !== 'admin' && (
                    <Button
                      variant={user.approved ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleApproval(user._id || user.id)}
                      className={
                        !user.approved
                          ? 'bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]'
                          : ''
                      }
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      {user.approved ? 'Revoke' : 'Approve'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="text-center text-[#A0A0A0] py-12">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}