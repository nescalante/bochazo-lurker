var util = require('../util');

module.exports = {
    get: function (strategy, options, callback) {
        var prepend;

        if (callback === undefined) {
            callback = options;
            options = {};
        }

        prepend = (options && options.prepend) || '';

        util.load(prepend + strategy.pagesUrl, function (err, querySelector) {
            var hrefs;

            if (err) {
                callback(err);
                return;
            }

            strategy.getPages(querySelector, callback);
        });
    }
};