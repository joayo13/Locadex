import { useEffect, useRef, useState } from 'react';
import { useError } from '../contexts/ErrorContext';

const GlobalErrorNotification = () => {
    const { error, setError } = useError();
    const setErrorRef = useRef(setError);
    const [errorShowing, setErrorShowing] = useState(false);

    useEffect(() => {
        if (error) {
            setErrorShowing(true);
            setTimeout(() => {
                setErrorShowing(false);
            }, 2000);
            //Give enough time for animation to happen before setting to null again
            setTimeout(() => {
                setErrorRef.current(null);
            }, 2500);
        }
    }, [error]);

    if (!error) return null; // No error, don't show anything

    return (
        <div
            className={`error ${errorShowing ? 'animate-error-in' : 'animate-error-out'}`}
        >
            <div className="fixed bottom-0 z-50 w-full bg-red-900 text-stone-200 flex gap-2 px-2 py-8 rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                </svg>
                <p>{error}</p>
            </div>
        </div>
    );
};

export default GlobalErrorNotification;
