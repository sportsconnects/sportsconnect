import logo from "../assets/images/sc12.png";
import { Link } from "react-router";





export default function AthleteNavbar() {
    return (
        <nav className="bg-white border-b border-white relative">
            <div className="max-w-7xl mx-auto px-4 py-2">
                <div className="flex justify-between items-center">
                    {/* Logo section */}
          <Link to="/">
            <div className="flex items-center ml-0 sm:ml-10 md:ml-20">
              <img
                src={logo}
                alt="logo"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
              />
              <div className="flex flex-col ml-2">
                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#0057B8]">
                  SPORTS CONNECT
                </span>
              </div>
            </div>
          </Link>

                </div>

            </div>






        </nav>
    )
}