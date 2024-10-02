import styles from "./header.module.css";
import Navigation from "./Navigation";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.header_div}>
      
      <Link href="/" className={styles.header_link}>
        <h1 className={styles.header_h1}>Community Helpers</h1>
      </Link>
  
      <Navigation />
    </div>
  );
}
