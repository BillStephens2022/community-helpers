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
      <ProfileCard user={neighbor} isEditMode={false} />
    </div>
  );
}
