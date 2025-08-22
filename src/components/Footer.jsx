import sc8 from "../assets/images/sc8.png";
import sc22 from "../assets/images/sc22.png";
import sc23 from "../assets/images/sc23.png";
import sc24 from "../assets/images/sc24.png";

export default function Footer() {
    return (
        <footer className="bg-[#0057B8] text-white px-6 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto">
                {/* Top Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20 mb-10">
                    
                    {/* Logo + Socials */}
                    <div>
                        <div className="mb-8 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 mb-6">
                                <img
                                    src={sc8}
                                    alt="footerlogo"
                                    className="w-20 h-20 object-contain mb-2 sm:mb-0"
                                />
                                <div className="text-2xl font-bold">
                                    Sports Connect
                                </div>
                            </div>

                            <div className="flex justify-center sm:justify-start space-x-4">
                                <a
                                    href="#"
                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <img src={sc22} alt="instagram logo" className="w-5 h-5 object-contain" />
                                </a>
                                <a
                                    href="#"
                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <img src={sc23} alt="x logo" className="w-5 h-5 object-contain" />
                                </a>
                                <a
                                    href="#"
                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <img src={sc24} alt="tiktok logo" className="w-5 h-5 object-contain" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Contact</h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li className="font-bold text-sm">+233 20 209 3760</li>
                            <li className="font-bold text-sm">sportsconnectrecruiting@gmail.com</li>
                            <li className="font-bold text-sm">Location here</li>
                            <li className="font-bold text-sm">Support</li>
                        </ul>
                    </div>

                    {/* For Athletes */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">For Athletes</h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li className="font-bold text-sm">Create Profile</li>
                            <li className="font-bold text-sm">Resources</li>
                            <li className="font-bold text-sm">Success Stories</li>
                        </ul>
                    </div>

                    {/* For Recruiters */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">For Recruiters</h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li className="font-bold text-sm">Join Platform</li>
                            <li className="font-bold text-sm">Search Athletes</li>
                            <li className="font-bold text-sm">Filter Search</li>
                        </ul>
                    </div>
                </div>

                {/* Divider + Bottom Section */}
                <hr className="border-gray-300/50 mb-4" />
                <div className="text-center">
                    <p className="text-xs sm:text-sm mt-2">&copy; 2025 Sports Connect. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
