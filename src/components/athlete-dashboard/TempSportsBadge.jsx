// src/components/SportBadge.jsx

const SPORT_COLORS = {
  Soccer:          { bg: "rgba(16,185,129,.15)",  color: "#10B981" },
  "Track & Field": { bg: "rgba(249,115,22,.15)",  color: "#F97316" },
  Basketball:      { bg: "rgba(245,158,11,.15)",  color: "#F59E0B" },
  Swimming:        { bg: "rgba(6,182,212,.15)",   color: "#06B6D4" },
  Volleyball:      { bg: "rgba(168,85,247,.15)",  color: "#A855F7" },
}

export default function SportBadge({ sport }) {
  const c = SPORT_COLORS[sport] || { bg: "rgba(59,130,246,.15)", color: "#3B82F6" }

  return (
    <span
      style={{ background: c.bg, color: c.color }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
    >
      <span
        style={{ background: c.color }}
        className="w-1.5 h-1.5 rounded-full inline-block"
      />
      {sport}
    </span>
  )
}