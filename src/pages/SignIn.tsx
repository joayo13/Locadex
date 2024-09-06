import React, { useEffect, useState } from 'react';
import '../App.css';
import { signInUser } from '../services/firebase';
import SignUp from './SignUp';
import { Link } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event);
        signInUser(email, password);
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
            <button className='bg-orange-800 w-fit text-stone-200 translate-x-1/2 px-4 py-2 rounded-sm' type="submit">
                Sign In
            </button>
            <Link className='block underline mx-auto' to={"/sign-up"}>Haven't signed up yet?</Link>
        </form>
        </div>

    );
}

export default SignIn;
