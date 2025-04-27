"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { from } from "rxjs"
import { map, filter, toArray } from "rxjs/operators"
import { getAllPosts } from "../services/postService"
import PostCard from "../components/PostCard"
import { Search, X, Filter, Loader } from "lucide-react"

const HomePage = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [activeFilters, setActiveFilters] = useState(false)

  // Load posts
  useEffect(() => {
    setLoading(true)
    getAllPosts()
      .then((data) => {
        setPosts(data)
        setFilteredPosts(data) // Initialize filteredPosts with all posts
        setLoading(false)

        // Extract unique categories
        const allCategories = [...new Set(data.map((post) => post.category))]
        setCategories(allCategories)
      })
      .catch((error) => {
        console.error("Error fetching posts:", error)
        setLoading(false)
      })
  }, [])

  // Filter posts using RxJS
  useEffect(() => {
    if (posts.length > 0) {
      const postsObservable = from(posts)

      // Create combined filter with RxJS
      const filteredObservable = postsObservable.pipe(
        filter((post) => {
          // Filter by category if selected
          if (selectedCategory && post.category !== selectedCategory) {
            return false
          }

          // Filter by search term
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            return (
              post.title.toLowerCase().includes(searchLower) ||
              post.content.toLowerCase().includes(searchLower) ||
              (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
            )
          }

          return true
        }),
        // Sort by date descending
        toArray(),
        map((postsArray) => 
          postsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        )
      )

      const subscription = filteredObservable.subscribe({
        next: (filtered) => {
          setFilteredPosts(filtered)
          setActiveFilters(!!searchTerm || !!selectedCategory)
        },
        error: (err) => console.error("Filter error:", err)
      })

      return () => subscription.unsubscribe()
    }
  }, [posts, searchTerm, selectedCategory])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-rose-100 to-teal-100 dark:from-rose-900/30 dark:to-teal-900/30">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-teal-600 dark:from-rose-400 dark:to-teal-400">
          Share Your World
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Welcome to 404.js, where you can share your thoughts, ideas, inspirations, and photos with the world.
        </p>
        {user ? (
          <Link to="/posts/new" className="btn-primary text-lg px-8 py-3">
            Create New Post
          </Link>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="btn-outline text-lg px-8 py-3">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
          </div>
        )}
      </section>

      {/* Filters Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Posts</h2>

          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters && (
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500">Active filters:</span>
            {selectedCategory && (
              <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 px-2 py-1 rounded-full text-sm">
                {selectedCategory}
              </span>
            )}
            {searchTerm && (
              <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-2 py-1 rounded-full text-sm">
                "{searchTerm}"
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* Posts Grid */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-8 w-8 text-rose-600 dark:text-rose-400" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
              {posts.length > 0 ? "No posts match your search criteria" : "No posts available yet"}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              {posts.length > 0 ? "Try adjusting your filters or search term" : "Be the first to share your thoughts!"}
            </p>
            {!activeFilters && user && (
              <div className="mt-4">
                <Link to="/posts/new" className="btn-primary">
                  Create New Post
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage