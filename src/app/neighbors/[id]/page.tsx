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
      <div className={styles.neighbor_header_div}>
        <div className={styles.neighbor_image_div}>
          {neighbor.profileImage && (
            <CldImage
              src={neighbor.profileImage}
              alt="sample image"
              width={120}
              height={120}
              crop={{
                type: "auto", // Transform the image: auto-crop to square aspect_ratio
                source: true,
              }}
              radius={150}
            />
          )}
        </div>
        <h1 className={styles.neighbor_header}>
          {neighbor.firstName} {neighbor.lastName}
        </h1>
      </div>
      <h2 className={styles.neighbor_wip}>*** This Page is a work in Progress ***</h2>
    </div>
  );
}
