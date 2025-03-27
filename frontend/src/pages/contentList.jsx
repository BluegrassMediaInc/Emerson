import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye, Edit2, Trash2, X } from "lucide-react";
import { listContentsApi, deleteContentApi, clearContentMsg } from "../store/slices/contentSlice";
import Header from "./Header";
import debounce from "lodash/debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChevronDown, Filter, Star } from "lucide-react";
import ProfileImg from "../assets/Profile.jfif";

export default function ContentList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { contents, loading, error, message } = useSelector((state) => state.content);
  const { userInfo } = useSelector((state) => state.auth);

  const debouncedSearchHandler = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearchHandler(search);
  }, [debouncedSearchHandler, search]);

  useEffect(() => {
    if (message === "Content deleted successfully") {
      setShowDeleteModal(false);
      setContentToDelete(null);
      dispatch(clearContentMsg());
    }
  }, [message, dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const loadContents = useCallback(() => {
    if (!hasMore) return;
    
    const nextPage = page + 1;
    dispatch(listContentsApi({ skip: (nextPage - 1) * 1, limit: 12, search: debouncedSearch }))
      .unwrap()
      .then((response) => {
        if (!response.data.data || response.data.data.length < 12) {
          setHasMore(false);
        }
        setPage(nextPage);
      })
      .catch(() => {
        setHasMore(false);
      });
  }, [dispatch, page, debouncedSearch, hasMore]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    dispatch(listContentsApi({ skip: 0, limit: 12, search: debouncedSearch }))
      .unwrap()
      .then((response) => {
        if (!response.data.data || response.data.data.length < 12) {
          setHasMore(false);
        }
      })
      .catch(() => {
        setHasMore(false);
      });
  }, [debouncedSearch, dispatch]);

  const handleDelete = (content) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (contentToDelete) {
      dispatch(deleteContentApi(contentToDelete._id))
        .unwrap()
        .then(() => {
          setPage(1);
          setHasMore(true);
          dispatch(listContentsApi({ skip: 0, limit: 12, search: debouncedSearch }))
            .unwrap()
            .then((response) => {
              if (!response.data.data || response.data.data.length < 12) {
                setHasMore(false);
              }
            });
          setShowDeleteModal(false);
          setContentToDelete(null);
        });
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="h-full w-full flex justify-center items-center">
        <div className="w-full h-full bg-white shadow-xl overflow-auto" id="scrollableDiv">
          <Header />

          {/* Search Bar */}
          <div className="p-4 sticky top-0 bg-white border-b border-slate-200 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search contents..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <InfiniteScroll
            dataLength={contents?.length || 0}
            next={loadContents}
            hasMore={hasMore}
            loader={
              hasMore && loading && (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              )
            }
            endMessage={
              contents?.length > 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No more contents to load
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No contents found
                </div>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="divide-y divide-slate-200">
              {contents && contents?.length > 0 && contents.map((item) => (
                <div
                  key={item._id}
                  className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <img
                    crossorigin='anonymous'
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item?.mediaUrl}`}
                    alt={item.title}
                    className="w-full sm:w-20 h-48 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold text-slate-900 break-words">{item.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-full sm:max-w-[500px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => navigate(`/blog/${item._id}`)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                          title="View Content"
                        >
                          <Eye size={18} />
                        </button>
                        {
                          userInfo && Object.keys(userInfo).length > 0 && userInfo._id === item?.userId &&
                          <>
                            <button
                              onClick={() => navigate(`/edit-content/${item._id}`)}
                              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                              title="Edit Content"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Content"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        }
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 flex-wrap">
                      <img
                        crossorigin='anonymous'
                        src={item?.userDetails?.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}${item?.userDetails?.avatar}` : ProfileImg}
                        alt={item.userDetails?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-slate-600">{item.userDetails?.name}</span>
                      {item.avgRating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-600">{item.avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Delete Content</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
