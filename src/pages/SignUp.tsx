import React, { useState } from 'react';
import '../App.css';
import { signUpUser } from '../services/firebase';
import { Link } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event);
        if(confirmPassword !== password) {
            return alert('passwords do not match')
        }
        signUpUser(email, password);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className='min-h-[calc(100vh-4rem)] bg-stone-950 flex items-center justify-center text-orange-400'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
                <label className='block'>Email</label>
                <input
                    className='bg-stone-900 border border-orange-400 rounded-sm indent-2'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className='block'>Password</label>
                <input
                    className='bg-stone-900 border border-orange-400 rounded-sm indent-2'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className='block'>Confirm Password</label>
                <input
                    className='bg-stone-900 border border-orange-400 rounded-sm indent-2'
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button className='bg-orange-800 w-fit text-stone-200 mx-auto px-4 py-2 rounded-sm' type="submit">
                Sign Up
            </button>
            <Link className='block underline mx-auto' to={"/sign-in"}>Already have an account?</Link>
        </form>
        </div>
    );
}

export default SignUp;
