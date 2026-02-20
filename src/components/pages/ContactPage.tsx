import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../styles/pages/ContactPage.css';

export function ContactPage() {
  const iconMap: Record<string, any> = {
    Phone,
    Mail,
    MapPin,
    Clock,
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [contactCards, setContactCards] = useState<
    Array<{ icon: string; title: string; details: string[]; color: string }>
  >([]);
  const [contactCardsLoading, setContactCardsLoading] = useState(true);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    
    // Phone number: only digits, max 10
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone.trim() && !/^\d{1,10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 1-10 digits only';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Failed to submit contact form');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setSubmitError('Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/content/contact');
        const data = await res.json();
        setContactCards(Array.isArray(data?.cards) ? data.cards : []);
      } catch (e) {
        console.error('Failed to load contact content', e);
        setContactCards([]);
      } finally {
        setContactCardsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="contact-hero-content"
        >
          
          <p className="contact-hero-description">
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="contact-info-container">
          <div className="contact-cards-grid">
            {contactCardsLoading ? (
              <div className="contact-loading">
                <Loader2 className="contact-loading-icon" />
              </div>
            ) : (
              contactCards.map((info, index) => {
                const Icon = iconMap[String(info.icon)] ?? Mail;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={`contact-card ${['Phone', 'Mail', 'MapPin', 'Clock'].includes(info.icon) ? 'special-card' : ''}`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="contact-card-icon-wrapper"
                        style={{ background: `linear-gradient(to bottom right, ${info.color})` }}
                      >
                        <Icon className="contact-card-icon" />
                      </motion.div>
                      <h3 className="contact-card-title">{info.title}</h3>
                      <div className="contact-card-details">
                        {(info.details ?? []).map((detail, i) => (
                          <div key={i}>{detail}</div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-map-grid">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="contact-form-card">
                <h2 className="contact-form-title">Send us a Message</h2>

                {submitError && (
                  <div className="contact-form-error">
                    {submitError}
                  </div>
                )}

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="contact-success"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="contact-success-icon-wrapper"
                    >
                      <CheckCircle2 className="contact-success-icon" />
                    </motion.div>
                    <h3 className="contact-success-title">Message Sent!</h3>
                    <p className="contact-success-message">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div>
                      <label htmlFor="name" className="contact-form-label">Full Name *</label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'name' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter your name"
                          className={`contact-form-input contact-form-field ${errors.name ? 'error' : ''}`}
                        />
                      </motion.div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="contact-field-error"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="contact-form-label">Email Address *</label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'email' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => {
                            setFocusedField(null);
                            if (formData.email.trim() && !validateEmail(formData.email)) {
                              setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
                            }
                          }}
                          placeholder="your.email@example.com"
                          className={`contact-form-input contact-form-field ${errors.email ? 'error' : ''}`}
                        />
                      </motion.div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="contact-field-error"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="contact-form-label">Phone Number</label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'phone' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Phone number"
                          className={`contact-form-input contact-form-field ${errors.phone ? 'error' : ''}`}
                        />
                      </motion.div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="contact-field-error"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="contact-form-label">Subject *</label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'subject' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="What is this regarding?"
                          className={`contact-form-input contact-form-field ${errors.subject ? 'error' : ''}`}
                        />
                      </motion.div>
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="contact-field-error"
                        >
                          {errors.subject}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="contact-form-label">Message *</label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'message' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Tell us more..."
                          rows={5}
                          className={`contact-form-textarea contact-form-field ${errors.message ? 'error' : ''}`}
                        />
                      </motion.div>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="contact-field-error"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <button
                        type="submit"
                        className="contact-submit-btn"
                        disabled={submitting}
                      >
                        <Send className="contact-submit-icon" />
                        {submitting ? 'Sending…' : 'Send Message'}
                      </button>
                    </motion.div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="contact-map-card">
                <div className="contact-map-header">
                  <MapPin className="contact-map-header-icon" />
                  <div>
                    <h3 className="contact-map-title">Visit Our Campus</h3>
                    <p className="contact-map-address">
                      Lubhu-Dandathok-Dharachour Rd, 44708
                    </p>
                  </div>
                </div>
                <div className="contact-map-iframe-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.4535636671753!2d85.37270517379054!3d27.64143557839849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb10be18a95d87%3A0x2e3fe2b9bb2ed289!2sJ9RG%2BJ43%20Future%20Star%20Secondary%20School%2C%20Lubhu-%20Dandathok-%20Dharachour%20Rd%2C%2044708!5e0!3m2!1sen!2snp!4v1770560562182!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '0.75rem' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Future Star Secondary School Location"
                  />
                </div>
                <a 
                  href="https://www.google.com/maps/place/Future+Star+Secondary+School/@27.6414356,85.3727052,17z" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-directions-btn"
                >
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
