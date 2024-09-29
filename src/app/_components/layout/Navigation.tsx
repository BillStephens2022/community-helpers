import Link from "next/link";
import styles from "./navigation.module.css";

export default async function Navigation() {

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar_ul}>
        <li>
          <Link href="/about" className={styles.navbar_link}>
            About
          </Link>
        </li>
        <li>
          <Link href="/login" className={styles.navbar_link}>
            Log in / Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  );
}