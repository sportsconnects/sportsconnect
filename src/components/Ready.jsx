import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

export default function Ready() {
    return (
        <div className="bg-[#F1F4F7] px-4 sm:px-6 py-12 sm:py-16 text-center">
            <div className="max-w-4xl mx-auto">
                {/* Heading */}
                <h2 className="font-bold text-[#0057B8] text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug">
                    Ready to Get Started?
                </h2>

                {/* Sub-text */}
                <p className="leading-relaxed text-base sm:text-lg text-gray-700 mb-8 px-2">
                    Join Ghana's premier student-athlete recruiting platform and take your athletic career to the next level
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-10">
                {/* Athlete */}
                <Link to="/athletesignup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 
                        text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full cursor-pointer transition-all 
                        duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base">
                        Create Athlete Profile
                        <ArrowRight size={18} />
                    </button>
                </Link>

                {/* Recruiter */}
                <Link to="/recruitersignup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold 
                        px-6 sm:px-8 py-3 sm:py-4 cursor-pointer rounded-full border border-gray-200 
                        transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                        Join as Recruiter
                    </button>
                </Link>
            </div>
        </div>
    )
}
