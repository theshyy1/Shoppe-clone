import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from 'src/contexts/app.context'
import useRoutesElement from 'src/useRoutesElement'
import { LocalStorageEventTarget } from 'src/utils/auth'

function App() {
  const routes = useRoutesElement()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clear-local-context', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clear-local-context', reset)
    }
  }, [reset])

  return (
    <>
      {routes}
      <ToastContainer position='top-center' autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick />
    </>
  )
}

export default App
