import TitleComponent from '../titleComponent/titleComponent';

const TeamCart = ({ data }) => {
    return (
        <div className='team_card group justify-self-center'>
            <img className='w-full' src={data.image} alt="Team img" />
            <div className="relative text-center lg:p-[30px] py-5 px-4 -mt-12 mx-auto bg-white z-10 lg:max-w-[calc(100%_-_60px)] shadow-shadow1 duration-300 group-hover:-mt-20">
                <TitleComponent size='extra-large-bold' className='text-black font-Merriwheather'>{data.heading}</TitleComponent>
                <TitleComponent size='small' className='text-textColor lg:text-base mt-1 mb-2'>{data.text}</TitleComponent>
                <ul className='flex items-center justify-center gap-2 -mt-8 opacity-0 invisible duration-300 group-hover:mt-0 group-hover:visible group-hover:opacity-100'>
                    {data.icons.map((item, index) => (
                        <li key={index}>
                            <a href={item.to} target="_blank" className='flex items-center justify-center w-8 h-8 bg-transparent border border-black rounded-full hover:bg-primary hover:border-primary hover:text-white transition-colors duration-300'><item.icon size={16} /></a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TeamCart;
