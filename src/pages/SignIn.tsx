import React, { useState } from 'react';
import '../App.css';
import AnimatedLink from '../components/AnimatedLink';
import { useAuth } from '../contexts/AuthContext';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useError } from '../contexts/ErrorContext';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleSignIn } = useAuth();
    const { setError } = useError();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location object

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(email, password);
            document.startViewTransition(() => {
                flushSync(() => {
                    navigate(`${location.pathname}`);
                });
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };
    const handleGoogleSignIn = async () => {
        await googleSignIn();
        document.startViewTransition(() => {
            flushSync(() => {
                navigate(`${location.pathname}`);
            });
        });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-stone-950 flex items-center justify-center text-orange-400">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block">Email</label>
                    <input
                        className="bg-stone-900 border border-orange-400 rounded-sm indent-2"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block">Password</label>
                    <input
                        className="bg-stone-900 border border-orange-400 rounded-sm indent-2"
                        type="password"
                        minLength={10}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    className="bg-orange-800 w-fit mx-auto text-stone-200 px-4 py-2 rounded-sm"
                    type="submit"
                >
                    Sign In
                </button>
                <div className="flex gap-2 items-center">
                    <div className="h-px w-full bg-orange-400"></div>
                    <p className="text-orange-400 text-sm">or</p>
                    <div className="h-px w-full bg-orange-400"></div>
                </div>
                <button
                    type="button"
                    onClick={() => handleGoogleSignIn()}
                    className="bg-orange-800 w-fit mx-auto text-stone-200 px-4 py-2 rounded-sm"
                >
                    Sign In With Google
                </button>
                <AnimatedLink
                    className="block underline mx-auto"
                    to={'/sign-up'}
                >
                    Haven't signed up yet?
                </AnimatedLink>
            </form>
        </div>
    );
}

export default SignIn;
