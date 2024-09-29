import Image from "next/image";
import styles from "./page.module.css";
import chlogo from "./images/chlogo.jpeg";
import Header from "./_components/layout/Header";
import Footer from "./_components/layout/Footer";
import LoginButton from "./_components/ui/LoginButton";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.home_left}>
          <Image
            className={styles.logo}
            src={chlogo}
            alt="Next.js logo"
            width={500}
            height={500}
            priority
          />
          <LoginButton>Let's Go!</LoginButton>
        </div>
        <div className={styles.home_right}>
        <h3 className={styles.home_h3}>Need a job done?</h3>
        <h4 className={styles.home_h4}>
          Your community has the skills you need!
        </h4>
        <ul className={styles.home_ul}>
          <li className={styles.home_li}>Handyman Services</li>
          <li className={styles.home_li}>Yard Work</li>
          <li className={styles.home_li}>House Cleaning</li>
          <li className={styles.home_li}>Child Care</li>
          <li className={styles.home_li}>Senior Care</li>
          <li className={styles.home_li}>Auto Repair</li>
          <li className={styles.home_li}>Computer Repair</li>
          <li className={styles.home_li}>Dog Walking / Pet Sitting</li>
        </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
