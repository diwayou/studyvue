import axios from 'axios'

const service = axios.create({
    timeout: 10000,
    withCredentials: true
  })

  const apiUrl = "http://localhost:8080"
  const localUrl = "http://localhost:8081"
  service.interceptors.request.use(
    config => {
      config.baseURL = apiUrl
      config.headers['Origin'] = localUrl
      
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  export default service