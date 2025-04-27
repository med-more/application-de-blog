import { useState } from "react"
import { Link } from "react-router-dom"
import { Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const CommentForm = ({ onSubmit, user }) => {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent("")
      setIsFocused(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-md border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-2">Join the conversation</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sign in to share your thoughts and connect with other readers.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 ${
        isFocused ? "ring-2 ring-rose-500 dark:ring-rose-400" : ""
      }`}
    >
      <h3 className="font-medium mb-3">Add a comment</h3>
      <div className="flex items-start gap-3">
        <div className="flex-grow">
          <textarea
            className={`form-input resize-none transition-all duration-300 ${
              isFocused ? "border-rose-500 dark:border-rose-400" : ""
            }`}
            rows={isFocused ? "4" : "2"}
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => content.length === 0 && setIsFocused(false)}
            required
          ></textarea>

          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between items-center mt-2"
              >
                <p className="text-xs text-gray-500">{content.length} / 500 characters</p>
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setContent("")
                    setIsFocused(false)
                  }}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(isFocused || content.length > 0) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-primary h-10 px-4 rounded-full"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Send size={18} />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  )
}

export default CommentForm