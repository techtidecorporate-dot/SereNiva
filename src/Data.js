import { MapPin, Envelope, Phone, FacebookLogo, InstagramLogo, LinkedinLogo, TwitterLogo, YoutubeLogo } from 'phosphor-react';

import serviceImg1 from './assets/service-img1.webp';
import serviceImg2 from './assets/service-img2.webp';
import serviceImg3 from './assets/service-img3.webp';
import serviceImg4 from './assets/service-img4.webp';
import serviceIcon from './assets/service-icon.webp';

import postImage1 from './assets/post-img1.webp';
import postImage2 from './assets/post-img2.webp';
import postImage3 from './assets/post-img3.webp';

import teamImage1 from './assets/team-img1.webp';
import teamImage2 from './assets/team-img2.webp';
import teamImage3 from './assets/team-img3.webp';

import video1 from './assets/video-1.mp4';
import video2 from './assets/video-2.mp4';
import video3 from './assets/video-3.mp4';
import video4 from './assets/video-4.mp4';
import video5 from './assets/video-5.mp4';
import video6 from './assets/video-6.mp4';
import video7 from './assets/video-7.mp4';

import client1 from './assets/client-1.webp';
import client2 from './assets/client-2.webp';
import client3 from './assets/client-3.webp';
import client4 from './assets/client-4.webp';

import swedishMassage from './assets/swedish-massage.webp';
import deepTissueMassage from './assets/deep-tissue-massage.webp';
import stoneMassage from './assets/stone-massage.webp';

import veganImg from './assets/vegan.webp';
import deliveryImg from './assets/delivery.webp';
import naturImg from './assets/natur.webp';
import recycleImg from './assets/recycle.webp';

import swedishCollection from './assets/swedish-collection-img.webp';
import tissueCollection from './assets/tissue-collection-img.webp';
import hotStoneCollection from './assets/hot-stone-collection-img.webp';
import aromaTherapyCollection from './assets/aromatherapy-collection-img.webp';

import facialOil from './assets/facial-oil.webp';
import bkindSoup from './assets/bkind-soup.webp';
import bodyLotion from './assets/mokosh-body-lotion.webp';


export const menuData = [
    { text: 'Home', to: '/' },
    { text: 'About', to: '/about' },
    { text: 'Services', to: '/services' },
    { text: 'Blog', to: '/blog' },
    { text: 'Contact', to: '/contact' },
];

export const contactData = [
    {
        icon: Envelope, label: "Email",
        title: "support.sereniva@email.com",
        path: 'mailto:support.sereniva@email.com'
    },
    {
        icon: Phone, label: "Phone",
        title: "+1 234 567890",
        path: "tel:+1234567890"
    },
    { icon: MapPin, label: "Address", title: "1867 Fire Access, USA", path: '/' },
];

export const socialData = [
    { icon: FacebookLogo, to: 'https://www.facebook.com/' },
    { icon: TwitterLogo, to: 'https://www.x.com/' },
    { icon: YoutubeLogo, to: 'https://www.youtube.com/' },
    { icon: InstagramLogo, to: 'https://www.instagram.com/' },
];

export const workingHours = [
    { day: 'Monday to Friday', time: '9AM - 6PM' },
    { day: 'Saturday', time: '9AM - 6PM' },
    { day: 'Sunday', time: '9AM - 5PM' },
];

export const serviceData = [
    { image: serviceImg1, icon: serviceIcon, heading: 'Massage Therapy' },
    { image: serviceImg2, icon: serviceIcon, heading: 'Body Treatment' },
    { image: serviceImg3, icon: serviceIcon, heading: 'Waxing Care' },
    { image: serviceImg4, icon: serviceIcon, heading: 'Facial Care' },
];

export const procedureData = [
    {
        image: swedishCollection,
        heading: 'The Sereniva Signature',
        category: 'Signature Journey',
        duration: '120 Mins',
        description: 'Our ultimate wellness experience combining a custom full-body massage, an enzymatic radiance facial, and a tension-melting scalp ritual for total transformation.'
    },
    {
        image: tissueCollection,
        heading: 'Oceanic Revive Journey',
        category: 'Revitalization',
        duration: '90 Mins',
        description: 'A marine-inspired ritual featuring a mineral-rich sea salt exfoliation followed by a detoxifying seaweed body wrap and a targeted hydrotherapy session.'
    },
    {
        image: hotStoneCollection,
        heading: 'Mindful Sound Escape',
        category: 'Mind & Spirit',
        duration: '105 Mins',
        description: 'A deep sensory journey utilizing therapeutic sound bath vibrations, heated hot stone therapy, and bespoke aromatherapy to quiet the mind.'
    },
    {
        image: aromaTherapyCollection,
        heading: 'Luminous Glow Ritual',
        category: 'Advanced Facial',
        duration: '75 Mins',
        description: 'Achieve a red-carpet radiance with our multi-step facial that integrates HydraFacial technology, concentrated oxygen infusion, and rejuvenating LED light therapy.'
    },
    {
        image: postImage1,
        heading: 'Vitality Energy Reset',
        category: 'Detoxification',
        duration: '90 Mins',
        description: 'A powerful detoxifying treatment that pairs manual lymphatic drainage with a warming ginger body mask to stimulate circulation and boost vitality.'
    },
    {
        image: postImage2,
        heading: 'Deep Sleep Sanctuary',
        category: 'Sleep Wellness',
        duration: '60 Mins',
        description: 'Designed for those seeking profound rest, this ritual features magnesium-infused massage techniques and a weighted aromatherapy eye treatment for deep relaxation.'
    },
];

export const blogData = [
    {
        id: "post_1",
        author: "Admin",
        date: "Jan 29, 2025",
        image: postImage1,
        title: 'Ultimate Guide to Professional Facial Treatments',
        description: 'Discover the transformative power of professional facial treatments for glowing skin. Expert aestheticians use premium products to restore natural radiance.',
        contentBlocks: [
            { id: 101, type: 'h2', value: 'Why Professional Facials Matter' },
            { id: 102, type: 'p', value: 'Whil e at-home skincare routines are essential, professional facial treatments offer a deeper level of care that can significantly improve your skin health. Our expert aestheticians analyze your skin type and concerns to tailor a treatment that targets your specific needs.' },
            { id: 103, type: 'h3', value: 'Key Benefits' },
            {
                id: 104, type: 'list', value: [
                    'Deep cleansing and exfoliation',
                    'Improved circulation and lymphatic drainage',
                    'Targeted treatment for acne, aging, or sensitivity',
                    'Stress relief and relaxation'
                ]
            },
            { id: 105, type: 'p', value: 'Regular facials can help maintain a youthful glow and prevent future skin issues. We recommend a professional treatment every 4-6 weeks for optimal results.' },
            { id: 106, type: 'image', value: postImage1, alt: 'Woman receiving a relaxing facial treatment' },
            { id: 107, type: 'h3', value: 'Our Signature Treatments' },
            {
                id: 108, type: 'descList', value: [
                    { term: 'Hydra-Glow Facial', details: 'A multi-step treatment that cleanses, exfoliates, and hydrates using advanced vortex technology.' },
                    { term: 'Anti-Aging Gold Mask', details: 'Infused with 24k gold to firm, lift, and brighten the complexion.' },
                    { term: 'Purifying Detox', details: 'Ideal for congested skin, utilizing clay masks and blue LED light therapy.' }
                ]
            }
        ]
    },
    {
        id: "post_2",
        author: "Admin",
        date: "Feb 06, 2025",
        image: postImage2,
        title: 'How Regular Massage Therapy Transforms Health',
        description: 'Experience incredible health benefits beyond simple relaxation and stress relief. Improved circulation enhances your overall wellness.',
        contentBlocks: [
            { id: 201, type: 'h2', value: 'More Than Just Relaxation' },
            { id: 202, type: 'p', value: 'Massage therapy is often viewed as a luxury, but it is a powerful tool for maintaining physical and mental health. Beyond significant stress reduction, regular massage can boost your immune system, improve posture, and enhance athletic performance.' },
            { id: 203, type: 'image', value: postImage2, alt: 'Deep tissue massage therapy session' },
            { id: 204, type: 'h3', value: 'Physiological Impacts' },
            {
                id: 205, type: 'list', value: [
                    'Lowers cortisol levels (stress hormone)',
                    'Increases serotonin and dopamine (mood boosters)',
                    'Reduces muscle tension and pain',
                    'Improves joint mobility and flexibility'
                ]
            },
            { id: 206, type: 'p', value: 'Studies have shown that even a single session can lower heart rate and blood pressure. Committing to a regular schedule amplifies these benefits, leading to long-term health improvements.' }
        ]
    },
    {
        id: "post_3",
        author: "Admin",
        date: "Mar 15, 2025",
        image: postImage3,
        title: 'Essential Oils Transform Your Spa Experience',
        description: 'Unlock therapeutic benefits of essential oils during spa experience today. Different scents reduce anxiety while promoting deep relaxation.',
        contentBlocks: [
            { id: 301, type: 'h2', value: 'The Power of Aromatherapy' },
            { id: 302, type: 'p', value: 'Aromatherapy uses natural plant extracts to promote health and well-being. When combined with spa treatments, essential oils can enhance the therapeutic effects, influencing mood and cognitive function.' },
            { id: 303, type: 'h3', value: 'Popular Essential Oils & Benefits' },
            {
                id: 304, type: 'descList', value: [
                    { term: 'Lavender', details: 'Promotes relaxation and helps treat anxiety, fungal infections, and insomnia.' },
                    { term: 'Peppermint', details: 'Boosts energy and aids digestion. Known for cooling and refreshing properties.' },
                    { term: 'Eucalyptus', details: 'Supports respiratory health and soothes muscle pain.' },
                    { term: 'Tea Tree', details: 'Known for its powerful antiseptic and anti-inflammatory properties.' }
                ]
            },
            { id: 305, type: 'image', value: postImage3, alt: 'Collection of essential oils and spa stones' },
            { id: 306, type: 'p', value: 'At Sereniva, we allow you to customize your treatment with a blend of oils that resonates with your current needs, creating a truly personalized sensory journey.' }
        ]
    },
    {
        id: "post_4",
        author: "Admin",
        date: "Apr 02, 2025",
        image: postImage1,
        title: 'Essential Wellness Practices for Daily Care',
        description: 'Transform daily routine with simple wellness practices promoting peace. Mindful breathing techniques create spa-like atmosphere at home.',
        contentBlocks: [
            { id: 401, type: 'h2', value: 'Bringing the Spa Home' },
            { id: 402, type: 'p', value: 'Wellness isnt just something you visit; its a lifestyle. Integrating small moments of self-care into your daily routine can have a profound impact on your overall happiness and stress levels.' },
            { id: 403, type: 'h3', value: 'Morning Rituals' },
            {
                id: 404, type: 'list', value: [
                    'Start with a glass of warm lemon water',
                    'Practice 5 minutes of deep breathing or meditation',
                    'Stretch gently to wake up the body',
                    'Apply a hydrating serum with mindful application'
                ]
            },
            { id: 405, type: 'p', value: 'Consistency is key. Even five minutes dedicated to yourself can reset your nervous system and prepare you for the day ahead.' }
        ]
    },
    {
        id: "post_5",
        author: "Admin",
        date: "Jan 29, 2025",
        image: postImage2,
        title: 'Complete Body Detox Purifying Treatments',
        description: 'Experience rejuvenating effects of professional body treatments today. Exfoliating scrubs and wraps remove toxins while improving skin texture.',
        contentBlocks: [
            { id: 501, type: 'h2', value: 'Why Detoxify?' },
            { id: 502, type: 'p', value: 'Our bodies are constantly exposed to environmental pollutants. A professional detox treatment helps to draw out impurities, unclog pores, and stimulate the lymphatic system.' },
            {
                id: 503, type: 'descList', value: [
                    { term: 'Body Scrub', details: 'Removes dead skin cells and stimulates circulation.' },
                    { term: 'Clay Wrap', details: 'Draws out toxins and impurities from deep within the skin.' },
                    { term: 'Lymphatic Message', details: 'Encourages the natural drainage of the lymph, which carries waste products away from the tissues.' }
                ]
            },
            { id: 504, type: 'p', value: 'You will leave feeling lighter, energized, and with skin that feels incredibly soft and revitalized.' }
        ]
    },
];

export const teamData = [
    {
        image: teamImage1,
        heading: 'Olivia Austin',
        text: 'Swedish Massage',
        icons: [
            { icon: FacebookLogo, to: 'https://www.facebook.com/' },
            { icon: TwitterLogo, to: 'https://www.x.com/' },
            { icon: InstagramLogo, to: 'https://www.instagram.com/' },
        ]
    },
    {
        image: teamImage2,
        heading: 'Amelia Hannan',
        text: 'Hot Stone Massage',
        icons: [
            { icon: FacebookLogo, to: 'https://www.facebook.com/' },
            { icon: TwitterLogo, to: 'https://www.x.com/' },
            { icon: InstagramLogo, to: 'https://www.instagram.com/' },
            { icon: LinkedinLogo, to: 'https://www.linkedin.com/' },
        ]
    },
    {
        image: teamImage3,
        heading: 'Kate Harris',
        text: 'Thai Massage',
        icons: [
            { icon: FacebookLogo, to: 'https://www.facebook.com/' },
            { icon: TwitterLogo, to: 'https://www.x.com/' },
            { icon: InstagramLogo, to: 'https://www.instagram.com/' },
            { icon: LinkedinLogo, to: 'https://www.linkedin.com/' },
        ]
    },
];

export const testimonialData = [
    {
        name: "Linia Korie",
        img: client1,
        designation: "Executive",
        desc: "First i beast be fruitful open you tree all Won't can't likeness and you're have whales creature seed to two grass life blessed you meat shall you winged under from their there he That you're one called gather make much red wherein set fourth green bearing fifth replenish given she had."
    },
    {
        name: "Devid Bell",
        img: client2,
        designation: "Writer",
        desc: "First i calm be stillness ease you body all Won't can't tension and you're have oils warmth peace to two breath flow soft blessed you light shall you quiet hands under from their there he That you're one called comfort make much rest wherein set fourth glow care fifth welcome given she had."
    },
    {
        name: "Horray Coreal",
        img: client3,
        designation: "Co-Executive",
        desc: "First i peace be gentle heal you soul all Won't can't hurry and you're have warmth calm oils to two scents deep soft blessed you rest shall you quiet touch under from their there he That you're one called unwind make much slow wherein set fourth hush breathe fifth soften given she had."
    },
    {
        name: "Linia Korie",
        img: client4,
        designation: "Executive",
        desc: "First i beast be fruitful open you tree all Won't can't likeness and you're have whales creature seed to two grass life blessed you meat shall you winged under from their there he That you're one called gather make much red wherein set fourth green bearing fifth replenish given she had."
    },
];

export const bestProductsData = [video1, video3, video4, video5, video6, video7, video1, video6];

export const skinProductsData = [
    {
        img: swedishMassage,
        heading: 'Swedish Massage',
        desc: 'Gentle strokes to melt away stress and tension.',
    },
    {
        img: deepTissueMassage,
        heading: 'Deep Tissue Massage',
        desc: 'Relieves chronic pain and muscle tension.',
    },
    {
        img: stoneMassage,
        heading: 'Hot Stone Massage',
        desc: 'Heated stones to release tension and restore deep balance.',
    },
    {
        img: swedishMassage,
        heading: 'Swedish Massage',
        desc: 'Gentle strokes to melt away stress and tension.',
    },
    {
        img: deepTissueMassage,
        heading: 'Deep Tissue Massage',
        desc: 'Relieves chronic pain and muscle tension.',
    },
    {
        img: stoneMassage,
        heading: 'Hot Stone Massage',
        desc: 'Heated stones to release tension and restore deep balance.',
    },
];

export const productBenefitsData = [
    {
        img: veganImg,
        heading: 'Vegan',
        desc: 'Our entire collection is vegan and cruelty free.'
    },
    {
        img: deliveryImg,
        heading: 'Fast & Free Shipping',
        desc: 'Doorstep delivery to most of the US.'
    },
    {
        img: naturImg,
        heading: 'Natural',
        desc: 'We only use the finest natural ingredients.'
    },
    {
        img: recycleImg,
        heading: 'Recyclable',
        desc: 'All packaging is recyclable and eco conscious.'
    },
];

export const popularCollectionData = [
    {
        img: swedishCollection,
        heading: 'Swedish',
        color: 'bg-lightBlue2',
    },
    {
        img: tissueCollection,
        heading: 'Deep Tissue',
        color: 'bg-lightPink20',
    },
    {
        img: hotStoneCollection,
        heading: 'Hot Stone',
        color: 'bg-lightBlue3',
    },
    {
        img: aromaTherapyCollection,
        heading: 'Aromatherapy',
        color: 'bg-lightPink30',
    }
];

export const newBeautyProductsData = [
    {
        img: facialOil,
        heading: 'Facial Oil',
        desc: 'New from Mokosh - body lotion'
    },
    {
        img: bkindSoup,
        heading: 'BKIND Soup',
        desc: 'Low-maintenance, high-performance'
    },
    {
        img: bodyLotion,
        heading: 'Mokosh body lotion',
        desc: 'Cushiony, smooth, pout-perfecting lip oil.'
    },
];

export const massageServicesData = [
    {
        name: "Aromatherapy Massage",
        category: "Massage",
        price: "125",
        duration: "60 min",
        detailPageHeading: "A Multisensory Journey to Perfect Mental and Physical Harmony",
        cardDescription: "Restore your senses with a blend of pure essential oils and gentle therapeutic touch.",
        fullDescription: "Immerse yourself in a world of sensory bliss. Our Aromatherapy Massage combines the healing power of essential oils with professional massage techniques to address your unique needs. Whether you seek stress relief, energy restoration, or emotional balance, our therapists curate a custom blend of high-grade botanical extracts to transport you to total tranquility.",
        benefits: ["Reduces stress and anxiety", "Balances hormone levels", "Improved mental clarity", "Enhanced emotional well-being"],
        included: ["Custom essential oil consultation", "Dermalogica botanical oils", "Steam ritual", "Post-session herbal infusion"],
        status: "Active",
        featured: true,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
        altText: "Aromatherapy Massage Treatment"
    },
    {
        name: "Deep Tissue Massage",
        category: "Massage",
        price: "145",
        duration: "60 min",
        detailPageHeading: "Recover and Rebuild with Intensive Muscle Alignment",
        cardDescription: "Focused pressure on deep muscle layers to release chronic tension and alleviate persistent pain.",
        fullDescription: "Our Deep Tissue Massage is designed for those seeking focused, intense relief from chronic muscle tension. Using slow, deliberate strokes and deep finger pressure, we target the deepest layers of muscle tissue, tendons, and fascia. This treatment is ideal for athletes, those with persistent pain, or anyone looking to break down scar tissue and improve overall mobility.",
        benefits: ["Breaks down scar tissue", "Alleviates chronic pain", "Improves posture and mobility", "Enhances athletic performance"],
        included: ["Deep muscle assessment", "Trigger point therapy", "Arnica muscle cooling balm", "Hydration therapy advice"],
        status: "Active",
        featured: true,
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800",
        altText: "Deep Tissue Massage Professional"
    },
    {
        name: "Hot Stone Massage",
        category: "Massage",
        price: "165",
        duration: "90 min",
        detailPageHeading: "Melt Away Tension with Therapeutic Volcanic Heat",
        cardDescription: "Deeply relaxing treatment using heated basalt stones to soothe sore muscles and calm the mind.",
        fullDescription: "Experience the ancient healing power of heat. In our Hot Stone Massage, smooth, water-heated volcanic basalt stones are placed on key energy centers of your body and used as extensions of the therapist's hands. The deep penetrating heat allows for deeper muscle manipulation, effectively melting away stubborn tension and inducing a state of deep meditative relaxation.",
        benefits: ["Promotes deep muscle relaxation", "Increases local circulation", "Reduces muscle spasms", "Promotes better sleep"],
        included: ["Hand-selected basalt stones", "Aromatic warming oil", "Energy point balancing", "Premium linen service"],
        status: "Active",
        featured: true,
        image: "https://images.unsplash.com/photo-1542848284-8afa78a08ccb?auto=format&fit=crop&q=80&w=800",
        altText: "Hot Stone Massage Stones"
    },
    {
        name: "Swedish Massage",
        category: "Massage",
        price: "110",
        duration: "60 min",
        detailPageHeading: "The Art of Classic Relaxation and Full Body Wellness",
        cardDescription: "Experience the foundation of massage therapy with long, rhythmic strokes designed to improve circulation.",
        fullDescription: "Indulge in the gold standard of relaxation. Our Swedish Massage uses five primary strokes—effleurage, petrissage, tapotement, friction, and vibration—to provide a luxurious experience that increases oxygen levels in the blood, decreases muscle toxins, and improves overall circulation. It is perfect for first-timers or those looking for a lighter, restorative touch to renew both body and spirit.",
        benefits: ["Reduces physiological stress", "Improves blood circulation", "Increases oxygen in the blood", "Relieves generalized fatigue"],
        included: ["Full body classic massage", "Choice of fragrance-free/infused oils", "Climate-controlled suite", "Signature relaxation tea"],
        status: "Active",
        featured: false,
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800",
        altText: "Classic Swedish Massage"
    }
];