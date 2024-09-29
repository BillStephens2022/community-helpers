import Link from "next/link";
import styles from "./footer.module.css";

export default function Header() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      <p>Copyright &copy; {currentYear} <Link className={styles.link} href="https://billstephens2022.github.io/my_portfolio/">Bill Stephens</Link></p>
    </div>
  );
}
