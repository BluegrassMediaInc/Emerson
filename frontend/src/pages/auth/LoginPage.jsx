import { useState, useEffect } from "react";
import { Lock, Mail, EyeOff, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginApi } from "../../store/slices/authSlice";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await dispatch(loginApi({ email, password }));
      if (response.payload?.status === 200 && response?.payload?.data?.token) {
        localStorage.setItem("token", `Bearer ${response.payload?.data?.token}`);
        toast.success("Login successful!");
        navigate('/');
      } else {
        throw new Error(response?.payload?.data?.message || "An error occurred.");
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="h-screen pr-5 pl-5 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-slate-800 text-center">
          Welcome Back
        </h2>
        <p className="text-slate-600 text-center mt-2">Sign in to continue</p>

        <form className="space-y-4 mt-6" onSubmit={handleLogin}>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              required
              disabled={loading}
            />
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              required
              disabled={loading}
            />
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-slate-600 text-center mt-6">
          Don't have an account?
          <button
            className="text-slate-800 font-medium ml-2 hover:text-slate-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
