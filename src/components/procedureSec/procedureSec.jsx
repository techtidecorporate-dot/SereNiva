import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { procedureData as staticData } from '../../Data';

import SectionTitle from '../sectionTitle/sectionTitle';
import TitleComponent from '../titleComponent/titleComponent';
import ProcedureCard from './procedureCard';

const ProcedureSec = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const servicesRef = ref(database, 'services');
        const unsubscribe = onValue(servicesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const servicesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).filter(s => s.status === 'Active');
                setServices(servicesArray);
            } else {
                // If no database services, use static data
                setServices(staticData);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className='lg:py-32 md:py-24 py-14'>
            <div className="container">
                <SectionTitle
                    subtitle="Our Specialties" subtitleClass="procedure_subtitle"
                    title="Signature" titleClass="procedure_title"
                    headingLevel='h2' highlightedText="Journeys"
                    sectionStyle="text-center max-w-[800px] mx-auto mb-12"
                >
                    <TitleComponent size='base' className='procedure_desc text-grey8 mt-5 lg:mb-14 mb-10'>Indulge in our curated selection of specialized treatments, each meticulously designed to harmonize your body, mind, and spirit for the ultimate wellness journey.</TitleComponent>
                </SectionTitle>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8">
                        {services.map((data, index) => (
                            <ProcedureCard data={data} key={data.id || index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProcedureSec;
