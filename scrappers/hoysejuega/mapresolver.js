var request = require('request');
var log = require('../../core/log').info;

module.exports = function (result, querySelector, options, callback) {
    var latLng = getLatLng(querySelector);

    request({
        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLng.latitude + ',' + latLng.longitude + '&sensor=false&language=es',
        proxy: options.proxy
    }, function (err, res, source) {
        if (err) {
            callback(err);
            return;
        }

        var json = eval("(" + source + ")");
        var country = (json.results[0] && json.results[0].address_components.filter(function (i) { return i.types[0] == "country" })[0] || {}).long_name;

        if (!json.results[0]) {
            log('location not found for place ' + result.description + ': ' + result.address);
        }

        request({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + result.address + (country ? ', ' + country : '') + '&sensor=false&language=es',
            proxy: options.proxy
        }, function (err, res, mapSource) {
            if (err) {
                callback(err);
                return;
            }

            var json = eval("(" + mapSource + ")");

            if (json.results && json.results[0]) {
                result.originalAddress = result.address;
                result.address = json.results[0].formatted_address;
                result.addressComponents = json.results[0].address_components.map(function (i) {
                    return {
                        longName: i.long_name,
                        shortName: i.short_name,
                        types: i.types
                    };
                });
                result.location = [json.results[0].geometry.location.lat, json.results[0].geometry.location.lng];
            }
            else {
                result.addressError = true;
            }

            callback(null, result);
        }).on('error', function (err) {
            callback(err);
        });
    });
};

function getLatLng(querySelector, callback) {
    var source = querySelector.getSource();
    var aux;

    aux = source.substring(source.indexOf('maps.LatLng') + 12);
    aux = aux.substring(0, aux.indexOf(');'));
    aux = aux.split(',');

    return { latitude: parseFloat(aux[0]), longitude: parseFloat(aux[1]) };
}