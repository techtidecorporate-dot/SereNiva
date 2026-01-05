import TitleComponent from '../titleComponent/titleComponent';
import ThemeButton from '../themeButton/themeButton';

const BeautyProduct = ({ props }) => {
    return (
        <div className='product_card pb-10'>
            <div className='overflow-hidden rounded-xl'>
                <img className='product_img' src={props.img} alt="img" />
            </div>
            <div className='px-6 py-4 text-center'>
                <h3 className='product_title text-black capitalize lg:text-3xl text-xl leading-[120%] font-Merriwheather font-medium'>{props.heading}</h3>
                <TitleComponent size='base' className='product_desc text-black sm:my-4 my-2.5'>{props.desc}</TitleComponent>
                <ThemeButton variant='underline' className='product_action_btn'>Check Now</ThemeButton>
            </div>
        </div>
    )
}

export default BeautyProduct;
