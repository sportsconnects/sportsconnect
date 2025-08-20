import hero from "../assets/images/sc4.png"
import { ArrowRight } from "lucide-react"








export default function Hero() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{backgroundImage: `url(${hero})`}}>
                 <div className="text-center mt-20 mb-12 max-w-4xl mx-auto text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    <span className="text-white">Sports Connect</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"> Recruiting Platform</span>
                </h1>
                <p className="max-w-3xl mx-auto mb-12 text-lg leading-relaxed">Connecting Ghana's most talented student-athletes with college recruiters worldwide.
          <br />
           Showcase your skills, build your profile, and take the next step in your athletic journey.
          </p>


          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >Create Athlete Profile
            <ArrowRight size={20} />
            </button>

            <button className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 cursor-pointer rounded-full border border-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Join as Recruiter
          </button>
          </div>
            </div>
            </div>
        </div>
    )
}