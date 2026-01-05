import TitleComponent from '../titleComponent/titleComponent';

const ServiceSecCart = ({ data }) => {
    if (!data) return null;

    return (
        <div className="service_card relative overflow-hidden group">
            <img src={data.image} alt="Service" className="w-full h-full object-cover" />
            <div className="flex flex-col items-center justify-center gap-5 absolute top-full opacity-0 left-0 w-full h-full bg-lightPink80 duration-300 group-hover:top-0 group-hover:opacity-100 ease-in-out">
                <div className="flex">
                    <img className="w-full h-auto" src={data.icon} alt="Service Icon" />
                </div>
                <TitleComponent type="h4" className="text-white text-center">
                    {data.heading}
                </TitleComponent>
            </div>
        </div>
    );
};

export default ServiceSecCart;