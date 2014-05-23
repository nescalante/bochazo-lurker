var request = require('request');
var cheerio = require('cheerio');
var log = require('./core/log').info;

module.exports = {
    load: function (options, callback) {
        request(options, function (err, res, data) {
            var querySelector = cheerio.load(data);

            querySelector.getSource = function () {
                return data;
            };

            callback(null, querySelector, data);
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
                try {
                    callback(item, index, doNext);
                }
                catch(err) {
                    log("error on item: " + item, err);
                    doNext();
                }
            }

            index++;

            function doNext() {
                processed++;

                if (array[index]) { 
                    next();
                }
                else if (!justSent && !array[processed] && done) {
                    done();

                    justSent = true;
                }
            }
        }
    }
};