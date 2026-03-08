// src/components/Avatar.jsx

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-500",
]

export default function Avatar({ name, size = 40 }) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const gradient = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        flexShrink: 0,
      }}
      className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold`}
    >
      {initials}
    </div>
  )
}