import { User } from 'src/types/user.type'
const access_token = 'access_token'
const user_profile = 'user_profile'

export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem(access_token, accessToken)
}

export const getAccessToken = () => {
  return localStorage.getItem(access_token) || ''
}

export const clearAccessToken = () => {
  localStorage.removeItem(access_token)
  localStorage.removeItem(user_profile)
}

export const saveProfileToLS = (user: User) => {
  localStorage.setItem(user_profile, JSON.stringify(user))
}

export const getProfileFromLS = (): User => {
  const result = localStorage.getItem(user_profile)
  return result ? JSON.parse(result) : null
}
