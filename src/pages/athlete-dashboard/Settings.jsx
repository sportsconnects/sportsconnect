// src/pages/AthleteSettings.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import AthleteNavbar from "./../../components/AthleteNavbar"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import {
  User, Bell, Lock, Eye, Moon, Sun, LogOut, ChevronRight,
  Shield, Trash2, Mail, Phone, Globe, Check, Smartphone
} from "lucide-react"

import {
  getCurrentUser, isLoggedIn, logoutUser,
  updateAthleteProfile, deleteAccount
} from "../../api/client"

const ACCENT = "#1DA8FF"

const THEME = {
  dark: { page: "#0D1117", surface: "#161B22", border: "rgba(255,255,255,0.06)", text: "#F0F6FF", textSub: "#9CA3AF", textMuted: "#4B5563", inputBg: "#0D1117", inputBorder: "rgba(255,255,255,0.1)" },
  light: { page: "#F0F4FA", surface: "#FFFFFF", border: "#E5E7EB", text: "#111827", textSub: "#6B7280", textMuted: "#9CA3AF", inputBg: "#F8FAFC", inputBorder: "#D1D5DB" },
}

// ── Toggle 
function Toggle({ value, onChange, dark }) {
  return (
    <button onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? ACCENT : dark ? "rgba(255,255,255,0.1)" : "#E5E7EB" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
        style={{ left: value ? "calc(100% - 22px)" : "2px" }} />
    </button>
  )
}

// ── Setting Row
function SettingRow({ label, sub, right, border, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: border ? `1px solid ${tk.border}` : "none" }}>
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: tk.text }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: tk.textMuted }}>{sub}</p>}
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  )
}

// ── Section Card
function Section({ icon: Icon, title, children, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <div className="flex items-center gap-2 px-4 py-3.5"
        style={{ borderBottom: `1px solid ${tk.border}` }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: `${ACCENT}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
        </div>
        <h2 className="font-black text-sm" style={{ color: tk.text }}>{title}</h2>
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
}

// ── Main Page 
export default function AthleteSettings() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [activeNav, setNav] = useState("settings")
  const tk = dark ? THEME.dark : THEME.light

  // Real user state
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Account fields 
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Edit states
  const [editEmail, setEditEmail] = useState(false)
  const [editPhone, setEditPhone] = useState(false)
  const [editName, setEditName] = useState(false)

  // Notifications
  const [notifs, setNotifs] = useState({
    recruiterViews: true,
    messages: true,
    offers: true,
    followers: false,
    emailDigest: true,
    pushMobile: true,
  })
  const toggleNotif = key => setNotifs(p => ({ ...p, [key]: !p[key] }))

  // Privacy
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showGPA: true,
    showSchool: true,
    recruitersOnly: false,
  })
  const togglePrivacy = key => setPrivacy(p => ({ ...p, [key]: !p[key] }))

  // Save state
  const [saved, setSaved] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)


  // ── Load real user data 
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin")
      return
    }

    const user = getCurrentUser()
    setCurrentUser(user)
    setFirstName(user.firstName || "")
    setLastName(user.lastName || "")
    setEmail(user.email || "")
    setPhone(user.phone || "")
  }, [navigate])

  // ── Save changes
  const handleSave = async () => {
    setLoading(true)
    try {
      await updateAthleteProfile({
      })
      const updatedUser = {
        ...currentUser,
        firstName,
        lastName,
        email,
        phone,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      toast.success("Settings saved successfully")

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  // ── Sign out 
  const handleSignOut = () => {
    toast.loading("Signing out...")
    setTimeout(() => {
      logoutUser()
    }, 800)
  }

  // ── Delete account
 const handleDeleteAccount = async () => {
  try {
    toast.loading("Deleting account...", { id: "delete" })
    await deleteAccount()
    toast.success("Account deleted", { id: "delete" })
    setTimeout(() => logoutUser(), 1000)
  } catch (err) {
    toast.error("Failed to delete account. Try again.", { id: "delete" })
  }
}

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeNav} setActive={setNav} dark={dark} />
        </div>

        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>
          <div className="px-4 pt-6 pb-4 max-w-xl">

            {/* Title */}
            <h1 className="font-black text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}>
              SETTINGS
            </h1>
            <p className="text-sm mb-6" style={{ color: tk.textMuted }}>
              Manage your account preferences
            </p>

            {/* ── Account ── */}
            <Section icon={User} title="Account" dark={dark}>
              {/* Full Name */}
              <SettingRow border dark={dark}
                label="Full Name"
                sub={editName ? undefined : `${firstName} ${lastName}`}
                right={
                  editName ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="First"
                        className="rounded-lg px-2 py-1 text-xs outline-none w-20"
                        style={{ background: tk.inputBg, border: `1px solid ${ACCENT}`, color: tk.text }}
                      />
                      <input
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Last"
                        className="rounded-lg px-2 py-1 text-xs outline-none w-20"
                        style={{ background: tk.inputBg, border: `1px solid ${ACCENT}`, color: tk.text }}
                      />
                      <button onClick={() => setEditName(false)}>
                        <Check className="w-4 h-4" style={{ color: "#10B981" }} />
                      </button>
                    </div>
                  ) : (
                    <button className="text-xs font-bold" style={{ color: ACCENT }}
                      onClick={() => setEditName(true)}>
                      Edit
                    </button>
                  )
                }
              />

              {/* Email */}
              <SettingRow border dark={dark}
                label="Email Address"
                sub={editEmail ? undefined : email}
                right={
                  editEmail ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="rounded-lg px-2 py-1 text-xs outline-none w-44"
                        style={{ background: tk.inputBg, border: `1px solid ${ACCENT}`, color: tk.text }}
                      />
                      <button onClick={() => setEditEmail(false)}>
                        <Check className="w-4 h-4" style={{ color: "#10B981" }} />
                      </button>
                    </div>
                  ) : (
                    <button className="text-xs font-bold" style={{ color: ACCENT }}
                      onClick={() => setEditEmail(true)}>
                      Edit
                    </button>
                  )
                }
              />

              {/* Phone */}
              <SettingRow border dark={dark}
                label="Phone Number"
                sub={editPhone ? undefined : (phone || "Not set")}
                right={
                  editPhone ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+233 XX XXX XXXX"
                        className="rounded-lg px-2 py-1 text-xs outline-none w-40"
                        style={{ background: tk.inputBg, border: `1px solid ${ACCENT}`, color: tk.text }}
                      />
                      <button onClick={() => setEditPhone(false)}>
                        <Check className="w-4 h-4" style={{ color: "#10B981" }} />
                      </button>
                    </div>
                  ) : (
                    <button className="text-xs font-bold" style={{ color: ACCENT }}
                      onClick={() => setEditPhone(true)}>
                      Edit
                    </button>
                  )
                }
              />

              {/* Password */}
              <SettingRow dark={dark}
                label="Password"
                sub="Change your account password"
                right={
                  <button className="text-xs font-bold" style={{ color: ACCENT }}>
                    Change
                  </button>
                }
              />
            </Section>

            {/* ── Appearance ── */}
            <Section icon={dark ? Moon : Sun} title="Appearance" dark={dark}>
              <SettingRow dark={dark}
                label="Dark Mode"
                sub="Switch between light and dark theme"
                right={<Toggle value={dark} onChange={setDark} dark={dark} />}
              />
            </Section>

            {/* ── Notifications ── */}
            {/* <Section icon={Bell} title="Notifications" dark={dark}>
              {[
                { key: "recruiterViews", label: "Recruiter Views", sub: "When a scout views your profile" },
                { key: "messages", label: "New Messages", sub: "When recruiters message you" },
                { key: "offers", label: "Scholarship Offers", sub: "New offers and deadlines" },
                { key: "followers", label: "New Followers", sub: "When someone follows you" },
                { key: "emailDigest", label: "Weekly Email Digest", sub: "Summary of your activity" },
                { key: "pushMobile", label: "Push Notifications", sub: "Alerts on your phone" },
              ].map(({ key, label, sub }, i, arr) => (
                <SettingRow key={key} dark={dark}
                  border={i < arr.length - 1}
                  label={label} sub={sub}
                  right={<Toggle value={notifs[key]} onChange={() => toggleNotif(key)} dark={dark} />}
                />
              ))}
            </Section> */}

            {/* ── Privacy ── */}
            {/* <Section icon={Eye} title="Privacy" dark={dark}>
              {[
                { key: "publicProfile", label: "Public Profile", sub: "Anyone can find and view your profile" },
                { key: "showGPA", label: "Show GPA", sub: "Display your academic score publicly" },
                { key: "showSchool", label: "Show School Name", sub: "Show your school on your profile" },
                { key: "recruitersOnly", label: "Recruiters Only Mode", sub: "Only verified scouts can view your profile" },
              ].map(({ key, label, sub }, i, arr) => (
                <SettingRow key={key} dark={dark}
                  border={i < arr.length - 1}
                  label={label} sub={sub}
                  right={<Toggle value={privacy[key]} onChange={() => togglePrivacy(key)} dark={dark} />}
                />
              ))}
            </Section> */}

            {/* ── Security ── */}
            {/* <Section icon={Shield} title="Security" dark={dark}>
              <SettingRow border dark={dark}
                label="Two-Factor Authentication"
                sub="Add an extra layer of security"
                right={
                  <button className="text-xs font-bold px-3 py-1.5 rounded-xl border"
                    style={{ borderColor: ACCENT, color: ACCENT }}>
                    Enable
                  </button>
                }
              />
              <SettingRow dark={dark}
                label="Active Sessions"
                sub="Manage devices logged in"
                right={
                  <button className="flex items-center gap-1 text-xs font-bold" style={{ color: ACCENT }}>
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                }
              />
            </Section> */}

            {/* ── Save button ── */}
            <button onClick={handleSave} disabled={loading}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white mb-3 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: saved ? "#10B981" : `linear-gradient(135deg,${ACCENT},#6366F1)` }}>
              {saved
                ? <><Check className="w-4 h-4" /> Saved!</>
                : loading ? "Saving..." : "Save Changes"}
            </button>

            {/* ── Danger zone ── */}
            <div className="rounded-2xl p-4 mb-4"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-black mb-3" style={{ color: "#EF4444" }}>DANGER ZONE</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleSignOut}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
                <button onClick={() => setShowDeleteModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <MobileBottomNav dark={dark} />

      {/* ── Delete Account Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: tk.surface, border: `1px solid rgba(239,68,68,0.3)` }}>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Trash2 className="w-6 h-6" style={{ color: "#EF4444" }} />
            </div>

            {/* Text */}
            <h2 className="font-black text-lg text-center mb-2" style={{ color: tk.text }}>
              Delete Account?
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: tk.textMuted }}>
              This will permanently delete your profile, highlights, and all your data.
              <span className="font-bold" style={{ color: "#EF4444" }}> This cannot be undone.</span>
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold border transition-all"
                style={{ borderColor: tk.border, color: tk.textSub }}
                onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  handleDeleteAccount()
                }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: "#EF4444" }}
                onMouseEnter={e => e.currentTarget.style.background = "#DC2626"}
                onMouseLeave={e => e.currentTarget.style.background = "#EF4444"}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}