'use client';

import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Tag,
  Briefcase,
  Layers,
} from 'lucide-react';
import { InterviewQuestionDto } from '@career-clarity/shared-types';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New question form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newCategory, setNewCategory] = useState('System Design');
  const [newRole, setNewRole] = useState('');
  const [newLevel, setNewLevel] = useState(3);

  const fetchQuestions = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/questions');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Sorular alınamadı');
      }
      setQuestions(data.data.questions || []);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu soruyu soru bankasından kaldırmak istediğinize emin misiniz?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      await fetchQuestions();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Soru silinemedi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestionText,
          answer: newAnswer,
          hint: newHint,
          category: newCategory,
          role: newRole || null,
          levelOrder: newLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setShowAddModal(false);
      setNewQuestionText('');
      setNewAnswer('');
      setNewHint('');
      await fetchQuestions();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Soru eklenemedi');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      (q.category && q.category.toLowerCase().includes(search.toLowerCase())) ||
      (q.answer && q.answer.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = categoryFilter === 'ALL' || q.category === categoryFilter;
    const matchLevel = levelFilter === 'ALL' || q.levelOrder.toString() === levelFilter;

    return matchSearch && matchCategory && matchLevel;
  });

  const categories = Array.from(new Set(questions.map((q) => q.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            Mülakat & Soru Bankası Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Teknik değerlendirme ve seviye belirleme soru kütüphanesini yönetin
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchQuestions}
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
            <Plus className="w-4 h-4" />
            <span>Yeni Soru Ekle</span>
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
      <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Soru metni veya çözüm içeriğinde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Tüm Kategoriler ({questions.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Tüm Seviyeler</option>
            <option value="1">L3 (Junior)</option>
            <option value="2">L4 (Mid-Level)</option>
            <option value="3">L5 (Senior)</option>
            <option value="4">L6 (Staff)</option>
            <option value="5">L7 (Principal)</option>
          </select>
        </div>
      </div>

      {/* Questions Grid / List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
            Soru bankası taranıyor...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs">
            Filtrelere uygun soru bulunamadı.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    <Tag className="w-2.5 h-2.5" />
                    {q.category}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">
                    <Layers className="w-2.5 h-2.5" />
                    Seviye {q.levelOrder}
                  </span>

                  {q.role && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      <Briefcase className="w-2.5 h-2.5" />
                      {q.role}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(q.id)}
                  disabled={actionLoading === q.id}
                  className="self-end sm:self-auto p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                  title="Soruyu Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-semibold text-white leading-relaxed">{q.question}</h3>

              {q.answer && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                    Örnek Çözüm & Mimari Yaklaşım:
                  </span>
                  <p className="line-clamp-3 text-slate-400">{q.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">Yeni Mülakat Sorusu Ekle</h2>
            <p className="text-xs text-slate-400 mb-4">
              Mülakat hazırlık bankasına yeni teknik soru ve kalibrasyon kriteri tanımlayın
            </p>

            <form onSubmit={handleCreateQuestion} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Soru Metni *</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Örn: 10 milyon kullanıcılı bir e-ticaret sepetinde concurrency ve race condition nasıl yönetilir?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kategori *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="System Design">System Design</option>
                    <option value="Data Structures & Algorithms">Data Structures & Algo</option>
                    <option value="Architecture & Scale">Architecture & Scale</option>
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Behavioral & Leadership">Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Seviye (Level)</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={1}>L3 (Junior)</option>
                    <option value={2}>L4 (Mid-Level)</option>
                    <option value={3}>L5 (Senior)</option>
                    <option value={4}>L6 (Staff)</option>
                    <option value={5}>L7 (Principal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Rol</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Evrensel (Tümü)</option>
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="ai_engineer">AI Engineer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Model Cevap / Çözüm</label>
                <textarea
                  rows={3}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Kritik trade-off'lar, optimizasyonlar ve mimari model..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Aday İpucu (Hint)</label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="Örn: Optimistic lock vs Pessimistic lock karşılaştırması yapın"
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
                  Soruyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
