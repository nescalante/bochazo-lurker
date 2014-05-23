var pages = require('./pages'),
    places = require('./places'),
    util = require('../util'),
    fs = require('fs');

module.exports = {
    import: function (strategy, options) {
        var strat = strategy(options);

        process.stdout.write('getting pages for ' + strat.name + ' ...');
        process.stdout.write('\n');

        pages.get(strat, options, function (err, data) {
            if (err) {
                throw err;
            }

            process.stdout.write(data.length + ' pages loaded');
            process.stdout.write('\n');
            process.stdout.write('loading places resources ...');

            places.getUrls(data, strat, options, function (err, hrefs) {
                var total = [];

                if (err) {
                    throw err;
                }

                process.stdout.write(hrefs.length + ' places loaded');
                process.stdout.write('\n');

                util.batch(hrefs, 6, function (item, index, next) {
                    var names = {};
                    clearLine();
                    process.stdout.write('loading place ' + (index + 1) + '/' + hrefs.length);

                    places.get(hrefs[index], strat, options, function (err, result) { 
                        if (err) {
                            throw err;
                        }

                        if (names[result._id]) {
                            result._id = result._id + '-2';
                        }
                        else {
                            names[result._id] = 1;
                        }

                        total.push(result);
                        next();
                    });
                }, function () {
                    clearLine();
                    process.stdout.write('scrapping finished!');
                    process.stdout.write('\n');

                    fs.writeFile(strat.name.toLowerCase() + '.json', JSON.stringify(total, null, "\t"), function(err) {
                        if(err) {
                          throw err;
                        }

                        process.stdout.write('json successfully saved');
                    });
                })
            });
        });
    }
};

function clearLine() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
}