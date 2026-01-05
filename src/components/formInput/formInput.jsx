import clsx from 'clsx';

const FormInput = ({ labelText, labelfor, type, name, placeholder, value, onChange, required = true, className = '' }) => {
    return (
        <div className='space-y-1.5'>
            <label className="block text-sm font-medium text-black mb-2">{labelText}</label>
            <input type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                id={labelfor}
                className={clsx(className, "p-4 bg-greyShade rounded lg:text-base text-sm text-black w-full placeholder:text-greyDark focus:outline-none")} />
        </div>
    )
}

export default FormInput;
