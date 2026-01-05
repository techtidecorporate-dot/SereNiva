import clsx from "clsx";

const ThemeButton = ({ children, variant = 'primary', className = '', ...props }) => {
    let variantClasses = '';

    switch (variant) {
        case 'primary':
            variantClasses = 'relative rounded-sm border-2 border-primary bg-primary text-white hover:bg-white hover:text-primary before:content-[""] before:absolute before:bg-primaryLight before:-top-[2px] before:right-5 before:w-2.5 before:h-0.5 before:duration-500 after:content-[""] after:absolute after:bg-primaryLight after:-bottom-[2px] after:left-5 after:w-2.5 after:h-0.5 after:duration-500 hover:before:right-3/4 hover:after:left-3/4';
            break;
        case 'secondary':
            variantClasses = 'relative bg-white rounded-sm border-2 border-grey-100 uppercase tracking-widest text-black hover:bg-black hover:text-white before:content-[""] before:absolute before:bg-black before:-top-[2px] before:right-5 before:w-2.5 before:h-0.5 before:duration-500 after:content-[""] after:absolute after:bg-black after:-bottom-[2px] after:left-5 after:w-2.5 after:h-0.5 after:duration-500 hover:before:right-3/4 hover:after:left-3/4';
            break;
        case 'secondary2':
            variantClasses = 'relative bg-black rounded-sm border-2 border-grey-100 uppercase tracking-widest text-white hover:text-black hover:bg-white before:content-[""] before:absolute before:bg-black before:-top-[2px] before:right-5 before:w-2.5 before:h-0.5 before:duration-500 after:content-[""] after:absolute after:bg-black after:-bottom-[2px] after:left-5 after:w-2.5 after:h-0.5 after:duration-500 hover:before:right-3/4 hover:after:left-3/4';
            break;
        case 'secondary3':
            variantClasses = 'relative bg-black rounded-full border-2 border-black uppercase tracking-widest text-white hover:bg-transparent hover:text-black';
            break;
        case 'outline':
            variantClasses = 'border border-primary text-primary hover:bg-primary hover:text-white';
            break;
        case 'ghost':
            variantClasses = 'text-primary hover:bg-primaryLight';
            break;
        case 'underline':
            variantClasses = 'relative rounded-full !p-0 text-black uppercase tracking-widest duration-300 after:content-[""] after:absolute after:w-full after:h-px after:scale-x-100 after:bg-black after:bottom-0 after:origin-center after:left-0 after:duration-300 hover:after:bg-primary hover:after:scale-x-0 hover:text-primary';
            break;
        default:
            variantClasses = 'bg-gray-300 text-black';
    }

    const baseClasses = 'px-5 py-3 md:text-base text-sm font-medium transition duration-300';
    const combinedClasses = clsx(baseClasses, variantClasses, className).trim();

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default ThemeButton;
