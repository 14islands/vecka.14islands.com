# vecka.14islands.com

Always know the week number. Essential when living in Sweden.

This app is built to test out the latest Progressive Web App features (Service Workers, Manifest.json etc.)

## Getting started

Install:

```
npm install
```

Run in development mode:

```
npm run dev
```

Run in production mode:

```
npm start
```

Node version: 6.9.1 (JavaScript features: http://node.green/)

## Deploy

App is hosted on Heroku and uses [CloudFlare](https://www.cloudflare.com/) as a CDN for caching and SSL.

```
git push heroku master
```

Note: You need access to Heroku to push it. Remember to purge CDN cache on deploy.

## Seasons

The app has different background color for weeks within each season.
* Spring: Starts at [Swedish Vårdagjämningen](https://sv.wikipedia.org/wiki/V%C3%A5rdagj%C3%A4mningen), 22nd of September
* Summer: Starts 1st of June
* Fall: Starts at [Swedish Höstdagjämningen](https://sv.wikipedia.org/wiki/H%C3%B6stdagj%C3%A4mningen), 22nd of September
* Winter: Starts 1st of December.

## Typeface

Sweden Sans: http://sweden.identitytool.com/buildingblocks/secondary-building-blocks-always-use#our-main-typeface
