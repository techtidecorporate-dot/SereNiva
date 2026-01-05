import TitleComponent from '../titleComponent/titleComponent';
import ThemeButton from '../themeButton/themeButton';

import argonOilVideo from '../../assets/video-11.mp4';
import mokoshArgonOilBanner from '../../assets/jasmine-oil2.webp';

const ProductShowcaseSec = () => {
    return (
        <section className='showcase_sec pt-12'>
            <div className='flex'>
                <div className='relative md:w-1/2'>
                    <div>
                        <img className='w-full aspect-[36/31] object-cover object-top' src={mokoshArgonOilBanner} alt="img" />
                    </div>
                    <div className='absolute w-full p-5 bottom-0 left-1/2 -translate-x-1/2 -translate-y-5 text-center z-10'>
                        <TitleComponent type='h3' className='showcase_title mb-4 text-black font-semibold'>Serenity Massage Oil</TitleComponent>
                        <TitleComponent size='base' className='showcase_desc text-black mb-3 sm:block hidden'>Cold-pressed botanical oils that hydrate and enhance every massage.</TitleComponent>
                        <ThemeButton variant='secondary2' className='showcase_action_btn'>Check Product</ThemeButton>
                    </div>
                </div>
                <div className='md:w-1/2 overflow-hidden md:block hidden'>
                    <video
                        src={argonOilVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className='showcase_video w-full h-full object-cover'
                    />
                </div>
            </div>
        </section>
    )
}

export default ProductShowcaseSec;
