import React from 'react';
interface UseLocationPopupProps {
    setUseGeolocation: (useGeolocation: boolean) => void;
    setUseLocationPopup: (useLocationPopup: boolean) => void;
  }
function UseLocationPopup({ setUseGeolocation, setUseLocationPopup }: UseLocationPopupProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const locationChoice = formData.get('locationChoice');

    if (locationChoice === 'agree') {
      localStorage.setItem('useLocation', 'true')
      setUseGeolocation(true)
      setUseLocationPopup(false)
    } else if (locationChoice === 'opt-out') {
      setUseLocationPopup(false)
      localStorage.setItem('useLocation', 'false')
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-stone-900 rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold">Location Permissions</h2>
        <p>
          Locadex uses your device's geolocation to get places near you. It is not kept on any records and is only used to make requests to Google APIs.
          If you wish to opt out of using your location, the application will instead use a default location of London England, so you can still explore the app's features.
        </p>
        <form className='mt-4 mx-auto w-max' onSubmit={handleSubmit}>
          <label className="flex items-center mb-4">
            <input 
              type="radio" 
              name="locationChoice" 
              value="agree" 
              className="mr-2"
            />
            I agree to use my geolocation
          </label>
          <label className="flex items-center mb-4">
            <input 
              type="radio" 
              name="locationChoice" 
              value="opt-out" 
              className="mr-2"
            />
            DO NOT use my geolocation
          </label>
          <div className='text-center'>
          <button 
           className="py-2 mb-2 w-20 bg-transparent hover:bg-orange-400 border border-orange-400  text-orange-400 hover:text-stone-950 rounded-sm transition-all">
            Submit
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UseLocationPopup;