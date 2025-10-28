import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data from localStorage on mount
    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = () => {
        try {
            const userData = localStorage.getItem('userData');
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (userData && isLoggedIn) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData) => {
        try {
            // Save user data to localStorage
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', userData.email);
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    };

    const updateUser = (updatedData) => {
        try {
            const updatedUser = { ...user, ...updatedData };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return true;
        } catch (error) {
            console.error('Error updating user data:', error);
            return false;
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('userData');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
            localStorage.removeItem('isAdmin');
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const isAuthenticated = () => {
        return user !== null && localStorage.getItem('isLoggedIn') === 'true';
    };

    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                login,
                updateUser,
                logout,
                isAuthenticated,
                loadUserFromStorage
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

