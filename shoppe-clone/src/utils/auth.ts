export const saveAccessToken = (access_token: string) => {
  return localStorage.setItem('access_token', access_token)
}

export const clearAccessToken = () => {
  return localStorage.removeItem('access_token')
}

export const getAccessToken = () => {
  return localStorage.getItem('access_token') || ''
}
