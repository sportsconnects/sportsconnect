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
import AthletePost from "./pages/athlete-dashboard/Post";
import AthleteSettings from "./pages/athlete-dashboard/Settings";
import AthleteMessages from "./pages/athlete-dashboard/Messages";
import AthleteAI from "./pages/athlete-dashboard/AI";
import AthleteOnboarding from "./pages/AthleteOnboarding"

import VerifyEmail from "./pages/VerifyEmail";

// Recruiter Dashboard pages
import RecruiterAthletes from "./pages/recruiters-dashboard/Athletes";
import RecruiterShortList from "./pages/recruiters-dashboard/ShortList";
import RecruiterMessages from "./pages/recruiters-dashboard/Messages";
import RecruiterProfile from "./pages/recruiters-dashboard/Profile";
import RecruiterSettings from "./pages/recruiters-dashboard/Settings";

import ProtectedRoute from "./components/ProtectedRoute";


const sportsConnect = createBrowserRouter([
{ path: '/', element: <Home />},
{ path: '/recruitersignup', element: <RecruiterSignUp />},
{ path: '/athletesignup', element: <AthleteSignUp />},
{ path: '/signin', element: <SignIn />},
{ path: '/verify-email', element: <VerifyEmail /> },

// Athlete Dashboard routes 
{ path: '/athletedashboard', element: <ProtectedRoute role="athlete"><AthleteDashboard /> </ProtectedRoute>},
{ path: '/athleteexplore', element:<ProtectedRoute role="athlete"><AthleteExplore /> </ProtectedRoute>},
{ path: '/athleterecruiters', element:<ProtectedRoute role="athlete"><AthleteRecruiters /> </ProtectedRoute>},
{ path: '/athleteprofile', element:<ProtectedRoute role="athlete"><AthleteProfile /> </ProtectedRoute>},
{ path: '/athletepost', element:<ProtectedRoute role="athlete"> <AthletePost /> </ProtectedRoute>},
{ path: '/athletesettings', element:<ProtectedRoute role="athlete"> <AthleteSettings /> </ProtectedRoute>},
{ path: '/athletemessages', element:<ProtectedRoute role="athlete"><AthleteMessages /> </ProtectedRoute>},
{ path: '/athleteai', element:<ProtectedRoute role="athlete"><AthleteAI /> </ProtectedRoute>},
{ path: '/athleteonboarding', element:<ProtectedRoute role="athlete"> <AthleteOnboarding /> </ProtectedRoute>},




// Recruiter Dashboard routes
{ path: '/recruiterdashboard', element:<ProtectedRoute role="recruiter"> <RecruiterDashboard /> </ProtectedRoute>},
{ path: '/recruiterathletes', element:<ProtectedRoute role="recruiter"><RecruiterAthletes /> </ProtectedRoute>},
{ path: '/recruitershortlist', element:<ProtectedRoute role="recruiter"><RecruiterShortList /> </ProtectedRoute>},
{ path: '/recruitermessages', element:<ProtectedRoute role="recruiter"> <RecruiterMessages /> </ProtectedRoute>},
{ path: '/recruiterprofile', element:<ProtectedRoute role="recruiter"><RecruiterProfile /> </ProtectedRoute>},
{ path: '/recruitersettings', element:<ProtectedRoute role="recruiter"> <RecruiterSettings /> </ProtectedRoute>}
])





function App() {
 
  return (
    <>
      <RouterProvider router={sportsConnect} />
    </>
  )
}

export default App
