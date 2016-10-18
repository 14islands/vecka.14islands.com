# vecka.14islands.com

Always know what week number it. Essential when living in Sweden.

This app is built to test out the latest Progressive Web App features (Service Workers, Manifest.json etc.)

## Getting started

Install:

```
npm install
```

Run in development mode:

```
npm run devloader
```

Run in production mode:

```
npm start
```

## Deploy

App is running in production on [https://vecka.herokuapp.com/](https://vecka.herokuapp.com/).

It's hosted on Heroku using [CloudFlare](https://www.cloudflare.com/) as a CDN for caching and SSL. To bypass Cloudflare it's possible to check the app out on [https://vecka.herokuapp.com/](https://vecka.herokuapp.com/).

```
git push heroku master
```

Note: Remember to purge CDN cache on deploy.

## Typeface

Sweden Sans: http://sweden.identitytool.com/buildingblocks/secondary-building-blocks-always-use#our-main-typeface

## Backlog (prioritized)

* Add a favicon
* Implement splash-screen
* Implement an offline page
* Improve swiping, make it sensitive while finger is on screen.
* Implement nicer design for the app.
* Click for Timeline
* Use 14islands font with fonts-api
* Send a push notification when a new week starts
* Since there is a limited number of weeks in a year, we could play with each number. Use it as an SVG or do some fun stuff with it.
* Include correct number in favicon
* Routes for each week
* Write a blog post
