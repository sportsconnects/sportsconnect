// src/pages/RecruiterSettings.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import { RecruiterSideNav, ACCENT, ACCENT2, THEME } from "../../components/RecruiterUi"
import {
  User, Bell, Eye, Moon, Sun, LogOut,
  Trash2, Shield, ChevronRight, Check
} from "lucide-react"
import {
  getRecruiterById, updateRecruiterProfile,
  getCurrentUser, isLoggedIn, logoutUser
} from "../../api/client"


// SUB COMPONENTS
function Toggle({ value, onChange, dark }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? ACCENT : dark ? "rgba(255,255,255,0.1)" : "#E5E7EB" }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
        style={{ left: value ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  )
}

function Row({ label, sub, right, border, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: border ? `1px solid ${tk.border}` : "none" }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: tk.text }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: tk.textMuted }}>{sub}</p>}
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  )
}

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


// MAIN PAGE
export default function RecruiterSettings() {
  const navigate = useNavigate()
  const [dark, setDark]       = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  // Account fields
  const [firstName,    setFirstName]    = useState("")
  const [lastName,     setLastName]     = useState("")
  const [institution,  setInstitution]  = useState("")
  const [role,         setRole]         = useState("")
  const [email,        setEmail]        = useState("")
  const [phone,        setPhone]        = useState("")
  const [bio,          setBio]          = useState("")
  const [location,     setLocation]     = useState("")
  const [website,      setWebsite]      = useState("")
  const [experience,   setExperience]   = useState("")

  // Edit toggles
  const [editField, setEditField] = useState(null) 

 
  const [notifs, setNotifs] = useState({
    newAthletes:  true,
    messages:     true,
    offerUpdates: true,
    weeklyReport: true,
    pushMobile:   false,
  })

  const [prefs, setPrefs] = useState({
    publicProfile:   true,
    showInstitution: true,
    allowMessages:   true,
    verifiedOnly:    false,
  })

  // ── Load real data on mount
  useEffect(() => {
    if (!isLoggedIn()) { navigate("/signin"); return }
    const currentUser = getCurrentUser()
    if (!currentUser) { navigate("/signin"); return }

    const id = currentUser._id || currentUser.id
    getRecruiterById(id)
      .then(({ data }) => {
        const u = data.user
        const p = data.profile
        setFirstName(u?.firstName    || "")
        setLastName(u?.lastName      || "")
        setEmail(u?.email            || "")
        setPhone(u?.phone || p?.phone || "")
        setInstitution(p?.organization || p?.institution || "")
        setRole(p?.role              || "")
        setBio(p?.bio                || "")
        setLocation(p?.location      || "")
        setWebsite(p?.website        || "")
        setExperience(p?.experience  || "")
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false))
  }, [])

  // ── Save changes
  const handleSave = async () => {
    setSaving(true)
    try {
      await updateRecruiterProfile({
        firstName,
        lastName,
        organization: institution,
        role,
        bio,
        location,
        phone,
        website,
        experience,
      })
      setSaved(true)
      setEditField(null)
      toast.success("Settings saved")
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    logoutUser()
  }

  const inlineEdit = (field, value, setValue, placeholder = "") => {
    const isEditing = editField === field
    return isEditing ? (
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="rounded-lg px-2 py-1 text-xs outline-none w-36 sm:w-44"
          style={{ background: dark ? "#0C0E14" : "#F8FAFC", border: `1px solid ${ACCENT}`, color: tk.text }}
        />
        <button onClick={() => setEditField(null)}>
          <Check className="w-4 h-4" style={{ color: "#10B981" }} />
        </button>
      </div>
    ) : (
      <button className="text-xs font-bold" style={{ color: ACCENT }} onClick={() => setEditField(field)}>
        Edit
      </button>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: tk.page }}>
        <p className="text-sm" style={{ color: tk.textMuted }}>Loading settings...</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main
          className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}
        >
          <div className="px-4 pt-6 pb-4 max-w-xl">

            <h1
              className="font-black text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}
            >
              SETTINGS
            </h1>
            <p className="text-sm mb-6" style={{ color: tk.textMuted }}>Manage your scout account</p>

            {/* Account */}
            <Section icon={User} title="Account" dark={dark}>
              <Row border dark={dark}
                label="First Name"
                sub={editField === "firstName" ? undefined : firstName || "Not set"}
                right={inlineEdit("firstName", firstName, setFirstName, "First name")}
              />
              <Row border dark={dark}
                label="Last Name"
                sub={editField === "lastName" ? undefined : lastName || "Not set"}
                right={inlineEdit("lastName", lastName, setLastName, "Last name")}
              />
              <Row border dark={dark}
                label="Institution"
                sub={editField === "institution" ? undefined : institution || "Not set"}
                right={inlineEdit("institution", institution, setInstitution, "e.g. University of Ghana")}
              />
              <Row border dark={dark}
                label="Role"
                sub={editField === "role" ? undefined : role || "Not set"}
                right={inlineEdit("role", role, setRole, "e.g. Head Scout")}
              />
              <Row border dark={dark}
                label="Email"
                sub={editField === "email" ? undefined : email || "Not set"}
                right={inlineEdit("email", email, setEmail, "your@email.com")}
              />
              <Row border dark={dark}
                label="Phone"
                sub={editField === "phone" ? undefined : phone || "Not set"}
                right={inlineEdit("phone", phone, setPhone, "+233 XX XXX XXXX")}
              />
              <Row border dark={dark}
                label="Location"
                sub={editField === "location" ? undefined : location || "Not set"}
                right={inlineEdit("location", location, setLocation, "e.g. Accra, Ghana")}
              />
              <Row border dark={dark}
                label="Website"
                sub={editField === "website" ? undefined : website || "Not set"}
                right={inlineEdit("website", website, setWebsite, "sports.ug.edu.gh")}
              />
              <Row border dark={dark}
                label="Experience"
                sub={editField === "experience" ? undefined : experience || "Not set"}
                right={inlineEdit("experience", experience, setExperience, "e.g. 10 years")}
              />
              <Row dark={dark}
                label="Bio"
                sub={editField === "bio" ? undefined : bio ? bio.slice(0, 40) + (bio.length > 40 ? "..." : "") : "Not set"}
                right={
                  editField === "bio" ? (
                    <button onClick={() => setEditField(null)}>
                      <Check className="w-4 h-4" style={{ color: "#10B981" }} />
                    </button>
                  ) : (
                    <button className="text-xs font-bold" style={{ color: ACCENT }} onClick={() => setEditField("bio")}>
                      Edit
                    </button>
                  )
                }
              />
              {editField === "bio" && (
                <div className="pb-3">
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="Tell athletes about your scouting background..."
                    className="w-full rounded-xl px-3 py-2 text-xs outline-none resize-none"
                    style={{ background: dark ? "#0C0E14" : "#F8FAFC", border: `1px solid ${ACCENT}`, color: tk.text }}
                  />
                </div>
              )}
            </Section>

            {/* Appearance */}
            <Section icon={dark ? Moon : Sun} title="Appearance" dark={dark}>
              <Row dark={dark}
                label="Dark Mode"
                sub="Switch between light and dark"
                right={<Toggle value={dark} onChange={setDark} dark={dark} />}
              />
            </Section>

            {/* Notifications */}
            <Section icon={Bell} title="Notifications" dark={dark}>
              {[
                { key: "newAthletes",  label: "New Athlete Matches",  sub: "Athletes matching your filters"  },
                { key: "messages",     label: "New Messages",         sub: "When athletes reply to you"      },
                { key: "offerUpdates", label: "Offer Updates",        sub: "Accepted, declined or expired"   },
                { key: "weeklyReport", label: "Weekly Scout Report",  sub: "Summary of scouting activity"    },
                { key: "pushMobile",   label: "Push Notifications",   sub: "Alerts on your phone"            },
              ].map(({ key, label, sub }, i, arr) => (
                <Row
                  key={key}
                  border={i < arr.length - 1}
                  dark={dark}
                  label={label}
                  sub={sub}
                  right={
                    <Toggle
                      value={notifs[key]}
                      onChange={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
                      dark={dark}
                    />
                  }
                />
              ))}
            </Section>

            {/* Privacy */}
            <Section icon={Eye} title="Profile & Privacy" dark={dark}>
              {[
                { key: "publicProfile",   label: "Public Profile",         sub: "Athletes can find you in search"        },
                { key: "showInstitution", label: "Show Institution",       sub: `Display ${institution || "institution"} on profile` },
                { key: "allowMessages",   label: "Allow Messages",         sub: "Athletes can message you directly"      },
                { key: "verifiedOnly",    label: "Verified Athletes Only", sub: "Filter to verified profiles only"       },
              ].map(({ key, label, sub }, i, arr) => (
                <Row
                  key={key}
                  border={i < arr.length - 1}
                  dark={dark}
                  label={label}
                  sub={sub}
                  right={
                    <Toggle
                      value={prefs[key]}
                      onChange={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                      dark={dark}
                    />
                  }
                />
              ))}
            </Section>

            {/* Security */}
            <Section icon={Shield} title="Security" dark={dark}>
              <Row border dark={dark}
                label="Two-Factor Authentication"
                sub="Add extra login security"
                right={
                  <button
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    Enable
                  </button>
                }
              />
              <Row dark={dark}
                label="Active Sessions"
                sub="Manage logged-in devices"
                right={
                  <button className="flex items-center gap-1 text-xs font-bold" style={{ color: ACCENT }}>
                    View<ChevronRight className="w-3.5 h-3.5" />
                  </button>
                }
              />
            </Section>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white mb-3 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              style={{ background: saved ? "#10B981" : `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
            >
              {saving ? "Saving..." : saved ? <><Check className="w-4 h-4" />Saved!</> : "Save Changes"}
            </button>

            {/* Danger zone */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <p className="text-xs font-black mb-3" style={{ color: "#EF4444" }}>DANGER ZONE</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSignOut}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all"
                  style={{ borderColor: "rgba(239,68,68,0.4)", color: "#EF4444" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <RecruiterBottomNav dark={dark} />
    </div>
  )
}