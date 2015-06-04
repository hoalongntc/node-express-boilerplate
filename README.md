Node-Express-Boilerplate
========================

### Requirement
Have `git`, `node`, `npm`, `redis` installed

### Install app requirement
```
npm install --save bower gulp
```

### Install
```
git clone git@github.com:hoalongntc/node-express-boilerplate.git myApp
cd myApp
npm install

git clone git@github.com:hoalongntc/agb-browserify.git public
cd public
npm install
bower install
```

### Run app

#### Client
Run `gulp` command in `public` folder to watch your client code
```
cd myApp/public
gulp

/* Production Mode - Build only */
gulp build
```

#### Server
Run `node main.js` to start express server
```
cd myApp
node main.js --dev

/* Production Mode */
node main.js
```