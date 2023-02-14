var makeMosaicsFromOverlappingTiles = function (collection, ROI) {
  
  collection = collection.filterBounds(ROI)
  
  function makeMosaics(image) {
    var thisImage = ee.Image(image);
    var date = ee.Date(thisImage.get('system:time_start'));
    // add 1 hour to exclude images from other paths
    var filteredDataset = collection.filterBounds(ROI)
                          .filterDate(date.advance(-1,'hour'), date.advance(1,'hour'));
    // add all image properties to the new image
    var toReturn = ee.Image(filteredDataset.mosaic()
                      .copyProperties(image,image.propertyNames())
                      ).set('timeD',ee.Date(thisImage.get('system:time_start')).format('YYYY-MM-dd-HH'));
    // add geometries
    var geometries = filteredDataset.map(function(img){
      return ee.Geometry(img.geometry());
    });
    
    var mergedGeometries = geometries.union();
    return toReturn.set('system:footprint', mergedGeometries.geometry());
  }
  
  var mosaiced = collection.map(makeMosaics);
  
  // the final collection without duplicates
  var post_filtered = mosaiced.distinct(['.geo','timeD']);
  return ee.ImageCollection(post_filtered);
  
}

// export the function
exports.makeMosaicsFromOverlappingTiles = makeMosaicsFromOverlappingTiles;
