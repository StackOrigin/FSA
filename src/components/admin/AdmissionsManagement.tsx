import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { X, UserPlus, Search, Loader2, Eye } from 'lucide-react';

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

function statusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    case 'under_review':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
  }
}

export function AdmissionsManagement() {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admissions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and update admission applications</p>
        </div>
        <Button variant="outline" onClick={fetchAdmissions}>Refresh</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No applications found.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((a, index) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {a.student_name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(a.created_at).toLocaleString()}
                      </span>
                      <span className={`ml-auto lg:ml-0 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor(String(a.status))}`}>
                        {String(a.status).replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Parent: <span className="font-medium">{a.parent_name}</span> • Grade: <span className="font-medium">{a.grade_applying}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-all">
                      {a.email} • {a.phone}
                    </div>
                    {a.message ? (
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {a.message}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(a)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <select
                      value={String(a.status)}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      disabled={updatingId === a.id}
                      className="h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selected.student_name} — Grade {selected.grade_applying}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Parent: {selected.parent_name} • {selected.email} • {selected.phone}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={statusColor(String(selected.status))}>
                  {String(selected.status).replace('_', ' ')}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              {selected.message ? (
                <Card className="p-4 bg-gray-50 dark:bg-gray-900/30">
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{selected.message}</p>
                </Card>
              ) : (
                <Card className="p-4 bg-gray-50 dark:bg-gray-900/30">
                  <p className="text-gray-500 dark:text-gray-400">No message provided.</p>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <select
                  value={String(selected.status)}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  disabled={updatingId === selected.id}
                  className="h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm flex-1"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
