import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
        <div className={styles.content}>
            <div className={styles.left}>
                <p>&copy; {currentYear} Tech Store. All rights reserved.</p>
            </div>
            <div className={styles.right}>
                <p>Contact us:</p>
                <div className={styles.contacts}>
                    <a className={styles.mail} href="mailto:nihad.mammadov.16@gmail.com">
                         nihad.mammadov.16@gmail.com
                    </a>
                    <a
                    className={styles.number}
                    href="https://wa.me/994508514536"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                        +994 50 851 45 36
                    </a>
                </div>
            </div>
        </div>
    </footer>

  );
};

export default Footer;