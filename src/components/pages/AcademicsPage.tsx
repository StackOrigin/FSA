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

export function AcademicsPage() {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  const subjects = [
    {
      icon: BookOpen,
      title: 'Literature & Language Arts',
      description: 'Develop critical thinking and communication skills through engaging with diverse texts.',
      color: 'from-blue-500 to-cyan-500',
      details: 'Our comprehensive language arts program includes creative writing, literary analysis, public speaking, and debate. Students explore classic and contemporary literature from around the world.',
      courses: ['Creative Writing', 'World Literature', 'Debate & Rhetoric', 'Poetry & Drama'],
    },
    {
      icon: FlaskConical,
      title: 'Sciences',
      description: 'Explore the natural world through hands-on experiments and cutting-edge research.',
      color: 'from-green-500 to-emerald-500',
      details: 'State-of-the-art laboratories provide students with hands-on experience in biology, chemistry, physics, and environmental science. Our STEM programs prepare students for future careers in science and technology.',
      courses: ['Biology', 'Chemistry', 'Physics', 'Environmental Science'],
    },
    {
      icon: Calculator,
      title: 'Mathematics',
      description: 'Build problem-solving skills from algebra to advanced calculus and beyond.',
      color: 'from-purple-500 to-violet-500',
      details: 'Our math curriculum emphasizes both theoretical understanding and practical application. Students progress from foundational concepts to advanced topics including statistics, calculus, and discrete mathematics.',
      courses: ['Algebra', 'Geometry', 'Calculus', 'Statistics & Probability'],
    },
    {
      icon: Globe,
      title: 'Social Studies',
      description: 'Understand history, culture, and society to become informed global citizens.',
      color: 'from-orange-500 to-amber-500',
      details: 'Students explore world history, geography, economics, and civics through engaging projects and discussions. Our program emphasizes critical thinking about current events and global issues.',
      courses: ['World History', 'Geography', 'Economics', 'Government & Politics'],
    },
    {
      icon: Laptop,
      title: 'Technology & Computer Science',
      description: 'Master coding, robotics, and digital literacy for the modern world.',
      color: 'from-pink-500 to-rose-500',
      details: 'From basic programming to advanced AI and machine learning, our technology courses prepare students for careers in tech. Hands-on projects include app development, robotics, and game design.',
      courses: ['Programming', 'Web Development', 'Robotics', 'AI & Machine Learning'],
    },
    {
      icon: Palette,
      title: 'Visual Arts',
      description: 'Express creativity through painting, sculpture, digital media, and design.',
      color: 'from-indigo-500 to-blue-500',
      details: 'Our art program encourages self-expression and creativity across traditional and digital mediums. Students develop portfolios and showcase their work in exhibitions and competitions.',
      courses: ['Drawing & Painting', 'Digital Art', 'Sculpture', 'Photography'],
    },
    {
      icon: Music,
      title: 'Performing Arts',
      description: 'Discover your voice through music, theater, and dance programs.',
      color: 'from-fuchsia-500 to-purple-500',
      details: 'Students can participate in choir, orchestra, band, theater productions, and dance ensembles. Our performance spaces include a modern auditorium and dedicated practice studios.',
      courses: ['Music Theory', 'Orchestra & Band', 'Theater Arts', 'Dance'],
    },
    {
      icon: Languages,
      title: 'World Languages',
      description: 'Connect with global cultures through immersive language learning.',
      color: 'from-teal-500 to-cyan-500',
      details: 'We offer instruction in Spanish, French, Mandarin, and other languages with opportunities for cultural immersion and exchange programs. Students develop fluency through interactive lessons.',
      courses: ['Spanish', 'French', 'Mandarin Chinese', 'Cultural Studies'],
    },
    {
      icon: Users,
      title: 'Physical Education',
      description: 'Build healthy habits through sports, fitness, and wellness programs.',
      color: 'from-lime-500 to-green-500',
      details: 'Our PE program promotes physical fitness, teamwork, and healthy lifestyle choices. Students participate in team sports, individual fitness activities, and health education.',
      courses: ['Team Sports', 'Fitness & Wellness', 'Yoga & Mindfulness', 'Health Education'],
    },
  ];

  const programs = [
    {
      icon: Trophy,
      title: 'Honors & AP Programs',
      description: 'Challenge yourself with advanced coursework and earn college credit.',
    },
    {
      icon: GraduationCap,
      title: 'College Counseling',
      description: 'Personalized guidance for college applications and career planning.',
    },
    {
      icon: Clock,
      title: 'After-School Enrichment',
      description: 'Extended learning through clubs, tutoring, and special programs.',
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
            Academic Excellence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            A comprehensive curriculum designed to inspire curiosity, foster critical thinking, and prepare students for success in college and beyond.
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
            <p className="text-lg text-muted-foreground">Click on any subject to learn more</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-300 border-border/50 bg-card/50 backdrop-blur ${
                    selectedSubject === index
                      ? 'shadow-2xl scale-105 ring-2 ring-primary'
                      : 'hover:shadow-xl hover:scale-105'
                  }`}
                  onClick={() => setSelectedSubject(selectedSubject === index ? null : index)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${subject.color} flex items-center justify-center mb-4`}
                  >
                    <subject.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold mb-2">{subject.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{subject.description}</p>

                  <motion.div
                    initial={false}
                    animate={{
                      height: selectedSubject === index ? 'auto' : 0,
                      opacity: selectedSubject === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-border/50 space-y-4">
                      <p className="text-sm text-muted-foreground">{subject.details}</p>
                      <div>
                        <div className="text-sm font-bold mb-2">Featured Courses:</div>
                        <div className="flex flex-wrap gap-2">
                          {subject.courses.map((course, i) => (
                            <span
                              key={i}
                              className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${subject.color} text-white`}
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Special Programs</h2>
            <p className="text-lg text-muted-foreground">Additional opportunities for growth</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4"
                  >
                    <program.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                  <p className="text-muted-foreground">{program.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
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
