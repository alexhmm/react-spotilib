# Project Information and (development) Installation

## Information

This project should serve as a better management for releases / albums.
In 2023 still a missing feature in Spotify.\
The new feature `Collections` will be able to store releases / albums in custom created lists.

Implemented Features:

- [x] Login page
- [x] Home page
- [x] Search page
- [x] Library Playlists page
- [x] Library Artists page
- [x] Library Albums page
- [x] Playlist detail page (Read)
- [x] Artist detail page (Read + Update)
- [x] Album detail page (Read)
- [x] Settings page
- [x] Global state management (Zustand)
- [x] Internationalization (i18n)
- [x] Start music
- [x] Full responsive design

To be implemented Features:

- [ ] Logo ¯\_(ツ)\_/¯
- [ ] Header back and forward navigation
- [ ] Profile / User page
- [ ] Playlist page (Update + Delete)
- [ ] Album page (Update)
- [ ] Search (Add string to pathname for better navigation, show last searchs etc..)
- [ ] Collections to organize releases / albums (playlist like with sorting and display options)
- [ ] SEO (React Helmet)
- [ ] Cookie banner
- ...

Currently in Spotify Development mode (private view).\
Spotify Quota extension request (public view) TBC.

## Installation

To check out this project create an Application in [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).

Create an environment file `.env.development` in the root directory of this project.\
Copy the example content from `env-example` to `.env.development`.\
Fill the environment file with the variables provided by the created Spotify Application.

Run `npm start` to start the application in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Scopes

Spotilib uses the following [Spotify Scopes](https://developer.spotify.com/documentation/general/guides/authorization/scopes/):

- `playlist-read-private` Read access to user's private playlists.
- `user-follow-modify` Write/delete access to the list of artists and other users that the user follows.
- `user-follow-read` Read access to the list of artists and other users that the user follows.
- `user-library-read` Read access to a user's library.
- `user-modify-playback-state` Write access to a user’s playback state.
- `user-read-email` Read access to user’s email address.
- `user-read-playback-state` Read access to a user’s player state.
- `user-read-private` Read access to user’s subscription details (type of user account).
- `user-top-read` Read access to a user's top artists and tracks.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
