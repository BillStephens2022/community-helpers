"use client";

import { useRecoilValue } from "recoil";
import {
  userState,
  usersState,
  usersLoadingState,
} from "../../_atoms/userAtom";
import Loader from "../../_components/ui/Loader";
import { CldImage } from "next-cloudinary";
import styles from "./neighbors.module.css";
import { useParams } from "next/navigation";
import ProfileCard from "@/app/_components/ProfileCard";

export default function Neighbors() {
  const { id: neighborId } = useParams();
  const loggedInUser = useRecoilValue(userState);
  const neighbors = useRecoilValue(usersState);
  const loading = useRecoilValue(usersLoadingState);

  const neighbor = neighbors.find((user) => user._id === neighborId);

  if (loading) return <Loader />;

  if (!loggedInUser) return <div>Access Denied</div>;
  if (!neighbor) return <div>Neighbor not found</div>;

  return (
    <div className={styles.neighbor_page}>
      <h2 className={styles.section_header} style={{textAlign:"center", background: "white", padding: "1rem"}}>*** This page is a Work in Progress ***</h2>
      <div className={styles.profile_and_pricing}>
        <ProfileCard user={neighbor} isEditMode={false} />
        <div className={styles.pricing}>
          <h2 className={styles.section_header}>Pricing</h2>
          <ul>
            <li>Placeholder item 1: $25.00</li>
            <li>Placeholder item 2: $50.00</li>
            <li>Placeholder item 3: $75.00</li>
          </ul>
        </div>
      </div>
      <div className={styles.testimonials}>
      <h2 className={styles.section_header}>Testimonials</h2>
      <ul>
        <li>Testimonial 1</li>
        <li>Testimonial 2</li>
        <li>Testimonial 3</li>
      </ul>
      </div>
    </div>
  );
}
