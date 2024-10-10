"use client"

import { useEffect } from "react";
import Navigation from "./Navigation";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from 'recoil'; // Import the hooks
import { usePathname } from "next/navigation"; // Import usePathname
import { headerTitleState } from "../../_atoms/headerAtom"
import styles from "./header.module.css";


export default function Header() {
  const pathname = usePathname();
  const setHeaderTitle = useSetRecoilState(headerTitleState); // Get the setter function

  // Create a mapping of route paths to page header titles
  const routeTitles: { [key: string]: string } = {
    '/': 'Community Helpers',
    '/about': 'About Us',
    '/profile': 'My Profile',
    '/community': 'My Community',
  };

  // Update the title based on pathname when the component mounts
  useEffect(() => {
    const newTitle = routeTitles[pathname] || 'Community Helpers'; // Default title
    setHeaderTitle(newTitle); // Update the header title in the atom
  }, [pathname, setHeaderTitle]);

  const headerTitle = useRecoilValue(headerTitleState);

  return (
    <div className={styles.header_div}>
      
      <Link href="/" className={styles.header_link}>
        <h1 className={styles.header_h1}>{headerTitle}</h1>
      </Link>
  
      <Navigation />
    </div>
  );
}
