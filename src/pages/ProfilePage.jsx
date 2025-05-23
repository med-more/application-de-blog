import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserPosts } from "../services/postService"
import { updateUserProfile } from "../services/authService"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import PostCard from "../components/PostCard"
import { Edit, Save, User, Loader, PenTool, MessageCircle } from "lucide-react"

const ProfilePage = ({ user, setUser }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  })

  // Load user posts
  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      getUserPosts(user.id)
        .then((data) => {
          setPosts(data || [])
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching user posts:", error)
          setPosts([])
          setLoading(false)
        })
    }
  }, [user])

  // Reset form when user changes or edit mode is toggled
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      })
    }
  }, [user, editMode, reset])

  const onSubmit = async (data) => {
    setSavingProfile(true)
    try {
      const updatedUser = await updateUserProfile(user.id, {
        ...user,
        ...data,
      })
      setUser(updatedUser)
      setEditMode(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        <Link to="/login" className="btn-primary mt-4 inline-block">
          Log In
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Profile Card */}
      <div className="card p-6 md:p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="flex items-center btn-outline">
              <Edit size={16} className="mr-1" />
              Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
           <div>
             <label htmlFor="username" className="form-label">
               Username
             </label>
             <input
               id="username"
               type="text"
               className={`form-input ${errors.username ? "border-red-500" : ""}`}
               {...register("username", {
                 required: "Username is required",
                 minLength: {
                   value: 3,
                   message: "Username must be at least 3 characters",
                 },
               })}
             />
             {errors.username && <p className="form-error">{errors.username.message}</p>}
           </div>

           <div>
             <label htmlFor="email" className="form-label">
               Email
             </label>
             <input
               id="email"
               type="email"
               className={`form-input ${errors.email ? "border-red-500" : ""}`}
               {...register("email", {
                 required: "Email is required",
                 pattern: {
                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                   message: "Invalid email address",
                 },
               })}
             />
             {errors.email && <p className="form-error">{errors.email.message}</p>}
           </div>

           <div>
             <label htmlFor="bio" className="form-label">
               Bio
             </label>
             <textarea
               id="bio"
               rows="4"
               className="form-input"
               placeholder="Tell us about yourself..."
               {...register("bio")}
             ></textarea>
           </div>

           <div className="flex justify-end space-x-4 pt-2">
             <button type="button" className="btn-outline" onClick={() => setEditMode(false)} disabled={savingProfile}>
               Cancel
             </button>
             <button type="submit" className="btn-primary flex items-center" disabled={savingProfile}>
               {savingProfile ? (
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
        ) : (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 text-3xl font-bold mr-4">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300">{user.bio || "No bio provided yet."}</p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-8">
              <div className="flex items-center">
                <PenTool size={18} className="mr-2 text-rose-500 dark:text-rose-400" />
                <span>
                  <strong>{posts.length}</strong> Posts
                </span>
              </div>
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2 text-teal-500 dark:text-teal-400" />
                <span>
                  <strong>{posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}</strong> Comments
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Posts */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Posts</h2>
          <Link to="/posts/new" className="btn-primary flex items-center">
            <PenTool size={16} className="mr-1" />
            New Post
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-8 w-8 text-rose-600 dark:text-rose-400" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">You haven't created any posts yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500 mb-4">
              Share your thoughts, ideas, or inspirations with the world
            </p>
            <Link to="/posts/new" className="btn-primary inline-flex items-center">
              <PenTool size={16} className="mr-1" />
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage