import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background via-muted/30 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactCardsLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
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
                    <Card className="p-6 text-center hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur h-full">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br ${String(info.color)} flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="font-bold mb-3">{info.title}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {(info.details ?? []).map((detail, i) => (
                          <div key={i}>{detail}</div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                {submitError && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                    {submitError}
                  </div>
                )}
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'name' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter your name"
                          className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                        />
                      </motion.div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'email' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="your.email@example.com"
                          className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
                        />
                      </motion.div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'phone' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="+1 (555) 123-4567"
                          className="mt-2"
                        />
                      </motion.div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'subject' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="What is this regarding?"
                          className={`mt-2 ${errors.subject ? 'border-red-500' : ''}`}
                        />
                      </motion.div>
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.subject}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <motion.div
                        animate={{
                          scale: focusedField === 'message' ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Tell us more..."
                          rows={5}
                          className={`mt-2 ${errors.message ? 'border-red-500' : ''}`}
                        />
                      </motion.div>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                        size="lg"
                        disabled={submitting}
                      >
                        <Send className="w-5 h-5 mr-2" />
                        {submitting ? 'Sending…' : 'Send Message'}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur">
                <div className="relative h-full min-h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-bold mb-2">Visit Our Campus</h3>
                      <p className="text-muted-foreground px-8">
                        123 Education Lane<br />
                        Innovation City, ST 12345
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6 rounded-full"
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                  
                  {/* Decorative grid */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className="border border-muted-foreground" />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Quick Answers</h2>
            <p className="text-lg text-muted-foreground">
              Common questions about contacting us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
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
                <Card className="p-6 hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur h-full">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
