import { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import CartLayout from 'src/layout/CartLayout/CartLayout'
import MainLayout from 'src/layout/MainLayout'
import RegisterLayout from 'src/layout/RegisterLayout'
import UserLayout from 'src/pages/User/layouts/UserLayout'
import Notfound from 'src/pages/Notfound/Notfound'

const Login = lazy(() => import('src/pages/Login/Login'))
const Register = lazy(() => import('src/pages/Register/Register'))
const Cart = lazy(() => import('src/pages/Cart'))
const ProductDetail = lazy(() => import('src/pages/ProductDetail'))
const ProductList = lazy(() => import('src/pages/ProductList/ProductList'))
const ProfileUser = lazy(() => import('src/pages/User/pages/Profile/ProfileUser'))
const ChangePassword = lazy(() => import('src/pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('src/pages/User/pages/HistoryPurchase'))

const ProtectedRoutes = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
const RejectedRoutes = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRoutesElement = () => {
  const routes = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoutes />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.productDetail,
          element: (
            <MainLayout>
              <Suspense>
                <ProductDetail />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <ProfileUser />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoutes />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: <Notfound />
    }
  ])
  return routes
}

export default useRoutesElement
