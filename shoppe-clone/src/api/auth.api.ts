import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
import { formSchemaType } from 'src/utils/validate'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

type LoginSchemaType = Pick<formSchemaType, 'email' | 'password'>

const AuthAPI = {
  registerAccount: (body: LoginSchemaType) => http.post<AuthResponse>(URL_REGISTER, body),
  LoginAccount: (body: LoginSchemaType) => http.post<AuthResponse>(URL_LOGIN, body),
  LogoutAccount: () => http.post(URL_LOGOUT)
}

export default AuthAPI
