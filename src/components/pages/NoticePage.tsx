import { motion } from 'motion/react';
import { useState } from 'react';
import '../../styles/pages/NoticePage.css';

export function NoticePage() {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="notice-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="notice-hero-content"
        >
          <h1 className="notice-hero-title">
            Notice Module
          </h1>
          <p className="notice-hero-description">
            "Notices are subject to change. Stay updated for important information."
          </p>
        </motion.div>
      </section>

      {/* Subjects Grid */}
      <section className="notice-programs-section">
        <div className="notice-programs-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="notice-programs-header"
          >
            <h2 className="notice-programs-title">Our Programs</h2>
            <p className="notice-programs-subtitle">Click on any subject to Download notice</p>
          </motion.div>
        </div>
      </section>


      {/* Notices */}
      <section className="notice-updates-section">
        <li className="notice-month-title">Magh Month Updates</li>
        <div className="notice-images-row">
          <img src='/images/vacancy3.jpg' className="notice-image" />
          <img src='/images/vacancy3.jpg' className="notice-image" />
        </div>

        <li className="notice-month-title">Falgun Month Updates</li>
        <div className="notice-images-row">
          <img src='/images/vacancy3.jpg' className="notice-image" />
          <img src='/images/vacancy.jpg' className="notice-image" />
        </div>
      </section>

      

      {/* Learning Approach */}
      <section className="notice-approach-section">
        <div className="notice-approach-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="notice-approach-header"
          >
            <h2 className="notice-approach-title">Our Teaching Approach</h2>
            <p className="notice-approach-subtitle">Student-centered learning for the 21st century</p>
          </motion.div>

          <div className="notice-approach-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="notice-approach-card blue">
                <h3 className="notice-approach-card-title">Personalized Learning</h3>
                <p className="notice-approach-card-description">
                  We recognize that every student learns differently. Our teachers use differentiated instruction, adaptive technology, and individualized support to ensure each student reaches their full potential.
                </p>
                <ul className="notice-approach-list">
                  <li className="notice-approach-list-item">
                    <span className="notice-approach-bullet blue" />
                    <span>Small class sizes for personalized attention</span>
                  </li>
                  <li className="notice-approach-list-item">
                    <span className="notice-approach-bullet blue" />
                    <span>Adaptive learning technologies</span>
                  </li>
                  <li className="notice-approach-list-item">
                    <span className="notice-approach-bullet blue" />
                    <span>Regular progress assessments</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="notice-approach-card purple">
                <h3 className="notice-approach-card-title">Project-Based Learning</h3>
                <p className="notice-approach-card-description">
                  Students engage in real-world projects that develop critical thinking, collaboration, and problem-solving skills. Learning becomes an active, engaging experience.
                </p>
                <ul className="notice-approach-list">
                  <li className="notice-approach-list-item">
                    <span className="notice-approach-bullet purple" />
                    <span>Hands-on, collaborative projects</span>
                  </li>
                  <li className="notice-approach-list-item">
                    <span className="notice-approach-bullet purple" />
                    <span>Real-world problem solving</span>
                  </li>
                  <li className="notice-approach-list-item">
                    <span className="notice-approach-bullet purple" />
                    <span>Interdisciplinary learning</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
