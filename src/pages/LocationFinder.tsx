
import LoadingScreen from './LoadingScreen';

function LocationFinder() {

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
            {/* using this empty div id=map to give init map something to attach to, we init map in generateLocation */}
            <div id="map"></div>
            {<LoadingScreen />}
        </div>
    );
}

export default LocationFinder;
