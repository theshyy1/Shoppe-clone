import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useRoutesElement from "src/useRoutesElement";
  

function App() {
  const routes = useRoutesElement();
  return (
    <>
      {routes}
    <ToastContainer position="top-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick />
    </>
  )
}

export default App
