var pages = require('./pages'),
    places = require('./places'),
    util = require('../util');

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

                        console.log(result);

                        next();
                    });
                }, function () {
                    console.log('finished!');
                })
            });
        });
    }
};