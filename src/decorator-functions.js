const cheerio = require('cheerio');
const querystring = require('querystring');
const fetchCached = require('./fetch').fetchCached;

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
  const oneHour = 60 * 60;
  let decoratorHtml = await fetchCached(decoratorUrl, oneHour, 'dekorator-cache');
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
  getDekoratorUrl,
  fetchDekoratorParts,
  mergeDekoratorParts,
};
