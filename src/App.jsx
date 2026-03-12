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

// Recruiter Dashboard pages
import RecruiterAthletes from "./pages/recruiters-dashboard/Athletes";
import RecruiterShortList from "./pages/recruiters-dashboard/ShortList";
import RecruiterMessages from "./pages/recruiters-dashboard/Messages";
import RecruiterProfile from "./pages/recruiters-dashboard/Profile";
import RecruiterSettings from "./pages/recruiters-dashboard/Settings";


const sportsConnect = createBrowserRouter([
{ path: '/', element: <Home />},
{ path: '/recruitersignup', element: <RecruiterSignUp />},
{ path: '/athletesignup', element: <AthleteSignUp />},
{ path: '/signin', element: <SignIn />},

// Athlete Dashboard routes 
{ path: '/athletedashboard', element: <AthleteDashboard />},
{ path: '/athleteexplore', element: <AthleteExplore />},
{ path: '/athleterecruiters', element: <AthleteRecruiters />},
{ path: '/athleteprofile', element: <AthleteProfile />},
{ path: '/athletepost', element: <AthletePost />},
{ path: '/athletesettings', element: <AthleteSettings />},
{ path: '/athletemessages', element: <AthleteMessages />},
{ path: '/athleteai', element: <AthleteAI />},
{ path: '/athleteonboarding', element: <AthleteOnboarding />},




// Recruiter Dashboard routes
{ path: '/recruiterdashboard', element: <RecruiterDashboard />},
{ path: '/recruiterathletes', element: <RecruiterAthletes />},
{ path: '/recruitershortlist', element: <RecruiterShortList />},
{ path: '/recruitermessages', element: <RecruiterMessages />},
{ path: '/recruiterprofile', element: <RecruiterProfile />},
{ path: '/recruitersettings', element: <RecruiterSettings />}
])





function App() {
 
  return (
    <>
      <RouterProvider router={sportsConnect} />
    </>
  )
}

export default App
