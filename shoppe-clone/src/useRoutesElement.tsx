import { useRoutes } from 'react-router-dom'
import MainLayout from 'src/layout/MainLayout'
import RegisterLayout from 'src/layout/RegisterLayout'
import Login from 'src/pages/Login/Login'
import ProductList from 'src/pages/ProductList/ProductList'
import Register from 'src/pages/Register/Register'

const useRoutesElement = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '/login',
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: '/register',
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    }
  ])
  return routes
}

export default useRoutesElement
