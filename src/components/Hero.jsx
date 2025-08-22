import hero from "../assets/images/sc4.png"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

export default function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* Content */}
        <div className="relative text-center px-4 sm:px-6 mt-20 mb-12 max-w-4xl mx-auto text-white">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="text-white">Sports Connect</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Recruiting Platform
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-3xl mx-auto mb-12 text-base sm:text-lg md:text-xl leading-relaxed">
            Connecting Ghana's most talented student-athletes with college
            recruiters worldwide.
            <br />
            Showcase your skills, build your profile, and take the next step in
            your athletic journey.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link to="/athletesignup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                Create Athlete Profile
                <ArrowRight size={20} />
              </button>
            </Link>

            <Link to="/recruitersignup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 cursor-pointer rounded-full border border-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Join as Recruiter
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
