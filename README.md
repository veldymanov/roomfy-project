# Roomfy

## Directory structure

```
docs/                   - Application for deployment ('app/' with only minified files).
                          'docs/' folder name was chosen for hosting in GitHub Pages when needed.
                                To create the 'docs/' run 'gulp build'
                                To start browser-sync run 'gulp build:server'
node_modules/           - NPM modules. Created after 'npm install'
src/                    - Contains full application.
    home/               -
        assets/         -
            img/        -
                images/ -
                icons/  -
        js/             - All self-created JavaScript files for 'index.html' page
    _footer.scss        -
    _header.scss        -
    _keyframes.scss     -
    _touch-slider.scss  -
    index.css           -
    index.html          -
    index.scss          -
.gitignore              -
gulpfile.js             - Gulp file
package.json            - NPM package file
README.md               - Project's readme file
```

## Gulp
### Prepare system
#### Install Git. Use Git Bash.
#### Install Node.js and NPM
#### Install global NPM packages
```
    npm install gulp-cli -g
        gulp -v

    npm install -g browser-sync
        browser-sync --version

    npm install -g npm-check
        npm-check --version
```

### Run New Project
#### Create Git Repo
#### Install npm packages
````
    npm install
````
#### Run the project
````
    gulp
````
#### Create 'docs/' directory - application (with only minified files) for deployment
````
    gulp build

    //run browser-sync for build
    gulp build:server
````