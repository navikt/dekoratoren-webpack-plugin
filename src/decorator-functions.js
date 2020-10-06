const cheerio = require('cheerio');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');
const querystring = require('querystring');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function getTmpFile(filename) {
  const dir = path.join(os.tmpdir(), 'dekorator-cache');
  !fs.existsSync(dir) && fs.mkdirSync(dir);
  return path.join(dir, filename);
}

function fileAge(filename) {
  const stats = fs.statSync(filename);
  return (new Date().getTime() - stats.mtime.getTime()) / 1000;
}

async function fetchCached(url, ttlSeconds) {
  const filename = crypto.createHash('md5').update(url).digest('hex');
  const cacheFilepath = getTmpFile(filename);
  if (!fs.existsSync(cacheFilepath) || fileAge(cacheFilepath) > ttlSeconds) {
    console.log(filename + ' not cached, fetching a new file.');
    const data = await fetch(url);
    fs.writeFileSync(cacheFilepath, data, 'utf-8');
  }
  return fs.readFileSync(cacheFilepath, 'utf-8');
}

function getDekoratorUrl(queryParams) {
  const urlBase = (process.env.NODE_ENV === 'production' || true) ?
      'https://www.nav.no/dekoratoren/' :
      'https://dekoratoren.dev.nav.no/';
  const url = new URL(urlBase);
  url.search = querystring.stringify(queryParams);
  return url.toString();
}

async function fetchDekoratorParts(options, decoratorHostUrl) {
  const decoratorUrl = getDekoratorUrl(options);
  let decoratorHtml = await fetchCached(decoratorUrl);
  decoratorHtml = decoratorHtml.replace(/\s+/g, ' ');
  const $ = cheerio.load(decoratorHtml);
  if (process.env.NODE_ENV === 'develop' && decoratorHostUrl) {
    $('#decorator-env').attr('data-src', decoratorHostUrl);
  }
  return {
    DECORATOR_URL: decoratorUrl,
    DECORATOR_FOOTER: $.html($('#decorator-footer')),
    DECORATOR_HEADER: $.html($('#decorator-header')),
    DECORATOR_SCRIPTS: $('#scripts').eq(0).html(),
    DECORATOR_STYLES: $('#styles').eq(0).html(),
  };
}

function mergeDekoratorParts(html, parts) {
  const $ = cheerio.load(html);
  const $body = $('body');
  const $head = $('head');
  $head.append(parts.DECORATOR_STYLES);
  $body.prepend(parts.DECORATOR_HEADER);
  $body.append(parts.DECORATOR_FOOTER);
  $body.append(parts.DECORATOR_SCRIPTS);
  return $.html();
}

module.exports = {
  fetch,
  getTmpFile,
  fileAge,
  fetchCached,
  getDekoratorUrl,
  fetchDekoratorParts,
  mergeDekoratorParts,
};
