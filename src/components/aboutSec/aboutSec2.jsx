import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Leaf, Heart, Star, Users, TrendUp, Sparkle } from 'phosphor-react';
import TitleComponent from '../titleComponent/titleComponent';
import SectionTitle from '../sectionTitle/sectionTitle';
import ThemeButton from '../themeButton/themeButton';

// Import your images
import AboutImage1 from '../../assets/about-img1.webp';
import AboutImage2 from '../../assets/about-img2.webp';

const AboutSec2 = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16">
            <div className="container">
                {/* Main About Section - Image & Content Side by Side */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Stylized Image Grid */}
                    <div className="relative">
                        {/* Main Container with decorative border */}
                        <div className="relative">
                            {/* Decorative background shapes */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primaryLight rounded-full blur-2xl opacity-50"></div>
                            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

                            {/* Images Grid */}
                            <div className="relative grid grid-cols-2 gap-4">
                                {/* Large Image - Top Left */}
                                <div className="relative col-span-1 row-span-2">
                                    <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl group">
                                        <img
                                            src={AboutImage1}
                                            alt="Luxury spa treatment"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Subtle overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                </div>

                                {/* Top Right - Small Image */}
                                <div className="relative h-[200px]">
                                    <div className="absolute inset-0 bg-primary rounded-3xl" />
                                    <div className="relative rounded-3xl overflow-hidden shadow-xl h-full transform translate-x-2 translate-y-2 group">
                                        <img
                                            src={AboutImage2}
                                            alt="Spa ambiance"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                {/* Bottom Right - Stats Card */}
                                <div className="relative h-[200px]">
                                    <div className="absolute inset-0 bg-primary/70 rounded-3xl animate-rotate shadow-xl transform -rotate-3" />
                                    <div className="relative bg-gradient-to-br from-primary to-pink-400 rounded-3xl p-6 text-white shadow-2xl h-full flex flex-col justify-center transform hover:rotate-0 transition-transform duration-500">
                                        <div className="mb-3">
                                            <Star size={36} weight='fill' className="text-white drop-shadow-lg" />
                                        </div>
                                        <TitleComponent type='h3' className='text-white text-3xl font-bold mb-2 drop-shadow-md'>15+</TitleComponent>
                                        <TitleComponent size='base' className='text-white/95 font-medium'>Years of Excellence</TitleComponent>
                                        <TitleComponent size='small' className='text-white/80 mt-1'>Trusted by 10K+ Clients</TitleComponent>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 transform hover:scale-110 transition-transform duration-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                    <TitleComponent size='small-medium' className='text-black'>Available Now</TitleComponent>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <SectionTitle
                            subtitle="Welcome to Sereniva"
                            subtitleClass="text-primary"
                            title="Your Sanctuary of"
                            titleClass="text-black"
                            headingLevel='h2'
                            highlightedText="Wellness"
                            sectionStyle="text-left mb-6"
                        />

                        <TitleComponent size='base' className='text-textColor leading-relaxed mb-4'>At Sereniva, we believe that true beauty radiates from within. Since our establishment, we've been dedicated to providing transformative spa experiences that harmonize body, mind, and spirit through time-honored techniques and modern innovations.</TitleComponent>

                        <TitleComponent size='base' className='text-textColor leading-relaxed mb-6'>Our team of certified therapists brings years of expertise and genuine passion to every treatment. We use only premium, organic products carefully selected for their therapeutic benefits and environmental sustainability.</TitleComponent>

                        {/* Key Features List */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                'Certified & Experienced Therapists',
                                'Luxury Organic Products',
                                'Personalized Treatment Plans',
                                'Serene & Private Environment'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 size-8 rounded-full bg-primaryLight flex items-center justify-center">
                                        <Check size={16} weight='bold' className="text-primary" />
                                    </div>
                                    <TitleComponent size='base' className='text-black'>{feature}</TitleComponent>
                                </div>
                            ))}
                        </div>

                        <ThemeButton variant='primary' onClick={() => { navigate("/services") }}>Discover Our Services</ThemeButton>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="bg-primaryLight rounded-3xl p-8 lg:p-12 mb-20">
                    <SectionTitle
                        subtitle="Why Choose Sereniva"
                        title="Experience the"
                        highlightedText="Difference"
                        headingLevel="h3"
                        sectionStyle="text-center mb-12"
                    />

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Leaf,
                                title: 'Natural & Organic',
                                description: 'We exclusively use certified organic products free from harmful chemicals, ensuring your skin receives only the purest ingredients nature has to offer.'
                            },
                            {
                                icon: Heart,
                                title: 'Holistic Approach',
                                description: 'Our treatments go beyond surface beauty. We focus on complete wellness, addressing your physical, emotional, and spiritual needs for lasting results.'
                            },
                            {
                                icon: Users,
                                title: 'Expert Care',
                                description: 'Our internationally certified therapists undergo continuous training to bring you the latest techniques combined with traditional healing wisdom.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <div className="w-16 h-16 rounded-xl bg-primaryLight flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                                    <item.icon size={32} weight='fill' className="text-primary group-hover:text-white transition-colors duration-300" />
                                </div>
                                <TitleComponent type='h4' className='text-black mb-3'>
                                    {item.title}
                                </TitleComponent>
                                <TitleComponent size='base' className='text-textColor leading-relaxed'>
                                    {item.description}
                                </TitleComponent>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Philosophy Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content First */}
                    <div className="lg:order-1 order-2">
                        <SectionTitle
                            subtitle="Our Philosophy"
                            title="Healing Through"
                            highlightedText="Balance"
                            headingLevel="h3"
                            sectionStyle="text-left mb-6"
                        />

                        <TitleComponent size='base' className='text-textColor leading-relaxed mb-6'>
                            We believe wellness is a journey, not a destination. Every individual is unique,
                            which is why we take time to understand your specific needs, concerns, and goals
                            before crafting a personalized treatment plan.
                        </TitleComponent>

                        <div className="bg-white border-l-4 border-primary rounded-r-xl p-6 shadow-md mb-6">
                            <TitleComponent size='large' className='text-black italic leading-relaxed'>
                                "True luxury is taking time for yourself. It's about creating moments of peace
                                in a busy world and nurturing your well-being from the inside out."
                            </TitleComponent>
                        </div>

                        <TitleComponent size='base' className='text-textColor leading-relaxed'>
                            From our carefully curated treatment menu to our tranquil environment, every element
                            is designed to transport you to a state of complete relaxation and rejuvenation.
                        </TitleComponent>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:order-2 order-1 grid grid-cols-2 gap-6">
                        {[
                            {
                                icon: TrendUp,
                                number: '15+',
                                label: 'Years of Excellence',
                                color: 'bg-gradient-to-br from-primary to-pink-400',
                                iconBg: 'bg-white/20'
                            },
                            {
                                icon: Users,
                                number: '10K+',
                                label: 'Happy Clients',
                                color: 'bg-gradient-to-br from-gray-900 to-gray-700',
                                iconBg: 'bg-white/10'
                            },
                            {
                                icon: Sparkle,
                                number: '50+',
                                label: 'Spa Treatments',
                                color: 'bg-gradient-to-br from-pink-400 to-pink-300',
                                iconBg: 'bg-white/20'
                            },
                            {
                                icon: Heart,
                                number: '98%',
                                label: 'Client Satisfaction',
                                color: 'bg-gradient-to-br from-primary to-pink-500',
                                iconBg: 'bg-white/20'
                            }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`group relative ${stat.color} rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                            >
                                {/* Background Decoration */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className='flex gap-3 items-center'>

                                        {/* Icon */}
                                        <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.iconBg} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon size={28} weight='bold' className="text-white" />
                                        </div>

                                        {/* Number */}
                                        <TitleComponent type='h3' className='text-white text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300 inline-block'>
                                            {stat.number}
                                        </TitleComponent>
                                    </div>

                                    {/* Label */}
                                    <TitleComponent size='base' className='text-white/95 font-medium leading-snug'>
                                        {stat.label}
                                    </TitleComponent>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-3xl transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSec2;