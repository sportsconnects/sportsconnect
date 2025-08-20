import logo from "../assets/images/sc12.png";








export default function Navbar() {
    return(
        <nav className="bg-white border-b border-white relative">
            <div className="max-w-7xl mx-auto px-2 py-2">
                <div className="flex justify-between items-center">

                    {/* {Logo section} */}
                    <div className="flex items-center ml-20">
                            <img src={logo} alt="logo" className="w-20 h-20 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-[#0057B8]">SPORTS CONNECT</span>
                            </div>
                    </div>

                </div>
            </div>
        </nav>
    )
}