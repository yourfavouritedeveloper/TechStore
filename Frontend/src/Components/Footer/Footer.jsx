import React from 'react';
import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';
import Brand from "../../../public/brandlogowhite.png";

function Footer() {

    const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <p className={styles.title}>FIND A STORE</p>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link} onClick={(e) => {
                e.preventDefault();
                navigate("/login", { state: { sign: true } });
                }}>Become A Member</a></li>
              <li>
                <a
                    href="#"
                    className={styles.link}
                    onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                    }}
                >
                    Sign Up for Username
                </a>
                </li>
              <li><a  href="mailto:info.tech.store.ts@gmail.com"
                className={styles.link}>Send Us Feedback</a></li>
              <li><a href="#" className={styles.link} onClick={(e) => {
                e.preventDefault();
                navigate("/campaign");
                }}>Student Discounts</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <p className={styles.title}>GET HELP</p>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>Delivery</a></li>
              <li><a href="#" className={styles.link}>Returns</a></li>
              <li><a href="#" className={styles.link}>Payment Options</a></li>
              <li><a href="#" className={styles.link}  onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
                }}>Contact Us</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <p className={styles.title}>ABOUT TECHSTORE</p>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>News</a></li>
              <li><a href="#" className={styles.link}>Careers</a></li>
              <li><a href="#" className={styles.link}>Investors</a></li>
              <li><a href="#" className={styles.link}>Sustainability</a></li>
            </ul>
          </div>
                
          <div className={styles.column}>
            <img className={styles.brand} src={Brand} alt="" />
          </div>

        </div>

        <div className={styles.bottomBar}>
          <div className={styles.bottomLeft}>
            <span>© 2025 TechStore</span>
            <span>Azerbaijan</span>
          </div>
          <div className={styles.bottomRight}>
            <a href="#" className={styles.link}>Guides</a>
            <a href="#" className={styles.link}>Terms of Sale</a>
            <a href="#" className={styles.link}>Terms of Use</a>
            <a href="#" className={styles.link}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;