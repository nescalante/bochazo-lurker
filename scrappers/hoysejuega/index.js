var request = require('request');

module.exports = function(options) {
    return {
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
        getPlace: function (querySelector, url, callback) {
            var result = {};
            var mapResolver = require('./mapresolver');

            // place data scan
            result.description = getDescription();
            result.address = getAddress();
            result.phones = getPhones();
            result.tags = getTags();
            result.info = getInfo();
            result.howToArrive = getHowToArrive();
            result.courts = getCourts();

            result._id = latinize(result.description
                    .toLowerCase()
                    .split(' ')
                    .map(function (i) {
                        return i.trim();
                    })
                    .filter(function (i) {
                        return i != '' && i != '-';
                    })
                    .join(' '))
                .replace(/\W/g, function (value) { return value == ' ' ? '-' : ''; });

            mapResolver(result, querySelector, options, callback);

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
                        return i.trim().replace(/´/g, ' ');
                    })
                    .filter(function (i) {
                        return i != '' && 
                            i.substring(0, 5).toLowerCase() != 'entre' && 

                            // exceptions
                            i != 'Abasto' && 
                            i != 'Parque Chas' &&
                            i != 'Echeverria' && 
                            i != 'Gral. Rodriguez 1' &&
                            i != 'Warnes' &&
                            i != 'Ceretti' &&
                            i != 'Costanera' &&
                            i != 'altura Juan B. Justo 7400' &&
                            i != 'Muñecas' &&
                            i != 'Lugano' &&
                            i != 'Bajo Flores' && 
                            i != 'Av La Fuente' &&
                            i != 'Parque Centenario' &&
                            i != 'Triunvirato' &&
                            i != 'San cayetano' &&
                            i != 'Dorregueira' &&
                            i != 'Bermudez';
                    })
                    .map(function (i) {
                        // corrections
                        if (i == 'Janner') {
                            i = 'Club Daom';
                        }
                        if (i == 'J. B. Alberdi 4565 - Bajo la Autopista') {
                            i = 'J. B. Alberdi 4565';
                        }
                        if (i == 'Cantilo') {
                            i = 'y Cantilo';
                        }
                        if (i == 'Matheu 1350 (1249)  y Au. 25 de mayo') {
                            i = 'Matheu 1350';
                        }
                        if (i == 'Av. Carabobo 899 (Abajo de la AU1 - Flores)') {
                            i = 'Av Carabobo 899';
                        }
                        if (i == 'Av. Cantilo y Guiraldes (frente a Ciudad Universitaria).') {
                            i = 'Parque Norte';
                        }
                        if (i == 'Av. roca y av. gral paz') {
                            i = 'Parque Polideportivo Pres Julio A. Roca';
                        }
                        if (i == 'Av Riestra y La Fuente') {
                            i = 'Av Riestra, y Av Lafuente';
                        }
                        if (i == 'California 1855 y Aut. Sur Barracas') {
                            i = 'California 1855';
                        }

                        if (addresses.indexOf(i) < 0) {
                            var addIt = true;

                            for (var x = 0; x < addresses.length; x++) {
                                if (i == 'Capital Federal' && addresses[x] == 'Haedo') {
                                    addIt = false;
                                }

                                if (i == 'Capital Federal' && addresses[x] == 'Boulogne') {
                                    addIt = false;
                                }
                            }

                            if (addIt) {
                                addresses.push(i);
                            }
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

                            if (phones.indexOf(phone) < 0) {
                                phones.push(phone);
                            }
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

            function latinize(value) {
                var translate = /[áéíóúÁÉÍÓÚ]/g,
                    charMap = {
                        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
                        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
                    };

                return value.replace(translate, function(match) { 
                    return charMap[match]; 
                });
            }
        }
    };
};