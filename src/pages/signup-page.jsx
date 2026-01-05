import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import ThemeButton from '../components/themeButton/themeButton';
import clsx from 'clsx';
import { CircleNotch, User } from 'phosphor-react';

// InputField component defined outside to prevent re-creation on every render
const InputField = ({ label, type, value, onChange, placeholder, required = false, errorText, min }) => (
    <div className='space-y-1.5 w-full'>
        <label className="block text-sm font-medium text-black mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            className={clsx(
                "p-3.5 bg-greyShade rounded lg:text-base text-sm text-black w-full placeholder:text-greyDark focus:outline-none border border-transparent focus:border-primary transition-colors",
                errorText ? "border-red-500" : ""
            )}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            min={min}
            required={required}
        />
        {errorText && <p className="text-xs text-red-500 mt-1">{errorText}</p>}
    </div>
);

const SignUpPage = () => {
    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('prefer-not-to-say');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    // Validation State
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [formValid, setFormValid] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    // Validation Logic
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\d{10,}$/.test(phone);
    const validateAge = (age) => parseInt(age) >= 18; // Assuming 18+ based on typical requirements, can adjust to 16 if needed

    // Password Strength Check
    useEffect(() => {
        let strength = "";
        if (password.length > 0) {
            if (password.length < 8) strength = "Too Short";
            else if (!/\d|[^a-zA-Z0-9]/.test(password)) strength = "Weak"; // Needs number or special char
            else strength = "Strong";
        }
        setPasswordStrength(strength);
    }, [password]);

    // Overall Form Validity Check
    useEffect(() => {
        const isValid =
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            validateEmail(email) &&
            password.length >= 8 &&
            (password === confirmPassword) &&
            (phone === '' || validatePhone(phone)) && // Optional but valid if present
            (age === '' || validateAge(age)); // Optional but valid if present

        setFormValid(isValid);
    }, [firstName, lastName, email, phone, age, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formValid) {
            setError("Please correct the errors in the form.");
            setLoading(false);
            return;
        }

        try {
            await signup(
                { firstName, lastName, email, phone, age: age || null, gender },
                password,
                profilePicture
            );
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to create an account.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Profile picture must be less than 5MB');
                return;
            }
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            setProfilePicture(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="pt-32 pb-20 bg-lightPink10 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-black mb-2">Create Account</h2>
                    <p className="text-center text-gray-500 mb-8">Join Sereniva to book appointments and track your orders</p>

                    {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Personal Information */}
                        <section>
                            <h3 className="text-lg font-semibold text-black mb-4 border-b border-gray-100 pb-2">Personal Information</h3>

                            {/* Profile Picture Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative mb-3">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-50">
                                        {profilePicturePreview ? (
                                            <img src={profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={48} weight="duotone" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-md hover:bg-primaryDark cursor-pointer transition-colors">
                                        <User size={18} weight="bold" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 text-center">Upload a profile picture (optional, max 5MB)</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputField
                                    label="First Name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Jane"
                                    required
                                />
                                <InputField
                                    label="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                            <InputField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jane@example.com"
                                required
                                errorText={email && !validateEmail(email) ? "Invalid email format" : ""}
                            />
                        </section>

                        {/* Additional Details */}
                        <section>
                            <h3 className="text-lg font-semibold text-black mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                                Additional Details <span className="text-xs font-normal text-gray-400 uppercase tracking-wider">Optional</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputField
                                    label="Phone Number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setPhone(val);
                                    }}
                                    placeholder="1234567890"
                                    errorText={phone && !validatePhone(phone) ? "Must be at least 10 digits" : ""}
                                />
                                <InputField
                                    label="Age"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="18"
                                    min="18"
                                    errorText={age && !validateAge(age) ? "Must be 18 or older" : ""}
                                />
                            </div>
                            <div className='space-y-1.5 w-full'>
                                <label className="block text-sm font-medium text-black mb-1">Gender</label>
                                <div className="relative">
                                    <select
                                        className="w-full p-3.5 bg-greyShade rounded lg:text-base text-sm text-black appearance-none focus:outline-none focus:border-primary border border-transparent"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section>
                            <h3 className="text-lg font-semibold text-black mb-4 border-b border-gray-100 pb-2">Security</h3>
                            <div className="space-y-4">
                                <div>
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                    />
                                    {password && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={clsx("h-full transition-all duration-300",
                                                        passwordStrength === "Too Short" ? "w-1/3 bg-red-400" :
                                                            passwordStrength === "Weak" ? "w-2/3 bg-yellow-400" :
                                                                "w-full bg-green-500"
                                                    )}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">{passwordStrength || "Min 8 chars"}</span>
                                        </div>
                                    )}
                                </div>

                                <InputField
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                    errorText={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
                                />
                            </div>
                        </section>

                        <div className="pt-4">
                            <ThemeButton
                                type="submit"
                                variant="primary"
                                className={clsx("w-full justify-center flex items-center gap-2", !formValid || loading ? "opacity-70 cursor-not-allowed" : "")}
                                disabled={!formValid || loading}
                            >
                                {loading && <CircleNotch className="animate-spin" size={20} />}
                                {loading ? "Creating Account..." : "Create Account"}
                            </ThemeButton>

                            <p className="mt-4 text-xs text-center text-gray-500">
                                Your personal information is kept private and used only for appointment and service purposes.
                                <br />
                                By creating an account, you agree to our <a href="#" className="underline hover:text-primary">Privacy Policy</a> and <a href="#" className="underline hover:text-primary">Terms & Conditions</a>.
                            </p>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/signin" className="text-primary font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
