# OpenNEM Widget

OpenNEM widget is a standalone application that visualises the Australia NEM (eastern and southern Australia states and territories) power generation for the last three days in 30 minutes interval, stacked by fuel technologies that generates the power.

The widget is a compact front-end version of the full project of 
[OpenNEM](https://github.com/opennem/opennem-fe).

## Installation
To run the application, you will need [Yarn](https://classic.yarnpkg.com/en/) on your system. 

Then open up the project folder in your command line and run:

```javascript
yarn install
```

## For development or to see it running locally in your browser
Run
```javascript
yarn start
```

A browser window should open up to `http://localhost:8080`

## For production
Run
```javascript
yarn build
```

Built and minified files will be created inside the `dist` folder. You can serve these files from any web server pointing the default html to `index.html`

## License
The MIT License (MIT)

Copyright 2020 Steven Tan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
