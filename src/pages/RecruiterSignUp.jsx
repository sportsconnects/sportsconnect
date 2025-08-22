import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ClipboardList } from "lucide-react"

export default function RecruiterSignUp() {
    return(
        <>

        <Navbar />

        <div className="bg-gray-200 min-h-screen flex items-center justify-center p-2 sm:p-4">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md mt-4 sm:mt-10 mb-4 sm:mb-10 mx-2 sm:mx-0">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full mb-3 sm:mb-4">
                            <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Join as Recruiter</h1>
                        <p className="text-sm sm:text-base text-gray-600">Discover talented student-athletes</p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text"
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email</label>
                            <input type="email"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Organization/College
                            </label>
                            <input
                                type="text"
                                placeholder="e.g: University of Ghana"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position/Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g: Head Coach, Scout"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="+233 XXX XXX XXX"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium py-2 px-4 text-sm sm:text-base rounded-md hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer duration-200 mt-4 sm:mt-6">
                            Create Recruiter Account
                        </button>

                        <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                            Already have an account?{' '}
                            <button className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />

        </>
    )
}