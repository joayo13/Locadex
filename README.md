# Locadex

Locadex is a mobile Progressive Web App (PWA) that generates top-rated nearby points of interest. It also has a map that helps you track the point of interest Can be used in desktop but meant for mobile.

## Features

- **TypeSafe**: Built with TypeScript to ensure code reliability and maintainability.
- **Progressive Web App (PWA)**: Supports offline functionality and can be installed directly on your device.
- **User Authentication**: Secure sign-up and login with Firebase authentication.
- **Adventure Tracking**: Capture and save your locations.

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Firebase for authentication and Firestore for database management
- **Maps API**: Google Maps and Google Places API

## Getting Started

### Prerequisites
- Firebase account and project
- Google Maps API key

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/locadex.git
    cd locadex
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables:
    - Create a `.env` file in the root directory
    - Add your Firebase config and Google Maps API key:

    ```bash
    REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
    REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
    ```

4. Start the development server:

    ```bash
    npm run start
    ```

5. Open the app at [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---
