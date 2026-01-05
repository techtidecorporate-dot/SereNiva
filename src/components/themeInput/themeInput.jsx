import clsx from "clsx";
import ThemeButton from "../themeButton/themeButton";

const ThemeInput = ({
    type = "email",
    name = "email",
    id = "email",
    placeholder = "Write your email",
    required = true,
    buttonText = "",
    className
}) => {
    return (
        <div className={clsx("relative", className)}>
            <input
                className="w-full sm:h-16 h-auto border border-solid border-grey-100 outline-none bg-white rounded-full py-3.5 pl-5 pr-5 sm:pr-32 text-base leading-normal text-black2 font-light"
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                required={required}
            />
            {
                buttonText && (
                    <div className="sm:absolute sm:w-max w-full sm:top-1/2 sm:-translate-y-1/2 sm:right-2 sm:mt-0 mt-4">
                        <ThemeButton variant="secondary3" className="sm:w-auto w-full">{buttonText}</ThemeButton>
                    </div>
                )
            }
        </div>
    );
};

export default ThemeInput;
