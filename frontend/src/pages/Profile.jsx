import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Edit2, Save, X, Camera } from "lucide-react";
import { getProfileApi, updateProfileApi, logoutApi } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import ProfileImg from "../assets/Profile.jfif";
import Loader from "../components/Loader";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const { loading, userInfo, msg } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setUserData({
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.avatar,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (msg) {
      toast.success(msg);
    }
  }, [msg]);

  const fetchProfile = async () => {
    const response = await dispatch(getProfileApi());
    if (!response.payload?.data?.data) {
      toast.error("Failed to fetch profile");
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    if (fileInputRef.current?.files[0]) {
      formData.append("avatar", fileInputRef.current.files[0]);
    }

    const response = await dispatch(updateProfileApi(formData));
    if (response.payload?.status === 200) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userInfo) {
      setUserData({
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.avatar,
      });
    }
  };

  const handleLogout = async () => {
    const response = await dispatch(logoutApi());
    if (response.payload?.status === 200) {
      navigate("/login");
    }
  };

  return (
    <>
      {
        loading ?
          <Loader /> :
          <>
            {
              userData && Object.keys(userData).length > 0 &&
              <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate("/content")}
                        className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
                      >
                        Back to Content
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all"
                        disabled={loading}
                      >
                        {loading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
                      <div className="relative">
                        <img
                          crossorigin='anonymous'
                          src={userData?.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}${userData?.avatar}` : ProfileImg}
                          alt={userData.name}
                          className="w-32 h-32 rounded-full border-4 border-emerald-500"
                        />
                        {isEditing && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full hover:bg-emerald-600 transition-all"
                          >
                            <Camera className="w-5 h-5" />
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={() => { }} // Handle via form submission
                              accept="image/*"
                              className="hidden"
                            />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.name}
                            onChange={(e) =>
                              setUserData({ ...userData, name: e.target.value })
                            }
                            className="bg-slate-700 text-white px-4 py-2 rounded-lg w-full md:w-auto mb-2"
                            disabled={loading}
                          />
                        ) : (
                          <h2 className="text-2xl font-bold mb-2">{userData.name}</h2>
                        )}
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{userData.email}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-all flex items-center"
                              disabled={loading}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all flex items-center"
                              disabled={loading}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all flex items-center"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </>
      }
    </>
  );
}
