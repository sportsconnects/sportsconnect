import React from 'react';
import sc16 from "../assets/images/sc16.jpg";
import sc17 from "../assets/images/sc17.jpg";
import sc18 from "../assets/images/sc18.jpg";
import sc19 from "../assets/images/sc19.jpg";
import sc20 from "../assets/images/sc20.jpg";
import sc21 from "../assets/images/sc21.jpg";

export default function FeaturedSports() {
    // Array of sports data
    const sportsData = [
        { image: sc16, alt: "soccer", name: "Soccer" },
        { image: sc17, alt: "basketball", name: "Basketball" },
        { image: sc18, alt: "track&field", name: "Track & Field" },
        { image: sc19, alt: "volleyball", name: "Volleyball" },
        { image: sc20, alt: "tennis", name: "Tennis" },
        { image: sc21, alt: "hockey", name: "Hockey" },
    ];

    return (
        <div className="bg-white px-4 sm:px-6 py-12 text-center">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8">
                    Featured Sports
                </h2>
            </div>

            {/* Scrolling Container */}
            <div className="overflow-hidden">
                <div className="flex animate-scroll gap-6 sm:gap-8 lg:gap-12">
                    {/* First set of sports */}
                    {sportsData.map((sport, index) => (
                        <div key={index} className="flex flex-col items-center flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3">
                                <img 
                                    src={sport.image} 
                                    alt={sport.alt}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <span className="text-xs sm:text-sm md:text-base font-medium text-[#0057B8]">
                                {sport.name}
                            </span>
                        </div>
                    ))}
                    
                    {/* Duplicate set for seamless loop */}
                    {sportsData.map((sport, index) => (
                        <div key={`duplicate-${index}`} className="flex flex-col items-center flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-3">
                                <img 
                                    src={sport.image} 
                                    alt={sport.alt}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <span className="text-xs sm:text-sm md:text-base font-medium text-[#0057B8]">
                                {sport.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
