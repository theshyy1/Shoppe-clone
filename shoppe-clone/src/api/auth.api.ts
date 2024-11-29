import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'
import { LoginSchemaType } from 'src/utils/validate'

const AuthAPI = {
  registerAccount: (body: LoginSchemaType) => http.post<AuthResponse>('register', body),
  LoginAccount: (body: LoginSchemaType) => http.post<AuthResponse>('login', body),
  LogoutAccount: () => http.post('logout')
}

export default AuthAPI
