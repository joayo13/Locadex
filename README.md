# Locadex

This app was designed to efficiently find places (gyms, libraries, parks etc.) near the user. There are platforms which somewhat do this already like TripAdvisor. Except they do not let you customize and filter the results with the same precision as this application. I have also designed it to use as little data as possible, so if you decide to use the mobile version, you can safely use your data without it being taken up the way it would be with other applications. If you want to, you can download it to your device to have a more native app-like experience.

## Features

-   **TypeSafe**: Built with TypeScript to ensure code reliability and maintainability.
-   **Progressive Web App (PWA)**: Supports offline functionality and can be installed directly on your device.
-   **Unit tested**

## Tech Stack

-   **Frontend**: React, TypeScript
-   **Maps API**: Google Maps and Google Places API

## Getting Started

### Prerequisites

-   Google Maps API key

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/joayo13/Locadex.git
    cd locadex
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables:

    - Create a `.env` file in the root directory
    - Add your Google Maps API key:

    ```bash
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
