# Smart Contract Generator -- Remix Plugin Introduction

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Once the plugin is connected to Remix, it would also use bootstrap css styles that were already defined by Remix so that the format adheres to the changing themes.

## Available Scripts

In the project directory, you can run:

### `npm install`

To download all the dependencies from package.json file needed for the project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

<!-- This is the url you enter when you want to connect this local plugin on Remix. -->

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner and runs the tests in /src/App.test.tsx file.\
The vitest testing framework is used for this project.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimises the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed using script `serve -s build`.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run format`

Uses Prettier code formatter to ensure that files adhere to a single standard.

## Connecting the plugin on Remix

1. Click the plugin manager icon on the sidebar of Remix.
2. Click Connect to a Local Plugin.
3. Run either `npm start` or `npm run build` in the terminal of project directory.
4. Enter as shown below:

![localPlugin](/src/assets/connection.png 'Connecting a local plugin on Remix')

## Important directories to note

Chat dialogues generated when testing the different smart contract use cases are found in
[\generated_contracts](https://github.com/alvasi/react-plugin/tree/main/generated_contracts/deepseek) .\
Plugin logic is located in [\src\app\App.tsx](https://github.com/alvasi/react-plugin/blob/main/src/app/App.tsx) .\
LLM integration logic is found in [\src\app\deepseek-client.ts](https://github.com/alvasi/react-plugin/blob/main/src/app/deepseek-client.ts) .\
Tests for the plugin are in the [\src\App.test.tsx](https://github.com/alvasi/react-plugin/blob/main/src/App.test.tsx) file.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
