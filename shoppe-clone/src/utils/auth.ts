import { User } from 'src/types/user.type'
const access_token = 'access_token'
const refresh_token = 'refresh_token'
const user_profile = 'user_profile'

export const LocalStorageEventTarget = new EventTarget()

export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem(access_token, accessToken)
}
export const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem(refresh_token, refreshToken)
}

export const getAccessToken = () => {
  return localStorage.getItem(access_token) || ''
}
export const getRefreshToken = () => {
  return localStorage.getItem(refresh_token) || ''
}

export const clearAccessToken = () => {
  localStorage.removeItem(access_token)
  localStorage.removeItem(refresh_token)
  localStorage.removeItem(user_profile)
  const clearEvent = new Event('clear-local-context')
  LocalStorageEventTarget.dispatchEvent(clearEvent)
}

export const saveProfileToLS = (user: User) => {
  localStorage.setItem(user_profile, JSON.stringify(user))
}

export const getProfileFromLS = (): User => {
  const result = localStorage.getItem(user_profile)
  return result ? JSON.parse(result) : null
}
