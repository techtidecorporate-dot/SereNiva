import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useSwiperSlide } from 'swiper/react';

const BestProductSlide = ({ item }) => {
    const swiperSlide = useSwiperSlide();
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (swiperSlide.isActive && videoRef.current) {
            videoRef.current.play();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

    }, [swiperSlide.isActive]);

    return (
        <div className='video_card relative flex items-center md:h-[600px] sm:h-[550px] h-full'>
            <div className={clsx("overflow-hidden md:max-h-[500px] sm:max-h-[450px] w-full max-h-[380px] ", swiperSlide.isActive && "sm:scale-y-[1.15]", " rounded-xl duration-300")}>
                <video
                    className='w-full'
                    ref={videoRef}
                    src={item}
                    autoPlay
                    loop
                    muted
                    playsInline />
            </div>
        </div>
    )
}

export default BestProductSlide;
