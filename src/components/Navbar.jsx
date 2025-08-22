import logo from "../assets/images/sc12.png";
import { Link } from "react-router";

export default function Navbar() {
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

          {/* Sign In button */}
          <div className="ml-2 sm:ml-4">
            <Link to="/signin">
              <button className="border border-gray-300 rounded-lg px-4 py-1 sm:px-6 sm:py-2 md:px-8 md:py-2 bg-white font-semibold text-sm sm:text-base hover:bg-blue-500 hover:text-white cursor-pointer">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
