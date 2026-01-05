import PropTypes from 'prop-types';

const getHeadingClasses = (type) => {
    switch (type) {
        case 'h1':
            return 'xl:text-6xl md:text-5xl text-4xl leading-[120%] font-Merriwheather';
        case 'h2':
            return 'md:text-[42px] text-3xl leading-[120%] font-Merriwheather';
        case 'h3':
            return 'lg:text-3xl text-[28px] leading-[120%] font-Merriwheather font-medium';
        case 'h4':
            return 'md:text-2xl sm:text-xl text-lg leading-[120%] font-Merriwheather tracking-[0.5px]';
        case 'h5':
            return 'text-lg font-Merriwheather tracking-[0.5px]';
        case 'h6':
            return 'text-base font-Merriwheather tracking-[0.5px]';
        default:
            return 'text-base font-Merriwheather tracking-[0.5px]';
    }
};

const getParagraphClasses = (size) => {
    switch (size) {
        case 'extra-small':
            return 'text-xs font-normal tracking-[0.5px]'
        case 'extra-small-medium':
            return 'text-xs font-medium tracking-[0.5px]'
        case 'extra-small-semibold':
            return 'text-xs font-semibold tracking-[0.5px]'
        case 'extra-small-bold':
            return 'text-xs font-bold tracking-[0.5px]'

        case 'small':
            return 'text-sm font-normal tracking-[0.5px]'
        case 'small-medium':
            return 'text-sm font-medium tracking-[0.5px]'
        case 'small-semibold':
            return 'text-sm font-semibold tracking-[0.5px]'
        case 'small-bold':
            return 'text-sm font-bold tracking-[0.5px]'

        case 'base':
            return 'text-base font-normal tracking-[0.5px]'
        case 'base-medium':
            return 'text-base font-medium tracking-[0.5px]'
        case 'base-semibold':
            return 'text-base font-semibold tracking-[0.5px]'
        case 'base-bold':
            return 'text-base font-bold tracking-[0.5px]'

        case 'large':
            return 'lg:text-lg text-base font-normal tracking-[0.5px]'
        case 'large-medium':
            return 'lg:text-lg text-base font-medium tracking-[0.5px]'
        case 'large-semibold':
            return 'lg:text-lg text-base font-semibold tracking-[0.5px]'
        case 'large-bold':
            return 'lg:text-lg text-base font-bold tracking-[0.5px]'

        case 'extra-large':
            return 'lg:text-xl md:text-lg font-normal tracking-[0.5px]'
        case 'extra-large-medium':
            return 'lg:text-xl md:text-lg font-medium tracking-[0.5px]'
        case 'extra-large-semibold':
            return 'lg:text-xl md:text-lg font-semibold tracking-[0.5px]'
        case 'extra-large-bold':
            return 'lg:text-xl md:text-lg font-bold tracking-[0.5px]'

        default:
            return 'text-base tracking-[0.5px]'
    }
}

const TitleComponent = ({ type = 'p', size = 'base-normal', children, className = '' }) => {
    const finalClass =
        type !== 'p' ? getHeadingClasses(type) : getParagraphClasses(size);

    const Tag = type;

    return (
        <Tag className={`${className} ${finalClass}`}>
            {children}
        </Tag>
    );
};

TitleComponent.propTypes = {
    type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']),
    size: PropTypes.oneOf([
        'extra-small', 'extra-small-medium', 'extra-small-semibold', 'extra-small-bold',
        'small', 'small-medium', 'small-semibold', 'small-bold',
        'base', 'base-medium', 'base-semibold', 'base-bold',
        'large', 'large-medium', 'large-semibold', 'large-bold',
        'extra-large', 'extra-large-medium', 'extra-large-semibold', 'extra-large-bold'
    ]),
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default TitleComponent;
