import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    updatePassword
} from 'firebase/auth';
import { ref, set, get, update, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, database, storage } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let dbUnsubscribe = null;

        // Listen for authentication state changes
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, set up real-time listener for database
                const userRef = ref(database, `users/${user.uid}`);

                // If there was a previous listener (e.g., user switch), unsubscribe
                if (dbUnsubscribe) {
                    dbUnsubscribe();
                }

                dbUnsubscribe = onValue(userRef, (snapshot) => {
                    const userData = snapshot.val() || {};

                    // Merge Auth data with Database data
                    // Database data takes precedence for fields like photoURL if updated there
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        ...userData
                    });
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    // Fallback to Auth data if DB fails
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    });
                    setLoading(false);
                });

            } else {
                // User is signed out
                if (dbUnsubscribe) {
                    dbUnsubscribe();
                    dbUnsubscribe = null;
                }
                setCurrentUser(null);
                setLoading(false);
            }
        });

        // Cleanup subscription on unmount
        return () => {
            authUnsubscribe();
            if (dbUnsubscribe) {
                dbUnsubscribe();
            }
        };
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Login error:", error);
            throw getReadableError(error);
        }
    };

    const signup = async (userData, password, profilePicture = null) => {
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                password
            );

            const user = userCredential.user;
            const displayName = `${userData.firstName} ${userData.lastName}`;
            let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

            // Upload profile picture if provided
            if (profilePicture) {
                try {
                    const imageRef = storageRef(storage, `profilePictures/${user.uid}/profile.jpg`);
                    await uploadBytes(imageRef, profilePicture);
                    photoURL = await getDownloadURL(imageRef);
                } catch (uploadError) {
                    console.error("Error uploading profile picture:", uploadError);
                    // Continue with default avatar if upload fails
                }
            }

            // Update user profile
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL
            });

            // Store additional user data in Realtime Database
            const userRef = ref(database, `users/${user.uid}`);
            await set(userRef, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone || '',
                age: userData.age || null,
                gender: userData.gender || 'prefer-not-to-say',
                role: 'customer',
                createdAt: new Date().toISOString(),
                displayName: displayName,
                photoURL: photoURL
            });

            return user;
        } catch (error) {
            console.error("Signup error:", error);
            throw getReadableError(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
            throw getReadableError(error);
        }
    };

    const updateUserProfile = async (updates, profilePicture = null) => {
        try {
            if (!currentUser) throw new Error("No user logged in");

            const user = auth.currentUser;
            let photoURL = currentUser.photoURL;

            // Upload new profile picture if provided
            if (profilePicture) {
                try {
                    const imageRef = storageRef(storage, `profilePictures/${user.uid}/profile.jpg`);
                    await uploadBytes(imageRef, profilePicture);
                    photoURL = await getDownloadURL(imageRef);
                } catch (uploadError) {
                    console.error("Error uploading profile picture:", uploadError);
                    throw new Error("Failed to upload profile picture");
                }
            }

            // Update display name if first/last name changed
            let displayName = currentUser.displayName;
            if (updates.firstName || updates.lastName) {
                const firstName = updates.firstName || currentUser.firstName;
                const lastName = updates.lastName || currentUser.lastName;
                displayName = `${firstName} ${lastName}`;
            }

            // Update Firebase Auth profile
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL
            });

            // Update Realtime Database
            const userRef = ref(database, `users/${user.uid}`);
            const updatedData = {
                ...updates,
                displayName: displayName,
                photoURL: photoURL,
                updatedAt: new Date().toISOString()
            };

            await update(userRef, updatedData);

            // Update local state
            setCurrentUser({
                ...currentUser,
                ...updatedData
            });

            return true;
        } catch (error) {
            console.error("Update profile error:", error);
            throw getReadableError(error);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            if (!currentUser || currentUser.role !== 'admin') {
                throw new Error('Unauthorized: Only admins can change user roles');
            }

            // Validate role
            const validRoles = ['customer', 'therapist', 'admin'];
            if (!validRoles.includes(newRole.toLowerCase())) {
                throw new Error('Invalid role. Must be customer, therapist, or admin');
            }

            // Update in Firebase Realtime Database
            const userRef = ref(database, `users/${userId}`);
            await update(userRef, {
                role: newRole.toLowerCase(),
                updatedAt: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error("Update role error:", error);
            throw error;
        }
    };

    const changePassword = async (newPassword) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No user logged in");
            await updatePassword(user, newPassword);
            return true;
        } catch (error) {
            console.error("Change password error:", error);
            throw getReadableError(error);
        }
    };

    // Helper function to convert Firebase errors to user-friendly messages
    const getReadableError = (error) => {
        const errorCode = error.code;
        let message = error.message;

        switch (errorCode) {
            case 'auth/email-already-in-use':
                message = 'This email is already registered. Please sign in instead.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                message = 'Email/password accounts are not enabled.';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak. Please use at least 6 characters.';
                break;
            case 'auth/user-disabled':
                message = 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                message = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password.';
                break;
            case 'auth/invalid-credential':
                message = 'Invalid credentials. Please check your email and password.';
                break;
            case 'auth/network-request-failed':
                message = 'Network error. Please check your internet connection.';
                break;
            default:
                message = error.message || 'An error occurred. Please try again.';
        }

        return new Error(message);
    };

    const value = {
        currentUser,
        login,
        signup,
        logout,
        updateUserProfile,
        updateUserRole,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

