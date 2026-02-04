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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
    <div className="pt-20">
      {/* Hero Section */}
      <section className="contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="contact-hero-content"
        >
          <h1 className="contact-hero-title">
            Get in Touch
          </h1>
          <p className="contact-hero-description">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                    <div className="contact-card">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
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

          {/* Contact Form and Map */}
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
                          onBlur={() => setFocusedField(null)}
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
                          placeholder="+1 (555) 123-4567"
                          className="contact-form-input contact-form-field"
                        />
                      </motion.div>
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

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="contact-map-card">
                <div className="contact-map-container">
                  <div className="contact-map-gradient" />
                  <div className="contact-map-content">
                    <div className="contact-map-inner">
                      <MapPin className="contact-map-icon" />
                      <h3 className="contact-map-title">Visit Our Campus</h3>
                      <p className="contact-map-address">
                        123 Education Lane<br />
                        Innovation City, ST 12345
                      </p>
                      <button className="contact-directions-btn">
                        Get Directions
                      </button>
                    </div>
                  </div>
                  
                  {/* Decorative grid */}
                  <div className="contact-map-grid">
                    <div className="contact-map-grid-inner">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className="contact-map-grid-cell" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section">
        <div className="contact-faq-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="contact-faq-header"
          >
            <h2 className="contact-faq-title">Quick Answers</h2>
            <p className="contact-faq-subtitle">
              Common questions about contacting us
            </p>
          </motion.div>

          <div className="contact-faq-grid">
            {[
              {
                question: 'How quickly will I get a response?',
                answer: 'We typically respond to inquiries within 24-48 hours during business days.',
              },
              {
                question: 'Can I schedule a campus tour?',
                answer: 'Yes! Contact our admissions office to schedule a personalized tour.',
              },
              {
                question: 'Who should I contact for emergencies?',
                answer: 'For emergencies during school hours, call our main office at +1 (555) 123-4567.',
              },
              {
                question: 'Do you accept walk-in visits?',
                answer: 'While appointments are preferred, our reception is open during office hours.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="contact-faq-card">
                  <h3 className="contact-faq-question">{faq.question}</h3>
                  <p className="contact-faq-answer">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
