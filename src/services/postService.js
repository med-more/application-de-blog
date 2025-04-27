import axios from "axios"

const API_URL = "http://localhost:3001"

// Get posts by user ID
export const getUserPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts?userId=${userId}`)
    return response.data
  } catch (error) {
    console.error("Get user posts error:", error)
    throw error
  }
}

// Get all posts
export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`)
    return response.data
  } catch (error) {
    console.error("Get all posts error:", error)
    throw error
  }
}

// Get post by ID
export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error("Get post error:", error)
    throw error
  }
}

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postData)
    return response.data
  } catch (error) {
    console.error("Create post error:", error)
    throw error
  }
}

// Update an existing post
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}`, postData)
    return response.data
  } catch (error) {
    console.error("Update post error:", error)
    throw error
  }
}

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error("Delete post error:", error)
    throw error
  }
}

// Add a comment to a post
export const addComment = async (postId, commentData) => {
  try {
    const post = await getPostById(postId)
    const updatedComments = [...(post.comments || []), commentData]
    const updatedPost = { ...post, comments: updatedComments }
    return await updatePost(postId, updatedPost)
  } catch (error) {
    console.error("Add comment error:", error)
    throw error
  }
}

// Delete a comment from a post
export const deleteComment = async (postId, commentId) => {
  try {
    const post = await getPostById(postId)
    const updatedComments = (post.comments || []).filter((comment) => comment.id !== commentId)
    const updatedPost = { ...post, comments: updatedComments }
    return await updatePost(postId, updatedPost)
  } catch (error) {
    console.error("Delete comment error:", error)
    throw error
  }
}