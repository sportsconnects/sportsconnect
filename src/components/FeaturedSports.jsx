import sc16 from "../assets/images/sc16.jpg";
import sc17 from "../assets/images/sc17.jpg";
import sc18 from "../assets/images/sc18.jpg";
import sc19 from "../assets/images/sc19.jpg";
import sc20 from "../assets/images/sc20.jpg";






export default function FeaturedSports() {
    return (
        <div className="bg-white px-6 py-16 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-10">Featured Sports</h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full flex items-center justify-center mb-4">
                        <img src={sc16} alt="soccer" 
                        className="w-full h-full rounded-full object-contain"/>
                    </div>
                    <span className="text-sm lg:text-base font-medium text-[#0057B8]">Soccer</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full flex items-center justify-center mb-4">
                        <img src={sc17} alt="basketball" 
                        className="w-full h-full rounded-full object-contain"/>
                    </div>
                    <span className="text-sm lg:text-base font-medium text-[#0057B8]">Basketball</span>
                </div>


                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full flex items-center justify-center mb-4">
                        <img src={sc18} alt="track&field" 
                        className="w-full h-full rounded-full object-contain"/>
                    </div>
                    <span className="text-sm lg:text-base font-medium text-[#0057B8]">Track & Field</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full flex items-center justify-center mb-4">
                        <img src={sc19} alt="volleyball" 
                        className="w-full h-full rounded-full object-contain"/>
                    </div>
                    <span className="text-sm lg:text-base font-medium text-[#0057B8]">Volleyball</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full flex items-center justify-center mb-4">
                        <img src={sc20} alt="tennis" 
                        className="w-full h-full rounded-full object-contain"/>
                    </div>
                    <span className="text-sm lg:text-base font-medium text-[#0057B8]">Tennis</span>
                </div>
            </div>
        </div>
    )
}