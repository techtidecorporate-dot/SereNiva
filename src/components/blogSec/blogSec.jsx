import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import SectionTitle from '../sectionTitle/sectionTitle';
import TitleComponent from "../titleComponent/titleComponent";
import BlogCard from './blogCard';

const BlogSec = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const blogsRef = ref(database, 'blogs');
        const unsubscribe = onValue(blogsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const blogsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).reverse(); // Show newest first
                setBlogs(blogsArray);
            } else {
                setBlogs([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const LoadingPlaceholder = () => (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                    <div className="bg-gray-200 aspect-[16/10] w-full"></div>
                    <div className="p-6 space-y-4">
                        <div className="flex gap-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-1/3 pt-4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className='lg:py-32 md:py-24 py-14'>
            <div className="container">
                <SectionTitle
                    subtitle="SPA Insights" subtitleClass="about_subtitle"
                    title="Read Our Latest" titleClass="about_title"
                    headingLevel='h2' highlightedText="Blog"
                    sectionStyle="text-center max-w-[900px] mx-auto mb-12"
                >
                    <TitleComponent size='base' className='mt-5 text-textColor'>
                        Explore our collection of articles on wellness, spa treatments, and healthy living.
                    </TitleComponent>
                </SectionTitle>

                {loading ? (
                    <LoadingPlaceholder />
                ) : blogs.length > 0 ? (
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} data={blog} id={blog.id} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">No blog posts found.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default BlogSec;
