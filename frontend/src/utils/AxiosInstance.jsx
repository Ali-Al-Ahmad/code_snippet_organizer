import axios from 'axios'

const token = localStorage.getItem('token')
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v0.1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

export default axiosInstance
