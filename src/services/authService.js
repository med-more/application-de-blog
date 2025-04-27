import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3001/users",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
})

const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data)
    throw new Error(error.response.data.error || "Request failed")
  } else if (error.request) {
    console.error("Network Error:", error.message)
    throw new Error("Network error. Please check your connection.")
  } else {
    console.error("Request Error:", error.message)
    throw new Error("An unexpected error occurred")
  }
}

export const registerUser = async (userData) => {
  try {
    const checkResponse = await api.get(`?email=${encodeURIComponent(userData.email)}`)
    if (checkResponse.data.length > 0) {
      throw new Error("Un utilisateur avec cet e-mail existe déjà")
    }

    const response = await api.post("", userData)
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await api.get(`?email=${encodeURIComponent(email)}`)

    if (response.data.length === 0) {
      throw new Error("Utilisateur non trouvé")
    }

    const user = response.data[0]
    if (user.password !== password) {
      throw new Error("Identifiants invalides")
    }

    return user
  } catch (error) {
    return handleApiError(error)
  }
}

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/${userId}`)
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/${userId}`, userData)
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}
