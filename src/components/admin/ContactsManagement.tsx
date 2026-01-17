import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Mail, Search, Loader2, Trash2, Eye, Phone } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export function ContactsManagement() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load contacts', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => {
      const hay = `${c.name} ${c.email} ${c.phone ?? ''} ${c.subject ?? ''} ${c.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const deleteContact = async (id: number) => {
    if (!confirm('Delete this contact message?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Delete failed');
      }
      if (selected?.id === id) setSelected(null);
      await fetchContacts();
    } catch (e) {
      console.error(e);
      alert('Failed to delete contact');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage contact form messages</p>
        </div>
        <Button variant="outline" onClick={fetchContacts}>
          Refresh
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 break-all">
                      {c.email}
                      {c.phone ? (
                        <span className="ml-3 inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Phone className="w-4 h-4" /> {c.phone}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {c.subject || 'General Inquiry'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {c.message}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(c)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteContact(c.id)}
                      disabled={deletingId === c.id}
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selected.subject || 'General Inquiry'}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From {selected.name} • {selected.email} • {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {selected.phone ? (
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  Phone: <span className="font-medium">{selected.phone}</span>
                </div>
              ) : null}

              <Card className="p-4 bg-gray-50 dark:bg-gray-900/30">
                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{selected.message}</p>
              </Card>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => deleteContact(selected.id)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
