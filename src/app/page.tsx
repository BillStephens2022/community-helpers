"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import chlogo from "./images/chlogo.jpeg";
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  const user = session?.user?.name;

  return (
    <div className={styles.home_content}>
    <h2 className={styles.home_subheader}>Need a job done?</h2>
    <main className={styles.home_main}>      
      <div className={styles.home_left}>
        <Image
          className={styles.logo}
          src={chlogo}
          alt="Community Helpers logo"
          width={425}
          height={425}
          priority
        />
        {session ? (<h2 className={styles.welcome_message}>Welcome back, {user}!</h2>) : (<Link href="/login" className={styles.get_started_link}>
          Let&apos;s Go!
        </Link>)}
      </div>
      <div className={styles.home_right}>
        <h4 className={styles.home_h4}>
          Your neighbors have the skills you need!
        </h4>
        <ul className={styles.home_ul}>
          <li className={styles.home_li}>Handyman Services</li>
          <li className={styles.home_li}>Landscaping</li>
          <li className={styles.home_li}>Housekeeping</li>
          <li className={styles.home_li}>Child / Senior</li>
          <li className={styles.home_li}>Dog Walking / Pet Sitting</li>
          <li className={styles.home_li}>Auto Repair</li>
          <li className={styles.home_li}>Technology</li>
          <li className={styles.home_li}>Tutoring</li>
        </ul>
      </div>
    </main>
    </div>
  );
}
