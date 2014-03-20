var core = require('./core'),
	util = require('./util'),
    scrappers = require('./scrappers');

core.import(scrappers.HoySeJuegaStrategy, {
   prepend: 'http://localhost:62504/?url='
});

// util.load('http://localhost:62504/?url=http://www.hoysejuega.com/canchas-de-futbol/511-buenos-aires-football-bafootball.htm', function (err, querySelector) {
// 	scrappers.HoySeJuegaStrategy.getPlace(querySelector, function (err, result) {
// 		console.log(result);
// 	});
// });