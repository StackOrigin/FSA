import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  X,
  Search,
  Loader2,
  CalendarDays,
  ArrowLeft,
  Star,
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  is_featured: boolean;
  created_at: string;
}

export function EventsManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate('/admin');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('location', formData.location);
      submitData.append('isFeatured', String(formData.isFeatured));
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        fetchEvents();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const toggleFeatured = async (event: Event) => {
    try {
      const submitData = new FormData();
      submitData.append('title', event.title);
      submitData.append('description', event.description || '');
      submitData.append('date', event.event_date?.split('T')[0] || '');
      submitData.append('time', event.event_time || '');
      submitData.append('location', event.location || '');
      submitData.append('isFeatured', String(!event.is_featured));

      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        body: submitData,
      });

      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      isFeatured: false,
    });
    setSelectedFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.event_date?.split('T')[0] || '',
      time: event.event_time || '',
      location: event.location || '',
      isFeatured: event.is_featured || false,
    });
    setSelectedFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      isFeatured: false,
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Events
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
            >
              Create and manage school events
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button onClick={openAddModal} className="admin-add-btn">
            <Plus />
            Add Event
          </button>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="admin-search-wrapper"
      >
        <Search className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </motion.div>

      {/* Events List */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-empty-state">
            <CalendarDays className="admin-empty-icon" />
            <h3 className="admin-empty-title">
              {searchTerm ? 'No events found' : 'No events yet'}
            </h3>
            <p className="admin-empty-text">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first event!'}
            </p>
            {!searchTerm && (
              <button onClick={openAddModal} className="admin-add-btn" style={{ marginTop: '1.5rem' }}>
                <Plus />
                Add Your First Event
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="admin-cards-grid" style={{ gridTemplateColumns: '1fr' }}>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="admin-item-card">
                <div className="admin-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 className="admin-item-title" style={{ fontSize: '1.125rem' }}>
                      {event.title}
                    </h3>
                    {event.is_featured && (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        padding: '0.25rem 0.625rem', 
                        backgroundColor: '#fef3c7', 
                        color: '#d97706', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        borderRadius: '9999px' 
                      }}>
                        <Star style={{ width: '0.75rem', height: '0.75rem', fill: '#d97706' }} />
                        Featured
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="admin-item-meta" style={{ marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                    <span className="contacts-info-badge">
                      <Calendar style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                      {new Date(event.event_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    {event.event_time && (
                      <span className="contacts-info-badge">
                        <Clock style={{ width: '1rem', height: '1rem', color: '#a855f7' }} />
                        {event.event_time}
                      </span>
                    )}
                    {event.location && (
                      <span className="contacts-info-badge">
                        <MapPin style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button 
                    className="admin-item-btn" 
                    onClick={() => toggleFeatured(event)}
                    style={{ 
                      backgroundColor: event.is_featured ? '#fef3c7' : '#f3f4f6',
                      color: event.is_featured ? '#d97706' : '#6b7280',
                      border: event.is_featured ? '1px solid #fcd34d' : '1px solid #e5e7eb'
                    }}
                    title={event.is_featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <Star style={{ fill: event.is_featured ? '#d97706' : 'none' }} />
                    {event.is_featured ? 'Featured' : 'Feature'}
                  </button>
                  <button className="admin-item-btn edit" onClick={() => openEditModal(event)}>
                    <Pencil />
                    Edit
                  </button>
                  <button className="admin-item-btn delete" onClick={() => handleDelete(event.id)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-modal-body">
                <div className="admin-modal-form">
                  <div className="admin-form-field">
                    <label htmlFor="title" className="admin-form-label">Event Title *</label>
                    <input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="admin-form-input"
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="description" className="admin-form-label">Description</label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="admin-form-textarea"
                      placeholder="Describe the event..."
                      rows={3}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-field">
                      <label htmlFor="date" className="admin-form-label">Date *</label>
                      <input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="admin-form-input"
                        required
                      />
                    </div>
                    <div className="admin-form-field">
                      <label htmlFor="time" className="admin-form-label">Time</label>
                      <input
                        id="time"
                        type="text"
                        placeholder="e.g., 9:00 AM"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="location" className="admin-form-label">Location</label>
                    <input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Main Auditorium"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-field">
                    <label htmlFor="image" className="admin-form-label">Event Image</label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="admin-form-input"
                      style={{ cursor: 'pointer' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.375rem' }}>
                      Upload an image from your computer (max 5MB)
                    </p>
                    {imagePreview && (
                      <div style={{ marginTop: '0.75rem', position: 'relative', width: '100%', height: '8rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="admin-modal-footer">
                <button type="button" className="admin-modal-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-modal-submit-btn"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <Loader2 className="admin-modal-submit-spinner" />
                  ) : editingEvent ? (
                    'Update Event'
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
