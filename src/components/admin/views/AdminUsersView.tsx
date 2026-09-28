import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  MoreVertical,
  CheckCircle2,
  HardDrive,
  KeyRound,
  Eye,
  Lock,
  UserCheck,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { PlatformUser, UserRole, UserStatus } from '../../../types';

interface AdminUsersViewProps {
  users: PlatformUser[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
  onResetAccess: (user: PlatformUser) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  onUpdateUserRole,
  onToggleUserStatus,
  onResetAccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [selectedUserForModal, setSelectedUserForModal] = useState<PlatformUser | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Privacy Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>User Management & RBAC</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage authenticated accounts, assign administrative roles, monitor storage consumption, and audit status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            {users.length} Registered Accounts
          </span>
        </div>
      </div>

      {/* Privacy Architecture Notice */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3 shadow-2xs">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Zero-Knowledge Tenant Privacy Architecture:</strong>
          <span className="ml-1 text-slate-700">
            Administrators manage accounts, storage quotas, and security roles. Private document contents remain client-scoped and end-to-end encrypted.
          </span>
        </div>
      </div>

      {feedbackNotice && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search user by name or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="support">Support</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-blue-50/50 text-slate-600 font-semibold border-b border-blue-100">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Storage Quota</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{user.name}</span>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => {
                          const newRole = e.target.value as UserRole;
                          onUpdateUserRole(user.id, newRole);
                          showToast(`Updated role for ${user.name} to ${newRole.toUpperCase()}`);
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold border cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : user.role === 'support'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                        <option value="support">SUPPORT</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          onToggleUserStatus(user.id);
                          showToast(`Toggled status for ${user.name}`);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          user.status === 'active'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {user.status.toUpperCase()}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-mono text-slate-800 font-semibold">
                          {(user.storageUsedMb || 0).toFixed(1)} MB
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          of {(user.storageQuotaMb / 1024).toFixed(0)} GB
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {user.documentsCount || 0}
                    </td>

                    <td className="py-3 px-4 text-slate-500">{user.lastActive}</td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUserForModal(user)}
                          title="View user details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            onResetAccess(user);
                            showToast(`Administrative reset link dispatched to ${user.email}`);
                          }}
                          title="Reset access / Send password reset"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal in White & Blue */}
      {selectedUserForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-blue-100 rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in">
            <div className="flex items-start justify-between pb-4 border-b border-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                  {selectedUserForModal.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedUserForModal.name}</h3>
                  <p className="text-xs text-slate-500">{selectedUserForModal.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">User ID</span>
                  <span className="font-mono font-bold text-slate-900">{selectedUserForModal.id}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Current Role</span>
                  <span className="font-bold text-blue-700 uppercase font-mono">{selectedUserForModal.role}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedUserForModal.status}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block">Joined</span>
                  <span className="text-slate-900 font-medium">{selectedUserForModal.joinedDate}</span>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-slate-700">
                <div className="flex justify-between mb-1">
                  <span>Storage Utilization</span>
                  <span className="font-mono font-bold text-slate-900">
                    {(selectedUserForModal.storageUsedMb || 0).toFixed(1)} MB / {(selectedUserForModal.storageQuotaMb / 1024).toFixed(0)} GB
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(100, ((selectedUserForModal.storageUsedMb || 0) / selectedUserForModal.storageQuotaMb) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUserForModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
