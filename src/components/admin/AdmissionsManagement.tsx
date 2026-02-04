import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { X, UserPlus, Search, Loader2, Eye, RefreshCw, GraduationCap, Mail, Phone, FileText, ArrowLeft } from 'lucide-react';

interface Admission {
  id: number;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | string;
  created_at: string;
}

const statusOptions = ['pending', 'under_review', 'approved', 'rejected'] as const;

interface AdmissionsManagementProps {
  onBack: () => void;
}

function statusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'under_review':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    default:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
}

function statusLabel(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function AdmissionsManagement({ onBack }: AdmissionsManagementProps) {
  const [items, setItems] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Admission | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchAdmissions = async () => {
    try {
      const res = await fetch('/api/admissions');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load admissions', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((a) => {
      const hay = `${a.student_name} ${a.parent_name} ${a.email} ${a.phone} ${a.grade_applying} ${a.status} ${a.message ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to update status');
      }

      await fetchAdmissions();
      if (selected?.id === id) {
        const updated = await res.json().catch(() => null);
        if (updated?.application) setSelected(updated.application);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update application status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Admissions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 mt-1"
            >
              Review and manage admission applications
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            onClick={fetchAdmissions}
            className="rounded-xl h-11 px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md"
      >
        <div className="flex items-center h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 gap-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-16 text-center border-0 bg-white dark:bg-slate-800">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <FileText className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {search ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search ? 'Try adjusting your search terms.' : 'Admission applications will appear here.'}
            </p>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((a, index) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {a.student_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white text-lg">
                            {a.student_name}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusColor(String(a.status))}`}>
                            {statusLabel(String(a.status))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Applied {new Date(a.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-emerald-500" />
                        Grade {a.grade_applying}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                        <UserPlus className="w-4 h-4 text-blue-500" />
                        {a.parent_name}
                      </span>
                    </div>

                    {a.message && (
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                        "{a.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelected(a)}
                      className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200"
                    >
                      <Eye className="w-4 h-4 mr-2" /> 
                      View
                    </Button>
                    <select
                      value={String(a.status)}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      disabled={updatingId === a.id}
                      className="h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{statusLabel(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              style={{ backgroundColor: 'white' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {selected.student_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selected.student_name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Applying for Grade {selected.grade_applying}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)} className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className={`${statusColor(String(selected.status))} px-4 py-1.5 text-sm font-semibold`}>
                  {statusLabel(String(selected.status))}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Parent/Guardian</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selected.parent_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Grade Applying</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Grade {selected.grade_applying}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{selected.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selected.phone}</p>
                  </div>
                </div>
              </div>

              {selected.message ? (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Message</p>
                  <Card className="p-4 bg-gray-50 dark:bg-slate-900/50 border-0 rounded-xl">
                    <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 italic">"{selected.message}"</p>
                  </Card>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Update Status</label>
                  <select
                    value={String(selected.status)}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                    disabled={updatingId === selected.id}
                    className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="h-11 rounded-xl px-6" 
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
