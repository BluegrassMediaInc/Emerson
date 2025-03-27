import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageCircle, X } from "lucide-react";
import Header from "./Header";
import { getContentByIdApi, clearSelectedContent } from "../store/slices/contentSlice";
import { addRatingApi, listRatingsApi, clearRatingMsg } from "../store/slices/ratingSlice";
import ProfileImg from "../assets/Profile.jfif";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: contentLoading, error: contentError, selectedContent } = useSelector((state) => state.content);
  const { loading: ratingLoading, error: ratingError, message: ratingMessage, ratings, averageRating, totalRatings } = useSelector((state) => state.rating);
  const { userInfo } = useSelector((state) => state.auth);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    if (id) {
      dispatch(getContentByIdApi(id));
      dispatch(listRatingsApi(id));
    }
    return () => {
      dispatch(clearSelectedContent());
      dispatch(clearRatingMsg());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (ratingMessage === "Rating added successfully") {
      setShowRatingModal(false);
      dispatch(clearRatingMsg());
      dispatch(listRatingsApi(id));
    }
  }, [ratingMessage, dispatch, id]);

  const handleRatingChange = (value) => {
    setRatingForm(prev => ({ ...prev, rating: value }));
  };

  const handleCommentChange = (e) => {
    setRatingForm(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitRating = () => {
    dispatch(addRatingApi({ id, ...ratingForm }));
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Header />
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-[60vh] bg-slate-700"></div>
            <div className="container mx-auto px-4 py-8">
              <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-slate-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (contentError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">{contentError}</div>
            <button
              onClick={() => navigate("/content")}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Back to Content List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedContent) {
    return null;
  }

  const displayedRatings = showAllRatings ? ratings : ratings.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header />
      <div className="w-full">
        {/* Hero Image Section */}
        {/* <div className="relative w-full h-[60vh]">
          {selectedContent.mediaUrl ? (
            <>
            <img
              crossorigin='anonymous'
              src={selectedContent.mediaUrl.startsWith('http') 
                ? selectedContent.mediaUrl 
                : `${import.meta.env.VITE_IMAGE_BASE_URL}${selectedContent.mediaUrl}`}
              alt={selectedContent.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-4xl text-white">
                    {selectedContent.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-white text-xl font-semibold">{selectedContent.title}</h2>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          <button
            onClick={() => navigate("/content")}
            className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>
        </div> */}

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Image Section */}
            <div className="relative h-[400px] md:h-[500px]">
              {selectedContent.mediaUrl ? (
                <img
                  crossorigin='anonymous'
                  src={selectedContent.mediaUrl.startsWith('http') 
                    ? selectedContent.mediaUrl 
                    : `${import.meta.env.VITE_IMAGE_BASE_URL}${selectedContent.mediaUrl}`}
                  alt={selectedContent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-4xl text-white">
                        {selectedContent.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-white text-xl font-semibold">{selectedContent.title}</h2>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              
              {/* Back Button with Blurred Background */}
              <div className="absolute top-4 left-4 z-20">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors text-white"
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 lg:p-12">
              {/* Title and Rating */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                  {selectedContent.title}
                </h1>
                <div className="flex items-center gap-4">
                  {averageRating && (
                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="text-slate-800 font-medium">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {userInfo && userInfo._id !== selectedContent.userId && (
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Rate Content
                    </button>
                  )}
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex items-center mb-8">
                <img
                  crossorigin='anonymous'
                  src={selectedContent?.userDetails?.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}${selectedContent?.userDetails?.avatar}` : ProfileImg}
                  alt={selectedContent?.userDetails?.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-slate-800 font-medium">{selectedContent?.userDetails?.name}</p>
                  <p className="text-slate-500 text-sm">
                    {new Date(selectedContent.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-slate-700 leading-relaxed text-lg">{selectedContent.description}</p>
              </div>

              {/* Ratings Section */}
              {ratings && ratings.length > 0 && (
                <div className="border-t pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Ratings & Reviews</h2>
                    <span className="text-slate-500">({totalRatings} ratings)</span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {displayedRatings.map((rating, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <img
                              crossorigin='anonymous'
                              src={rating?.userDetails?.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}${rating?.userDetails?.avatar}` : ProfileImg}
                              alt={rating?.userDetails?.name}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <span className="font-medium text-slate-800">{rating?.userDetails?.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-slate-600">{rating.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-slate-600 text-sm mb-2">{rating.comment}</p>
                        )}
                        <p className="text-slate-500 text-sm">
                          {new Date(rating.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                  {ratings.length > 5 && (
                    <button
                      onClick={() => setShowAllRatings(!showAllRatings)}
                      className="mt-6 w-full py-2 text-blue-500 hover:text-blue-600 font-medium"
                    >
                      {showAllRatings ? "Show Less" : `View All ${ratings.length} Ratings`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Rate this Content</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            {ratingError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {ratingError}
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(value)}
                    className={`p-2 rounded-full transition-colors ${ratingForm.rating >= value
                        ? "text-yellow-500"
                        : "text-slate-300 hover:text-yellow-500"
                      }`}
                  >
                    <Star className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Comment (Optional)</label>
              <textarea
                value={ratingForm.comment}
                onChange={handleCommentChange}
                className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Share your thoughts about this content..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={ratingLoading}
                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {ratingLoading ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
