import axios from 'axios'

const TOKEN_KEY = 'todo_app_token'

export const TodoAuth = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  saveToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY)
  },

  isAuthenticated: (): boolean => {
    const token = TodoAuth.getToken()
    return !!token
  },
}

// Create an axios instance for API calls
export const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = TodoAuth.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
