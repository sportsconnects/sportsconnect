import { createBrowserRouter, RouterProvider} from "react-router";
import Home from "./pages/Home";
import RecruiterSignUp from "./pages/RecruiterSignUp";
import AthleteSignUp from "./pages/AthleteSignUp";



const sportsConnect = createBrowserRouter([
{ path: '/', element: <Home />},
{ path: '/recruitersignup', element: <RecruiterSignUp />},
{ path: '/athletesignup', element: <AthleteSignUp />},
])





function App() {
 
  return (
    <>
      <RouterProvider router={sportsConnect} />
    </>
  )
}

export default App
