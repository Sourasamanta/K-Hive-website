"use client";
import { useState } from "react";
import { Upload, X, Tag, Image as ImageIcon, Loader2 } from "lucide-react";
import { useCreatePost } from "@/lib/hooks/usePosts";
import { useRouter } from "next/navigation";
import { mediaApi } from "@/lib/api/media";

export default function CreatePost() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Handle tag addition
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();

    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  // Compress image before upload
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new file from the blob
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                console.log(
                  `Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(
                    compressedFile.size / 1024
                  ).toFixed(2)}KB`
                );
                resolve(compressedFile);
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  // Handle image selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
        setError("");
      } catch (err) {
        console.error("Error compressing image:", err);
        setError("Failed to process image");
      }
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Get fresh upload credentials and upload image to ImageKit
  const uploadImage = async (file) => {
    try {
      console.log("Getting fresh upload credentials...");

      // Get fresh upload credentials from backend using mediaApi
      const credsResult = await mediaApi.getUploadLink();
      console.log("Fresh upload credentials received");

      const { token, expire, signature, publicKey, uploadUrl, folder } =
        credsResult.data;

      // Check if token is about to expire (less than 10 seconds remaining)
      const timeLeft = expire - Math.floor(Date.now() / 1000);
      console.log(`Token expires in ${timeLeft} seconds`);

      if (timeLeft < 10) {
        throw new Error("Upload token expired. Please try again.");
      }

      // Prepare form data for ImageKit upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("fileName", `${Date.now()}-${file.name}`);
      uploadFormData.append("publicKey", publicKey);
      uploadFormData.append("signature", signature);
      uploadFormData.append("expire", expire);
      uploadFormData.append("token", token);
      uploadFormData.append("folder", folder);

      console.log("Uploading to ImageKit...");

      // Upload to ImageKit
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: uploadFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        console.error("ImageKit upload failed:", uploadResult);
        throw new Error(
          uploadResult.message || "Failed to upload image to ImageKit"
        );
      }

      console.log("Image uploaded successfully:", uploadResult.url);
      return uploadResult.url;
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (
      formData.title.trim().length < 5 ||
      formData.title.trim().length > 200
    ) {
      setError("Title must be between 5 and 200 characters");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    if (formData.content.trim().length < 10) {
      setError("Content must be at least 10 characters");
      return;
    }

    try {
      // Upload image if present (get fresh credentials right before upload)
      let mediaUrls = [];
      if (imageFile) {
        console.log("Starting image upload...");
        try {
          const imageUrl = await uploadImage(imageFile);
          mediaUrls.push(imageUrl);
          console.log("Image uploaded, URL:", imageUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setError(`Image upload failed: ${uploadError.message}`);
          return;
        }
      }

      // Create post using mutation
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
      };

      // Add media only if there are URLs
      if (mediaUrls.length > 0) {
        postData.media = mediaUrls;
      }

      console.log("Submitting post data:", JSON.stringify(postData, null, 2));
      console.log("Media URLs:", mediaUrls);

      const result = await createPostMutation.mutateAsync(postData);

      console.log("Post created successfully:", result);

      // Reset form
      setFormData({ title: "", content: "", tags: [] });
      setImageFile(null);
      setImagePreview(null);
      setTagInput("");

      // Redirect to the new post or posts list
      router.push("/posts");
    } catch (err) {
      console.error("Error creating post:", err);

      // Better error message extraction
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred while creating the post");
      }
    }
  };

  const isSubmitting = createPostMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title (5-200 characters)"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isSubmitting}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content (minimum 10 characters)"
              rows={8}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Tags Input */}
          <div>
            <label
              htmlFor="tagInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                placeholder="Add tags..."
                className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                disabled={isSubmitting}
              >
                <Tag size={18} />
                Add
              </button>
            </div>

            {/* Display Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900 transition"
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB (will be compressed)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  disabled={isSubmitting}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Post...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Create Post
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
