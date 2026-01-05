import { useNavigate } from 'react-router-dom';

import TitleComponent from '../titleComponent/titleComponent';
import ThemeButton from '../themeButton/themeButton';

const SkinCareProduct = ({ props }) => {
    const navigation = useNavigate();

    // Handle both static data and Firebase data
    const serviceImage = props.image || props.img;
    const serviceName = props.name || props.heading;
    const serviceDesc = props.cardDescription || props.description || props.desc;
    const servicePrice = props.price;

    return (
        <div className="skin_product_card relative h-[650px] overflow-hidden group">
            {/* Image Background */}
            <div className="absolute inset-0">
                <img
                    className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105'
                    src={serviceImage}
                    alt={serviceName}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
            </div>

            {/* Content Centered at Bottom */}
            <div className="absolute inset-x-0 bottom-0 pb-12 pt-24 px-6 flex flex-col items-center text-center z-10 bg-gradient-to-t from-black/80 to-transparent">

                <TitleComponent type='h3' className='text-white mb-2 drop-shadow-lg tracking-wide'>
                    {serviceName}
                </TitleComponent>

                {/* Elegant Price Display */}
                {servicePrice && (
                    <div className="flex items-center gap-3 text-white/90 mb-4 font-Merriwheather italic">
                        <span className="w-8 h-[1px] bg-white/60"></span>
                        <span className="text-xl">from ${servicePrice}</span>
                        <span className="w-8 h-[1px] bg-white/60"></span>
                    </div>
                )}

                <p className='text-white/80 text-sm md:text-base mb-8 max-w-sm line-clamp-3 leading-relaxed drop-shadow-md'>
                    {serviceDesc}
                </p>

                <ThemeButton
                    variant='secondary'
                    className='min-w-[160px] hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 uppercase tracking-widest text-xs'
                    onClick={() => {
                        if (props.id) {
                            navigation(`/services/${props.id}`);
                        } else {
                            navigation("/services");
                        }
                    }}
                >
                    Show Details
                </ThemeButton>
            </div>
        </div>
    )
}

export default SkinCareProduct;
