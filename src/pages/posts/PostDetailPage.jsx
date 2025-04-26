"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import { getPostById, deletePost, addComment, deleteComment } from "../../services/postService"
import CommentForm from "../../components/CommentForm"
import { Edit, Trash2, MessageCircle, ArrowLeft, Calendar, Tag, Loader } from "lucide-react"
import { motion } from "framer-motion"

const PostDetailPage = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  // Load post data
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const postData = await getPostById(id)
        setPost(postData)
      } catch (error) {
        toast.error("Failed to load post")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, navigate])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  // Delete post handler
  const handleDeletePost = async () => {
    try {
      await deletePost(id)
      toast.success("Post deleted successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to delete post")
    }
  }

  // Add comment handler
  const handleAddComment = async (content) => {
    if (!user) {
      toast.info("Please log in to comment")
      navigate("/login")
      return
    }

    try {
      const newComment = {
        id: Date.now().toString(),
        content,
        userId: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      }

      const updatedPost = await addComment(id, newComment)
      setPost(updatedPost)
      toast.success("Comment added")
    } catch (error) {
      toast.error("Failed to add comment")
    }
  }

  // Delete comment handler
  const handleDeleteComment = async (commentId) => {
    try {
      const updatedPost = await deleteComment(id, commentId)
      setPost(updatedPost)
      toast.success("Comment deleted")
    } catch (error) {
      toast.error("Failed to delete comment")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin h-8 w-8 text-rose-600 dark:text-rose-400" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
      </div>

      <article className="card overflow-hidden">
        {/* Post Header */}
        <div className="relative">
          {/* Featured Image */}
          {post.image && (
            <div className="aspect-video w-full relative">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
          )}

          {/* Post Header Content */}
          <div className={`p-6 ${post.image ? "absolute bottom-0 left-0 right-0 text-white" : ""}`}>
            <div className="flex items-center mb-2">
              <span className="inline-block bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 px-2 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
              <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={14} className="mr-1" />
                {formatDate(post.createdAt)}
              </span>
            </div>

            <h1 className={`text-3xl md:text-4xl font-bold ${post.image ? "text-white" : ""}`}>{post.title}</h1>

            <div className="flex items-center mt-4">
              <div className="flex items-center space-x-1 text-sm">
                <span className="font-semibold">By {post.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Body */}
        <div className="p-6">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-6">
              <Tag size={16} className="text-gray-500" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <button className="flex items-center text-gray-600 dark:text-gray-400">
                <MessageCircle size={20} className="mr-1" />
                <span>{post.comments?.length || 0} Comments</span>
              </button>
            </div>

            {/* Edit/Delete Buttons (visible to post author only) */}
            {user && post.userId === user.id && (
              <div className="flex items-center space-x-2">
                <Link to={`/posts/${id}/edit`} className="flex items-center btn-outline">
                  <Edit size={16} className="mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-b-xl">
          <motion.h3 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-bold mb-6">
            Comments ({post.comments?.length || 0})
          </motion.h3>

          {/* Comment Form */}
          <CommentForm onSubmit={handleAddComment} user={user} />

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
              className="mt-8 space-y-6"
            >
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 text-sm font-bold mr-2">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium block">{comment.username}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Comment (visible to comment author only) */}
                    {user && comment.userId === user.id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mt-2">{comment.content}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center py-8 bg-white dark:bg-gray-800 rounded-lg"
            >
              <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
            </motion.div>
          )}
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Post</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowConfirmDelete(false)} className="btn-outline">
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetailPage
