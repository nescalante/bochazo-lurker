var util = require('../util');

module.exports = {
    get: function (strategy, options, callback) {
        var prepend;

        if (callback === undefined) {
            callback = options;
            options = {};
        }

        prepend = (options && options.prepend) || '';

        util.load({ 
            url: prepend + strategy.pagesUrl,
            proxy: options.proxy
        }, function (err, querySelector) {
            if (err) {
                callback(err);
                return;
            }

            strategy.getPages(querySelector, callback);
        });
    }
};