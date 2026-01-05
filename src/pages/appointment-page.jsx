import HeroSec2 from '../components/heroSec/heroSec2';
import AppointmentSec from '../components/appointmentSec/appointmentSec';

const AppointmentPage = () => {
    return (
        <>
            <HeroSec2
                heading="Book Appointment"
                Link="/appointment"
                pageText="Appointment"
            />
            <AppointmentSec />
        </>
    );
};

export default AppointmentPage;
