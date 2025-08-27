import { createBrowserRouter, RouterProvider} from "react-router";
import Home from "./pages/Home";
import RecruiterSignUp from "./pages/RecruiterSignUp";
import AthleteSignUp from "./pages/AthleteSignUp";
import SignIn from "./pages/SignIn";
import AthleteDashboard from "./pages/AthleteDashboard";


const sportsConnect = createBrowserRouter([
{ path: '/', element: <Home />},
{ path: '/recruitersignup', element: <RecruiterSignUp />},
{ path: '/athletesignup', element: <AthleteSignUp />},
{ path: '/signin', element: <SignIn />},
{ path: '/athletedashboard', element: <AthleteDashboard />},
])





function App() {
 
  return (
    <>
      <RouterProvider router={sportsConnect} />
    </>
  )
}

export default App
