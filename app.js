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

// var fs = require('fs');
// var file = 'data.json';
 
// fs.readFile(file, 'utf8', function (err, data) {
// 	var names = {};

// 	if (err) {
// 		throw err;
//   	}
 
//   	data = JSON.parse(data);

//   	data.forEach(function (item, index) {
//   		if (names[item.description]) {
//   			console.log(item.description + ' is repeated ' + (names[item.description] + 1) + ' times');
//   			console.log(item.addressError)
//   		}

//   		var desc = latinize(item.description
//   			.toLowerCase()
//   			.split(' ')
//   			.map(function (i) {
//   				return i.trim();
//   			})
//   			.filter(function (i) {
//   				return i != '';
//   			})
//   			.join(' '))
//   			.replace(/\W/g, function (value) { return value == ' ' ? '-' : ''; })

//   			console.log(desc);

//   		console.log(item.addressComponents);

//   		names[item.description] = (names[item.description] || 0) + 1;
//   	});
// });

// function latinize(value) {
//     var translate = /[áéíóúÁÉÍÓÚ]/g,
//         charMap = {
//             'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
//             'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
//         };

//     return value.replace(translate, function(match) { 
//         return charMap[match]; 
//     });
// }