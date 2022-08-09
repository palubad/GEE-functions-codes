var startDate = '2021-07-19',
    endDate = '2021-07-20';

var S1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                  .filterBounds(geometry)
                  .filterDate(startDate, endDate)

print('the original collection',S1Collection)
Map.addLayer(ee.Image(S1Collection.toList(S1Collection.size()).get(0)),{min:-25,max:5,bands:'VH'},'image old 1');
Map.addLayer(ee.Image(S1Collection.toList(S1Collection.size()).get(1)),{min:-25,max:5,bands:'VH'},'image old 2');
Map.addLayer(ee.Image(S1Collection.toList(S1Collection.size()).get(2)),{min:-25,max:5,bands:'VH'},'image old 3');

// https://gis.stackexchange.com/questions/369057/google-earth-engine-roi-area-falling-outside-partial-coverage-by-sentinel-1-tile
function makeMosaicsFromOverlappingTiles(collection) {
  function makeMosaics(image) {
    var thisImage = ee.Image(image);
    var date = ee.Date(thisImage.get('system:time_start'));
    // add only hour to exclude images from other paths
    var filteredDataset = collection.filterDate(date, date.advance(1,'hour'));
    // add all image properties to the new image
    var toReturn = ee.Image(filteredDataset.mosaic()
                      .copyProperties(image,image.propertyNames())
                      );
    // add geometries
    var geometries = filteredDataset.map(function(img){
      return ee.Feature(img.geometry());
    });
    
    var mergedGeometries = geometries.union();
    return toReturn.set('system:footprint', mergedGeometries.geometry());
  }
  
  var mosaiced = S1Collection.map(makeMosaics);
  
  // the final collection without duplicates
  var post_filtered = mosaiced.filter(ee.Filter.contains('.geo', geometry));
  return post_filtered
}

var mosaicedTiles = makeMosaicsFromOverlappingTiles(S1Collection);
print('the final collection', mosaicedTiles)

Map.addLayer(S1Collection.first().geometry(),{},'geometry original')
Map.addLayer(mosaicedTiles.first().geometry(),{},'geometry new')

Map.addLayer(ee.Image(mosaicedTiles.toList(mosaicedTiles.size()).get(0)),{min:-25,max:5,bands:'VH'},'image new 1');
Map.addLayer(ee.Image(mosaicedTiles.toList(mosaicedTiles.size()).get(1)),{min:-25,max:5,bands:'VH'},'image new 2');
