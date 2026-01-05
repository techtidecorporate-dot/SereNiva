import { Link } from 'react-router-dom';
import { Play } from 'phosphor-react';

import TitleComponent from '../titleComponent/titleComponent';
import ThemeButton from '../themeButton/themeButton';

import heroVideo from '../../assets/heroVideo.mp4';

const HeroSec = () => {
    return (
        <div className="relative h-[calc(100vh-32px)] overflow-hidden sm:pt-44 sm:pb-28 py-32 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-neutral-800/30 before:-z-[1]">
            <div className="container">
                <div className="absolute px-3.5 max-w-[800px] w-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mx-auto text-center">
                    <TitleComponent size='base' className='hero_title_prefix text-primary uppercase'>spa & beauty center</TitleComponent>
                    <TitleComponent type='h1' className='hero_title mx-auto max-w-[90%] mt-5 mb-6 text-white font-bold capitalize'>Beauty and success starts here.</TitleComponent>
                    <TitleComponent size='base' className='hero_desc text-white mb-12'>Together creeping heaven upon third dominion be upon won't darkness rule behold it created good saw after she'd Our set living.</TitleComponent>
                    <div className="hero_action_main flex justify-center items-center gap-4 flex-wrap">
                        <Link to="/appointment">
                            <ThemeButton className='hero_action_btn first'>Reserve Now</ThemeButton>
                        </Link>
                        <Link className='flex justify-center items-center gap-2.5 group hero_action_btn second' to='/'>
                            <div className="flex items-center justify-center bg-primaryLight rounded-full w-12 h-12">
                                <Play size={20} className='text-primary' />
                            </div>
                            <TitleComponent size='base' className='text-white duration-300 group-hover:text-primary'>Watch Our Story</TitleComponent>
                        </Link>
                    </div>
                </div>
            </div>
            <video
                className="absolute top-0 left-0 -z-[2] w-full h-full object-cover"
                src={heroVideo}
                type='video/mp4'
                autoPlay
                loop
                muted
                playsInline
            />

        </div>
    )
}

export default HeroSec;
