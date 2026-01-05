import { serviceData } from "../../Data";
import ServiceSecCart from "./ServiceSecCart";

const ServiceSec = () => {
    return (
        <section className="lg:pt-32 md:pt-24 pt-14">
            <div className="container-fluid">
                <div className="grid md:grid-cols-4 grid-cols-2 gap-1">
                    {serviceData.map((data, index) => (
                        <ServiceSecCart data={data} key={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServiceSec;