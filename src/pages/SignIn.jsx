import { useState } from "react"
import { useNavigate, Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { LogIn, Eye, EyeOff } from "lucide-react"
import sc25 from "../assets/images/sc25.jpg"
import { loginUser } from "../../src/api/client"
import { toast } from "sonner"

export default function SignIn() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "athlete",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError("")
    }

    const handleSubmit = async () => {
        setError("")

        if (!formData.email || !formData.password) {
            return toast.error("Please enter your email and password")
        }

        try {
            setLoading(true)
            const { data } = await loginUser(formData)

            localStorage.setItem("authToken", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            // Redirect based on role
            if (data.user.role === "athlete") {
                navigate("/athletedashboard")
            } else {
                navigate("/recruiterdashboard")
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-200 flex items-center justify-center p-2 sm:p-4"
                style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 mt-4 sm:mt-10 mb-8 sm:mb-20 mx-2 sm:mx-0">

                    {/* Image side */}
                    <div className="hidden md:block">
                        <img src={sc25} alt="Signin" className="w-full h-48 sm:h-64 md:h-full object-cover" />
                    </div>

                    {/* Form side */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full mb-3 sm:mb-4">
                                <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                            <p className="text-sm sm:text-base text-gray-600">Sign in to your SportsConnect account</p>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Role selector */}
                        <div className="mb-4 sm:mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">I am signing in as:</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                {["athlete", "recruiter"].map(r => (
                                    <label key={r} className="flex items-center cursor-pointer">
                                        <input type="radio" name="role" value={r}
                                            checked={formData.role === r}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                        <span className="ml-2 text-sm text-gray-700 capitalize">{r}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input name="email" type="email" placeholder="Enter your email"
                                    value={formData.email} onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showPassword
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                                </label>
                                <button className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer text-left sm:text-right">
                                    Forgot password?
                                </button>
                            </div>

                            <button onClick={handleSubmit} disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium py-2 px-4 text-sm sm:text-base rounded-md hover:from-blue-600 hover:to-cyan-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 mt-4 sm:mt-6 disabled:opacity-60 disabled:cursor-not-allowed">
                                {loading ? "Signing In..." : "Sign In"}
                            </button>

                            <div className="text-center mt-4 sm:mt-6">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Don't have an account?</p>
                                <div className="flex justify-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
                                    <Link to="/athletesignup" className="text-blue-500 hover:text-blue-600 font-medium">
                                        Sign up as Athlete
                                    </Link>
                                    <span className="text-gray-400">•</span>
                                    <Link to="/recruitersignup" className="text-cyan-500 hover:text-cyan-600 font-medium">
                                        Sign up as Recruiter
                                    </Link>
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