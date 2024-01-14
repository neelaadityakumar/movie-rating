import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MovieDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movieDetails, setMovieDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReviews, setEditingReviews] = useState({});

  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        return;
      }
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        setMovieDetails(data);

        // Fetch and set movie reviews
        const reviewsRes = await fetch(`/api/reviews?movieId=${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error);
      }
    };

    fetchMovieDetails();
  }, [id, editingReviews]);

  const handleEditReview = (reviewId) => {
    setEditingReviews((prevEditingReviews) => ({
      ...prevEditingReviews,
      [reviewId]: true,
    }));

    // Save the current review data to editedData
    const reviewToEdit = reviews.find((review) => review._id === reviewId);
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [reviewId]: { ...reviewToEdit },
    }));
  };

  const handleCancelEdit = (reviewId) => {
    setEditingReviews((prevEditingReviews) => ({
      ...prevEditingReviews,
      [reviewId]: false,
    }));

    // Clear the edited data for the canceled review
    setEditedData((prevEditedData) => {
      const { [reviewId]: omit, ...rest } = prevEditedData;
      return rest;
    });
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData[reviewId]),
      });

      if (!res.ok) {
        console.error(`Failed to update review with ID ${reviewId}`);
        return;
      }
    } catch (error) {
      console.error(`Error updating review with ID ${reviewId}:`, error);
    }
    window.location.reload();
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error(`Failed to delete review with ID ${reviewId}`);
        return;
      }

      console.log(`Review with ID ${reviewId} deleted successfully`);

      // Refresh reviews after deletion
      const reviewsRes = await fetch(`/api/reviews?movieId=${id}`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
    } catch (error) {
      console.error(`Error deleting review with ID ${reviewId}:`, error);
    }
  };

  return (
    <div className="container px-4 lg:px-6 mx-auto">
      {movieDetails ? (
        <>
          {/* ... */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl lg:text-4xl font-400 mb-6 mt-10">
              {movieDetails.name}
            </h1>
            {movieDetails?.averageRating && (
              <p className="text-2xl lg:text-4xl font-400 text-[#6459F5]">
                {" "}
                {movieDetails.averageRating}/10
              </p>
            )}{" "}
          </div>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="border-gray-100 border-2 p-4 rounded mb-4"
              >
                {editingReviews[review._id] ? (
                  <>
                    <label>
                      Reviewer Name:
                      <input
                        type="text"
                        className="border border-black ml-4 mt-2"
                        value={
                          editedData[review._id]?.reviewerName ||
                          review.reviewerName
                        }
                        onChange={(e) =>
                          setEditedData((prevEditedData) => ({
                            ...prevEditedData,
                            [review._id]: {
                              ...prevEditedData[review._id],
                              reviewerName: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Rating:
                      <input
                        className="border border-black ml-4 mt-2"
                        type="number"
                        value={editedData[review._id]?.rating || review.rating}
                        onChange={(e) =>
                          setEditedData((prevEditedData) => ({
                            ...prevEditedData,
                            [review._id]: {
                              ...prevEditedData[review._id],
                              rating: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Comments:
                      <textarea
                        className="border border-black ml-4 mt-2"
                        value={
                          editedData[review._id]?.comments || review.comments
                        }
                        onChange={(e) =>
                          setEditedData((prevEditedData) => ({
                            ...prevEditedData,
                            [review._id]: {
                              ...prevEditedData[review._id],
                              comments: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <br />
                    <button
                      className="mr-4 text-red-400"
                      onClick={() => handleCancelEdit(review._id)}
                    >
                      Cancel
                    </button>

                    <button
                      className="mr-4 text-green-400"
                      onClick={() => handleUpdateReview(review._id)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <p>{review.comments}</p>
                      <p>{review.rating}/10</p>
                    </div>
                    <div className="flex justify-between mt-5">
                      <p>
                        By{" "}
                        <span className="italic"> {review.reviewerName}</span>
                      </p>{" "}
                      <div className="space-x-2">
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEditReview(review._id)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteReview(review._id)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No reviews available for this movie.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MovieDetails;
