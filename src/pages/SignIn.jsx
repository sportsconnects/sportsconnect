import { LogIn } from "lucide-react"
import Navbar from "../components/Navbar"
import sc25 from "../assets/images/sc25.jpg";
import Footer from "../components/Footer";

export default function SignIn() {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-200 flex items-center justify-center p-2 sm:p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 mt-4 sm:mt-10 mb-8 sm:mb-20 mx-2 sm:mx-0">
                    
                    {/* Right Section - Image */}
                    <div className="block">
                        <img
                            src={sc25}
                            alt="Signin image"
                            className="w-full h-48 sm:h-64 md:h-full object-cover"
                        />
                    </div>

                    {/* Left Section - Form */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full mb-3 sm:mb-4">
                                <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                            <p className="text-sm sm:text-base text-gray-600">Sign in to your TalentConnect account</p>
                        </div>

                        {/* Radio Selection */}
                        <div className="mb-4 sm:mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">I am signing in as:</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="athlete"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Athlete</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="recruiter"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Recruiter</span>
                                </label>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                                </label>
                                <button className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer text-left sm:text-right">
                                    Forgot password?
                                </button>
                            </div>

                            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium py-2 px-4 text-sm sm:text-base rounded-md hover:from-blue-600 hover:to-cyan-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 mt-4 sm:mt-6">
                                Sign In
                            </button>

                            {/* Sign Up Options */}
                            <div className="text-center mt-4 sm:mt-6">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Don't have an account?</p>
                                <div className="flex justify-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
                                    <button className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                                        Sign up as Athlete
                                    </button>
                                    <span className="text-gray-400">•</span>
                                    <button className="text-cyan-500 hover:text-cyan-600 font-medium cursor-pointer">
                                        Sign up as Recruiter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}