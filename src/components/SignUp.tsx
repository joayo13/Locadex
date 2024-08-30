import React, { useEffect, useState } from 'react';
import '../App.css';
import { signUpUser } from '../services/firebase';
type SignUpProps = {
    setSignUpFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
function SignUp({ setSignUpFormVisible }: SignUpProps) {
    useEffect(() => {
        // Disable scrollbar
        document.body.style.overflow = 'hidden';

        // Re-enable scrollbar when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []); // Empty dependency array ensures this runs only on mount/unmount
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event);
        signUpUser(email, password);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <form className="sign-in-container" onSubmit={handleSubmit}>
            <button onClick={() => setSignUpFormVisible(false)}>exit</button>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button value={'signup'} type="submit">
                Sign Up
            </button>
        </form>
    );
}

export default SignUp;
