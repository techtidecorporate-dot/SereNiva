import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { menuData, contactData, socialData, workingHours } from '../../Data';

import TitleComponent from '../titleComponent/titleComponent';

import brandLogo from '../../assets/sereniva-dark-logo.svg';

const Footer = () => {
    const location = useLocation();

    return (
        <>
            <footer className={clsx(
                "lg:py-28 md:py-24 py-14 bg-primaryLight",
                location.pathname === "/service" ? "mt-10" : ""
            )}>
                <div className="container">
                    <div className="grid lg:grid-cols-[1fr_0.5fr_1fr_1fr] sm:grid-cols-[1fr_1fr] gap-6 items-start">
                        <div>
                            <Link to="/" className="inline-flex">
                                <img className='xl:w-48 w-32 h-auto' src={brandLogo} alt="brand logo" />
                            </Link>
                            <TitleComponent size="base" className="xl:mt-6 mt-5 mb-4 text-black">Lorem ipsum amet, consectetur adipiscing elit. Suspendis varius enim eros elementum tristique. Duis cursus.</TitleComponent>
                            <Link to="mailto:sereniva@email.com" className="text-primary underline lg:text-lg text-base font-medium">support.sereniva@email.com</Link>
                            <ul className="flex items-center gap-3 2xl:mt-7 mt-5">
                                {socialData.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.path} className="flex justify-center items-center xl:size-12 size-9 bg-grey8 rounded-full translate-y-0 duration-300 group hover:-translate-y-2.5 hover:bg-primary">
                                            <item.icon className='text-white' weight='fill' size={22} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <TitleComponent type='h4' className="text-black font-bold">Links</TitleComponent>
                            <ul className="flex gap-y-2 flex-col">
                                {menuData.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.to} className="inline-block text-black lg:text-lg md:text-base font-medium duration-300 hover:text-primary">{item.text}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <TitleComponent type='h4' className='text-black font-bold'>Contact Us</TitleComponent>
                            <ul className='flex flex-col xl:gap-y-5 gap-y-3'>
                                {contactData.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.path} className='grid grid-cols-[auto_1fr] items-center gap-x-4 group'>
                                            <div className='flex justify-center items-center size-10 bg-primary rounded-full'>
                                                <item.icon className='text-white' size={20} />
                                            </div>
                                            <div className='flex flex-col gap-0.5'>
                                                <TitleComponent size='base-medium' className='text-grey8/80'>{item.label}</TitleComponent>
                                                <TitleComponent size='large-medium' className='text-black duration-300 group-hover:text-primary'>{item.title}</TitleComponent>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <TitleComponent type='h4' className="text-black font-bold">Working Hours</TitleComponent>
                            <ul className='flex gap-y-2 flex-col'>
                                {workingHours.map((item, index) => (
                                    <li key={index} className='flex gap-1'>
                                        <TitleComponent size='base-bold' className='lg:text-lg text-base text-black'>{item.day}</TitleComponent>:
                                        <TitleComponent size='base' className='lg:text-lg text-base text-black'>{item.time}</TitleComponent>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <section className="pt-9 py-4 md:py-4 bg-primaryLight border-t border-t-solid border-t-grey8/50">
                <div className="container">
                    <div className="flex justify-center items-center text-center">
                        <TitleComponent size='small' className='text-grey8 text-center lg:text-base'>© Copyright 2025 <Link to='/' className='text-grey8 duration-300 hover:text-primary'>Sereniva</Link>. All Rights Reserved</TitleComponent>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Footer;
