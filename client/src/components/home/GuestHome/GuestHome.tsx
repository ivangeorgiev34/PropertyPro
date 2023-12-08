import React from "react";
import styles from "./GuestHome.module.scss";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

export const GuestHome: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
  });
  return (
    <main>
      <section className={styles.introductionSection}>
        <div
          ref={ref}
          className={`${
            inView === true
              ? styles.introductionContentHidden
              : styles.introductionContent
          }`}
        >
          <span className={styles.motto}>PROPERTY RENTAL PORTAL</span>
          <h1>
            With PropertyPro you can now start renting your own house at any
            time, as much as you want.
          </h1>
          <p className={styles.introductionContentDescription}>
            Run your business in flexible times, with near to zero efforts, on a
            platform designed to help you get tenants who will rent your
            property.
          </p>
          <div className={styles.introductionBtnsContainer}>
            <Link to={"/register"} className={styles.introductionGetStartedBtn}>
              Get Started!
            </Link>
            <Link to={"/login"} className={styles.introductionSignInBtn}>
              Sign In!
            </Link>
          </div>
        </div>
        <img
          className={styles.introductionImage}
          src="https://thumbs.dreamstime.com/b/smiling-business-partners-shaking-hands-business-meeting-smiling-business-partners-shaking-hands-business-meeting-255723473.jpg"
          alt=""
        />
      </section>
      <section className={styles.benefitsSection}>
        <h2>Benefits of PropertyPro</h2>
        <p className={styles.benefitsDescription}>
          PropertyPro helps tenants and landlords connect and establish a
          connection, so that can both parties are satisfied.
        </p>
        <div className={styles.benefitCards}>
          <div
            ref={ref}
            className={
              inView === true ? styles.benefitCardHidden : styles.benefitCard
            }
          >
            <i className="fa-solid fa-chart-simple fa-2xl"></i>
            <h3>Easy to use</h3>
            <p className={styles.benefitCardDescription}>
              The PropertyPro platform is extemely simple to navigate through
              and work with. You do not need any experience in these types of
              platforms in order to work in this application.
            </p>
          </div>
          <div
            ref={ref}
            className={
              inView === true ? styles.benefitCardHidden : styles.benefitCard
            }
          >
            <i className="fa-solid fa-dollar-sign fa-2xl"></i>
            <h3>Completely free</h3>
            <p className={styles.benefitCardDescription}>
              PropertyPro is completely free of any fees or taxes, because we
              believe in delivering great products, without wanting anything in
              return.
            </p>
          </div>
          <div
            ref={ref}
            className={
              inView === true ? styles.benefitCardHidden : styles.benefitCard
            }
          >
            <i className="fa-solid fa-arrow-up-from-bracket fa-2xl"></i>
            <h3>Up to date</h3>
            <p className={styles.benefitCardDescription}>
              The app is reguarly checked for any bugs from our developers team,
              that can cause problems to our clients. We are always open to talk
              to if you find any bugs in our application.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.testimonialsSection}>
        <h2>Testimonials</h2>
        <p className={styles.testimonialsDescription}>
          If you are still not convinced, take it from some of our clients
        </p>
        <div className={styles.testimonialCards}>
          <div
            ref={ref}
            className={
              inView === true
                ? styles.testimonialCard
                : styles.testimonialCardHidden
            }
          >
            <img
              className={styles.testimonialCardPersonImage}
              src="https://thumbs.dreamstime.com/b/lovely-glamorous-young-woman-portrait-female-charm-emanating-beauty-stunning-girl-fabulous-alluring-night-party-make-up-92375002.jpg"
              alt=""
            />
            <span className={styles.testimonialPersonName}>
              Amanda Mitchell, Landlord
            </span>
            <p className={styles.testimonialContent}>
              I am so pleased with PropertyPro! I have searched for a more
              capable and functional property rental portal like this, and I
              could not find any better!
            </p>
            <ul className={styles.starsList}>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className="fa-solid fa-star"></i>
              </li>
            </ul>
          </div>
          <div
            ref={ref}
            className={
              inView === true
                ? styles.testimonialCard
                : styles.testimonialCardHidden
            }
          >
            <img
              className={styles.testimonialCardPersonImage}
              src="https://th.bing.com/th/id/OIP.FWc6rm8Cq7Xyddu1B0a90gHaGL?pid=ImgDet&w=575&h=480&rs=1"
              alt=""
            />
            <span className={styles.testimonialPersonName}>
              Matthew Tracy, Tenant
            </span>
            <p className={styles.testimonialContent}>
              Back when I didn't know about PropertyPro, I was helplessly
              searching for a holiday destination in which me and my family
              could go to. But when I found out about ProeprtyPro everything
              changed!
            </p>
            <ul className={styles.starsList}>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
            </ul>
          </div>
          <div
            ref={ref}
            className={
              inView === true
                ? styles.testimonialCard
                : styles.testimonialCardHidden
            }
          >
            <img
              className={styles.testimonialCardPersonImage}
              src="https://th.bing.com/th/id/OIP.7RmDMjUBWeG0zOk9f8I1UAHaLF?pid=ImgDet&w=183&h=274&c=7"
              alt=""
            />
            <span className={styles.testimonialPersonName}>
              John Curry, Landlord
            </span>
            <p className={styles.testimonialContent}>
              I have been searching for this type of platform for ages! A year
              ago I found the perfect one, and that is PropertyPro, which has
              helped me a ton in getting more customers over the past year.
            </p>
            <ul className={styles.starsList}>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className={`fa-solid fa-star ${styles.yellowStar}`}></i>
              </li>
              <li>
                <i className="fa-solid fa-star"></i>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};
