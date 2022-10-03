# Contribute
Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome!

## Development setup

### Install dependencies
- [Git](https://git-scm.com)
- [npm](https://npmjs.com) or [yarn](https://yarnpkg.com)

### Fork the repository
To contribute to SPARK, you must fork the [SPARK Repository](https://github.com/zairza-cetb/SPARK) 

### Build SPARK
1. Clone your forked Github repository:
```bash
git clone https://github.com/<github_username>/SPARK.git
```

2. Go to the project directory:
```bash
cd SPARK
```

3. Install npm/yarn dependencies:
```bash
npm install 
# OR
yarn
```

4. Set up  your firebase project credentials
* In the firebase console,click **Add Project**
  * To create a new project, enter the desired project name.
* Click Create Project
* After you have a Firebase project, you can register your app
   * In the center of the Firebase console's project overview page, click the Web icon to launch the setup workflow.
   * Enter your app's nickname.
   * Click Register app.
   * Follow the on-screen instructions to add and initialize the Firebase SDK in your app.
   * Go to console and then project settings
   * Then in **General** tab , you will find the *Your apps* section, select your web app name
   * You will find your firebase configurations there
   * Replace the **firebaseConfig** object with the object in **src\services\firebase\index.js** file in your folder.
   * Make sure to replace all your firebase credentials with environment variables for security reasons.
   * Make sure not to make those environment variables public by putting the **.env** file in **.gitignore** file.



4. Run locally:
```bash
npm start
yarn start
```

## Create a pull request
After making your changes, open a pull request (PR). Once you submit your pull request, others from the SPARK team will review it.
Did you have an issue, like a merge conflict, or don't know how to open a pull request? Check out [GitHub's pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) tutorial on how to resolve merge conflicts and other issues.
