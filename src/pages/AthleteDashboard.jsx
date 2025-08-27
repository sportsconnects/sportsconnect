import AthleteNavbar from "../components/AthleteNavbar"
import { User, Trophy, Play } from "lucide-react"
import sc26 from "../assets/images/sc26.jpg"
import YouTube from 'react-youtube'

export default function AthleteDashboard() {
    const featuredAthletes = [
        {
            id: 1,
            name: "James Junior",
            sport: "Soccer",
            position: "Center Back",
            school: "St Peter's Boys",
            location: "Eastern Region",
            classOf: "2018",
            age: 16,
            height: "5'7\"",
            achievements: ["Best Defender InterSchools", "Regional Champion"],
            videoId: "-5oif_xAwyg", // Extracted video ID from the YouTube URL
            videoTitle: "Soccer Highlights"
        },
        {
            id: 2,
            name: "James Junior",
            sport: "Soccer",
            position: "Center Back",
            school: "St Peter's Boys",
            location: "Eastern Region",
            classOf: "2018",
            age: 16,
            height: "5'7\"",
            achievements: ["Best Defender InterSchools", "Regional Champion"],
            videoId: "-5oif_xAwyg", // Extracted video ID from the YouTube URL
            videoTitle: "Soccer Highlights"
        },
        {
            id: 3,
            name: "James Junior",
            sport: "Soccer",
            position: "Center Back",
            school: "St Peter's Boys",
            location: "Eastern Region",
            classOf: "2018",
            age: 16,
            height: "5'7\"",
            achievements: ["Best Defender InterSchools", "Regional Champion"],
            videoId: "-5oif_xAwyg", // Extracted video ID from the YouTube URL
            videoTitle: "Soccer Highlights"
        },
    ]

    // YouTube player options
    const opts = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            mute: 0,
            loop: 0,
            modestbranding: 1,
            fs: 1,
            cc_load_policy: 0,
            iv_load_policy: 3,
        },
    }

    const onReady = (event) => {
        event.target.pauseVideo()
    }

    return (
        <>
            <AthleteNavbar />

            <div className="bg-[#F2F8FF] min-h-screen p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back, James Junior
                    </h1>
                    <p className="text-gray-600">Manage your profile and discover other talented athletes</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                            <div className="flex items-center mb-4">
                                <User className="w-5 h-5 mr-2" />
                                <h2 className="text-lg text-white font-semibold">Your Profile</h2>
                            </div>

                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3">
                                <img
                                    src={sc26}
                                    alt="profile image"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-1">James Junior</h3>
                            <p className="text-blue-100 mb-1">Center Back • Soccer</p>
                            <p className="text-blue-100">St Peter's Senior High</p>

                            <div className="space-y-3 text-sm mt-2">
                                <div className="flex justify-between">
                                    <span className="text-blue-100">Region:</span>
                                    <span className="font-medium">Eastern Region</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-blue-100">Class:</span>
                                    <span className="font-medium">2018</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-blue-100">Height:</span>
                                    <span className="font-medium">5'6</span>
                                </div>
                            </div>

                            <button className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 mt-6 font-medium cursor-pointer">
                                Update Profile
                            </button>

                            <button className="w-full border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg py-2 mt-6 text-gray-700 font-medium cursor-pointer">
                                View Full Profile
                            </button>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <Trophy className="w-5 h-5 mr-2 text-gray-700" />
                                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Achievements:</span>
                                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">3</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Recruiter Interest:</span>
                                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">High</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="">
                            <div className="flex items-center mb-2">
                                <User className="w-5 h-5 mr-2 text-gray-700" />
                                <h2 className="text-xl font-bold text-gray-800">Discover Other Athletes</h2>
                            </div>
                            <p className="text-gray-600 mb-6">Connect and learn from fellow student-athletes</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-6">
                                <Play className="w-5 h-5 mr-2 text-gray-700" />
                                <h3 className="text-xl font-bold text-gray-900">Featured Highlight Reels</h3>
                            </div>

                            {/* New Grid Layout: Featured + Column */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Featured Video - Takes up more space */}
                                {featuredAthletes.slice(0, 1).map((athlete) => (
                                    <div key={athlete.id} className="lg:col-span-3">
                                        {/* YouTube Video Player - Larger */}
                                        <div className="relative mb-4 overflow-hidden rounded-lg bg-black aspect-video">
                                            <YouTube
                                                videoId={athlete.videoId}
                                                opts={opts}
                                                onReady={onReady}
                                                className="w-full h-full"
                                                iframeClassName="w-full h-full rounded-lg"
                                            />

                                            <div className="absolute top-3 right-3 z-10">
                                                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                                                    {athlete.sport === 'Track & Field' ? 'Track & Field' : athlete.sport}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-2 left-2 z-10">
                                                <span className="bg-black/70 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                                                    {athlete.videoTitle}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Featured Athlete Info */}
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-gray-900 text-sm">{athlete.name}</h4>
                                            <p className="text-gray-600 text-xs">{athlete.position} • {athlete.school}</p>
                                            <p className="text-gray-500 text-xs">{athlete.location}</p>

                                            <div className="flex items-center justify-between pt-1">
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">{athlete.height}</span> • Class of {athlete.classOf}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Age {athlete.age}
                                                </div>
                                            </div>

                                            {/* Achievements */}
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {athlete.achievements.map((achievement, index) => (
                                                    <span key={index} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                                        {achievement}
                                                    </span>
                                                ))}
                                            </div>

                                            <button className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-1.5 mt-2 font-medium transition-all text-sm">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Secondary Videos Column */}
                                <div className="lg:col-span-3 space-y-4">
                                    {featuredAthletes.slice(1).map((athlete) => (
                                        <div key={athlete.id} className="group">
                                            {/* YouTube Video Player - Smaller */}
                                            <div className="relative mb-3 overflow-hidden rounded-lg bg-black aspect-video">
                                                <YouTube
                                                    videoId={athlete.videoId}
                                                    opts={opts}
                                                    onReady={onReady}
                                                    className="w-full h-full"
                                                    iframeClassName="w-full h-full rounded-lg"
                                                />

                                                <div className="absolute top-2 right-2 z-10">
                                                    <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                                                        {athlete.sport === 'Track & Field' ? 'Track & Field' : athlete.sport}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-2 left-2 z-10">
                                                    <span className="bg-black/70 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                                                        {athlete.videoTitle}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Compact Athlete Info */}
                                            <div className="space-y-1">
                                                <h5 className="font-bold text-gray-900 text-sm">{athlete.name}</h5>
                                                <p className="text-gray-600 text-xs">{athlete.position} • {athlete.school}</p>
                                                <p className="text-gray-500 text-xs">{athlete.location}</p>

                                                <div className="flex items-center justify-between pt-1">
                                                    <div className="text-xs text-gray-600">
                                                        <span className="font-medium">{athlete.height}</span> • {athlete.classOf}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Age {athlete.age}
                                                    </div>
                                                </div>

                                                {/* Compact Achievements */}
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {athlete.achievements.slice(0, 2).map((achievement, index) => (
                                                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                                            {achievement}
                                                        </span>
                                                    ))}
                                                </div>

                                                <button className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-1.5 mt-2 font-medium transition-all text-sm">
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}