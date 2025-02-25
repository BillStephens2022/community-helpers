"use client";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { useState } from "react";
import { useParams } from "next/navigation";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  userState,
  usersState,
  usersLoadingState,
} from "../../_atoms/userAtom";
import Loader from "../../_components/ui/Loader";
import ProfileCard from "../../_components/ProfileCard";
import styles from "./neighbors.module.css";
import Button from "@/app/_components/ui/Button";
import { addUserReview } from "@/app/_utils/api/users";
import ReviewsList from "@/app/_components/ReviewsList";

export default function Neighbors() {
  const { id: neighborId } = useParams();
  const loggedInUser = useRecoilValue(userState);
  const neighbors = useRecoilValue(usersState);
  const setUsers = useSetRecoilState(usersState);
  const loading = useRecoilValue(usersLoadingState);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");

  const neighbor = neighbors?.find((user) => user._id === neighborId);

  if (loading) return <Loader />;

  if (!loggedInUser) return <div>Access Denied</div>;
  if (!neighbor) return <div>Neighbor not found</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewText.trim() || reviewRating === 0 || !loggedInUser) {
      alert("Please provide a review and select a rating.");
      return;
    }

    const newReview = {
      reviewText,
      reviewRating,
      reviewer: loggedInUser._id,
    };

    try {
      console.log("Updated service being sent to api:", newReview);
      // Send the updated reviews array to the server to update the user in database
      const updatedUser = await addUserReview(neighbor._id, newReview);
      console.log("Updated user from API response:", updatedUser);
      if (!updatedUser) {
        throw new Error("Failed to update reviews.");
      }

      // Update state with the new user data from API response
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === neighborId ? updatedUser : user))
      );

      // Reset form
      setReviewText("");
      setReviewRating(0);
      setShowReviewForm(false);
      setError("");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating the user.");
    }
  };

  return (
    <div className={styles.neighbor_page}>
      <div className={styles.profile_and_testimonials}>
        <ProfileCard user={neighbor} isEditMode={false} />
        <div className={styles.reviews}>
          <h2 className={styles.section_header}>Reviews</h2>
          <h4 className={styles.section_subheader}>
            <IoMdAddCircleOutline
              size={24}
              onClick={() => setShowReviewForm(!showReviewForm)}
            />
            Add a Review
          </h4>
          {showReviewForm && (
            <form className={styles.review_form} onSubmit={handleSubmit}>
              <label className={styles.review_form_label} htmlFor="review">
                Review:
              </label>
              <textarea
                className={styles.review_form_textarea}
                id="review"
                name="review"
                rows={4}
                cols={50}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
              <label className={styles.review_form_label}>Rating:</label>
              <div className={styles.star_rating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={styles.star}
                    onClick={() => setReviewRating(star)} // Set the rating when clicked
                    onMouseEnter={() => setHoverRating(star)} // Hover effect
                    onMouseLeave={() => setHoverRating(0)} // Reset hover when leaving
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color:
                        star <= (hoverRating || reviewRating)
                          ? "#FFD700"
                          : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.form_error}>{error}</div>
              <div className={styles.buttons_div}>
                <Button type="submit">Submit</Button>
                <Button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          <ReviewsList reviews={neighbor.reviews || []} neighborName={neighbor.firstName} />
        </div>
      </div>
    </div>
  );
}
