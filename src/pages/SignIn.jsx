import { useState } from "react"
import { useNavigate, Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Eye, EyeOff } from "lucide-react"
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
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      return toast.error("Please enter your email and password")
    }
    try {
      setLoading(true)
      const { data } = await loginUser(formData)
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
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
      <div
        className="min-h-screen bg-[#050A14] flex items-center justify-center p-4"
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');
          .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }

          .field-input {
            width: 100%;
            padding: 11px 14px;
            border-radius: 10px;
            font-size: 0.875rem;
            color: #fff;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            outline: none;
            transition: border-color 0.2s;
          }
          .field-input::placeholder { color: #4a5f7a; }
          .field-input:focus { border-color: rgba(29,168,255,0.5); }

          .role-pill {
            display: flex; align-items: center; gap: 8px;
            padding: 8px 16px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03);
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.875rem;
            color: #8fa3be;
            font-weight: 500;
          }
          .role-pill.active {
            border-color: rgba(29,168,255,0.5);
            background: rgba(29,168,255,0.1);
            color: #1DA8FF;
          }
          .role-dot {
            width: 8px; height: 8px; border-radius: 50%;
            border: 2px solid currentColor;
            transition: background 0.2s;
          }
          .role-pill.active .role-dot { background: #1DA8FF; }
        `}</style>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden my-8"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Image side */}
          <div className="hidden md:block relative">
            <img src={sc25} alt="Signin" className="w-full h-full object-cover" />
            {/* overlay */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to right, transparent 60%, #050A14)" }} />
            <div className="absolute bottom-10 left-8">
              <p className="hiw-label text-white text-4xl leading-none">Sports</p>
              <p className="hiw-label text-[#1DA8FF] text-4xl leading-none">Connect</p>
            </div>
          </div>

          {/* Form side */}
          <div className="p-8 lg:p-12" style={{ background: "#07112B" }}>

            {/* Header */}
            <div className="mb-8">
              <p className="text-[#1DA8FF] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                Welcome Back
              </p>
              <h1 className="hiw-label text-white text-4xl leading-none mb-2">Sign In</h1>
              <p className="text-[#8fa3be] text-sm">Sign in to your SportsConnect account</p>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <p className="text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-3">
                I am signing in as
              </p>
              <div className="flex gap-3">
                {["athlete", "recruiter"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`role-pill ${formData.role === r ? "active" : ""}`}
                  >
                    <span className="role-dot" />
                    <span className="capitalize">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[#8fa3be] text-sm font-medium mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              <div>
                <label className="block text-[#8fa3be] text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="field-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5f7a] hover:text-[#8fa3be] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-3.5 w-3.5 accent-[#1DA8FF]" />
                <span className="text-[#8fa3be] text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#1DA8FF] text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#1DA8FF", boxShadow: "0 0 24px rgba(29,168,255,0.3)" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = "0 0 36px rgba(29,168,255,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(29,168,255,0.3)")}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Sign up links */}
            <div className="mt-6 text-center">
              <p className="text-[#8fa3be] text-sm mb-2">Don't have an account?</p>
              <div className="flex justify-center gap-2 text-sm">
                <Link to="/athletesignup" className="text-[#1DA8FF] hover:underline font-medium">
                  Sign up as Athlete
                </Link>
                <span className="text-[#4a5f7a]">•</span>
                <Link to="/recruitersignup" className="text-[#F59E0B] hover:underline font-medium">
                  Sign up as Recruiter
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}