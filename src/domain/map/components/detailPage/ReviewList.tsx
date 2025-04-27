import React from "react";

interface Review {
  id: number;
  name: string;
  title: string;
  rating: number;
  content: string;
  photoDir: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>리뷰</h3>
      {reviews.length === 0 ? (
        <p style={styles.noReview}>아직 작성된 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={styles.reviewCard}>
            <p style={styles.name}>{review.name}</p>
            <img src={review.photoDir} />
            <p style={styles.title}>{review.title}</p>
            <p style={styles.rating}>{review.rating}</p>
            <p style={styles.content}>{review.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "16px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  noReview: {
    fontSize: "14px",
    color: "#999",
  },
  reviewCard: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  author: {
    fontWeight: "bold",
    marginBottom: "4px",
  },
  content: {
    marginBottom: "4px",
  },
  date: {
    fontSize: "12px",
    color: "#aaa",
  },
};

export default ReviewList;
