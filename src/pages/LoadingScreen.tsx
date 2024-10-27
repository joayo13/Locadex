function LoadingScreen() {
    return (
        <div className="h-[calc(100vh-4rem)] bg-stone-950 flex items-center justify-center">
            <div className="container">
                <div className="line"></div>
                <p className="text-sm text-orange-400 mt-20 text-center">loading</p>
            </div>
        </div>
    );
}

export default LoadingScreen;
