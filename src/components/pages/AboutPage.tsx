import { motion } from 'motion/react';
import { Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import '../../styles/pages/AboutPage.css';

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
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero"
      style={{backgroundImage:"url('/images/mainphoto1.jpg')", backgroundSize:"cover", backgroundPosition:"center "}}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="about-hero-content"
        >
          <h1 className="about-hero-title">
            About Our Future Stars
          </h1>
          
        </motion.div>
        
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="mission-vision-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mission-card">
              <div className="card-icon blue">
                <Target />
              </div>
              <h2 className="card-title">Our Mission</h2>
              <p className="card-description">
                To provide a transformative educational experience that empowers every student to reach their full potential, 
                think critically, and make meaningful contributions to society. 
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="vision-card">
              <div className="card-icon purple">
                <Eye />
              </div>
              <h2 className="card-title">Our Vision</h2>
              <p className="card-description">
                To be a global leader in education, recognized for excellence in teaching, innovation in learning, and dedication to 
                developing compassionate, capable individuals who will shape a better future for all. 
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="timeline-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="timeline-header"
          >
            <h2 className="timeline-title">Our Journey</h2>
            <p className="timeline-subtitle">Milestones that shaped our legacy</p>
          </motion.div>

          <div className="timeline-grid">
            <div className="timeline-wrapper">
            {/* Timeline line */}
            <div className="timeline-line" />

            <div className="timeline-items">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: index * 0.2 }}
                  className={`timeline-item ${index % 2 !== 0 ? 'even' : ''}`}
                >
                  {/* Timeline dot */}
                  <div className="timeline-dot" />

                  <div className="timeline-content">
                    {index % 2 === 0 && (
                      <div className="milestone-card">
                        <div className="milestone-year">
                          {milestone.year}
                        </div>
                        <h3 className="milestone-title">{milestone.title}</h3>
                        <p className="milestone-description">{milestone.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="timeline-content">
                    {index % 2 !== 0 && (
                      <div className="milestone-card">
                        <div className="milestone-year">
                          {milestone.year}
                        </div>
                        <h3 className="milestone-title">{milestone.title}</h3>
                        <p className="milestone-description">{milestone.description}</p>
                      </div>
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
              className="journey-images"
            >
              <div className="journey-images">
              <motion.img 
                src="/images/mainphoto1.jpg" 
                alt="Journey" 
                className="journey-image"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0 }}
              />
              <motion.img 
                src='/images/mainphoto1.jpg' 
                className='journey-image'
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
              <motion.img 
                src='/images/mainphoto1.jpg' 
                className='journey-image'
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
              <motion.img 
                src='/images/mainphoto1.jpg' 
                className='journey-image'
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />
              <motion.img 
                src='/images/mainphoto1.jpg' 
                className='journey-image'
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="values-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="values-header"
          >
            <h2 className="values-title">Our Core Values</h2>
            <p className="values-subtitle">The principles that guide everything we do</p>
          </motion.div>

          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="value-card">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="value-icon"
                    style={{background: `linear-gradient(to bottom right, #3b82f6, #a855f7, #ec4899)`}}
                  >
                  </motion.div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="testimonials-section">
        <div className="testimonials-container" style={{textAlign: 'center'}}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="testimonials-title">Teacher's Testimonial</h2>
            
            <div className='teacher-testimonials'>
                <div className='testimonial-row'>
                  <img className='testimonial-img' src='/images/mainphoto1.jpg'/>
                  <p>"Watching students grow in confidence is the most rewarding part of teaching here."</p>
                  <img className='testimonial-img' src='/images/mainphoto1.jpg'/>
                  <p>"Witnessing students develop confidence and academic excellence is the most fulfilling aspect of my role as an educator."</p>
                </div>
                <div className='testimonial-row'>
                  <img className='testimonial-img' src='/images/mainphoto1.jpg'/>
                  <p>"Education is not only about imparting knowledge, but about nurturing character and self-belief."</p>
                  <img className='testimonial-img' src='/images/mainphoto1.jpg'/>
                  <p>"Each student’s success reflects our commitment to quality education."</p>
              </div>
              <div className='testimonial-row'>
                  <img className='testimonial-img' src='/images/mainphoto1.jpg'/>
                  <p>"Supporting students in their personal and academic growth is at the heart of my teaching philosophy."</p>
                  <img className='testimonial-img' src='/images/mainphoto1.jpg'/>
                  <p>"Observing students progress with confidence and competence is deeply rewarding."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

