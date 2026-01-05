import { Link } from 'react-router-dom';

import TitleComponent from '../titleComponent/titleComponent';

const HeroSec2 = (props) => {
    return (
        <section className='bg-primaryLight lg:pt-40 lg:pb-24 pb-16 pt-32'>
            <div className="container">
                <div className={`mx-auto text-center ${props.className || 'max-w-[600px]'}`}>
                    <TitleComponent type='h2' className='text-black' >{props.heading}</TitleComponent>
                    <div className='md:mt-6 mt-4 flex gap-2 justify-center items-center'>
                        <Link to='/' className='text-black text-base font-semibold tracking-[0.5px] duration-300 hover:text-primary'>Home</Link>
                        <p>/</p>
                        <Link to={props.Link} className='text-primary text-base font-semibold tracking-[0.5px]'>{props.pageText}</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSec2;
