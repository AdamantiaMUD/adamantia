/* eslint-disable-next-line id-length */
const fs = require('fs');
const path = require('path');

const configDest = path.join(__dirname, '..', 'build', 'adamantia.json');
const configSrc = path.join(__dirname, '..', 'src', 'adamantia.json');

fs.copyFileSync(configSrc, configDest);
