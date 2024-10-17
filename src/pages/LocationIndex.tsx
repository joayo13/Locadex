import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { useError } from '../contexts/ErrorContext';
import LoadingScreen from './LoadingScreen';

function LocationIndex() {
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    const [places, setPlaces] = useState<string[]>([]);
    const { currentUser } = useAuth(); // Authenticated user info
    const { setError } = useError();
    const setErrorRef = useRef(setError);

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoadingPlaces(true);
            if (currentUser) {
                try {
                    // Get the document reference for the current user
                    const userDocRef = doc(db, 'users', currentUser.uid);

                    // Fetch the user document
                    const userDoc = await getDoc(userDocRef);

                    // Check if document exists and retrieve the places array
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData?.places) {
                            setPlaces(userData.places);
                            localStorage.setItem(
                                'placesList',
                                JSON.stringify(userData.places)
                            );
                            setLoadingPlaces(false);
                        }
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        setErrorRef.current(error.message);
                        setLoadingPlaces(false);
                    } else {
                        setErrorRef.current(
                            'An unknown error occured. Try again later.'
                        );
                        setLoadingPlaces(false);
                    }
                    console.error('Error fetching places:', error);
                }
            }
        };
        fetchPlaces();
    }, [currentUser]);
    const placesList = () => {
        return (
            <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
                <h1 className="text-6xl py-4 playfair text-orange-400">
                    Index
                </h1>
                <p>{!places ? 'You have not captured a place yet.' : null}</p>
                <ul className="underline flex flex-col gap-4">
                    {places.sort().map((place, index) => (
                        <li
                            key={index}
                            className="fade-in-animation"
                            style={{ animationDelay: `${index * 0.2}s` }} // Stagger effect with delay
                        >
                            {place}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    return <>{loadingPlaces ? <LoadingScreen /> : placesList()}</>;
}

export default LocationIndex;
