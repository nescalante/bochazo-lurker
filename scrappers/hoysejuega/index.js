module.exports = {
    name: 'HoySeJuega',
    pagesUrl: 'http://www.hoysejuega.com/listado-canchas.htm',
    getPages: function (querySelector, callback) {
        var hrefs = [];
        
        querySelector('a').each(function (index, item) {
            var href = querySelector(item).attr('href');

            if (href.indexOf('page_number') > 0) {
                href = href.substr(0, href.indexOf('&'));

                if (hrefs.indexOf(href) < 0) {
                    hrefs.push(href);
                }
            }
        });

        callback(null, hrefs);
    },
    getPlacesByPage: function (querySelector, callback) {
        var hrefs = [];

        querySelector('.izquierda .titulo a').each(function (index, item) {
            var href = querySelector(item).attr('href');

            hrefs.push(href);
        });

        callback(null, hrefs);
    },
    getPlace: function (querySelector, callback) {
        var result = {},
            title = querySelector('title').text(),
            phones = [],
            addresses = [];

        // place data scan
        result.description = title.substring(0, title.indexOf(' - Dirección'));
        
        querySelector('p.txt15')
            .text()
            .split('\r\n')
            .join(',')
            .split(',')
            .map(function (i) {
                return i.trim();
            })
            .filter(function (i) {
                return i != '' && i.substring(0, 5).toLowerCase() != 'entre';
            })
            .map(function (i) {
                if (addresses.indexOf(i) < 0) {
                    addresses.push(i);
                }
            });

        result.address = addresses.join(', ');

        // phones scan
        querySelector('.txt18 + .txt16')
            .text()
            .split(',')
            .map(function (i) {
                return i.trim();
            })
            .filter(function (i) {
                return i != '';
            })
            .forEach(function (item, index) {
                var source = item
                    .split('/')
                    .map(function (i) {
                        return i.trim();
                    });

                source.forEach(function (i, ix) {
                    var phone = i;

                    if (ix > 0) {
                        phone = source[ix - 1].substring(0, source[ix - 1].length - i.length) + i;
                    }

                    phones.push(phone);
                });
            });

        result.phones = phones;
        
        // tags collection
        result.tags = [];
        
        querySelector('ul.txt15 li').each(function (ix, item) {
            querySelector(item).text()
                .split('/')
                .map(function (i) {
                    return i.trim().toLowerCase();
                })
                .filter(function (i) {
                    return i != '';
                })
                .map(function (i) {
                    result.tags.push(i);
                })
        });

        querySelector('p.negro.txt12').each(function (ix, item) { 
            var desc = 'DESCRIPCIÓN:',
                text = querySelector(item).text();

            if (text.indexOf(desc) == 0) {
                result.info = text.substring(desc.length).trim();
            };
        });

        callback(null, result);
    }
};