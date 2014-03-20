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
        var result = {};

        // place data scan
        result.description = getDescription();
        result.address = getAddress();
        result.phones = getPhones();
        result.tags = getTags();
        result.info = getInfo();
        result.howToArrive = getHowToArrive();
        result.courts = getCourts();

        callback(null, result);

        function getCourts() {
            var courts = [];

            querySelector('div[id=detalleCancha_complejo]').each(function (ix, item) {
                var court = {},
                    title = querySelector(item).find('.txt16');
                
                if (title.length) {
                    var source = querySelector(item).find('.txt14').text();

                    court.name = title.text().trim();
                    court.isIndoor = source.indexOf('Techada') > 0;
                    court.isLighted = source.indexOf('Con Luz') > 0;
                    court.players = parseInt(source.substring(14, 17));
                    court.sport = 'Fútbol';
                    court.surface = source
                        .substring(source.indexOf('Tipo de piso: ') + 14);
                    court.surface = court.surface
                        .substring(0, court.surface.indexOf(' -'))
                        .trim();

                    courts.push(court);
                }
            });

            return courts;
        }

        function getDescription() {
            var title = querySelector('title').text();

            return title.substring(0, title.indexOf(' - Dirección'));
        }

        function getAddress() {
            var addresses = [];

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

            return addresses.join(', ');
        }

        function getPhones() {
            var phones = [];

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

            return phones;
        }

        function getTags() {
            var tags = [];

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
                    tags.push(i);
                });
            });

            return tags;
        }

        function getInfo() {
            var info;

            querySelector('p.negro.txt12').each(function (ix, item) { 
                var desc = 'DESCRIPCIÓN:',
                    text = querySelector(item).text();

                if (text.indexOf(desc) == 0) {
                    info = text.substring(desc.length).trim();
                };
            });

            return info;
        }

        function getHowToArrive() {
            return querySelector('p.txt13')
                .text()
                .split('\r\n')
                .map(function (i) {
                    return i.trim();
                })
                .join(' ')
                .trim();
        }
    }
};