import styles from "./header.module.css";
import Navigation from "./Navigation";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.header_div}>
      <h1 className={styles.header_h1}>
        <Link href="/">Community Helpers</Link>
      </h1>
      <Navigation />
    </div>
  );
}
