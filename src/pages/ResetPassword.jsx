import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { resetPassword } from "../../src/api/client"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // If no token in URL, show invalid state immediately
  const [invalidToken] = useState(!token)

  const handleSubmit = async () => {
    if (!password || !confirmPassword) return toast.error("Please fill in both fields")
    if (password.length < 6) return toast.error("Password must be at least 6 characters")
    if (password !== confirmPassword) return toast.error("Passwords do not match")

    const toastId = toast.loading("Resetting your password...")
    try {
      setLoading(true)
      await resetPassword(token, password)
      toast.success("Password reset successfully!", { id: toastId })
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong."
      const expired = err.response?.data?.expired
      toast.error(msg, { id: toastId })
      if (expired) {
        setTimeout(() => navigate("/forgot-password"), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');
    .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }
    .field-input {
      width: 100%; padding: 11px 14px; border-radius: 10px;
      font-size: 0.875rem; color: #fff;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      outline: none; transition: border-color 0.2s;
    }
    .field-input::placeholder { color: #4a5f7a; }
    .field-input:focus { border-color: rgba(29,168,255,0.5); }
  `

  return (
    <>
      <Navbar />
      <div
        className="bg-[#050A14] min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      >
        <style>{sharedStyles}</style>

        <div className="w-full max-w-md">

          {/* ── Invalid / missing token ── */}
          {invalidToken && (
            <div className="rounded-2xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-5xl mb-5">⚠️</div>
              <h2 className="text-white font-bold text-xl mb-2">Invalid Reset Link</h2>
              <p className="text-[#8fa3be] text-sm mb-8">
                This password reset link is missing or invalid. Please request a new one.
              </p>
              <Link to="/forgot-password">
                <button className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer"
                  style={{ background: "#1DA8FF", boxShadow: "0 0 24px rgba(29,168,255,0.3)" }}>
                  Request New Link
                </button>
              </Link>
            </div>
          )}

          {/* ── Success state ── */}
          {!invalidToken && success && (
            <div className="rounded-2xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(29,168,255,0.12)", border: "1px solid rgba(29,168,255,0.25)" }}>
                  <ShieldCheck className="w-6 h-6 text-[#1DA8FF]" />
                </div>
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Password Reset!</h2>
              <p className="text-[#8fa3be] text-sm mb-8">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <Link to="/signin">
                <button className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer"
                  style={{ background: "#1DA8FF", boxShadow: "0 0 24px rgba(29,168,255,0.3)" }}>
                  Sign In
                </button>
              </Link>
            </div>
          )}

          {/* ── Reset form ── */}
          {!invalidToken && !success && (
            <div className="rounded-2xl p-8"
              style={{ background: "#07112B", border: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Header */}
              <div className="mb-8">
                <p className="text-[#1DA8FF] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                  Account Security
                </p>
                <h1 className="hiw-label text-white text-4xl leading-none mb-2">Reset Password</h1>
                <p className="text-[#8fa3be] text-sm">Choose a strong new password for your account.</p>
              </div>

              <div className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="field-input pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5f7a] hover:text-[#8fa3be] cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-[#8fa3be] text-xs font-semibold uppercase tracking-widest mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="field-input pr-10"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5f7a] hover:text-[#8fa3be] cursor-pointer">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength hint */}
                <p className="text-[#4a5f7a] text-xs">
                  Must be at least 6 characters.
                </p>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ background: "#1DA8FF", boxShadow: "0 0 24px rgba(29,168,255,0.3)" }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = "0 0 36px rgba(29,168,255,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(29,168,255,0.3)")}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                {/* Back */}
                <div className="text-center pt-2">
                  <Link to="/signin"
                    className="inline-flex items-center gap-2 text-[#8fa3be] hover:text-white text-sm transition-colors">
                    <ArrowLeft size={15} />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}