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
            console.log('loading page ' + (index + 1) + '/' + pageUrls.length);

            var url = prepend + item;

            getByPage(url, strategy, function (err, resources) {
                if (err) {
                    callback(err);
                    return;
                }

                resources.forEach(function (href) {
                    result.push(href);
                });

                next();
            });
        }, function () {
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

        util.load(prepend + placeUrl, function (err, querySelector) {
            if (err) {
                callback(err, null);
                return;
            }

            strategy.getPlace(querySelector, callback);
        })
    }
};

function getByPage(pageUrl, strategy, callback) {
    util.load(pageUrl, function (err, querySelector) {
        if (err) {
            callback(err);
            return;
        }

        strategy.getPlacesByPage(querySelector, callback);
    });
}