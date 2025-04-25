"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { getPostById, updatePost } from "../../services/postService"
import { Upload, X, Save, Loader } from "lucide-react"

const categoryOptions = [
  "Technology",
  "Travel",
  "Food",
  "Fashion",
  "Lifestyle",
  "Health",
  "Business",
  "Art",
  "Education",
  "Personal",
]

const EditPostPage = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [post, setPost] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const watchTitle = watch("title", "")

  // Load post data
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      try {
        const postData = await getPostById(id)

        // Check if user is the author
        if (postData.userId !== user.id) {
          toast.error("You are not authorized to edit this post")
          navigate(`/posts/${id}`)
          return
        }

        setPost(postData)
        reset({
          title: postData.title,
          category: postData.category,
          content: postData.content,
          image: postData.image || "",
        })

        if (postData.image) {
          setImagePreview(postData.image)
        }

        if (postData.tags && Array.isArray(postData.tags)) {
          setTags(postData.tags)
        }
      } catch (error) {
        toast.error("Failed to load post")
        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id, user.id, navigate, reset])

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Only process images
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file")
      return
    }

    // Create image preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      setValue("image", e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle tags
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  // Submit form
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      // Create updated post object
      const postData = {
        ...post,
        ...data,
        tags,
        updatedAt: new Date().toISOString(),
      }

      await updatePost(id, postData)
      toast.success("Post updated successfully!")
      navigate(`/posts/${id}`)
    } catch (error) {
      toast.error("Failed to update post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin h-8 w-8 text-rose-600 dark:text-rose-400" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="card p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              type="text"
              className={`form-input ${errors.title ? "border-red-500" : ""}`}
              placeholder="Enter a catchy title..."
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title must be less than 100 characters",
                },
              })}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="form-error">{errors.title.message}</p>
              ) : (
                <span className="text-xs text-gray-500">{watchTitle.length}/100</span>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className="form-input"
              {...register("category", { required: "Category is required" })}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="form-label">
              Tags (Max 5)
            </label>
            <div className="flex items-center">
              <input
                id="tags"
                type="text"
                className="form-input"
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                className="ml-2 btn-outline"
                onClick={addTag}
                disabled={tags.length >= 5 || !tagInput}
              >
                Add
              </button>
            </div>
            {tags.length >= 5 && <p className="text-xs text-amber-600 mt-1">Maximum of 5 tags reached</p>}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                      onClick={() => removeTag(tag)}
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
            <label htmlFor="image" className="form-label">
              Featured Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
              {imagePreview ? (
                <div className="space-y-2 text-center">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="mx-auto h-40 object-cover rounded-md"
                  />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="text-red-600 dark:text-red-400 text-sm underline"
                      onClick={() => {
                        setImagePreview("")
                        setValue("image", "")
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              className={`form-input ${errors.content ? "border-red-500" : ""}`}
              placeholder="Write your post content here..."
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 50,
                  message: "Content must be at least 50 characters",
                },
              })}
            />
            {errors.content && <p className="form-error">{errors.content.message}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" className="btn-outline" onClick={() => navigate(`/posts/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save size={18} className="mr-2" />
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPostPage
