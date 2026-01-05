import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import FormInput from '../components/formInput/formInput';
import ThemeButton from '../components/themeButton/themeButton';
import PageHeader from "../components/titleComponent/titleComponent"; // Assuming this exists based on dir structure, but let's check or just build a simple header if not sure. Actually better to just build a simple section.

// I'll stick to a clean layout.

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
        }
    };

    return (
        <div className="pt-32 pb-20 bg-lightPink10">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-black mb-8">Sign In</h2>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='space-y-1.5'>
                            <label className="block text-sm font-medium text-black mb-2">Email</label>
                            <input
                                type="email"
                                className="p-4 bg-greyShade rounded lg:text-base text-sm text-black w-full placeholder:text-greyDark focus:outline-none"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='space-y-1.5'>
                            <label className="block text-sm font-medium text-black mb-2">Password</label>
                            <input
                                type="password"
                                className="p-4 bg-greyShade rounded lg:text-base text-sm text-black w-full placeholder:text-greyDark focus:outline-none"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <ThemeButton type="submit" variant="primary" className="w-full justify-center">
                            Sign In
                        </ThemeButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
