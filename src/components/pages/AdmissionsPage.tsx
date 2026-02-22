import { motion } from 'motion/react';
import { 
  FileText, 
  UserCheck, 
  Calendar, 
  CheckCircle, 
  DollarSign,
  Clock,
  Users,
  Mail,
  Phone,
  Download,
  Send,
  User,
  GraduationCap,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { apiJson } from '../../lib/api';
import '../../styles/pages/AdmissionsPage.css';

export function AdmissionsPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    gradeApplying: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let value = e.target.value;
    
    // Phone number: only digits, max 10
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate email format
    if (!validateEmail(formData.email)) {
      setFormError('Invalid email format');
      return;
    }
    
    setFormStatus('submitting');
    try {
      await apiJson('/admissions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setFormStatus('success');
      setFormData({ studentName: '', parentName: '', email: '', phone: '', gradeApplying: '', message: '' });
    } catch (err: any) {
      setFormStatus('error');
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const steps = [
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Complete our online application form with required documents.',
      details: 'Fill out the comprehensive application form including student information. Required documents include birth certificate, and previous school records.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: UserCheck,
      title: 'Entrance Assessment',
      description: 'Take our age-appropriate evaluation to help us understand your child.',
      details: 'Students will participate in an assessment designed to evaluate academic readiness and help us understand their learning style.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Calendar,
      title: 'Campus Visit & Interview',
      description: 'Tour our facilities and meet with our admissions team.',
      details: 'Schedule a personalized tour of our campus to experience our learning environment. Meet with teachers, see our facilities, and have a conversation with our admissions team.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: CheckCircle,
      title: 'Review & Decision',
      description: 'Our admissions committee reviews your application.',
      details: 'Applications are reviewed, considering academic potential, character, and fit with our school community.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Users,
      title: 'Welcome to Future Stars Academy',
      description: 'Accept your offer and prepare for an amazing journey!',
      details: 'Upon acceptance, you\'ll receive a welcome packet with enrollment forms, orientation details, and information about our new student programs. Our team will guide you through every step of the transition.',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const faqs = [
    {
      question: 'When are applications accepted?',
      answer: 'We accept applications year-round, though priority is given to applications submitted before February 1st for the following school year.',
    },
    {
      question: 'What are the age requirements?',
      answer: 'We accept students from Pre-K (age 4) through Grade 12. Age requirements vary by grade level.',
    },
    {
      question: 'Is financial aid available?',
      answer: 'Yes, we offer need-based financial aid and merit scholarships. Families must complete a separate financial aid application.',
    },
    {
      question: 'What is the student-teacher ratio?',
      answer: 'We maintain small class sizes with an average student-teacher ratio of 12:1 to ensure personalized attention.',
    },
  ];

  
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="admissions-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="admissions-hero-content"
        >
          <h1 className="admissions-hero-title">
            Join Our Community
          </h1>
          <p className="admissions-hero-description">
          Our admissions process is designed to help us get to know your family and ensure the best fit for your child's success.
          </p>
          <a href="#application-form" className="admissions-hero-btn">
            Start Your Application
          </a>
        </motion.div>
      </section>

      {/* Application Process */}
      <section className="admissions-process-section">
        <div className="admissions-process-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="admissions-process-header"
          >
            <h2 className="admissions-process-title">Application Process</h2>
            <p className="admissions-process-subtitle">Five simple steps to enrollment</p>
          </motion.div>

          <div className="admissions-steps">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`admissions-step-card ${activeStep === index ? 'active' : ''}`}
                  onClick={() => setActiveStep(activeStep === index ? null : index)}
                >
                  <div className="admissions-step-content">
                    <div className="admissions-step-header">
                      <div className="admissions-step-icon-wrapper" style={{ background: `linear-gradient(to bottom right, ${step.color.replace('from-', '').replace(' to-', ', ')})` }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <step.icon className="admissions-step-icon" />
                        </motion.div>
                      </div>
                      
                      <div className="admissions-step-info">
                        <span 
                          className="admissions-step-badge"
                          style={{ background: `linear-gradient(to right, ${step.color.replace('from-', '').replace(' to-', ', ')})` }}
                        >
                          Step {index + 1}
                        </span>
                        <h3 className="admissions-step-title">{step.title}</h3>
                        <p className="admissions-step-description">{step.description}</p>

                        <motion.div
                          initial={false}
                          animate={{
                            height: activeStep === index ? 'auto' : 0,
                            opacity: activeStep === index ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="admissions-step-details">
                            <p className="admissions-step-details-text">
                              {step.details}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="admissions-dates-section">
        <div className="admissions-dates-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="admissions-dates-header"
          >
            <h2 className="admissions-dates-title">Important Dates</h2>
            <p className="admissions-dates-subtitle">Mark your calendar</p>
          </motion.div>

          <div className="admissions-dates-grid">
            {[
              { date: 'February 1', event: 'Priority Application Deadline', icon: Clock },
              { date: 'March 15', event: 'Admission Decisions Released', icon: Mail },
              { date: 'April 30', event: 'Enrollment Confirmation Due', icon: CheckCircle },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="admissions-date-card">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="admissions-date-icon-wrapper"
                  >
                    <item.icon className="admissions-date-icon" />
                  </motion.div>
                  <div className="admissions-date-value">
                    {item.date}
                  </div>
                  <div className="admissions-date-event">{item.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="admissions-form-section" id="application-form">
        <div className="admissions-form-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="admissions-form-header"
          >
            <h2 className="admissions-form-title">Apply Now</h2>
            <p className="admissions-form-subtitle">Fill out the form below to start your child's journey with us</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {formStatus === 'success' ? (
              <div className="admissions-form-success">
                <CheckCircle className="admissions-form-success-icon" />
                <h3 className="admissions-form-success-title">Application Submitted!</h3>
                <p className="admissions-form-success-text">
                  Thank you for applying. Our admissions team will review your application and get back to you within 5-7 business days.
                </p>
                <button
                  className="admissions-form-success-btn"
                  onClick={() => setFormStatus('idle')}
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form className="admissions-form" onSubmit={handleSubmit}>
                <div className="admissions-form-grid">
                  {/* Student Name */}
                  <div className="admissions-form-group">
                    <label className="admissions-form-label" htmlFor="studentName">
                      <User className="admissions-form-label-icon" />
                      Student's Full Name <span className="admissions-form-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="admissions-form-input"
                      placeholder="Enter student's full name"
                      required
                    />
                  </div>

                  {/* Parent Name */}
                  <div className="admissions-form-group">
                    <label className="admissions-form-label" htmlFor="parentName">
                      <Users className="admissions-form-label-icon" />
                      Parent/Guardian Name <span className="admissions-form-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="admissions-form-input"
                      placeholder="Enter parent/guardian name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="admissions-form-group">
                    <label className="admissions-form-label" htmlFor="email">
                      <Mail className="admissions-form-label-icon" />
                      Email Address <span className="admissions-form-required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => {
                        if (formData.email.trim() && !validateEmail(formData.email)) {
                          setFormError('Invalid email format');
                        }
                      }}
                      className="admissions-form-input"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="admissions-form-group">
                    <label className="admissions-form-label" htmlFor="phone">
                      <Phone className="admissions-form-label-icon" />
                      Phone Number <span className="admissions-form-required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="admissions-form-input"
                      placeholder="1234567890"
                      required
                    />
                  </div>

                  {/* Grade Applying */}
                  <div className="admissions-form-group admissions-form-full">
                    <label className="admissions-form-label" htmlFor="gradeApplying">
                      <GraduationCap className="admissions-form-label-icon" />
                      Grade Applying For <span className="admissions-form-required">*</span>
                    </label>
                    <select
                      id="gradeApplying"
                      name="gradeApplying"
                      value={formData.gradeApplying}
                      onChange={handleInputChange}
                      className="admissions-form-input admissions-form-select"
                      required
                    >
                      <option value="">Select a grade</option>
                      <option value="Pre-K">Pre-K</option>
                      <option value="Kindergarten">Kindergarten</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="admissions-form-group admissions-form-full">
                    <label className="admissions-form-label" htmlFor="message">
                      <MessageSquare className="admissions-form-label-icon" />
                      Additional Information <span className="admissions-form-optional">(Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="admissions-form-input admissions-form-textarea"
                      placeholder="Any additional information you'd like to share..."
                      rows={4}
                    />
                  </div>
                </div>

                {formStatus === 'error' && (
                  <div className="admissions-form-error">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="admissions-form-submit"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <Loader2 className="admissions-form-submit-icon spinning" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="admissions-form-submit-icon" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="admissions-faq-section">
        <div className="admissions-faq-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="admissions-faq-header"
          >
            <h2 className="admissions-faq-title">Frequently Asked Questions</h2>
            <p className="admissions-faq-subtitle">Got questions? We've got answers</p>
          </motion.div>

          <div className="admissions-faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="admissions-faq-card">
                  <h3 className="admissions-faq-question">{faq.question}</h3>
                  <p className="admissions-faq-answer">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     
    </div>
  );
}
