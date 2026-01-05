import { productBenefitsData } from '../../Data';

import ProductBenefit from './productBenefit';

const ProductBenefitsSec = () => {
    return (
        <section className='lg:py-32 md:py-24 py-14'>
            <div className="container">
                <div className='grid md:grid-cols-4 sm:grid-cols-2 gap-5 items-center'>
                    {productBenefitsData.map((item, index) => (
                        <ProductBenefit key={index} props={item} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductBenefitsSec;
