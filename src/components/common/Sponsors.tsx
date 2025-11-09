import { BlurredInfiniteSlider } from '../ui/blurred-infinite-slider';

const SPONSOR_LOGOS = [
    { src: "/images/ug1.png", alt: "Partner 1", height: 40 },
    { src: "/images/ug2.svg", alt: "Partner 2", height: 36 },
    { src: "/images/ug3.png", alt: "Partner 3", height: 38 },
    { src: "/images/ug4.png", alt: "Partner 4", height: 35 },
    { src: "/images/ug5.png", alt: "Partner 5", height: 40 },
    { src: "/images/ug6.png", alt: "Partner 6", height: 37 },
    { src: "/images/ug7.png", alt: "Partner 7", height: 39 },
    { src: "/images/ug8.jpg", alt: "Partner 8", height: 42 },
];

export default function Sponsors() {
    return (
        <section className="bg-white py-16 w-full overflow-hidden border-t border-gray-100">
            <div className="m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    {/* Text Section */}
                    <div className="flex-shrink-0 text-center md:text-right md:max-w-52 md:border-r md:border-gray-200 md:pr-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Trusted Partners
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                            Working with Uganda's leading collaborators to deliver exceptional experiences
                        </p>
                    </div>
                    
                    {/* Logo Slider Section */}
                    <div className="w-full py-8 md:w-auto md:flex-1 md:pl-8">
                        <BlurredInfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={100}
                            fadeWidth={80}
                        >
                            {SPONSOR_LOGOS.map((logo, index) => (
                                <div key={`${logo.src}-${index}`} className="flex items-center">
                                    <img
                                        className="mx-auto w-fit grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 object-contain"
                                        src={logo.src}
                                        alt={logo.alt}
                                        style={{ height: `${logo.height}px`, maxWidth: '140px' }}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </BlurredInfiniteSlider>
                    </div>
                </div>
            </div>
        </section>
    );
}