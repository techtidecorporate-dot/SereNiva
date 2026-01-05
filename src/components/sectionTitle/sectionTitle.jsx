import clsx from "clsx";
import TitleComponent from "../titleComponent/titleComponent";

const SectionTitle = ({ subtitle, subtitleClass, title, titleClass, highlightedText, remainingTitle, headingLevel, headingColor, sectionStyle, children }) => {
    const HeadingTag = headingLevel;

    return (
        <div className={clsx(sectionStyle)}>
            <TitleComponent size="large" className={clsx(subtitleClass, "inline-block text-primary bg-primaryLight border-b-2 border-b-borderColor py-1 px-3 rounded-full text-primary")}>{subtitle}</TitleComponent>

            <TitleComponent type={HeadingTag} className={clsx(titleClass, "mt-5", headingColor ? headingColor : "text-black")}>
                {title}{" "}
                {highlightedText && (
                    <span className="relative inline-block bg-gradient bg-clip-text text-transparent mr-2">
                        {highlightedText}
                    </span>
                )}
                {remainingTitle}
            </TitleComponent>
            {children}
        </div>
    );
};

export default SectionTitle;
