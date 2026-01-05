import TitleComponent from '../titleComponent/titleComponent';
import SectionTitle from '../sectionTitle/sectionTitle';
import ThemeButton from '../themeButton/themeButton';

import ChinaRose from '../../assets/china-rose.webp';
import Jasmine from '../../assets/jasmine.webp';

const AboutSec = () => {
    return (
        <section className='relative lg:py-32 md:py-24 py-14'>
            <div className="container">
                <SectionTitle
                    subtitle="About Our SPA Center" subtitleClass="about_subtitle"
                    title="Come and you will be" titleClass="about_title"
                    headingLevel='h2' highlightedText="Inspired!"
                    sectionStyle="text-center max-w-[900px] mx-auto"
                >
                    <TitleComponent size='base' className='about_desc text-grey8 mt-5 lg:mb-14 mb-10'>It's the end of summer the sweltering heat makes human sweat in the night and makes the plants and trees wilt even in the moonlit nights. The eastern wind breeze brings an eerie feeling, that the monsoon clouds are soon coming, there is a strange silence in the ears, the sky gets darker and darker</TitleComponent>
                    <ThemeButton className='about_action_btn' variant='primary'>Read More</ThemeButton>
                </SectionTitle>
            </div>
            <img className='about_img1 absolute sm:left-[16%] top-10 max-w-28 -z-10 md:block hidden' src={ChinaRose} alt="China Rose img" />
            <img className='about_img2 absolute bottom-[1/2] md:right-32 md:-translate-x-32 right-[16%] -translate-y-[16%] -z-10 md:block hidden' src={Jasmine} alt="Jasmine img" />
        </section>
    )
}

export default AboutSec;
