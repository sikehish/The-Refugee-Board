import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import About from "./pages/About"
import Login from "./pages/Login"
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"
import ErrorPage from "./pages/ErrorPage"
import Navbar from './components/Navbar';
import CreateEntry from './pages/CreateEntry';
import Root from './Root';
import RootWrapper from './RootWrapper';
// import { AuthContextProvider } from './Hooks/AuthContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "create-entry",
        element: <CreateEntry />,
      },
    ],
  },
  // {
  //   path: "/admin",
  //   element: <Admin />,
  // },
  // {
  //   path: "/about",
  //   element: <About />,
  // },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider
    router={router}
  />
)
