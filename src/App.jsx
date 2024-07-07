import 'bootstrap/dist/css/bootstrap.min.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Tracker from "./pages/Tracker";
import Signin from "./pages/Signin";
import Layout from "./pages/Layout";
import RequireAuth from "./pages/RequireAuth";

import EmployeeTracksLoader from "./features/Tracker/EmployeeLoader"
import { DateProvider } from './Context/DateContext';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Signin />} />
      <Route element={<RequireAuth />}>
        <Route path="home" element={<Tracker />} loader={EmployeeTracksLoader}  />
      </Route>
    </Route>
  )
);

function App() {
  return ( 
  <DateProvider>
      <RouterProvider router={router} />;
</DateProvider>
)

}

export default App;




