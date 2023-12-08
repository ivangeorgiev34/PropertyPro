import React from "react";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  return (
    <footer id={styles.footer}>
      <span>© 2023 PropertyPro</span>
      <ul className={styles.socialsList}>
        <li>
          <a href="https://www.facebook.com/">
            <i className="fa-brands fa-square-facebook fa-2xl"></i>
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/">
            <i className="fa-brands fa-square-instagram fa-2xl"></i>
          </a>
        </li>
        <li>
          <a href="https://www.twitter.com/">
            <i className="fa-brands fa-square-twitter fa-2xl"></i>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/">
            <i className="fa-brands fa-square-youtube fa-2xl"></i>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/">
            <i className="fa-brands fa-linkedin fa-2xl"></i>
          </a>
        </li>
      </ul>
    </footer>
  );
};
