import { CaretLeft, CaretRight } from 'phosphor-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { bestProductsData } from '../../Data';

import SectionTitle from '../sectionTitle/sectionTitle';
import BestProductSlide from './bestProductSlide';

const BestProductsSec = () => {
    return (
        <section className='py-12'>
            <SectionTitle
                subtitle="Premium Quality" subtitleClass="skincare_subtitle"
                title="Best" titleClass="skincare_title"
                headingLevel='h2' highlightedText="Skincare" remainingTitle="Products"
                sectionStyle="text-center max-w-[900px] mx-auto mb-5"
            />
            <div className='sm:px-0 px-2'>
                <Swiper
                    className='group'
                    spaceBetween={20}
                    centeredSlides={true}
                    loop={true}
                    pagination={true}
                    autoplay={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1
                        },
                        640: {
                            slidesPerView: 2
                        },
                        1024: {
                            slidesPerView: 3
                        },
                        1200: {
                            slidesPerView: 4
                        }
                    }}
                >
                    {bestProductsData.map((item, index) => (
                        <SwiperSlide key={index} className='flex items-center mb-10'>
                            <BestProductSlide item={item} />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-button-main flex justify-center items-center flex-row-reverse gap-x-6">
                        <div className="swiper-button-next z-50 absolute order-1 top-1/2 right-0 md:right-5 -translate-y-1/2 flex justify-center items-center xl:w-12 xl:h-12 w-10 h-10 bg-white50 rounded-full opacity-0 invisible duration-300 group/btn after:content-[none] hover:bg-primary hover:border-transparent group-hover:opacity-100 group-hover:visible">
                            <CaretRight className='md:!w-5 !w-5 md:!h-5 !h-4 text-black duration-300 group-hover/btn:text-white' weight='bold' />
                        </div>
                        <div className="swiper-button-prev z-50 absolute top-1/2 left-0 md:left-5 -translate-y-1/2 flex justify-center items-center xl:w-12 xl:h-12 w-10 h-10 bg-white50 rounded-full opacity-0 invisible duration-300 group/btn hover:bg-primary hover:border-transparent after:content-[none] group-hover:opacity-100 group-hover:visible">
                            <CaretLeft className='md:!w-5 !w-4 md:!h-5 !h-4 text-black duration-300 group-hover/btn:text-white' weight='bold' />
                        </div>
                    </div>
                </Swiper>
            </div>
        </section>
    )
}

export default BestProductsSec;
