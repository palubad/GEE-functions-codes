var bandsToImgCollection = function (image) {
  var bandNames = image.bandNames();

  function bandsToImgCollection(img) {
    var final = function (name){
      var band = img.select(ee.String(name));
      return band.set({'system:index':ee.String(name)});    
    };
    return final;
  }
  
  var imgCollection = ee.ImageCollection(bandNames.map(bandsToImgCollection(image)));
  
  return imgCollection
}

exports.bandsToImgCollection = bandsToImgCollection
