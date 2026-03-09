// src/pages/RecruiterSettings.jsx

import { useState } from "react"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import { RecruiterSideNav, ACCENT, ACCENT2, THEME } from "../../components/RecruiterUi"
import {
  User, Bell, Eye, Moon, Sun, LogOut,
  Trash2, Shield, ChevronRight, Check
} from "lucide-react"

function Toggle({ value, onChange, dark }) {
  return (
    <button onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? ACCENT : dark?"rgba(255,255,255,0.1)":"#E5E7EB" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
        style={{ left: value?"calc(100% - 22px)":"2px" }} />
    </button>
  )
}

function Row({ label, sub, right, border, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: border?`1px solid ${tk.border}`:"none" }}>
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color:tk.text }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color:tk.textMuted }}>{sub}</p>}
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  )
}

function Section({ icon:Icon, title, children, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
      <div className="flex items-center gap-2 px-4 py-3.5"
        style={{ borderBottom:`1px solid ${tk.border}` }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background:`${ACCENT}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color:ACCENT }} />
        </div>
        <h2 className="font-black text-sm" style={{ color:tk.text }}>{title}</h2>
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
}

export default function RecruiterSettings() {
  const [dark, setDark]     = useState(false)
  const [email, setEmail]   = useState("d.mensah@ug.edu.gh")
  const [editEmail, setEdit]= useState(false)
  const tk = dark ? THEME.dark : THEME.light

  const [notifs, setNotifs] = useState({
    newAthletes:  true,
    messages:     true,
    offerUpdates: true,
    weeklyReport: true,
    pushMobile:   false,
  })

  const [prefs, setPrefs] = useState({
    publicProfile:    true,
    showInstitution:  true,
    allowMessages:    true,
    verifiedOnly:     false,
  })

  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const editBtn = (fn) => (
    <button className="text-xs font-bold" style={{ color:ACCENT }} onClick={fn}>Edit</button>
  )

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>
          <div className="px-4 pt-6 pb-4 max-w-xl">

            <h1 className="font-black text-2xl sm:text-3xl mb-1"
              style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:tk.text }}>
              SETTINGS
            </h1>
            <p className="text-sm mb-6" style={{ color:tk.textMuted }}>Manage your scout account</p>

            {/* Account */}
            <Section icon={User} title="Account" dark={dark}>
              <Row border dark={dark} label="Full Name"    sub="Coach David Mensah"             right={editBtn()} />
              <Row border dark={dark} label="Institution"  sub="University of Ghana"            right={editBtn()} />
              <Row border dark={dark} label="Role"         sub="Head Scout & Recruitment Officer" right={editBtn()} />
              <Row border dark={dark}
                label="Email" sub={editEmail ? undefined : email}
                right={editEmail ? (
                  <div className="flex items-center gap-2">
                    <input value={email} onChange={e => setEmail(e.target.value)}
                      className="rounded-lg px-2 py-1 text-xs outline-none w-40"
                      style={{ background:dark?"#0C0E14":"#F8FAFC", border:`1px solid ${ACCENT}`, color:tk.text }} />
                    <button onClick={() => setEdit(false)}>
                      <Check className="w-4 h-4" style={{ color:"#10B981" }} />
                    </button>
                  </div>
                ) : editBtn(() => setEdit(true))}
              />
              <Row dark={dark} label="Password" sub="Last changed 2 months ago" right={editBtn()} />
            </Section>

            {/* Appearance */}
            <Section icon={dark ? Moon : Sun} title="Appearance" dark={dark}>
              <Row dark={dark} label="Dark Mode" sub="Switch between light and dark"
                right={<Toggle value={dark} onChange={setDark} dark={dark} />} />
            </Section>

            {/* Notifications */}
            <Section icon={Bell} title="Notifications" dark={dark}>
              {[
                { key:"newAthletes",  label:"New Athlete Matches",   sub:"Athletes matching your filters"   },
                { key:"messages",     label:"New Messages",          sub:"When athletes reply to you"       },
                { key:"offerUpdates", label:"Offer Updates",         sub:"Accepted, declined or expired"    },
                { key:"weeklyReport", label:"Weekly Scout Report",   sub:"Summary of scouting activity"     },
                { key:"pushMobile",   label:"Push Notifications",    sub:"Alerts on your phone"             },
              ].map(({ key, label, sub }, i, arr) => (
                <Row key={key} border={i<arr.length-1} dark={dark} label={label} sub={sub}
                  right={<Toggle value={notifs[key]} onChange={() => setNotifs(p => ({ ...p,[key]:!p[key] }))} dark={dark} />} />
              ))}
            </Section>

            {/* Privacy */}
            <Section icon={Eye} title="Profile & Privacy" dark={dark}>
              {[
                { key:"publicProfile",    label:"Public Profile",        sub:"Athletes can find you in search"        },
                { key:"showInstitution",  label:"Show Institution",      sub:"Display University of Ghana on profile" },
                { key:"allowMessages",    label:"Allow Messages",        sub:"Athletes can message you directly"      },
                { key:"verifiedOnly",     label:"Verified Athletes Only", sub:"Filter to verified profiles only"      },
              ].map(({ key, label, sub }, i, arr) => (
                <Row key={key} border={i<arr.length-1} dark={dark} label={label} sub={sub}
                  right={<Toggle value={prefs[key]} onChange={() => setPrefs(p => ({ ...p,[key]:!p[key] }))} dark={dark} />} />
              ))}
            </Section>

            {/* Security */}
            <Section icon={Shield} title="Security" dark={dark}>
              <Row border dark={dark} label="Two-Factor Authentication" sub="Add extra login security"
                right={
                  <button className="text-xs font-bold px-3 py-1.5 rounded-xl border"
                    style={{ borderColor:ACCENT, color:ACCENT }}>Enable</button>
                }
              />
              <Row dark={dark} label="Active Sessions" sub="Manage logged-in devices"
                right={
                  <button className="flex items-center gap-1 text-xs font-bold" style={{ color:ACCENT }}>
                    View<ChevronRight className="w-3.5 h-3.5" />
                  </button>
                }
              />
            </Section>

            {/* Save */}
            <button onClick={handleSave}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white mb-3 flex items-center justify-center gap-2 transition-all"
              style={{ background: saved?"#10B981":`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
              {saved ? <><Check className="w-4 h-4" />Saved!</> : "Save Changes"}
            </button>

            {/* Danger zone */}
            <div className="rounded-2xl p-4"
              style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-black mb-3" style={{ color:"#EF4444" }}>DANGER ZONE</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {[
                  [LogOut,  "Sign Out"],
                  [Trash2,  "Delete Account"],
                ].map(([Icon, label]) => (
                  <button key={label}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all"
                    style={{ borderColor:"rgba(239,68,68,0.4)", color:"#EF4444" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      <RecruiterBottomNav dark={dark} />
    </div>
  )
}