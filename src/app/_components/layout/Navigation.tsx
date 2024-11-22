"use client";

import Link from "next/link";
import styles from "./navigation.module.css";
import { signOut, useSession } from "next-auth/react";


export default function Navigation() {
  const {data: session } = useSession();

  const handleLogoff = async () => {
    await signOut({ redirect: true, callbackUrl: "/" }); // Redirect to homepage after logging out
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar_ul}>
        <li>
          <Link href="/about" className={styles.navbar_link}>
            About
          </Link>
        </li>
        {session ? (
          <>
            <li>
              <Link href="/profile" className={styles.navbar_link}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/community" className={styles.navbar_link}>
                Community
              </Link>
            </li>
            <li>
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
  );
}
