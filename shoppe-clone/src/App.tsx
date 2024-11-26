import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useRoutesElement from "src/useRoutesElement";
  

function App() {
  const routes = useRoutesElement();
  return (
    <>
      {routes}
    <ToastContainer />
    </>
  )
}

export default App
