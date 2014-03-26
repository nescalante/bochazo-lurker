### Strategy Definition

Strategy must implement the following properties:

`name: String`: File name to generate json.

`pagesUrl: String`: First url to be requested.

`getPages: function(querySelector, callback)`: This will return on callback the hrefs to be requested.

`getPlacesByPage: function(querySelector, callback)`: This will return on callback the places list on each page.

`getPlace: function (querySelector, callback)`: This will return on callback the full place info.

### Strategy Example

Define a strategy to scrap some site:

```
module.exports = {
  name: 'SomeName',
  pagesUrl: 'somesite.com',
  getPages: function (querySelector, callback) {
    var someData = querySelector('a').text();
  
    callback(null, ['some', 'hrefs', 'to', 'be', 'requested']);
  },
  getPlacesByPage: function (querySelector, callback) {
    callback(null, ['more', 'hrefs']);
  },
  getPlace: function (querySelector, callback) {
    var place = {
      description: 'we scrap some place here!',
      address: 'false street 123'
    };
    
    callback(null, place);
  }
};
```

Add it to [scrappers list](https://github.com/nescalante/bochazo-lurker/blob/master/scrappers/index.js):

```
var yourStrategy = require('./yourStrategy');

module.exports = {
  YourStrategy: yourStrategy
};
```

Scrap [what you need](https://github.com/nescalante/bochazo-lurker/blob/master/app.js)!

```
var core = require('./core');
var scrappers = require('./scrappers');

core.import(scrappers.YourStrategy);
```
