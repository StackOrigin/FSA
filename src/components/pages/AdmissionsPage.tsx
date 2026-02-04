import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
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
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background via-muted/30 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Community
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
          Our admissions process is designed to help us get to know your family and ensure the best fit for your child's success.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8"
          >
            Start Your Application
          </Button>
        </motion.div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Application Process</h2>
            <p className="text-lg text-muted-foreground">Five simple steps to enrollment</p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden cursor-pointer transition-all duration-300 border-border/50 bg-card/50 backdrop-blur ${
                    activeStep === index ? 'shadow-2xl ring-2 ring-primary' : 'hover:shadow-xl'
                  }`}
                  onClick={() => setActiveStep(activeStep === index ? null : index)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}
                        >
                          <step.icon className="w-7 h-7 text-white" />
                        </motion.div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${step.color} text-white`}>
                            Step {index + 1}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>

                        <motion.div
                          initial={false}
                          animate={{
                            height: activeStep === index ? 'auto' : 0,
                            opacity: activeStep === index ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.details}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Important Dates</h2>
            <p className="text-lg text-muted-foreground">Mark your calendar</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                <Card className="p-6 text-center hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {item.date}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.event}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Addmission QR */}
      
      

     

      {/* FAQs */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Got questions? We've got answers</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     
    </div>
  );
}
