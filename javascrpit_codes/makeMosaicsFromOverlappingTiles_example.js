// set start and end date
var startDate = '2021-07-19',
    endDate = '2021-07-20';

// pre-filter the S-1 collection
var S1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                  .filterBounds(geometry)
                  .filterDate(startDate, endDate)

print('the original collection',S1Collection)
Map.addLayer(ee.Image(S1Collection.toList(S1Collection.size()).get(0)),{min:-25,max:5,bands:'VH'},'image old 1');
Map.addLayer(ee.Image(S1Collection.toList(S1Collection.size()).get(1)),{min:-25,max:5,bands:'VH'},'image old 2');
Map.addLayer(ee.Image(S1Collection.toList(S1Collection.size()).get(2)),{min:-25,max:5,bands:'VH'},'image old 3');


// call the prepared function 
var theFunction = require('users/danielp/functions:makeMosaicsFromOverlappingTiles_function');

// apply the function
var finalCollection = theFunction.makeMosaicsFromOverlappingTiles(S1Collection,geometry);

print(finalCollection);
Map.addLayer(ee.Image(finalCollection.toList(finalCollection.size()).get(0)),{min:-25,max:5,bands:'VH'},'image new 1');
Map.addLayer(ee.Image(finalCollection.toList(finalCollection.size()).get(1)),{min:-25,max:5,bands:'VH'},'image new 2');
