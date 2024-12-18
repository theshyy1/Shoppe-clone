import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/api/auth.api'
import { HttpStatusCode } from 'src/constants/HttpStatusCode'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { ErrorResponse } from 'src/types/ultil.type'
import {
  clearAccessToken,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveProfileToLS,
  saveRefreshToken
} from 'src/utils/auth'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from 'src/utils/ultils'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessToken()
    this.refreshToken = getRefreshToken()
    this.refreshTokenRequest = null
    ;(this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24,
        'expire-refresh-token': 60 * 60 * 24 * 1000
      }
    })),
      // interceptors request
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken && config.headers) {
            config.headers['Authorization'] = this.accessToken
            return config
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        }
      ),
      // interceptors response
      this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config
          if (url === URL_LOGIN || url === URL_REGISTER) {
            const data = response.data as AuthResponse
            this.accessToken = data.data.access_token
            this.refreshToken = data.data.refresh_token
            saveAccessToken(this.accessToken)
            saveRefreshToken(this.refreshToken)
            saveProfileToLS(data.data.user)
          } else if (url === URL_LOGOUT) {
            this.accessToken = ''
            this.refreshToken = ''
            clearAccessToken()
          }
          return response
        },
        (error: AxiosError) => {
          if (
            ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
              error.response?.status as number
            )
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data?.message || error.message
            toast.error(message)
          }

          // Lỗi Unauthorized (401) có rất nhiều trường hợp
          // - Token không đúng
          // - Không truyền token
          // - Token hết hạn*
          // Nếu là lỗi 401
          if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
            const config = error.response?.config || { headers: {}, url: '' }
            const { url } = config
            // Trường hợp Token hết hạn và request đó không phải là của request refresh token
            // thì chúng ta mới tiến hành gọi refresh token
            if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
              // Hạn chế gọi 2 lần handleRefreshToken
              this.refreshTokenRequest = this.refreshTokenRequest
                ? this.refreshTokenRequest
                : this.handleRefreshToken().finally(() => {
                    // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                    setTimeout(() => {
                      this.refreshTokenRequest = null
                    }, 10000)
                  })
              return this.refreshTokenRequest.then((access_token) => {
                // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
              })
            }

            clearAccessToken()
            this.accessToken = ''
            this.refreshToken = ''
            toast.error(error.response?.data.data?.message || error.response?.data.message)
            // window.location.reload()
          }
          return Promise.reject(error)
        }
      )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        this.accessToken = access_token
        saveAccessToken(access_token)
        return access_token
      })
      .catch((err) => {
        this.accessToken = ''
        this.refreshToken = ''
        clearAccessToken()
        throw err
      })
  }
}

const http = new Http().instance

export default http
