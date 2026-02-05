import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Search, Loader2, Trash2, Eye, Phone, RefreshCw, Inbox, ArrowLeft } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

interface ContactsManagementProps {
  onBack: () => void;
}

export function ContactsManagement({ onBack }: ContactsManagementProps) {
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
    <div className="admin-management">
      {/* Header */}
      <div className="admin-management-header">
        <div className="admin-management-header-left">
          <button onClick={onBack} className="admin-back-btn">
            <ArrowLeft />
          </button>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-management-title"
            >
              Messages
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
            >
              View and manage contact form submissions
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button onClick={fetchContacts} className="contacts-refresh-btn">
            <RefreshCw />
            Refresh
          </button>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="admin-search-wrapper contacts-search"
      >
        <Search className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon contacts-loading" />
          <p className="admin-loading-text">Loading messages...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-empty-state">
            <div className="contacts-empty-icon">
              <Inbox />
            </div>
            <h3 className="admin-empty-title">
              {search ? 'No messages found' : 'No messages yet'}
            </h3>
            <p className="admin-empty-text">
              {search ? 'Try adjusting your search terms.' : 'Messages from the contact form will appear here.'}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="contacts-grid">
          {filtered.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="contacts-card">
                <div className="contacts-card-inner">
                  <div className="contacts-card-content">
                    <div className="contacts-card-header">
                      <div className="contacts-avatar">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="contacts-name">{c.name}</span>
                        <span className="contacts-date">
                          {new Date(c.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="contacts-info">
                      <span className="contacts-info-badge">
                        <Mail className="contacts-icon-orange" />
                        {c.email}
                      </span>
                      {c.phone && (
                        <span className="contacts-info-badge">
                          <Phone className="contacts-icon-blue" />
                          {c.phone}
                        </span>
                      )}
                    </div>
                    <div className="contacts-message-preview">
                      <div className="contacts-subject">
                        {c.subject || 'General Inquiry'}
                      </div>
                      <div className="contacts-message-text">
                        {c.message}
                      </div>
                    </div>
                  </div>
                  <div className="contacts-actions">
                    <button className="contacts-view-btn" onClick={() => setSelected(c)}>
                      <Eye />
                      View
                    </button>
                    <button
                      className="contacts-delete-btn"
                      onClick={() => deleteContact(c.id)}
                      disabled={deletingId === c.id}
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="contacts-spinner" />
                      ) : (
                        <Trash2 />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="admin-modal contacts-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="contacts-modal-header">
                <div className="contacts-modal-header-left">
                  <div className="contacts-modal-avatar">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="admin-modal-title">
                      {selected.subject || 'General Inquiry'}
                    </h2>
                    <p className="contacts-modal-meta">
                      From <span className="contacts-modal-name">{selected.name}</span> • {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button className="admin-modal-close" onClick={() => setSelected(null)}>
                  <X />
                </button>
              </div>

              <div className="contacts-modal-info">
                <span className="contacts-modal-badge">
                  <Mail className="contacts-icon-orange" />
                  {selected.email}
                </span>
                {selected.phone && (
                  <span className="contacts-modal-badge">
                    <Phone className="contacts-icon-blue" />
                    {selected.phone}
                  </span>
                )}
              </div>

              <div className="contacts-modal-message">
                <p>{selected.message}</p>
              </div>

              <div className="contacts-modal-footer">
                <button className="admin-modal-cancel-btn" onClick={() => setSelected(null)}>
                  Close
                </button>
                <button
                  className="contacts-modal-delete-btn"
                  onClick={() => deleteContact(selected.id)}
                >
                  <Trash2 />
                  Delete Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
