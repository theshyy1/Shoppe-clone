const access_token = 'access_token'

export const saveAccessToken = (accessToken: string) => {
  return localStorage.setItem(access_token, accessToken)
}

export const clearAccessToken = () => {
  return localStorage.removeItem(access_token)
}

export const getAccessToken = () => {
  return localStorage.getItem(access_token) || ''
}
