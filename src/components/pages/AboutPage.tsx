import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';

export function AboutPage() {
  const milestones = [
    {
      year: '1995',
      title: 'Foundation',
      description: 'FutureSchool was established with a vision to revolutionize education.',
    },
    {
      year: '2005',
      title: 'Digital Transformation',
      description: 'Introduced cutting-edge technology and digital learning platforms.',
    },
    {
      year: '2015',
      title: 'Global Expansion',
      description: 'Opened international campuses and online programs worldwide.',
    },
    {
      year: '2020',
      title: 'Innovation Hub',
      description: 'Launched state-of-the-art research and innovation centers.',
    },
    {
      year: '2025',
      title: 'Future Ready',
      description: 'Leading the way in AI-enhanced and personalized learning.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'Striving for the highest standards in everything we do.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Compassion',
      description: 'Fostering empathy, kindness, and understanding in our community.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Embracing creativity and new approaches to learning.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Building strong partnerships among students, teachers, and families.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Award,
      title: 'Integrity',
      description: 'Upholding honesty, ethics, and accountability in all our actions.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'Looking forward to create lasting positive impact on society.',
      color: 'from-indigo-500 to-blue-500',
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
            About FutureSchool
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            For over 30 years, we've been at the forefront of educational innovation, nurturing curious minds and empowering students to become leaders, thinkers, and changemakers.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-border/50 backdrop-blur">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide a transformative educational experience that empowers every student to reach their full potential, think critically, and make meaningful contributions to society. We are committed to fostering curiosity, creativity, and a lifelong love of learning.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-border/50 backdrop-blur">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be a global leader in education, recognized for excellence in teaching, innovation in learning, and dedication to developing compassionate, capable individuals who will shape a better future for all. We envision a world where every student thrives.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">Milestones that shaped our legacy</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-background shadow-lg z-10" />

                  <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-12">
                    {index % 2 === 0 && (
                      <Card className="p-6 hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </Card>
                    )}
                  </div>

                  <div className="w-full md:w-1/2 pl-20 md:pl-12">
                    {index % 2 !== 0 && (
                      <Card className="p-6 hover:shadow-xl transition-shadow border-border/50 bg-card/50 backdrop-blur">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </Card>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-border/50 bg-card/50 backdrop-blur">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Led by Passionate Educators</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our dedicated team of administrators, teachers, and staff work tirelessly to create an environment where every student can thrive.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-background shadow-lg"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
