import { Link } from 'react-router-dom';
import TitleComponent from '../titleComponent/titleComponent';
import ThemeButton from '../themeButton/themeButton';

const ProcedureCard = ({ data }) => {
    return (
        <div className='procedure-card relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full'>
            {/* Image Section */}
            <div className='relative overflow-hidden aspect-[4/3]'>
                <img
                    className='w-full h-full object-cover duration-700 group-hover:scale-110'
                    src={data.image}
                    alt={data.name || data.heading}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Dynamic Price Tag */}
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="bg-white/95 backdrop-blur px-5 py-2 rounded-2xl shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-xl font-bold text-black2 font-Merriwheather">${data.price || '99'}</span>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-primary bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-sm">{data.category}</span>
                </div>
            </div>

            <div className='p-8 flex flex-col flex-1 pb-10'>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{data.duration} Treatment</span>
                </div>

                <TitleComponent type="h3" className='mb-4 !text-2xl leading-tight font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[4rem]'>
                    {data.name || data.heading}
                </TitleComponent>

                <p className='text-textColor text-base leading-relaxed mb-8 line-clamp-3 flex-1 font-sans'>
                    {data.description}
                </p>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <Link to='/contact'>
                        <ThemeButton variant='primary' className="!px-8 !py-3 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-shadow">
                            Book Experience
                        </ThemeButton>
                    </Link>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[2px]">Starting From</span>
                        <span className="text-lg font-bold text-black2 font-Merriwheather">${data.price || '99'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProcedureCard;