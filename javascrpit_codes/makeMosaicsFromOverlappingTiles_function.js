var makeMosaicsFromOverlappingTiles = function (collection, ROI) {
  
  collection = collection.filterBounds(ROI)
  
  function makeMosaics(image) {
    var thisImage = ee.Image(image);
    var date = ee.Date(thisImage.get('system:time_start'));
    // add 1 hour to exclude images from other paths
    var filteredDataset = collection.filterBounds(ROI)
                          .filterDate(date, date.advance(1,'hour'));
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
  
  var mosaiced = collection.map(makeMosaics);
  
  // the final collection without duplicates
  var post_filtered = mosaiced.filter(ee.Filter.contains('.geo', ROI));
  return post_filtered;
  
}

// export the function
exports.makeMosaicsFromOverlappingTiles = makeMosaicsFromOverlappingTiles;
