const config = require('../config');
const currentLanguageFile = '../locales/' + `${config.language}`;

module.exports = require(currentLanguageFile).speech;
