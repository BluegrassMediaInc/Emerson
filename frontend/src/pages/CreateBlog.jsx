import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { Upload } from "lucide-react";
import axios from "axios";
import { createContentApi, clearContentMsg } from "../store/slices/contentSlice";

export default function CreateBlog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.content);
  
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (message === "Content created successfully") {
      navigate("/content");
      dispatch(clearContentMsg());
    }
  }, [message, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        dispatch(clearContentMsg());
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearContentMsg());

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('content', formData.image);
    }

    dispatch(createContentApi(formDataToSend));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Content Cover Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-48 w-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, image: null }));
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-slate-800 hover:text-slate-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            ref={fileInputRef}
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all duration-200 text-slate-800 placeholder-slate-400"
                placeholder="Enter Content title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none"
                placeholder="Enter a brief description"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/content")}
                className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
