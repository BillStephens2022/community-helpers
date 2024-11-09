import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import chlogo from "./images/chlogo.jpeg";

export default function Home() {
  return (
    <div className={styles.home_content}>
    <h2 className={styles.home_subheader}>Need a job done?</h2>
    <main className={styles.home_main}>      
      <div className={styles.home_left}>
        <Image
          className={styles.logo}
          src={chlogo}
          alt="Next.js logo"
          width={425}
          height={425}
          priority
        />
        <Link href="/login" className={styles.get_started_link}>
          Let&apos;s Go!
        </Link>
      </div>
      <div className={styles.home_right}>
        <h4 className={styles.home_h4}>
          Your neighbors have the skills you need!
        </h4>
        <ul className={styles.home_ul}>
          <li className={styles.home_li}>Handyman Services</li>
          <li className={styles.home_li}>Yard Work</li>
          <li className={styles.home_li}>House Cleaning</li>
          <li className={styles.home_li}>Child Care</li>
          <li className={styles.home_li}>Senior Care</li>
          <li className={styles.home_li}>Auto Repair</li>
          <li className={styles.home_li}>Technology</li>
          <li className={styles.home_li}>Dog Walking / Pet Sitting</li>
        </ul>
      </div>
    </main>
    </div>
  );
}
