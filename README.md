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
### 1 Prepare system
#### 1.1 Install Git. Use Git Bash.
#### 1.2 Install Node.js and NPM
#### 1.3 Install global NPM packages 
```
    npm install gulp-cli -g
        gulp -v

    npm install -g browser-sync 
        browser-sync --version
	
    npm install -g npm-check
        npm-check --version 	 
```

### 2 Run New Project
#### 2.1 Prepare project directory
```
- Copy 'project'
- Change directory name to project name. 
```
#### 2.2 Create Git Repo
##### 2.2.1 Inside new project directory run:
```
    git init
    git status
    git add .
    git commit -m "First commit"
```
##### 2.2.2 On BitBucket (example)
```
- In 'https://bitbucket.org/veldymanov/' create a new repository.
- Click 'I have existing project'
- Inside project's directory run the commands shown:
    git remote add origin https://veldymanov@bitbucket.org/veldymanov/template.git
    git push -u origin master
```
#### 2.3 Install npm packages
````
    npm install
````
#### 2.4 Run the project
````
    gulp
````
#### 2.5 Create 'docs/' directory - application (with only minified files) for deployment
````
    gulp build

    //run browser-sync for build
    gulp build:server
````