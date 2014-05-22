var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    load: function (options, callback) {
        request(options, function (err, res, data) {
            var querySelector = cheerio.load(data);

            callback(null, querySelector);
        }).on('error', function (e) {
            callback(e);
        });
    },

    // use batch package here
    batch: function(array, size, callback, done) {
        var index = 0,
            i = 0,
            justSent = false;
            processed = 0;

        if (callback === undefined) {
            callback = size;
            size = 1;
        }

        for (; i < size; i++) {
            next();
        }

        function next() {
            var item = array[index];

            if (item) {
                callback(item, index, function () {
                    processed++;

                    if (array[index]) { 
                        next();
                    }
                    else if (!justSent && !array[processed] && done) {
                        done();

                        justSent = true;
                    }
                });
            }

            index++;
        }
    }
};