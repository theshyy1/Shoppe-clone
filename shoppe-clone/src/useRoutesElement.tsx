import { useRoutes } from 'react-router-dom'
import RegisterLayout from 'src/layout/RegisterLayout'
import Login from 'src/pages/Login/Login'
import ProductList from 'src/pages/ProductList/ProductList'
import Register from 'src/pages/Register/Register'

const useRoutesElement = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <ProductList />
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
