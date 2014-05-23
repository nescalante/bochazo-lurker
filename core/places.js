var util = require('../util');

module.exports = {
    getUrls: function (pageUrls, strategy, options, callback) {
        var prepend,
            result = [];

        if (callback === undefined) {
            callback = options;
            options = {};
        }

        prepend = (options && options.prepend) || '';
        
        util.batch(pageUrls, 6, function (item, index, next) {
            clearLine();
            process.stdout.write('loading page ' + (index + 1) + '/' + pageUrls.length);

            var url = prepend + item;

            getByPage(url, options, strategy, function (err, resources) {
                if (err) {
                    throw err;
                }

                resources.forEach(function (href) {
                    result.push(href);
                });

                next();
            });
        }, function () {
            clearLine();
            callback(null, result);
        });
    },
    get: function (placeUrl, strategy, options, callback) {
        var prepend;

        if (callback === undefined) {
            callback = options;
            options = {};
        }

        prepend = (options && options.prepend) || '';

        util.load({
            url: prepend + placeUrl,
            proxy: options.proxy
        }, function (err, querySelector) {
            if (err) {
                callback(err, null);
                return;
            }

            strategy.getPlace(querySelector, prepend + placeUrl, callback);
        })
    }
};

function getByPage(pageUrl, options, strategy, callback) {
    util.load({
        url: pageUrl,
        proxy: options.proxy
    }, function (err, querySelector) {
        if (err) {
            callback(err);
            return;
        }

        strategy.getPlacesByPage(querySelector, callback);
    });
}

function clearLine() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
}