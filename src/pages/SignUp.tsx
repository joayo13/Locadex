import React, { useEffect, useState } from 'react';
import '../App.css';
import { signUpUser } from '../services/firebase';
import { error } from 'console';
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
        <div className='min-h-[calc(100vh-4rem)] bg-neutral-950 flex items-center justify-center text-blue-400'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
                <label className='block'>Email</label>
                <input
                    className='bg-neutral-900 border border-blue-400 rounded-sm indent-2'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className='block'>Password</label>
                <input
                    className='bg-neutral-900 border border-blue-400 rounded-sm indent-2'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className='block'>Confirm Password</label>
                <input
                    className='bg-neutral-900 border border-blue-400 rounded-sm indent-2'
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button className='bg-blue-800 w-fit text-neutral-200 translate-x-1/2 px-4 py-2 rounded-sm' type="submit">
                Sign Up
            </button>
            <Link className='block underline mx-auto' to={"/sign-in"}>Already have an account?</Link>
        </form>
        </div>
    );
}

export default SignUp;
