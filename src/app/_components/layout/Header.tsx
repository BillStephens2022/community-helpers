"use client";

import { useEffect } from "react";
import Navigation from "./Navigation";
import Link from "next/link";
import { useRecoilValue, useSetRecoilState } from "recoil"; // Import the hooks
import { usePathname } from "next/navigation"; // Import usePathname
import { headerTitleState } from "../../_atoms/headerAtom";
import styles from "./header.module.css";

export default function Header() {
  const pathname = usePathname();
  const setHeaderTitle = useSetRecoilState(headerTitleState); // Get the setter function

  // mapping of route paths to page header titles
  const routeTitles: { [key: string]: string } = {
    "/": "Community Helpers",
    "/about": "About Us",
    "/profile": "My Profile",
    "/community": "My Community",
  };

 // Update the title based on pathname
 useEffect(() => {
  let newTitle = "Community Helpers"; // Default title

  // Check for exact matches
  if (routeTitles[pathname]) {
    newTitle = routeTitles[pathname];
  } 
  // Check for dynamic routes like /neighbors/[id]
  else if (pathname.startsWith("/neighbors/")) {
    newTitle = "Neighbor Profile";
  }

  setHeaderTitle(newTitle);
}, [pathname, setHeaderTitle]);

  const headerTitle = useRecoilValue(headerTitleState);

  return (
    <div className={styles.header_div}>
      <Navigation />
      <Link href="/" className={styles.header_link}>
        <h1 className={styles.header_h1}>{headerTitle}</h1>
      </Link>
    </div>
  );
}
