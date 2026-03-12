import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import {
    ChevronRight, ChevronLeft, Check, Sparkles,
    GraduationCap, Dumbbell, User
} from "lucide-react"
import { setupAthleteProfile, getCurrentUser } from "../../src/api/client"

const ACCENT = "#1DA8FF"

const SPORTS = ["Soccer", "Basketball", "Track & Field", "Swimming", "Volleyball", "Rugby", "Tennis", "Athletics", "Other"]

const POSITIONS = {
    Soccer: ["Goalkeeper", "Center Back", "Left Back", "Right Back", "Defensive Mid", "Central Mid", "Attacking Mid", "Left Wing", "Right Wing", "Striker"],
    Basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
    "Track & Field": ["Sprinter (100m)", "Sprinter (200m)", "400m", "800m", "1500m", "5000m", "10000m", "Hurdles", "Long Jump", "High Jump", "Triple Jump", "Shot Put", "Discus", "Javelin"],
    Swimming: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"],
    Volleyball: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite Hitter", "Libero"],
    Rugby: ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum Half", "Fly Half", "Centre", "Wing", "Fullback"],
    Tennis: ["Singles", "Doubles", "Both"],
    Athletics: ["Sprinter", "Middle Distance", "Long Distance", "Field Events", "Combined Events"],
    Other: ["Not specified"],
}

const REGIONS = [
    "Greater Accra", "Ashanti", "Eastern", "Western", "Central",
    "Northern", "Upper East", "Upper West", "Volta", "Brong-Ahafo",
    "Oti", "Ahafo", "Bono East", "North East", "Savannah", "Western North"
]

const CLASS_YEARS = ["2025", "2026", "2027", "2028", "2029"]

const STEPS = [
    { id: "sport",   label: "Your Sport",   icon: Dumbbell,      desc: "What do you play?"  },
    { id: "school",  label: "Your School",  icon: GraduationCap, desc: "Academic details"   },
    { id: "profile", label: "Your Profile", icon: User,          desc: "Physical details"   },
    { id: "preview", label: "All Set!",     icon: Sparkles,      desc: "Review & finish"    },
]

export default function AthleteOnboarding() {
    const navigate = useNavigate()
    const user = getCurrentUser()

    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        sport:        "",
        position:     "",
        region:       "",
        classOf:      "",
        school:       "",
        gpa:          "",
        height:       "",
        weight:       "",
        bio:          "",
        achievements: [""],
    })

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    const addAchievement = () => {
        if (form.achievements.length >= 5) return
        setForm(prev => ({ ...prev, achievements: [...prev.achievements, ""] }))
    }

    const updateAchievement = (i, val) => {
        const updated = [...form.achievements]
        updated[i] = val
        setForm(prev => ({ ...prev, achievements: updated }))
    }

    const removeAchievement = (i) => {
        setForm(prev => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== i) }))
    }

    const canProceed = () => {
        if (step === 0) return !!form.sport && !!form.position && !!form.region && !!form.classOf
        if (step === 1) return !!form.school
        return true
    }

    const handleFinish = async () => {
        setLoading(true)
        const toastId = toast.loading("Setting up your profile...")
        try {
            const payload = {
                ...form,
                achievements: form.achievements
                    .filter(a => a.trim())
                    .map(title => ({ title })),
            }
            await setupAthleteProfile(payload)
            toast.success("Profile created! Welcome to SportsConnect 🎉", { id: toastId })
            setTimeout(() => navigate("/athletedashboard"), 1200)
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save profile", { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    const firstName = user?.firstName || "Athlete"

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
            style={{
                background: "#E5E7EB",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: none; }
                }
                .fade-up  { animation: fadeUp 0.4s ease both; }
                .step-card { animation: fadeUp 0.35s ease both; }
                input, select, textarea {
                    background: #FFFFFF !important;
                    border: 1px solid #D1D5DB !important;
                    color: #111827 !important;
                    border-radius: 6px !important;
                    padding: 8px 12px !important;
                    width: 100%;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                input:focus, select:focus, textarea:focus {
                    border-color: #3B82F6 !important;
                    box-shadow: 0 0 0 2px rgba(59,130,246,0.15) !important;
                }
                input::placeholder, textarea::placeholder { color: #9CA3AF !important; }
                select option { background: #FFFFFF; color: #111827; }
            `}</style>

            {/* Logo */}
            <div className="fade-up mb-8 text-center">
                <h1
                    className="font-black text-3xl mb-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", color: "#111827" }}
                >
                    SPORTSCONNECT
                </h1>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                    Welcome, <span style={{ color: ACCENT }}>{firstName}</span> — let's build your profile
                </p>
            </div>

            {/* Step indicators */}
            <div className="fade-up flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => {
                    const done    = i < step
                    const current = i === step
                    const Icon    = s.icon
                    return (
                        <div key={s.id} className="flex items-center gap-2">
                            <div
                                className="flex items-center justify-center rounded-full transition-all duration-300"
                                style={{
                                    width:      current ? 36 : 28,
                                    height:     current ? 36 : 28,
                                    background: done    ? "#10B981"
                                              : current ? ACCENT
                                              : "#E5E7EB",
                                    border:     current ? `2px solid ${ACCENT}` : "2px solid transparent",
                                    boxShadow:  current ? `0 0 16px rgba(29,168,255,0.3)` : "none",
                                }}
                            >
                                {done
                                    ? <Check className="w-3.5 h-3.5 text-white" />
                                    : <Icon className="w-3.5 h-3.5" style={{ color: current ? "#fff" : "#9CA3AF" }} />
                                }
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className="w-8 h-0.5 rounded-full transition-all duration-500"
                                    style={{ background: i < step ? "#10B981" : "#D1D5DB" }}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Card */}
            <div
                key={step}
                className="step-card w-full max-w-md p-6"
                style={{
                    background:   "#FFFFFF",
                    border:       "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow:    "0 4px 24px rgba(0,0,0,0.08)",
                }}
            >
                {/* Step header */}
                <div className="mb-6">
                    <p className="text-xs font-black mb-1" style={{ color: ACCENT, letterSpacing: "0.1em" }}>
                        STEP {step + 1} OF {STEPS.length}
                    </p>
                    <h2 className="font-black text-xl" style={{ color: "#111827" }}>
                        {STEPS[step].label}
                    </h2>
                    <p className="text-sm" style={{ color: "#6B7280" }}>{STEPS[step].desc}</p>
                </div>

                {/* ── STEP 0: Sport ── */}
                {step === 0 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                Sport <span style={{ color: ACCENT }}>*</span>
                            </label>
                            <select value={form.sport} onChange={e => { set("sport", e.target.value); set("position", "") }}>
                                <option value="">Select your sport</option>
                                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {form.sport && (
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                    Position / Event <span style={{ color: ACCENT }}>*</span>
                                </label>
                                <select value={form.position} onChange={e => set("position", e.target.value)}>
                                    <option value="">Select your position</option>
                                    {(POSITIONS[form.sport] || []).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                Region <span style={{ color: ACCENT }}>*</span>
                            </label>
                            <select value={form.region} onChange={e => set("region", e.target.value)}>
                                <option value="">Select your region</option>
                                {REGIONS.map(r => <option key={r} value={r}>{r} Region</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                Graduation Year <span style={{ color: ACCENT }}>*</span>
                            </label>
                            <select value={form.classOf} onChange={e => set("classOf", e.target.value)}>
                                <option value="">Class of...</option>
                                {CLASS_YEARS.map(y => <option key={y} value={y}>Class of {y}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* ── STEP 1: School ── */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                School Name <span style={{ color: ACCENT }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. St. Peter's Boys School"
                                value={form.school}
                                onChange={e => set("school", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                GPA <span style={{ color: "#9CA3AF" }}>(optional)</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="4"
                                placeholder="e.g. 3.5"
                                value={form.gpa}
                                onChange={e => set("gpa", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                Achievements <span style={{ color: "#9CA3AF" }}>(up to 5)</span>
                            </label>
                            <div className="space-y-2">
                                {form.achievements.map((a, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. Regional Champion 2024"
                                            value={a}
                                            onChange={e => updateAchievement(i, e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        {form.achievements.length > 1 && (
                                            <button
                                                onClick={() => removeAchievement(i)}
                                                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all font-bold"
                                                style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {form.achievements.length < 5 && (
                                    <button
                                        onClick={addAchievement}
                                        className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                                        style={{ background: "#EFF6FF", color: "#3B82F6", border: "1px dashed #BFDBFE" }}
                                    >
                                        + Add Achievement
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Physical Profile ── */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                    Height <span style={{ color: "#9CA3AF" }}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="eg: 6/1 or 185cm"
                                    value={form.height}
                                    onChange={e => set("height", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                    Weight <span style={{ color: "#9CA3AF" }}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 75kg"
                                    value={form.weight}
                                    onChange={e => set("weight", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>
                                Bio <span style={{ color: "#9CA3AF" }}>(optional)</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Tell recruiters about yourself — your playing style, goals, what drives you..."
                                value={form.bio}
                                onChange={e => set("bio", e.target.value)}
                                style={{ resize: "none" }}
                            />
                            <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                                {form.bio.length}/300 characters
                            </p>
                        </div>

                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            You can fill these in later from your profile settings.
                        </p>
                    </div>
                )}

                {/* ── STEP 3: Preview ── */}
                {step === 3 && (
                    <div className="space-y-3">
                        {/* Summary card */}
                        <div
                            className="rounded-xl p-4"
                            style={{ background: "#F0F7FF", border: "1px solid #BFDBFE" }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #1DA8FF, #6366F1)", color: "#fff" }}
                                >
                                    {firstName[0]}
                                </div>
                                <div>
                                    <p className="font-black text-sm" style={{ color: "#111827" }}>{firstName}</p>
                                    <p className="text-xs" style={{ color: ACCENT }}>
                                        {form.position} · {form.sport}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    ["School",   form.school  || "—"],
                                    ["Region",   form.region  || "—"],
                                    ["Class of", form.classOf || "—"],
                                    ["GPA",      form.gpa     || "—"],
                                    ["Height",   form.height  || "—"],
                                    ["Weight",   form.weight  || "—"],
                                ].map(([label, val]) => (
                                    <div key={label} className="rounded-lg px-3 py-2"
                                        style={{ background: "#FFFFFF" }}>
                                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{label}</p>
                                        <p className="text-xs font-bold truncate" style={{ color: "#111827" }}>{val}</p>
                                    </div>
                                ))}
                            </div>

                            {form.achievements.filter(a => a.trim()).length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs mb-1.5" style={{ color: "#6B7280" }}>Achievements</p>
                                    <div className="flex flex-wrap gap-1">
                                        {form.achievements.filter(a => a.trim()).map((a, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                                                style={{ background: "#FEF3C7", color: "#D97706" }}>
                                                🏆 {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SC Coach teaser */}
                        <div
                            className="rounded-xl p-3 flex items-center gap-3"
                            style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
                        >
                            <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: "#3B82F6" }} />
                            <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                                SC Coach will use this profile to give you{" "}
                                <strong style={{ color: "#3B82F6" }}>
                                    personalized {form.sport || "sport"} drills
                                </strong>{" "}
                                and recruiting tips.
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-6">
                    {step > 0 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{ background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < STEPS.length - 1 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canProceed()}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: canProceed()
                                    ? "linear-gradient(to right, #3B82F6, #06B6D4)"
                                    : "#E5E7EB",
                                color:  canProceed() ? "#fff" : "#9CA3AF",
                                cursor: canProceed() ? "pointer" : "not-allowed",
                            }}
                        >
                            Continue <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: "linear-gradient(to right, #3B82F6, #06B6D4)",
                                color:   "#fff",
                                opacity: loading ? 0.7 : 1,
                                cursor:  loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Saving..." : <><Sparkles className="w-4 h-4" /> Launch My Profile</>}
                        </button>
                    )}
                </div>

                {/* Skip option on step 2 */}
                {step === 2 && (
                    <button
                        onClick={() => setStep(s => s + 1)}
                        className="w-full mt-2 text-xs py-1.5 transition-all text-center"
                        style={{ color: "#9CA3AF" }}
                    >
                        Skip for now →
                    </button>
                )}
            </div>

            {/* Bottom note */}
            <p className="fade-up mt-6 text-xs" style={{ color: "#9CA3AF" }}>
                You can update all details anytime from your profile
            </p>
        </div>
    )
}