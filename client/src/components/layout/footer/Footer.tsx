import React from "react";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
    return (
        <footer id={styles.footer}>
            <span>© 2023 PropertyPro</span>
            <ul className={styles.socialsList}>
                <li><i className="fa-brands fa-square-facebook fa-2xl"></i></li>
                <li><i className="fa-brands fa-square-instagram fa-2xl"></i></li>
                <li><i className="fa-brands fa-square-twitter fa-2xl"></i></li>
                <li><i className="fa-brands fa-square-youtube fa-2xl"></i></li>
                <li><i className="fa-brands fa-linkedin fa-2xl"></i></li>
            </ul>
        </footer>
    );
};