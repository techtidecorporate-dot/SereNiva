import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { FacebookLogo, TwitterLogo, LinkedinLogo, InstagramLogo } from 'phosphor-react';
import SectionTitle from '../sectionTitle/sectionTitle';
import TitleComponent from "../titleComponent/titleComponent";
import TeamCart from "./teamCart";

const TeamSec = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const teamRef = ref(database, 'therapists');
        const unsubscribe = onValue(teamRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedTeam = Object.values(data)
                    .filter(member => member.status === 'Active') // Only show active therapists
                    .map(member => ({
                        image: member.image,
                        heading: member.name, // TeamCart expects 'heading' for name
                        text: member.specialty, // TeamCart expects 'text' for specialty
                        icons: [
                            member.socials?.facebook && { icon: FacebookLogo, to: member.socials.facebook },
                            member.socials?.twitter && { icon: TwitterLogo, to: member.socials.twitter },
                            member.socials?.linkedin && { icon: LinkedinLogo, to: member.socials.linkedin },
                            member.socials?.instagram && { icon: InstagramLogo, to: member.socials.instagram }
                        ].filter(Boolean)
                    }));
                setTeam(formattedTeam);
            } else {
                setTeam([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return null; // Or a skeleton loader if preferred

    if (team.length === 0) return null; // Hide section if no active team members

    return (
        <div className='lg:py-32 md:py-24 py-14'>
            <div className="container">
                <SectionTitle
                    subtitle="Meet Our Experts" subtitleClass="team_subtitle"
                    title="Experienced" titleClass="team_title"
                    headingLevel='h2' highlightedText="Team"
                    sectionStyle="text-center max-w-[800px] mx-auto mb-12"
                >
                    <TitleComponent size='base' className='team_desc mt-5 text-textColor'>
                        Our professional therapists are dedicated to your wellness journey.
                    </TitleComponent>
                </SectionTitle>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:gap-6 gap-4">
                    {team.map((data, index) => (
                        <TeamCart data={data} key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeamSec;
