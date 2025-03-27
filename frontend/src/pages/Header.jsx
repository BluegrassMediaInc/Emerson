import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "../store/slices/authSlice";
import {
  ChevronDown,
  Filter,
  Search,
  X,
  Plus,
  ArrowLeft,
  Menu,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { getProfileApi, logoutApi } from "../store/slices/authSlice";
import ProfileImg from "../assets/Profile.jfif";

export default function Header({ title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const { searchQuery = "", sortBy = "dateCreated" } = useSelector(
    (state) => state.content || {}
  );
  const { user, userInfo } = useSelector((state) => state.auth);

  const fetchProfile = async () => {
    const response = await dispatch(getProfileApi());
    if (!response.payload?.data?.data) {
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!userInfo || Object.keys(userInfo).length > 1) {
        fetchProfile();
      }
    }
  }, []);

  const handleLogout = async () => {
    const response = await dispatch(logoutApi());
    if (response.payload?.status === 200) {
      navigate("/login");
    };
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSort = () => {
    // dispatch(setSortBy(sortBy === "rating" ? "dateCreated" : "rating"));
    setIsMobileMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isMobileMenuOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileOpen]);

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/content")}
            className="flex items-center"
          >
            <span className="text-2xl md:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 cursor-pointer">
              Fang
            </span>
            <span className="text-2xl md:text-3xl font-light tracking-wider text-white cursor-pointer">
              book
            </span>
          </button>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {title}
          </h2>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* {title === "My Content" && (
            <button
              onClick={() => navigate("/content")}
              className="flex items-center bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Content
            </button>
          )} */}
          <button
            onClick={() => navigate("/createblog")}
            className="flex items-center bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Content
          </button>
          {/* <button
            onClick={() => navigate("/mycontent")}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
          >
            My Content
          </button> */}

          {/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                navigate("/profile");
                setIsProfileOpen(false);
              }}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
            >
              <img
                crossorigin='anonymous'
                src={userInfo?.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}${userInfo?.avatar}` : ProfileImg}
                alt={userInfo?.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{userInfo?.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium">{userInfo?.name}</p>
                  <p className="text-sm text-gray-400">{userInfo?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu with Transition */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-slate-800 to-slate-900 p-4 shadow-lg transition-transform duration-300 ease-in-out z-50 ${isMobileMenuOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
          }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Menu</h3>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Profile Section in Mobile Menu */}
          <div
            onClick={() => {
              navigate("/profile");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-all"
          >
            <img
              crossorigin='anonymous'
              src={userInfo?.avatar ? `${import.meta.env.VITE_IMAGE_BASE_URL}${userInfo?.avatar}` : ProfileImg}
              alt={userInfo?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{userInfo?.name}</p>
              <p className="text-sm text-gray-400">{userInfo?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              navigate("/createblog");
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Blog
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all text-red-400"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
    </div>
  );
}
