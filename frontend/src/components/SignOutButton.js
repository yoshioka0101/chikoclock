import React from 'react';
import { signOut } from '../api';
import { useNavigate } from 'react-router-dom';

const SignOutButton = ({ setIsSignedIn }) => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsSignedIn(false);
            navigate('/');
        } catch (err) {
            console.error('Sign-out failed:', err);
        }
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
