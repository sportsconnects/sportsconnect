import { useState } from "react"
import { useNavigate, Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { User, Eye, EyeOff } from "lucide-react"
import { registerAthlete } from "../../src/api/client"
import { toast } from "sonner"

export default function AthleteSignUp() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async () => {
    // Validation — use toast.error instead of setError
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return toast.error("Please fill in all required fields")
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }

    const toastId = toast.loading("Creating your account...")

    try {
      setLoading(true)
      const { data } = await registerAthlete(formData)

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Account created successfully! Redirecting...", { id: toastId })

      setTimeout(() => navigate("/signin"), 1500)

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Try again.", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex items-center justify-center p-2 sm:p-4"
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md mt-4 sm:mt-10 mb-4 sm:mb-10 mx-2 sm:mx-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full mb-3 sm:mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Join as Athlete</h1>
            <p className="text-sm sm:text-base text-gray-600">Showcase your talent to college recruiters</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input name="phone" type="tel" placeholder="+233 XXX XXX XXX" value={formData.phone} onChange={handleChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium py-2 px-4 text-sm sm:text-base rounded-md hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer duration-200 mt-4 sm:mt-6 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating Account..." : "Create Athlete Account"}
            </button>

            <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500 hover:text-blue-600 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}