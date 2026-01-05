import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { newBeautyProductsData } from '../../Data';

import SectionTitle from '../sectionTitle/sectionTitle';
import BeautyProduct from './beautyProduct';

const NewBeautyProducts = () => {
    return (
        <section className='lg:py-32 md:py-24 py-14'>
            <div className="container-fluid">
                <SectionTitle
                    subtitle="Latest Arrivals" subtitleClass="beauty_subtitle"
                    title="New" titleClass="beauty_title"
                    headingLevel='h2' highlightedText="Beauty" remainingTitle="Products"
                    sectionStyle="text-center max-w-[700px] mx-auto mb-12"
                />
                <Swiper
                    spaceBetween={20}
                    pagination={true}
                    autoplay={true}
                    modules={[Pagination, Autoplay]}
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
                    }}
                >
                    {newBeautyProductsData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <BeautyProduct props={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default NewBeautyProducts;
