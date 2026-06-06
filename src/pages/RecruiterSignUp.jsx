import { useState } from "react"
import { Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Eye, EyeOff } from "lucide-react"
import { registerRecruiter, resendVerification } from "../../src/api/client"
import { toast } from "sonner"

export default function RecruiterSignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    position: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.organization) {
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
      await registerRecruiter(formData)
      toast.success("Account created! Check your email.", { id: toastId })
      setSentEmail(formData.email)
      setShowEmailSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');
    .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }
    .field-input {
      width: 100%; padding: 10px 14px; border-radius: 10px;
      font-size: 0.875rem; color: #fff;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      outline: none; transition: border-color 0.2s;
    }
    .field-input::placeholder { color: #4a5f7a; }
    .field-input:focus { border-color: rgba(245,158,11,0.5); }
  `

  // ── Email sent state ──
  if (showEmailSent) {
    return (
      <>
        <Navbar />
        <div className="bg-[#050A14] min-h-screen flex items-center justify-center p-4"
          style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
          <style>{sharedStyles}</style>
          <div className="w-full max-w-md rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-5xl mb-5">📬</div>
            <h2 className="text-white font-bold text-xl mb-2">Check your email!</h2>
            <p className="text-[#8fa3be] text-sm mb-1">We sent a verification link to</p>
            <p className="text-[#F59E0B] font-semibold text-sm mb-4">{sentEmail}</p>
            <p className="text-[#8fa3be] text-xs mb-6">
              Click the link in the email to activate your account. The link expires in 24 hours.
            </p>
            <div className="rounded-xl p-4 text-sm mb-6"
              style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
              <p className="text-[#8fa3be] font-semibold mb-1">Didn't receive it?</p>
              <p className="text-[#8fa3be]">Check your spam folder or{" "}
                <button
                  onClick={async () => {
                    try {
                      await resendVerification(sentEmail)
                      toast.success("Verification email resent!")
                    } catch {
                      toast.error("Failed to resend. Try again.")
                    }
                  }}
                  className="text-[#F59E0B] font-semibold underline cursor-pointer bg-transparent border-none"
                >
                  click here to resend
                </button>
              </p>
            </div>
            <Link to="/signin" className="text-[#8fa3be] hover:text-white text-sm transition-colors">
              Already verified? Sign in →
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // ── Main form ──
  return (
    <>
      <Navbar />
      <div className="bg-[#050A14] min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <style>{sharedStyles}</style>

        <div className="w-full max-w-md my-10 rounded-2xl p-8"
          style={{ background: "#07112B", border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Header */}
          <div className="mb-8">
            <p className="text-[#F59E0B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Scout / Coach
            </p>
            <h1 className="hiw-label text-white text-4xl leading-none mb-2">Join as Recruiter</h1>
            <p className="text-[#8fa3be] text-sm">Discover talented student-athletes across Ghana</p>
          </div>

          <div className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">First Name</label>
                <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Last Name</label>
                <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="field-input" />
              </div>
            </div>

            <div>
              <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="field-input" />
            </div>

            <div>
              <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Organization / College</label>
              <input name="organization" type="text" placeholder="e.g. University of Ghana"
                value={formData.organization} onChange={handleChange} className="field-input" />
            </div>

            <div>
              <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Position / Title</label>
              <input name="position" type="text" placeholder="e.g. Head Coach, Scout"
                value={formData.position} onChange={handleChange} className="field-input" />
            </div>

            <div>
              <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Phone Number</label>
              <input name="phone" type="tel" placeholder="+233 XXX XXX XXX"
                value={formData.phone} onChange={handleChange} className="field-input" />
            </div>

            <div>
              <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" value={formData.password} onChange={handleChange}
                  className="field-input pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5f7a] hover:text-[#8fa3be] cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">Confirm Password</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange}
                  className="field-input pr-10" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5f7a] hover:text-[#8fa3be] cursor-pointer">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: "#F59E0B", boxShadow: "0 0 24px rgba(245,158,11,0.25)" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = "0 0 36px rgba(245,158,11,0.45)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(245,158,11,0.25)")}>
              {loading ? "Creating Account..." : "Create Recruiter Account"}
            </button>

            <p className="text-center text-sm text-[#8fa3be] mt-2">
              Already have an account?{" "}
              <Link to="/signin" className="text-[#F59E0B] hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}