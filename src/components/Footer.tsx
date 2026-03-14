import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin} from 'lucide-react';
import '../styles/Footer.css';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const footerLinks = {
    'Quick Links': [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Notices', path: '/notice' },   
      { label: 'Admissions', path: '/admissions' },
    ],
    'Resources': [
      { label: 'Events', path: '/events' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Contact', path: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/futurestars.acdmy' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/futurestarsacademylalitpur/' },
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@futurestarsacademy1727' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="footer-logo"
            >
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="footer-logo-icon">
                  <img src='./images/logo.png'></img>
                <div className="footer-logo-text">FSA</div>
                </div>
              </Link>
            </motion.div>
            <p className="footer-description">
              Knowledge Brings Humanity
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="footer-social-link"
                  aria-label={social.label}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-links-section">
              <h3>{title}</h3>
              <ul className="footer-links-list">
                {links.map((link, index) => (
                  <li key={index}>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link
                        to={link.path}
                        className="footer-link"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="footer-contact-item">
              <MapPin />
              <a href='https://maps.app.goo.gl/C6PUG1oVfXRaJppy6'>Lubhu,Lalitpur</a>
            </div>
            <div className="footer-contact-item">
              <Phone />
              <a href="tel:015580754">015580754,</a>
              <a href="tel:9761692981">9761692981,</a>
              <a href="tel: 9841281367">9841281367</a>
            </div>
            <div className="footer-contact-item">
              <Mail />
              <a href="mailto:futurestarsacd@gmail.com">futurestarsacd@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2026 FutureStarsAcademy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
