var pages = require('./pages'),
    places = require('./places'),
    util = require('../util'),
    fs = require('fs');

module.exports = {
    import: function (strategy, options) {
        console.log('getting pages for ' + strategy.name + ' ...');

        pages.get(strategy, options, function (err, data) {
            if (err) {
                throw err;
            }

            console.log(data.length + ' pages loaded');
            console.log('');
            console.log('loading places resources ...');

            places.getUrls(data, strategy, options, function (err, hrefs) {
                var total = [];

                if (err) {
                    throw err;
                }

                console.log('a total of ' + hrefs.length + ' places has been loaded');
                console.log('');

                util.batch(hrefs, 6, function (item, index, next) {
                    console.log('loading ' + (index + 1) + '/' + hrefs.length + ' on url ' + hrefs[index]);

                    places.get(hrefs[index], strategy, options, function (err, result) { 
                        if (err) {
                            throw err;
                        }

                        total.push(result);

                        next();
                    });
                }, function () {
                    console.log('finished!');

                    fs.writeFile('data.json', JSON.stringify(total), function(err) {
                        if(err) {
                          throw err;
                        }

                        console.log('json successfully saved');
                    }); 
                })
            });
        });
    }
};