import clsx from 'clsx';

const FormInput2 = ({ type, name, placeholder, value, onChange, required = true, className = '' }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={clsx(className, 'py-3 px-4 border border-grey100 rounded-md bg-white lg:text-base text-sm text-black w-full placeholder:text-greyDark focus:outline-none focus:border-primary transition-colors duration-300')}
        />

    )
}

export default FormInput2;
