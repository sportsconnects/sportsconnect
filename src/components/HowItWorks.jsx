import sc14 from "../assets/images/sc14.jpg";
import sc15 from "../assets/images/sc15.png";





export default function HowItWorks() {
    return (
        <div className="bg-[#F3FEF9] px-6 py-16 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-10">How it Works</h2>
                <p className="font-bold text-xl mb-10 text-[#0057B8]">For Student Athletes</p>
            </div>
            <div className="relative grid grid-cols-12 gap-6 items-center min-h-[200px]">
                <div className="col-span-4 space-y-4">
                    <div className="bg-gray-300 p-8 rounded-lg mb-10">
                        <h3 className="font-bold text-lg mb-3 text-[#0057B8]">
                            Create Your Profile
                        </h3>
                        <p className="text-sm leading-relaxed text-[#0057B8]">Build a comprehensive profile with your stats, achievements, and highlight videos</p>
                    </div>

                    <div className="bg-gray-300 p-8 rounded-lg">
                        <h3 className="font-bold text-lg mb-3 text-[#0057B8]">
                            Get Discovered
                        </h3>
                        <p className="text-sm leading-relaxed text-[#0057B8]">College recruiters search and find your profile based on your sport and skills</p>
                    </div>
                </div>

                <div className="col-span-4 flex justify-center px-4">
                    <div className="relative">
                        <img src={sc14} alt="student athlete in action"
                            className="w-full h-full max-w-sm object-cover rounded-lg shadow-lg" />
                    </div>
                </div>

                <div className="col-span-4 space-y-4">
                    <div className="bg-gray-300 p-8 rounded-lg mb-10 mt-10">
                        <h3 className="font-bold text-lg mb-3 text-[#0057B8]">
                            Connect & Recruit
                        </h3>
                        <p className="text-sm leading-relaxed text-[#0057B8]">Receive direct contact from interested recruiters and explore opportunities</p>
                    </div>

                    <div className="bg-gray-300 p-8 rounded-lg mb-10">
                        <h3 className="font-bold text-lg mb-3 text-[#0057B8]">
                            Secure Your Future
                        </h3>
                        <p className="text-sm leading-relaxed text-[#0057B8]">Join teams and take the next step in your athletic and academic journey.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-15">
                <p className="font-bold text-xl mb-10 text-[#0057B8]">For Recruiters</p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center lg:justify-start">
                        <img src={sc15} alt="recruiters image"
                            className="w-full h-96 rounded-lg flex items-end justify-center" />
                    </div>

                    <div>
                    <div className="mb-12">
                        <div className="gird grid-cols-1 md:grid-cols-2">
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-[#0057B8]">Search & Filter</h3>
                                <p className="text-sm">Use advanced filters to find athletes by sport, position, region, and more</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-bold mb-3 text-[#0057B8]">Review Profiles</h3>
                                <p className="text-sm">Access detailed athlete profiles with stats, videos, and academic information</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-bold mb-3 text-[#0057B8]">Make Contact</h3>
                                <p className="text-sm">Reach out directly via email or WhatsApp to start the recruitment process</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-bold mb-3 text-[#0057B8]">Track & Manage</h3>
                                <p className="text-sm">Save favorite athletes, track conversations, and organize prospects all in one place</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}