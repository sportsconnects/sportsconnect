import { ArrowRight } from "lucide-react"


export default function Ready() {
    return (
        <div className="bg-[#F1F4F7] px-6 py-16 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-bold text-[#0057B8] text-2xl md:text-3xl lg:text-4xl mb-5 leading-tight">Ready to Get Started?</h2>
                <p className="leading-relaxed text-lg mb-8">Join Ghana's premier student-athlete recruiting platform and take your athletic career to the next level</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >Create Athlete Profile
                    <ArrowRight size={20} />
                </button>

                <button className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 cursor-pointer rounded-full border border-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Join as Recruiter
                </button>
            </div>
        </div>
    )
}