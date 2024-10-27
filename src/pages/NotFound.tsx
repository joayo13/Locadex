import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4 text-center">
            <h1 className="text-6xl py-4 playfair text-orange-400">
                404 Not Found
            </h1>
            <Link className="underline" to={'/'}>
                Return to home
            </Link>
        </div>
    );
}

export default NotFound;
