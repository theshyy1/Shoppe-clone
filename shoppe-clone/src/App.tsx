import { Outlet } from "react-router-dom";
import useRoutesElement from "src/useRoutesElement";

function App() {
  const routes = useRoutesElement();
  return (
    <>
    <Outlet />
      {routes}
    </>
  )
}

export default App
