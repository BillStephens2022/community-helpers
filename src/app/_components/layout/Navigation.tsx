"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styles from "./navigation.module.css";

export default function Navigation() {
  const { data: session } = useSession();
  const [isChecked, setIsChecked] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsChecked(false);
  };

  const handleLogoff = async () => {
    await signOut({ redirect: true, callbackUrl: "/" }); // Redirect to homepage after logging out
  };

  return (
    <>
      <div className={styles.navbar}>
        <input
          type="checkbox"
          className={styles.nav_checkbox}
          id="navi-toggle"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label htmlFor="navi-toggle" className={styles.nav_button}>
          <span className={styles.nav_icon}>&nbsp;</span>
        </label>
        <div className={styles.nav_background}></div>
        <nav className={styles.navbar_nav}>
          <ul className={styles.nav_items}>
            <li className={styles.nav_item}>
              <Link
                href="/"
                className={`${styles.nav_item} ${styles.nav_link} ${
                  pathname === "/" ? styles.active : ""
                }`}
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link
                href="/about"
                className={`${styles.nav_item} ${styles.nav_link} ${
                  pathname === "/about" ? styles.active : ""
                }`}
                onClick={handleLinkClick}
              >
                About
              </Link>
            </li>
            {session ? (
              <>
                <li className={styles.nav_item}>
                  <Link
                    href="/profile"
                    className={`${styles.nav_item} ${styles.nav_link} ${
                      pathname === "/profile" ? styles.active : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    Profile
                  </Link>
                </li>
                <li className={styles.nav_item}>
                  <Link
                    href="/community"
                    className={`${styles.nav_item} ${styles.nav_link} ${
                      pathname === "/community" ? styles.active : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    Community
                  </Link>
                </li>
                <li
                  className={`${styles.nav_item} ${styles.nav_logout_button}`}
                >
                  <button
                    type="button"
                    onClick={handleLogoff}
                    className={styles.navbar_logout}
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className={styles.navbar_login}>
                  Sign Up / Log In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
