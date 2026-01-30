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
      title: 'Excellence',
      description: 'Striving for the highest standards in everything we do.',
      color: 'from-blue-500 via-purple-500 to-pink-500',
    },
    {
      title: 'Compassion',
      description: 'Fostering empathy, kindness, and understanding in our community.',
      color: 'from-blue-500 via-purple-500 to-pink-500',
    },
    {
      title: 'Innovation',
      description: 'Embracing creativity and new approaches to learning.',
      color: 'from-blue-500 via-purple-500 to-pink-500',
    },
    {
      title: 'Collaboration',
      description: 'Building strong partnerships among students, teachers, and families.',
      color: 'from-blue-500 via-purple-500 to-pink-500',
    },
    {
      title: 'Integrity',
      description: 'Upholding honesty, ethics, and accountability in all our actions.',
      color: 'from-blue-500 via-purple-500 to-pink-500',
    },
    
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background via-muted/30 to-background"
      style={{backgroundImage:"url('/images/mainphoto1.jpg')", backgroundSize:"cover", backgroundPosition:"center "}}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white  bg-clip-text text-transparent">
            About Our Future Stars
          </h1>
          
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
                To provide a transformative educational experience that empowers every student to reach their full potential, 
                think critically, and make meaningful contributions to society. 
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
                To be a global leader in education, recognized for excellence in teaching, innovation in learning, and dedication to 
                developing compassionate, capable individuals who will shape a better future for all. 
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">Milestones that shaped our legacy</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-17 items-start">
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

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center "
            >
              <div className='flex flex-col gap-x-7'>
              <img src="/images/mainphoto1.jpg" 
                alt="Journey" 
                className="w-full h-auto rounded-lg shadow-lg object-cover py-8 rounded-small"
              />
              <img src='/images/mainphoto1.jpg' className='py-9' />
               <img src='/images/mainphoto1.jpg' className='py-8' />
                <img src='/images/mainphoto1.jpg' className='py-8' />
                <img src='/images/mainphoto1.jpg' className='py-8' />
                <img src='/images/mainphoto1.jpg' className='py-8' />
              </div>
            </motion.div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-border/50 bg-card/50 backdrop-blur align-middle text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${value.color} mb-3 mx-auto flex items-center justify-center`}
                  >
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 ">{value.title}</h3>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Teacher's Testimonial</h2>
            
            <div className='flex flex-col gap-8 p-12'>
                <div className='flex gap-4'>
                  <img className='w-20 h-20 rounded-lg object-cover flex-shrink-0' src='/images/mainphoto1.jpg'/>
                  <p>"Watching students grow in confidence is the most rewarding part of teaching here."</p>
                  <img className='w-20 h-20 rounded-lg object-cover flex-shrink-0' src='/images/mainphoto1.jpg'/>
                  <p>"Witnessing students develop confidence and academic excellence is the most fulfilling aspect of my role as an educator."</p>
                </div>
                <div className='flex gap-4'>
                  <img className='w-20 h-20 rounded-lg object-cover flex-shrink-0' src='/images/mainphoto1.jpg'/>
                  <p>"Education is not only about imparting knowledge, but about nurturing character and self-belief."</p>
                  <img className='w-20 h-20 rounded-lg object-cover flex-shrink-0' src='/images/mainphoto1.jpg'/>
                  <p>"Each student’s success reflects our commitment to quality education."</p>
              </div>
              <div className='flex gap-4'>
                  <img className='w-20 h-20 rounded-lg object-cover flex-shrink-0' src='/images/mainphoto1.jpg'/>
                  <p>"Supporting students in their personal and academic growth is at the heart of my teaching philosophy."</p>
                  <img className='w-20 h-20 rounded-lg object-cover flex-shrink-0' src='/images/mainphoto1.jpg'/>
                  <p>"Observing students progress with confidence and competence is deeply rewarding."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
