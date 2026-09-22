'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  yearsExp: number | null;
  primaryStack: string | null;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER');
  const [newStack, setNewStack] = useState('');
  const [newExp, setNewExp] = useState(3);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Kullanıcılar alınamadı');
      }
      setUsers(data.data.users || []);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user: SafeUser) => {
    if (user.email === 'abdulatif.mirzaev2004@gmail.com') return; // Owner locked
    const nextRole = user.role === 'USER' ? 'ADMIN' : 'USER';
    setActionLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      await fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Rol güncellenemedi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusToggle = async (user: SafeUser) => {
    if (user.email === 'abdulatif.mirzaev2004@gmail.com') return;
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      await fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Durum güncellenemedi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (user: SafeUser) => {
    if (user.email === 'abdulatif.mirzaev2004@gmail.com') {
      alert('Ana süper yönetici hesabı silinemez.');
      return;
    }

    if (
      !confirm(`"${user.email}" kullanıcısını ve tüm verilerini silmek istediğinize emin misiniz?`)
    ) {
      return;
    }

    setActionLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      await fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Kullanıcı silinemedi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          name: newName,
          role: newRole,
          yearsExp: newExp,
          primaryStack: newStack,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setShowAddModal(false);
      setNewEmail('');
      setNewName('');
      setNewPassword('');
      await fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Kullanıcı oluşturulamadı');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.primaryStack && u.primaryStack.toLowerCase().includes(search.toLowerCase()));

    const matchRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'ADMIN' && (u.role === 'ADMIN' || u.role === 'SUPERADMIN')) ||
      (roleFilter === 'USER' && u.role === 'USER');

    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Kullanıcı & Hesap Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Kayıtlı hesapları görüntüleyin, rolleri düzenleyin ve hesap erişimlerini denetleyin
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yeni Kullanıcı Ekle</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="E-posta, isim veya teknoloji yığını ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 hidden sm:inline">Filtre:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Tüm Roller ({users.length})</option>
            <option value="ADMIN">Yöneticiler</option>
            <option value="USER">Standart Kullanıcılar</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Kullanıcı / E-posta</th>
                <th className="px-4 py-3.5">Rol</th>
                <th className="px-4 py-3.5">Durum</th>
                <th className="px-4 py-3.5">Deneyim & Stack</th>
                <th className="px-4 py-3.5">Kayıt Tarihi</th>
                <th className="px-5 py-3.5 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Kullanıcı veritabanı taranıyor...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Arama kriterlerine uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isOwner = u.email === 'abdulatif.mirzaev2004@gmail.com';
                  const isActing = actionLoading === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                            {u.name ? u.name.slice(0, 2) : u.email.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-white flex items-center gap-1.5">
                              <span>{u.name || 'İsimsiz Kullanıcı'}</span>
                              {isOwner && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-medium">
                                  Sahip
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[11px]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge & Button */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                              u.role === 'SUPERADMIN'
                                ? 'bg-purple-950 text-purple-300 border-purple-800/60'
                                : u.role === 'ADMIN'
                                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800/60'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {u.role === 'SUPERADMIN' ? (
                              <ShieldCheck className="w-3 h-3 text-purple-400" />
                            ) : (
                              <Shield className="w-3 h-3 text-cyan-400" />
                            )}
                            {u.role}
                          </span>

                          {!isOwner && (
                            <button
                              onClick={() => handleRoleToggle(u)}
                              disabled={isActing}
                              className="text-[10px] text-cyan-400 hover:underline disabled:opacity-50"
                              title="Rolü Değiştir"
                            >
                              Değiştir
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleStatusToggle(u)}
                          disabled={isOwner || isActing}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/50'
                              : 'bg-red-950/60 text-red-300 border border-red-800/40 hover:bg-red-900/50'
                          } ${isOwner ? 'cursor-default' : 'cursor-pointer'}`}
                          title={isOwner ? 'Korumalı Hesap' : 'Tıklayarak durumu değiştirin'}
                        >
                          {u.status === 'ACTIVE' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span>{u.status === 'ACTIVE' ? 'Aktif' : 'Askıda'}</span>
                        </button>
                      </td>

                      {/* Stack & Exp */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <p className="text-white text-xs">{u.yearsExp ?? 0} Yıl Deneyim</p>
                          <p className="text-slate-500 text-[11px] max-w-xs truncate">
                            {u.primaryStack || 'Belirtilmedi'}
                          </p>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {isOwner ? (
                          <span className="text-[11px] text-slate-500 italic">Dokunulamaz</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isActing}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 border border-transparent hover:border-red-900/50 transition-colors disabled:opacity-50"
                            title="Kullanıcıyı Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">Yeni Kullanıcı Oluştur</h2>
            <p className="text-xs text-slate-400 mb-4">
              Veritabanına manuel kullanıcı veya yeni bir yönetici ekleyin
            </p>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="ornek@careerclarity.dev"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Başlangıç Şifresi *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Hesap Rolü</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'USER' | 'ADMIN')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="USER">Standart Kullanıcı</option>
                    <option value="ADMIN">Yönetici (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Deneyim (Yıl)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={newExp}
                    onChange={(e) => setNewExp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Teknoloji Yığını</label>
                <input
                  type="text"
                  value={newStack}
                  onChange={(e) => setNewStack(e.target.value)}
                  placeholder="React, TypeScript, Node.js, AWS"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
                >
                  Kullanıcıyı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
