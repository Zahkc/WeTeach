# Hey All, I finally rebased  the git so  here are some getting started instructions.

## Set up dev envrionment

First, to get the project on your computer please run the following commands in order.

### `git clone https://github.com/tomhobeika/CSIT321.git`
If you are developing for front end or back end you may want to add --branch Front or --branch Back .
Once cloned run:
### `cd CSIT321`
### `npm install`
### `npm start`
Now the project should be running your browser.

## Keeping the project up to date

Before writing code to ensure the project is up to date you should always run:
### `git pull`

Once you have written code you wish to upload simply run:
### `git add -A`
### `git commit -m "Short message about the update details"`
### `git push`

## Deployment

To deploy the porject to the server the following steps should be done:

### `npm run build`
This will make a build folder ready for the server
### `git add ./build/`
### `git commit -m "Deployment Build"`
These commands will push the new build to your branch.
### `git checkout main`
### `git merge master`
### `git push origin main`
These commands will merge your branch with main.

Now you should log into the server and simply run:
### `bash publish`
or ### `bash ~/import`

To publish the videos run this:
### `sudo ln -s /weteach/data/public /var/www/html/media_content`

To start the API:
### `pm2 start /weteach/api/server.js -n dbdaemon --attach`

For the upload component
### `pm2 start /weteach/upload/server.js -n uploaddaemon --attach`

To check the API is running simply run (under Dev login): 
### `pm2 list`

If not running type
### `pm2 resurrect`

To restart the API, the API auto restarts in dev if changes are made to the source code:
### `pm2 kill`
### `pm2 resurrect`
