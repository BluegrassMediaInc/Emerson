import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

const ContentList = lazy(() => import("./pages/contentList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ContentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <BlogPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createblog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-content/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
