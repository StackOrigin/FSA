import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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

function getStatusClass(status: string) {
  switch (status) {
    case 'approved':
      return 'status-approved';
    case 'rejected':
      return 'status-rejected';
    case 'under_review':
      return 'status-review';
    default:
      return 'status-pending';
  }
}

function statusLabel(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function AdmissionsManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate('/admin');
  const [items, setItems] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
    // PDF download function (all details)
    const downloadAdmissionAsPDF = (admission: Admission) => {
      import('jspdf').then(({ default: jsPDF }) => {
        const doc = new jsPDF();
        let y = 10;
        doc.setFontSize(16);
        doc.text('Admission Application', 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.text(`Student Name: ${admission.student_name}`, 10, y);
        y += 8;
        doc.text(`Parent/Guardian: ${admission.parent_name}`, 10, y);
        y += 8;
        doc.text(`Email: ${admission.email}`, 10, y);
        y += 8;
        doc.text(`Phone: ${admission.phone}`, 10, y);
        y += 8;
        doc.text(`Grade Applying: ${admission.grade_applying}`, 10, y);
        y += 8;
        doc.text(`Status: ${statusLabel(String(admission.status))}`, 10, y);
        y += 8;
        doc.text(`Submitted: ${new Date(admission.created_at).toLocaleString()}`, 10, y);
        y += 10;
        if (admission.message) {
          doc.setFontSize(13);
          doc.text('Additional Message:', 10, y);
          y += 8;
          doc.setFontSize(11);
          doc.text(admission.message, 10, y);
        }
        doc.save('admission-details.pdf');
      });
    };
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
              Admissions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
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
          <button onClick={fetchAdmissions} className="admissions-refresh-btn">
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
        className="admin-search-wrapper admissions-search"
      >
        <Search className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon admissions-loading" />
          <p className="admin-loading-text">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-empty-state">
            <div className="admissions-empty-icon">
              <FileText />
            </div>
            <h3 className="admin-empty-title">
              {search ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="admin-empty-text">
              {search ? 'Try adjusting your search terms.' : 'Admission applications will appear here.'}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="admissions-grid">
          {filtered.map((a, index) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="admissions-card">
                <div className="admissions-card-inner">
                  <div className="admissions-card-content">
                    <div className="admissions-card-header">
                      <div className="admissions-avatar">
                        {a.student_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="admissions-card-header-info">
                        <div className="admissions-card-title-row">
                          <span className="admissions-name">{a.student_name}</span>
                          <span className={`admissions-status-badge ${getStatusClass(String(a.status))}`}>
                            {statusLabel(String(a.status))}
                          </span>
                        </div>
                        <p className="admissions-date">
                          Applied {new Date(a.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="admissions-info">
                      <span className="admissions-info-badge">
                        <GraduationCap className="admissions-icon-emerald" />
                        Grade {a.grade_applying}
                      </span>
                      <span className="admissions-info-badge">
                        <UserPlus className="admissions-icon-blue" />
                        {a.parent_name}
                      </span>
                    </div>

                    {a.message && (
                      <p className="admissions-message-preview">
                        "{a.message}"
                      </p>
                    )}
                  </div>

                  <div className="admissions-actions">
                    <button className="admissions-view-btn" onClick={() => setSelected(a)}>
                      <Eye />
                      View
                    </button>
                    <button className="admissions-view-btn" onClick={() => downloadAdmissionAsPDF(a)}>
                      <FileText />
                      PDF
                    </button>
                    <select
                      value={String(a.status)}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      disabled={updatingId === a.id}
                      className="admissions-status-select"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{statusLabel(s)}</option>
                      ))}
                    </select>
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
              className="admin-modal admissions-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="admissions-modal-header">
                <div className="admissions-modal-header-left">
                  <div className="admissions-modal-avatar">
                    {selected.student_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="admin-modal-title">{selected.student_name}</h2>
                    <p className="admissions-modal-subtitle">
                      Applying for Grade {selected.grade_applying}
                    </p>
                  </div>
                </div>
                <button className="admin-modal-close" onClick={() => setSelected(null)}>
                  <X />
                </button>
              </div>

              <div className="admissions-modal-status-row">
                <span className={`admissions-status-badge large ${getStatusClass(String(selected.status))}`}>
                  {statusLabel(String(selected.status))}
                </span>
                <span className="admissions-modal-date">
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              <div className="admissions-modal-grid">
                <div className="admissions-modal-info-card">
                  <div className="admissions-modal-info-icon blue">
                    <UserPlus />
                  </div>
                  <div>
                    <p className="admissions-modal-info-label">Parent/Guardian</p>
                    <p className="admissions-modal-info-value">{selected.parent_name}</p>
                  </div>
                </div>
                <div className="admissions-modal-info-card">
                  <div className="admissions-modal-info-icon emerald">
                    <GraduationCap />
                  </div>
                  <div>
                    <p className="admissions-modal-info-label">Grade Applying</p>
                    <p className="admissions-modal-info-value">Grade {selected.grade_applying}</p>
                  </div>
                </div>
                <div className="admissions-modal-info-card">
                  <div className="admissions-modal-info-icon orange">
                    <Mail />
                  </div>
                  <div>
                    <p className="admissions-modal-info-label">Email</p>
                    <p className="admissions-modal-info-value small">{selected.email}</p>
                  </div>
                </div>
                <div className="admissions-modal-info-card">
                  <div className="admissions-modal-info-icon purple">
                    <Phone />
                  </div>
                  <div>
                    <p className="admissions-modal-info-label">Phone</p>
                    <p className="admissions-modal-info-value">{selected.phone}</p>
                  </div>
                </div>
              </div>

              {selected.message && (
                <div className="admissions-modal-message">
                  <p className="admissions-modal-message-label">Additional Message</p>
                  <div className="admissions-modal-message-content">
                    <p>"{selected.message}"</p>
                  </div>
                </div>
              )}

              <div className="admissions-modal-footer">
                <div className="admissions-modal-status-update">
                  <label className="admissions-modal-status-label">Update Status</label>
                  <select
                    value={String(selected.status)}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                    disabled={updatingId === selected.id}
                    className="admissions-status-select large"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="admin-modal-submit-btn"
                    onClick={() => downloadAdmissionAsPDF(selected)}
                  >
                    <FileText size={16} />
                    Download PDF
                  </button>
                  <button className="admin-modal-cancel-btn" onClick={() => setSelected(null)}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
