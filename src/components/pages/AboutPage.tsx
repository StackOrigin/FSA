import { motion } from 'motion/react';
import { Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import '../../styles/pages/AboutPage.css';

export function AboutPage() {
  const milestones = [
    {
      year: '2000',
      title: 'Foundation',
      description: 'FSA began its journey to provide quality eduction and inspire lifelong learning.',
    },
    {
      year: '2010',
      title: 'Growing Beyond Borders',
      description: 'Created opportunities and a positive atmosphere where everyone feel supported.',
    },
    {
      year: '2015',
      title: 'Smart Learning Era',
      description: 'Integrated modern technology to create interactive and effective learning.',
    },
    {
      year: '2020',
      title: 'Education for Tomorrow',
      description: 'Advancing with intelligent, personalized learning to prepare students for the future.',
    },
    {
      year: '2025',
      title: 'Centre for Creativity',
      description: 'Developed innovation spaces to encourage research, creativity.',
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

  const teacherTestimonials = [
    { img: './images/principal.jpg', text: '"Watching students grow in confidence is the most rewarding part of teaching here."' },
    { img: './images/mainphoto1.jpg', text: '"Education is not only about imparting knowledge, but about nurturing character and self-belief."' },
    { img: './images/mainphoto1.jpg', text: '"Each student\'s success reflects our commitment to quality education."' },
  ];

  const studentTestimonials = [
    { img: './images/mainphoto1.jpg', text: '"My teachers encourage me to think big and believe in myself."' },
    { img: './images/mainphoto1.jpg', text: '"Learning here is exciting — every lesson helps me discover something new."' },
    { img: './images/mainphoto1.jpg', text: '"Teachers here are very supportive, and the learning approach makes difficult subjects easy to understand."' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero"
      style={{backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('./images/mainphoto1.jpg')", backgroundSize:"cover", backgroundPosition:"center"}}>
        
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
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  className={`timeline-item${index % 2 !== 0 ? ' even' : ''}`}
                >
                  {/* Timeline dot */}
                  <div className="timeline-dot" />

                  <div className="timeline-content">
                    <div className="milestone-card">
                      <div className="milestone-year">{milestone.year}</div>
                      <h3 className="milestone-title">{milestone.title}</h3>
                      <p className="milestone-description">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            </div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="journey-images"
            >
              {[
                { src: './images/2000.jpg', alt: '2000' },
                { src: './images/2010.jpg', alt: '2010' },
                { src: './images/2015.jpg', alt: '2015' },
                { src: './images/2020.jpg', alt: '2020' },
                { src: './images/2025.jpg', alt: '2025' },
              ].map((img, i) => (
                <motion.img
                  key={img.alt}
                  src={img.src}
                  alt={`Journey ${img.alt}`}
                  className="journey-image"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                />
              ))}
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
                    whileHover={{ scale: 1.15, rotate: 360 }}
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

      {/* Testimonials: Teachers and Students */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="testimonials-title">Testimonials</h2>

            {/* Teachers */}
            <h3 className="testimonials-subtitle">Teachers</h3>
            <div className='teacher-testimonials'>
              {teacherTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`teacher-${index}`}
                  className='testimonial-row'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img className='testimonial-img' src={testimonial.img} alt="Teacher" />
                  <p>{testimonial.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Students */}
            <h3 className="testimonials-subtitle" style={{ marginTop: '2rem' }}>Students</h3>
            <div className='teacher-testimonials'>
              {studentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`student-${index}`}
                  className='testimonial-row'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img className='testimonial-img' src={testimonial.img} alt="Student" />
                  <p>{testimonial.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

