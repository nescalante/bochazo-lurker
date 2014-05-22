var core = require('./core'),
    scrappers = require('./scrappers');

core.import(scrappers.HoySeJuegaStrategy, { proxy: 'http://localhost:3128' });