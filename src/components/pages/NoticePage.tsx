import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { 
  BookOpen, 
  FlaskConical, 
  Calculator, 
  Languages, 
  Palette, 
  Music, 
  Laptop,
  Globe,
  Trophy,
  Users,
  Clock,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';

export function NoticePage() {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

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
            Notice Module
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            "Notices are subject to change. Stay updated for important information.”
          </p>
        </motion.div>
      </section>

      {/* Subjects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Programs</h2>
            <p className="text-lg text-muted-foreground">Click on any subject to Download notice</p>
          </motion.div>

          
        </div>
      </section>
      {/* Notices */}
      <section className=''>
        <div className='p-6'>
          <img src='/images/vacancy3.jpg' className='h-20.1'/>
        </div>

      </section>

      

      {/* Learning Approach */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Teaching Approach</h2>
            <p className="text-lg text-muted-foreground">Student-centered learning for the 21st century</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-border/50 backdrop-blur">
                <h3 className="text-2xl font-bold mb-4">Personalized Learning</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We recognize that every student learns differently. Our teachers use differentiated instruction, adaptive technology, and individualized support to ensure each student reaches their full potential.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Small class sizes for personalized attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Adaptive learning technologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Regular progress assessments</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-border/50 backdrop-blur">
                <h3 className="text-2xl font-bold mb-4">Project-Based Learning</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Students engage in real-world projects that develop critical thinking, collaboration, and problem-solving skills. Learning becomes an active, engaging experience.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <span>Hands-on, collaborative projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <span>Real-world problem solving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <span>Interdisciplinary learning</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
