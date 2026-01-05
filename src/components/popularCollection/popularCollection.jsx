import { useState } from 'react'
import clsx from 'clsx';

import { Link } from 'react-router-dom';
import { popularCollectionData } from '../../Data';

import TitleComponent from '../titleComponent/titleComponent';

const PopularCollection = () => {
    const [bgColor, setBgColor] = useState('bg-lightBlue2');
    function handleMouseEnter(color) {
        setBgColor(color);
    }
    return (
        <section className={clsx("lg:pt-20 lg:pb-[88px] py-16", bgColor)}>
            <div className="container">
                <div className='text-center'>
                    <TitleComponent size='small' className='collection_title_prefix mb-4 text-black'>Popular Collection</TitleComponent>
                    <div className='flex flex-col md:gap-0 gap-4'>
                        {popularCollectionData.map((item, index) => {
                            return (
                                <Link to={"/"} key={index} className="flex mx-auto w-max justify-center items-center md:gap-x-10 sm:gap-x-5 gap-x-3 group" onMouseEnter={() => handleMouseEnter(item.color)} onMouseLeave={() => handleMouseEnter('bg-white')} >
                                    <TitleComponent type="h1" className={clsx("collection_title" + (index + 1), "md:translate-x-16 text-black lg:text-7xl md:text-[56px] text-[32px] leading-[120%] font-medium duration-500 md:group-hover:translate-x-14")}>{item.heading}</TitleComponent>
                                    <div className={`lg:w-24 lg:h-24 md:w-[72px] md:h-[72px] w-10 h-10 md:translate-x-10 md:opacity-0 md:invisible rounded-full overflow-hidden md:duration-500 md:group-hover:translate-x-12 md:group-hover:opacity-100 md:group-hover:visible`}>
                                        <img className='w-full h-full object-cover' src={item.img} alt="img" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularCollection;
