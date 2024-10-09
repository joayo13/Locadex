import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';

function LocationIndex() {
    const [places, setPlaces] = useState<string[]>([]);
    const { currentUser } = useAuth(); // Authenticated user info

    useEffect(() => {
        const fetchPlaces = async () => {
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
                        }
                    }
                } catch (error) {
                    console.error('Error fetching places:', error);
                }
            }
        };

        fetchPlaces();
    }, [currentUser]);
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
            <h1 className="text-6xl py-4 playfair text-orange-400">Index</h1>
            <ul className="underline flex flex-col gap-4">
                {places.sort().map((place, index) => (
                    <li key={index}>{place}</li>
                ))}
            </ul>
        </div>
    );
}

export default LocationIndex;
