import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, push, set } from 'firebase/database';
import { useAuth } from '../../context/auth-context';
import { useToast } from '../../context/toast-context';
import SectionTitle from '../sectionTitle/sectionTitle';
import TitleComponent from '../titleComponent/titleComponent';
import ThemeButton from '../themeButton/themeButton';
import FormInput2 from '../formInput/formInput2';
import ContactImage from '../../assets/cta-img.webp';
import { massageServicesData } from '../../Data';
import clsx from 'clsx';

const AppointmentSec = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: currentUser?.displayName || (currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : ''),
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        service: '',
        date: '',
        time: '',
        notes: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.displayName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || prev.name,
                email: currentUser.email || prev.email,
                phone: currentUser.phone || prev.phone
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.service || !formData.date || !formData.time) {
            showToast("Please fill in all required fields", 'error');
            return;
        }

        setLoading(true);
        try {
            const appointmentsRef = ref(database, 'appointments');
            const newRef = push(appointmentsRef);

            const selectedService = massageServicesData.find(s => s.name === formData.service);

            const appointmentData = {
                userId: currentUser?.uid || 'guest',
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                serviceName: formData.service,
                serviceDuration: selectedService?.duration || '60 min',
                date: formData.date,
                time: formData.time,
                notes: formData.notes,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            await set(newRef, appointmentData);

            // If user is logged in, send notification
            if (currentUser) {
                const notificationRef = push(ref(database, `notifications/${currentUser.uid}`));
                await set(notificationRef, {
                    title: 'Appointment Pending',
                    message: `Your booking for ${formData.service} is now pending. Check your profile for updates!`,
                    date: new Date().toISOString(),
                    read: false,
                    type: 'appointment'
                });
            }

            showToast("Success! Your booking request is pending.", 'success');
            setFormData({
                name: currentUser?.displayName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || '',
                email: currentUser?.email || '',
                phone: currentUser?.phone || '',
                service: '',
                date: '',
                time: '',
                notes: ''
            });

        } catch (error) {
            console.error(error);
            showToast("Failed to book appointment", 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = "py-3 px-4 border border-grey100 rounded-md bg-white lg:text-base text-sm text-black w-full focus:outline-none focus:border-primary transition-colors duration-300";

    return (
        <div id="appointment" className="relative flex items-center bg-primaryLight md:mb-12">
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 lg:w-2/5 h-full overflow-hidden lg:block hidden">
                <img className='w-full h-full object-cover' src={ContactImage} alt="contact image" />
            </div>
            <div className="container">
                <div className="lg:flex lg:justify-end xl:pl-[100px] lg:pl-16 xl:py-32 md:py-24 py-14">
                    <div className='lg:w-3/5'>
                        <SectionTitle
                            subtitle="Book Your Session" subtitleClass="contact_subtitle"
                            title="Make an" titleClass="contact_title"
                            headingLevel='h2' highlightedText="Appointment"
                            sectionStyle="mb-8"
                        >
                            <TitleComponent size='base' className='contact_desc mt-5 text-textColor'>Schedule your relaxation session with our expert therapists</TitleComponent>
                        </SectionTitle>

                        <form onSubmit={handleSubmit} className='flex flex-col lg:gap-6 gap-3.5'>
                            <div className='flex sm:flex-row flex-col lg:gap-6 gap-3.5'>
                                <FormInput2 type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} required />
                                <FormInput2 type='email' name='email' placeholder='Email Address' value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className='flex sm:flex-row flex-col lg:gap-6 gap-3.5'>
                                <select
                                    className={clsx(inputStyles, "appearance-none")}
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select service</option>
                                    {massageServicesData.map((s, i) => (
                                        <option key={i} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                                <FormInput2 type='tel' name='phone' placeholder='Phone Number' value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className='flex sm:flex-row flex-col lg:gap-6 gap-3.5'>
                                <FormInput2 type='date' name='date' placeholder='mm/dd/yyyy' value={formData.date} onChange={handleChange} required />
                                <FormInput2 type='time' name='time' placeholder='--:-- --' value={formData.time} onChange={handleChange} required />
                            </div>
                            <textarea
                                className={inputStyles}
                                name="notes"
                                rows="4"
                                placeholder="Your notes"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                            <div className="col-span-2">
                                <ThemeButton variant='primary' type="submit" disabled={loading}>
                                    {loading ? 'Processing...' : 'Make an Appointment'}
                                </ThemeButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSec;