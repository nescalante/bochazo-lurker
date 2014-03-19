var pages = require('./pages'),
    places = require('./places');

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

                (function next(index) {
                    index = index || 0;

                    if (hrefs[index]) {
                        console.log('loading ' + (index + 1) + '/' + hrefs.length + ' on url ' + hrefs[index]);

                        places.get(hrefs[index], strategy, options, function (err, result) { 
                            if (err) {
                                throw err;
                            }

                            console.log(result);

                            next(index + 1);
                        });
                    }
                })();
            });
        });
    }
};