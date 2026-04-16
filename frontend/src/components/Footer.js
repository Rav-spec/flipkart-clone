import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container footer-grid">

        {/* About */}
        <div className="footer-col">
          <h4>ABOUT</h4>
          <ul>
            <li><Link to="/">Contact Us</Link></li>
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Flipkart Stories</Link></li>
            <li><Link to="/">Press</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="footer-col">
          <h4>HELP</h4>
          <ul>
            <li><Link to="/">Payments</Link></li>
            <li><Link to="/">Shipping</Link></li>
            <li><Link to="/">Cancellation & Returns</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>

        {/* Policy */}
        <div className="footer-col">
          <h4>POLICY</h4>
          <ul>
            <li><Link to="/">Return Policy</Link></li>
            <li><Link to="/">Terms of Use</Link></li>
            <li><Link to="/">Security</Link></li>
            <li><Link to="/">Privacy</Link></li>
            <li><Link to="/">Sitemap</Link></li>
          </ul>
        </div>

        {/* Sell / Connect */}
        <div className="footer-col">
          <h4>SOCIAL</h4>
          <ul>
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <FiGithub size={13} style={{ marginRight: 6 }} />GitHub
              </a>
            </li>
            <li>
              <a href="mailto:support@flipkart.com">
                <FiMail size={13} style={{ marginRight: 6 }} />support@flipkart.com
              </a>
            </li>
            <li>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'inherit' }}>
                <FiPhone size={13} />1800-202-9898
              </span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    {/* Footer Bottom */}
    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <div className="footer-brand">
          <span>🛒</span>
          <span><strong>Flipkart</strong> Clone — SDE Intern Assignment</span>
        </div>
        <span>© {new Date().getFullYear()} Flipkart Clone. Built with React &amp; Node.js</span>
      </div>
    </div>
  </footer>
);

export default Footer;
