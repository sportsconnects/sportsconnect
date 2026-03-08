import { createBrowserRouter, RouterProvider} from "react-router";
import Home from "./pages/Home";
import RecruiterSignUp from "./pages/RecruiterSignUp";
import AthleteSignUp from "./pages/AthleteSignUp";
import SignIn from "./pages/SignIn";
import AthleteDashboard from "./pages/AthleteDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AthleteExplore from "./pages/athlete-dashboard/Explore";
import AthleteRecruiters from "./pages/athlete-dashboard/Recruiters";
import AthleteProfile from "./pages/athlete-dashboard/Profile";


const sportsConnect = createBrowserRouter([
{ path: '/', element: <Home />},
{ path: '/recruitersignup', element: <RecruiterSignUp />},
{ path: '/athletesignup', element: <AthleteSignUp />},
{ path: '/signin', element: <SignIn />},
{ path: '/athletedashboard', element: <AthleteDashboard />},
{ path: '/athleteexplore', element: <AthleteExplore />},
{ path: '/athleterecruiters', element: <AthleteRecruiters />},
{ path: '/athleteprofile', element: <AthleteProfile />},
{ path: '/recruiterdashboard', element: <RecruiterDashboard />},
])





function App() {
 
  return (
    <>
      <RouterProvider router={sportsConnect} />
    </>
  )
}

export default App
