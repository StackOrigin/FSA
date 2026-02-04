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
  Download
} from 'lucide-react';
import { useState } from 'react';
import '../../styles/pages/AdmissionsPage.css';

export function AdmissionsPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Complete our online application form with required documents.',
      details: 'Fill out the comprehensive application form including student information, academic history, and extracurricular activities. Required documents include birth certificate, previous school records, and immunization records.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: UserCheck,
      title: 'Entrance Assessment',
      description: 'Take our age-appropriate evaluation to help us understand your child.',
      details: 'Students will participate in an assessment designed to evaluate academic readiness and help us understand their learning style. This is not a pass/fail test, but a tool to ensure we can meet your child\'s needs.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Calendar,
      title: 'Campus Visit & Interview',
      description: 'Tour our facilities and meet with our admissions team.',
      details: 'Schedule a personalized tour of our campus to experience our learning environment. Meet with teachers, see our facilities, and have a conversation with our admissions team about your family\'s educational goals.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: CheckCircle,
      title: 'Review & Decision',
      description: 'Our admissions committee reviews your application.',
      details: 'Applications are reviewed holistically, considering academic potential, character, and fit with our school community. Decisions are typically communicated within 2-3 weeks of completing all steps.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Users,
      title: 'Welcome to FutureSchool',
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
          <button className="admissions-hero-btn">
            Start Your Application
          </button>
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

      {/* Addmission QR */}
      
      

     

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
