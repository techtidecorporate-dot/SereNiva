import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { testimonialData } from '../../Data';

import TitleComponent from '../titleComponent/titleComponent';

import 'swiper/css';
import 'swiper/css/pagination';

import quote from '../../assets/quote.webp';

const TestimonialSec = () => {
    return (
        <div className="testimonial_sec bg-primaryLight lg:py-32 md:py-24 py-14">
            <div className="container">
                <Swiper
                    pagination={true}
                    modules={[Pagination]}
                    className='lg:w-5/6 mx-auto'
                >
                    {testimonialData.map((item, index) => (
                        <SwiperSlide key={index} className="slide pb-10 text-center">
                            <img className="quote_img mt-0 mx-auto sm:w-16 w-12" src={quote} alt="" />
                            <TitleComponent size='small' className="review_desc md:my-11 my-7 mx-auto max-w-[900px] text-black2 sm:text-base">{item.desc}</TitleComponent>
                            <div className='flex flex-col items-center gap-5'>
                                <img className="profile_img md:w-20 md:h-20 w-16 h-16 object-cover rounded-full" src={item.img} alt="" />
                                <TitleComponent type='h4' className="user_name text-black2">{item.name}, <span className="text-base tracking-[0.5px] font-medium">{item.designation}</span> </TitleComponent>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default TestimonialSec;
