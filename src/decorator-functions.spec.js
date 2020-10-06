const path = require('path');
const fs = require('fs');
const mergeDekoratorParts = require('./decorator-functions').mergeDekoratorParts;
const fetchDekoratorParts = require('./decorator-functions').fetchDekoratorParts;
const cheerio = require('cheerio');
test('should inject stuff', async () => {
  const testHtmlPath = path.join(__dirname, '..', 'test-resources', 'index.html');
  const testHtml = fs.readFileSync(testHtmlPath);
  const parts = await fetchDekoratorParts();
  const mergedHtml = mergeDekoratorParts(testHtml, parts);
  fs.writeFileSync("test.html",mergedHtml);
  const $ = cheerio.load(mergedHtml);
  expect($("body #decorator-footer").length).toBeGreaterThan(0);
  expect($("body #decorator-header").length).toBeGreaterThan(0);
  expect($("body #decorator-env").length).toBeGreaterThan(0);
});
