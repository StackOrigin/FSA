import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Mail, Search, Loader2, Trash2, Eye, Phone, RefreshCw, Inbox } from 'lucide-react';

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
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Messages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 mt-1"
          >
            View and manage contact form submissions
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            onClick={fetchContacts}
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
        className="relative max-w-md"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800"
        />
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-16 text-center border-0 bg-white dark:bg-slate-800">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Inbox className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {search ? 'No messages found' : 'No messages yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search ? 'Try adjusting your search terms.' : 'Messages from the contact form will appear here.'}
            </p>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">{c.name}</span>
                        <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(c.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                        <Mail className="w-4 h-4 text-orange-500" />
                        {c.email}
                      </span>
                      {c.phone && (
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                          <Phone className="w-4 h-4 text-blue-500" />
                          {c.phone}
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {c.subject || 'General Inquiry'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {c.message}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelected(c)}
                      className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200"
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selected.subject || 'General Inquiry'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      From <span className="font-medium text-gray-700 dark:text-gray-300">{selected.name}</span> • {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)} className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-xl">
                  <Mail className="w-4 h-4 text-orange-500" />
                  {selected.email}
                </span>
                {selected.phone && (
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-xl">
                    <Phone className="w-4 h-4 text-blue-500" />
                    {selected.phone}
                  </span>
                )}
              </div>

              <Card className="p-5 bg-gray-50 dark:bg-slate-900/50 border-0 rounded-xl">
                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{selected.message}</p>
              </Card>

              <div className="flex gap-3 pt-6">
                <Button 
                  variant="outline" 
                  className="flex-1 h-11 rounded-xl" 
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => deleteContact(selected.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Message
                </Button>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
