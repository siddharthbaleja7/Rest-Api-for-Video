# Video API

This project provides REST APIs for managing video files, including uploading, trimming, merging, and sharing video links.

## Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

## Setup

1. **Initialize the project:**

    ```sh
    mkdir video-api
    cd video-api
    npm init -y
    npm install express multer sqlite3 swagger-ui-express jsonwebtoken jest supertest
    ```

2. **Create the necessary folders and files:**

    ```sh
    mkdir controllers middlewares routes models tests
    touch app.js config.js controllers/videoController.js middlewares/authenticate.js routes/videoRoutes.js models/video.js 
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following:

    ```env
    
    apiToken=your_secret_key
    ```

## Running the API Server

1. **Start the server:**

    ```sh
    node app.js
    ```

## Folder Structure

- `app.js`
- `config.js`
- `controllers/`
  - `videoController.js`
- `middlewares/`
  - `auth.js`
- `models/`
  - `video.js`
- `routes/`
  - `videoRoutes.js`
- `.env`
- `package.json`


## Features

- **Upload Video:** Allows users to upload videos with configurable size and duration limits.
- **Trim Video:** Allows trimming a previously uploaded video from the start or end.
- **Merge Videos:** Allows merging multiple previously uploaded video clips into a single video file.
- **Share Video Link:** Allows sharing a video link with a time-based expiry.

## Dependencies

- `express`: Web framework for Node.js.
- `multer`: Middleware for handling `multipart/form-data`.
- `sqlite3`: SQLite database library.

## License

This project is licensed under the MIT License.

