import { SuccessResponse } from 'src/types/ultil.type'
import { User } from 'src/types/user.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: Number
  user: User
  refresh_token: string
  expire_refresh_token: Number
}>

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string
}>
