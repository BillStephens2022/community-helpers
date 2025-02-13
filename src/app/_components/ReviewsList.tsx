"use client";

import { CldImage } from "next-cloudinary";
import styles from "./reviewsList.module.css";

interface Review {
  reviewText: string;
  reviewRating: number;
  reviewer: {
    profileImage?: string;
    firstName: string;
    lastName?: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  neighborName: string;
}

export default function ReviewsList({ reviews, neighborName }: ReviewsListProps) {
  return (
    <ul className={styles.reviews_list}>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <li key={index} className={styles.review_li}>
            <p className={styles.review_rating}>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < review.reviewRating ? "#FFD700" : "#ccc",
                    fontSize: "20px",
                  }}
                >
                  ★
                </span>
              ))}
            </p>
            <p className={styles.review_reviewText}>
              {review.reviewText} -
              {review.reviewer.profileImage && (
                <CldImage
                  src={review.reviewer?.profileImage}
                  alt="user's profile image"
                  radius={50}
                  width={25}
                  height={25}
                  crop={{ type: "thumb", gravity: "face" }}
                  className={styles.profileImage}
                />
              )}
              {review.reviewer?.firstName} {review.reviewer?.lastName?.slice(0, 1)}.
            </p>
          </li>
        ))
      ) : (
        <p className={styles.no_reviews_yet}>
          No reviews yet, be the first to review {neighborName}&apos;s work!
        </p>
      )}
    </ul>
  );
}