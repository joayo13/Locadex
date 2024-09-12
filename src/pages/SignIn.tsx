import React, { useState } from 'react';
import '../App.css';
import AnimatedLink from '../components/AnimatedLink';
import { useAuth } from '../contexts/AuthContext';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleSignIn } = useAuth()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            login(email, password)
        }
        catch(e) {
            console.log(e)
            setError('check console')
        }
        
    };

    return (
        <div className='min-h-[calc(100vh-4rem)] bg-stone-950 flex items-center justify-center text-orange-400'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='w-44 text-red-400'>{error}</div>
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
            <button className='bg-orange-800 w-fit mx-auto text-stone-200 px-4 py-2 rounded-sm' type="submit">
                Sign In
            </button>
            <button type="button" onClick={() => googleSignIn()} className='bg-orange-800 w-fit mx-auto text-stone-200 px-4 py-2 rounded-sm'>
                Sign In With Google
            </button>
            <AnimatedLink className='block underline mx-auto' to={"/sign-up"}>Haven't signed up yet?</AnimatedLink>
        </form>
        </div>

    );
}

export default SignIn;
