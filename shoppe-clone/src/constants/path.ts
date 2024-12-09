const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  historyPurchase: '/user/history',
  changePassword: '/user/password',
  login: '/login',
  register: '/register',
  logout: '/logout',
  cart: '/cart',
  productDetail: ':nameId'
} as const

export default path
