import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const wrapCharacters = (text) => {
    return text.split(' ').map((word, index) => {
        const wordWrapped = word.split('').map((char) => {
            return `<span class="char inline-block">${char}</span>`;
        }).join('');
        return `<span class="word inline-block" data-word-index="${index}">${wordWrapped}</span>`;
    }).join(' ');
}


const animateText = (selector, delay) => {
    const header = document.querySelector(selector);
    if (!header) return;
    header.innerHTML = wrapCharacters(header.textContent);
    console.log(header.innerHTML);

    gsap.fromTo(`${selector} .char`, {
        x: 10,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        delay: delay ? delay : 0,
        duration: 0.2,
        stagger: 0.05,
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'restart none none reverse'
        }
    })
}

const slideUpAnimation = (selector, delay) => {
    gsap.fromTo(selector, {
        y: 40,
        filter: 'blur(3px)',
        opacity: 0
    }, {
        y: 0,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: delay ? delay : 0,
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'restart none none reverse'
        }
    })
}

const slideDownAnimation = (selector, delay) => {
    gsap.fromTo(selector, {
        y: "-40",
        filter: 'blur(3px)',
        opacity: 0
    }, {
        y: "0",
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: delay ? delay : 0,
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'restart none none reverse'
        }
    })
}

const headerAnimation = (selector, delay) => {
    const elements = gsap.utils.toArray(selector);
    if (elements.length === 0) return;
    elements.forEach((element) => {
        gsap.fromTo(element, {
            y: "-100%",
            opacity: 0
        }, {
            y: "0",
            opacity: 1,
            duration: 2,
            delay: delay ? delay : 0,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'restart none none reverse'
            }
        })
    })
}

const zoomOutAnimation = (selector, delay) => {
    gsap.fromTo(selector, {
        scale: 1.2,
        filter: 'blur(3px)',
    }, {
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        delay: delay ? delay : 0,
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            scrub: true,
            toggleActions: 'restart none none reverse'
        }
    })
}

const swipeLeftAnimation = (selector, delay) => {
    gsap.fromTo(selector, {
        x: -100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        delay: delay ? delay : 0,
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'restart none none reverse'
        }
    })
}
const swipeRightAnimation = (selector, delay) => {
    gsap.fromTo(selector, {
        x: 100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        delay: delay ? delay : 0,
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'restart none none reverse'
        }
    })
}

const Animation = ({ children }) => {
    useEffect(() => {
        slideUpAnimation('.hero_header', 0.5);

        headerAnimation('.hero_title_prefix', 0.5);
        animateText('.hero_title', 0.5);
        slideUpAnimation('.hero_desc', 0.5);
        slideUpAnimation('.hero_action_btn.first', 1.5);
        slideUpAnimation('.hero_action_btn.second', 2);

        slideUpAnimation('.empSkin_sec', 0.5);
        headerAnimation('.empSkin_title_prefix', 0.5);
        slideUpAnimation('.empSkin_highlight_heading', 0.5);
        slideDownAnimation('.empSkin_highlight_heading .inr_img', 0.3);

        slideDownAnimation('.about_img', 0.5);
        headerAnimation('.about_title_prefix', 0.5);
        animateText('.about_title', 0.5);
        slideUpAnimation('.about_desc', 0.5);
        slideUpAnimation('.about_action_btn', 0.5);
        swipeLeftAnimation('.about_img1', 0.5);
        swipeRightAnimation('.about_img2', 0.5);

        slideUpAnimation('.skin_product_card', 0.5);
        slideDownAnimation('.skin_product_title', 0.5);
        slideUpAnimation('.skin_product_desc', 0.3);
        slideUpAnimation('.skin_product_action_btn', 0.5);
        zoomOutAnimation('.skin_product_img', 0.5);

        slideUpAnimation('.service_card', 0.5);

        headerAnimation('.collection_title_prefix', 0.5);
        animateText('.collection_title1', 0.5);
        animateText('.collection_title2', 0.5);
        animateText('.collection_title3', 0.5);
        animateText('.collection_title4', 0.5);

        slideUpAnimation('.testimonial_sec', 0.5);
        slideUpAnimation('.quote_img', 0.5);
        slideUpAnimation('.review_desc', 0.5);
        slideUpAnimation('.profile_img', 0.5);
        slideUpAnimation('.user_name', 0.5);

        animateText('.team_title', 0.5);
        slideUpAnimation('.team_desc', 0.5);
        slideUpAnimation('.team_card', 0.5);

        animateText('.skincare_title', 0.5);
        slideUpAnimation('.video_card', 0.5);

        slideUpAnimation('.showcase_sec', 0.5);
        animateText('.showcase_title', 0.5);
        slideUpAnimation('.showcase_desc', 0.5);
        slideUpAnimation('.showcase_action_btn', 0.5);

        animateText('.beauty_title', 0.5);
        slideUpAnimation('.product_card', 0.5);
        slideDownAnimation('.product_title', 0.5);
        slideUpAnimation('.product_desc', 0.5);
        slideUpAnimation('.product_action_btn', 0.5);

        slideUpAnimation('.benefit_card', 0.5);
        slideDownAnimation('.benefit_card_img', 0.5);
        slideUpAnimation('.benefit_card_title', 0.5);
        slideUpAnimation('.benefit_card_desc', 0.5);

        slideUpAnimation('.newsletter_sec', 0.5);
        animateText('.newsletter_title', 0.5);
        slideUpAnimation('.newsletter_desc', 0.5);
        slideUpAnimation('.newsletter_input', 0.5);

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }, [])
    return (
        <>
            {children}
        </>
    )
}

export default Animation
