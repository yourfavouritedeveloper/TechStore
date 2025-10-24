import React from 'react';
import styles from './Footer.module.css';
import Brand from '../../assets/branddark.png'

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
                    <a className={styles.mail} href="mailto:info.tech.store.ts@gmail.com">
                         info.tech.store.ts@gmail.com
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
         <img src={Brand} alt="TechStore" />
    </footer>

  );
};

export default Footer;