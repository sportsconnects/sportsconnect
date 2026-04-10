import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router"
import { toast } from "sonner"
import { resendVerification } from "../api/client.js"
import axios from "axios"

const ACCENT = "#1DA8FF"

export default function VerifyEmail() {
  const [params]  = useSearchParams()
  const navigate  = useNavigate()
  const [status,  setStatus]  = useState("verifying") 
  const [message, setMessage] = useState("")
  const [email,   setEmail]   = useState("")
  const [resending, setResending] = useState(false)
  const [resent,    setResent]    = useState(false)

  useEffect(() => {
    const token = params.get("token")
    if (!token) {
      setStatus("error")
      setMessage("No verification token found in this link.")
      return
    }

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`)
      .then(({ data }) => {
        // Store JWT and user — same as normal login
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setStatus("success")
        toast.success("Email verified! Welcome to SportsConnect 🎉")
        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "athlete") {
            navigate("/athleteonboarding")
          } else {
            navigate("/recruiterdashboard")
          }
        }, 2000)
      })
      .catch(err => {
        setStatus("error")
        setMessage(
          err.response?.data?.message ||
          "This verification link is invalid or has expired."
        )
      })
  }, [])

  const handleResend = async () => {
    if (!email.trim()) return toast.error("Please enter your email")
    setResending(true)
    try {
      await resendVerification(email.trim())
      setResent(true)
      toast.success("New verification email sent! Check your inbox.")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend. Try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07112B",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: 24
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
      `}</style>

      <div style={{
        background: "#161B22",
        borderRadius: 24,
        padding: "48px 40px",
        maxWidth: 420,
        width: "100%",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.07)",
        animation: "fadeUp 0.4s ease both"
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: ACCENT, fontSize: 26, fontWeight: 900, letterSpacing: 4, margin: "0 0 2px" }}>
            SPORTS
          </h1>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, letterSpacing: 4, margin: 0 }}>
            CONNECT
          </h1>
        </div>

        {/* VERIFYING */}
        {status === "verifying" && (
          <>
            <div style={{
              width: 52, height: 52,
              border: `4px solid ${ACCENT}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              margin: "0 auto 24px",
              animation: "spin 0.8s linear infinite"
            }} />
            <h2 style={{ color: "#fff", marginBottom: 8 }}>Verifying your email...</h2>
            <p style={{ color: "#94A3B8", fontSize: 14 }}>Just a moment</p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div style={{
              width: 72, height: 72,
              background: "rgba(16,185,129,0.15)",
              borderRadius: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 32
            }}></div>
            <h2 style={{ color: "#fff", marginBottom: 8 }}>Email Verified!</h2>
            <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24 }}>
              Welcome to SportsConnect. Setting up your profile now...
            </p>
            <div style={{
              width: 40, height: 4,
              background: ACCENT,
              borderRadius: 4,
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }} />
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div style={{
              width: 72, height: 72,
              background: "rgba(239,68,68,0.15)",
              borderRadius: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 32
            }}>⏰</div>
            <h2 style={{ color: "#fff", marginBottom: 8 }}>Link Expired</h2>
            <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 28 }}>
              {message}
            </p>

            {/* Resend form */}
            {!resent ? (
              <div style={{ textAlign: "left" }}>
                <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 10 }}>
                  Enter your email to get a new verification link:
                </p>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleResend()}
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#0D1117",
                    color: "#fff",
                    fontSize: 14,
                    marginBottom: 12,
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleResend}
                  disabled={resending}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    background: ACCENT,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    cursor: resending ? "not-allowed" : "pointer",
                    opacity: resending ? 0.7 : 1
                  }}
                >
                  {resending ? "Sending..." : "Resend Verification Email"}
                </button>
              </div>
            ) : (
              <div style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 12,
                padding: "16px",
                color: "#10B981",
                fontSize: 14
              }}>
                 Email sent! Check your inbox and spam folder.
              </div>
            )}

            <Link
              to="/signin"
              style={{ display: "block", marginTop: 20, color: "#94A3B8", fontSize: 13, textDecoration: "none" }}
            >
              ← Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}