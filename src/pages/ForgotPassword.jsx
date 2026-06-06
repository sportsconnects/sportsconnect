import { useState } from "react"
import { Link } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { forgotPassword } from "../../src/api/client"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email address")

    const toastId = toast.loading("Sending reset link...")
    try {
      setLoading(true)
      await forgotPassword(email)
      toast.success("Reset link sent!", { id: toastId })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div
        className="bg-[#050A14] min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');`}</style>

        <div className="w-full max-w-md">

          {!sent ? (
            <div
              className="rounded-2xl p-8"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(29,168,255,0.12)", border: "1px solid rgba(29,168,255,0.25)" }}>
                  <Mail className="w-6 h-6 text-[#1DA8FF]" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-white font-bold text-2xl mb-2">Forgot Password?</h1>
                <p className="text-[#8fa3be] text-sm leading-relaxed">
                  No worries — enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#8fa3be] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-[#4a5f7a] outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(29,168,255,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#1DA8FF", boxShadow: "0 0 24px rgba(29,168,255,0.3)" }}
                onMouseEnter={e => !loading && (e.target.style.boxShadow = "0 0 36px rgba(29,168,255,0.5)")}
                onMouseLeave={e => e.target.style.boxShadow = "0 0 24px rgba(29,168,255,0.3)"}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Back to sign in */}
              <div className="mt-6 text-center">
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 text-[#8fa3be] hover:text-white text-sm transition-colors"
                >
                  <ArrowLeft size={15} />
                  Back to Sign In
                </Link>
              </div>
            </div>

          ) : (

            /* Success state */
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-5xl mb-5">📬</div>
              <h2 className="text-white font-bold text-xl mb-2">Check your inbox</h2>
              <p className="text-[#8fa3be] text-sm leading-relaxed mb-2">
                We sent a password reset link to
              </p>
              <p className="text-[#1DA8FF] font-semibold text-sm mb-6">{email}</p>
              <p className="text-[#8fa3be] text-xs mb-8">
                The link expires in 1 hour. Check your spam folder if you don't see it.
              </p>

              <button
                onClick={async () => {
                  try {
                    await forgotPassword(email),
                    toast.success("Reset link resent!")
                  } catch {
                    toast.error("Failed to resend. Try again.")
                  }
                }}
                className="text-[#1DA8FF] text-sm font-semibold underline cursor-pointer bg-transparent border-none mb-6 block mx-auto"
              >
                Resend email
              </button>

              <Link
                to="/signin"
                className="inline-flex items-center gap-2 text-[#8fa3be] hover:text-white text-sm transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Sign In
              </Link>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}