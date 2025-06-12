// This function adds Local Incidence Angle (LIA) to a selected Sentinel-1 GEE ImageCollection 
// using the Copernicus DEM for the selected region of interest (geometry). 
// This function is a part of the paper in Remote Sensing journal: 
// Paluba et al. (2021): "Land Cover-Specific Local Incidence Angle Correction: A Method for 
// Time-Series Analysis of Forest Ecosystems" https://www.mdpi.com/2072-4292/13/9/1743 
// (doi: 10.3390/rs13091743). The code for the full algorithm developed is available in this 
// GitHub repository: https://github.com/palubad/LC-SLIAC. 
// Please refer to this paper if using the addLIA function. 

var addLIA = function (collection,geometry) {
  // add DEM
  var CoprenicusDEM = ee.ImageCollection("COPERNICUS/DEM/GLO30")
            .select('DEM')
            .filterBounds(collection.union(1).first().geometry(1));

// Define a function to compute slope and aspect for each image
var calculateSlopeAspect = function(image) {
  // Compute slope and aspect
  var slope = ee.Terrain.slope(image);
  var aspect = ee.Terrain.aspect(image);
  
  // Return the image with new bands for slope and aspect
  return image.rename('DEM').addBands(slope.rename('slope')).addBands(aspect.rename('aspect'));
};

CoprenicusDEM = ee.Join.saveAll("match").apply(CoprenicusDEM,CoprenicusDEM,ee.Filter.withinDistance({distance:300, leftField:'.geo', rightField: '.geo', maxError:100}));

CoprenicusDEM = ee.ImageCollection(CoprenicusDEM).map(function(im){
  var extendedIM = ee.ImageCollection(ee.List(im.get("match"))).mosaic().setDefaultProjection(im.projection());
  return calculateSlopeAspect(extendedIM).clip(im.geometry());
});

  // Create separate ascending and descending collections
  var sentinel1ASCDB = collection
      .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));
  var sentinel1DESCDB = collection
      .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));
  
  // Calculate aspect and slope from DEM, in radians for further calculations
  var slope = CoprenicusDEM.mosaic().select('slope').multiply(Math.PI / 180);
  var aspect = CoprenicusDEM.mosaic().select('aspect').multiply(Math.PI / 180);
  
  
  //////////////////Function to CREATE LIA for ASCENDING images//////////////////

  // Function to calculate true azimuth direction for  the near range image edge
  var createLIAASC = function(img) {
  
      // Reproject aspect and slope to the coordinate system of S-1 image
      // Resample using nearest neighbour method
      var aspectReproj = aspect
      //       .reproject({
      //     crs: img.select('VV').projection()
      // });
      var slopeReproj = slope
      //         .reproject({
      //     crs: img.select('VV').projection()
      // });
  
      // Get the coords as a transposed array --> [[x,y]] to [x] a [y]
      // get(0) for get the first list, beause it's a list of lists // img.geometry() = 'system:footprint'
      // based on Guido Lemoine's script available at https://code.earthengine.google.com/f358cffefd45e09d162eb58821e83205
      var coords = ee.Array(img.geometry().coordinates().get(0)).transpose();
      var crdLons = ee.List(coords.toList().get(0)); // get x coordinates
      var crdLats = ee.List(coords.toList().get(1)); // get y coordinates
      var minLon = crdLons.sort().get(0); // get min/maxes
      var maxLon = crdLons.sort().get(-1);
      var minLat = crdLats.sort().get(0);
      var maxLat = crdLats.sort().get(-1);
  
      // Get the coordinates of the most southwest and most northwest point of the image
      // get the X coordinate of the min Y point and subtract the minX from that to get the difference
      var Xdiff = ee.Number(crdLons.get(crdLats.indexOf(minLat))).subtract(minLon);
  
      // get the Y coordinate of the min X point and subtract the minY from that to get the difference
      var Ydiff = ee.Number(crdLats.get(crdLons.indexOf(minLon))).subtract(minLat);
  
      // Now we have a right triangle --> just use the trigonometric function
      var azimuth = (Ydiff.divide(Xdiff)).atan().multiply(180 / Math.PI).add(270.0);
      // azimuth = 360 - (90 - x)   -->   x + 270!
  
      var azimuthViewAngle = azimuth.subtract(270);
  
      // Then calculate the viewing angle 
      var azimuthViewIMG = ee.Image(azimuth.subtract(270)).rename('AzimuthLook_ASC');
  
      // Define the Radar incidence angle
      var s1_inc = img.select('angle').multiply(Math.PI / 180);
  
      // Calculation of Local incidence angle according to Teillet et al. (1985), Hinse et al. (1988) and Castel et. al (2010)
      var LIAimg = ((slopeReproj.cos().multiply(s1_inc.cos()))
              .subtract(slopeReproj.sin().multiply(s1_inc.sin().multiply((aspectReproj.subtract(azimuthViewIMG.multiply(Math.PI / 180))).cos())))).acos()
          .clip(ee.Geometry.Polygon(img.geometry().coordinates().get(0))).multiply(180 / Math.PI).rename('LIA');
      
      return img.addBands([LIAimg]).setMulti({
          lookAngleAzimuth: azimuthViewAngle
      });
  };
  
  //////////////////Function to CREATE LIA for DESCENDING images//////////////////
  
  var createLIADESC = function(img) {
      var aspectReproj = aspect
      //       .reproject({
      //     crs: img.select('VV').projection()
      // });
      var slopeReproj = slope
      //       .reproject({
      //     crs: img.select('VV').projection()
      // });
  
      // Get the coords as a transposed array --> [[x,y]] to [x] a [y]
      // get(0) for get the first list, beause it's a list of lists // img.geometry() = 'system:footprint'
      // based on Guido Lemoine's script available at https://code.earthengine.google.com/f358cffefd45e09d162eb58821e83205
      var coords = ee.Array(img.geometry().coordinates().get(0)).transpose();
      var crdLons = ee.List(coords.toList().get(0)); // get x coordinates
      var crdLats = ee.List(coords.toList().get(1)); // get y coordinates
      var minLon = crdLons.sort().get(0); // get min/maxes
      var maxLon = crdLons.sort().get(-1);
      var minLat = crdLats.sort().get(0);
      var maxLat = crdLats.sort().get(-1);
  
      //Get the coordinates of the most southeast and most northeast point of the image
      // get the X coordinate of the min Y point and subtract the max X from that to get the difference
      var Xdiff = ee.Number(maxLon).subtract(ee.Number(crdLons.get(crdLats.indexOf(minLat))));
  
      // get the Y coordinate of the min X point and subtract the minY from that to get the difference
      var Ydiff = ee.Number(crdLats.get(crdLons.indexOf(maxLon))).subtract(minLat);
  
      // Now we have a right triangle --> just use the trigonometric functions
      var azimuth = ee.Number(90).subtract((Ydiff.divide(Xdiff)).atan().multiply(180 / Math.PI)).add(180);
      // azimuth = 90 - azimuth + 180
  
      var azimuthViewAngle = azimuth.add(90);
  
      // Then calculate the azimuth viewing angle 
      var azimuthViewIMG = ee.Image(azimuth.add(90)).rename('AzimuthLook_Desc');
  
      // Define the Radar incidence angle 
      var s1_inc = img.select('angle').multiply(Math.PI / 180);
  
      // Calculation of Local incidence angle according to Teillet et al. (1985), Hinse et al. (1988) and Castel et. al (2010)
      var LIAimg = ((slopeReproj.cos().multiply(s1_inc.cos()))
              .subtract(slopeReproj.sin().multiply(s1_inc.sin().multiply((aspectReproj.subtract(azimuthViewIMG.multiply(Math.PI / 180))).cos())))).acos()
          .clip(ee.Geometry.Polygon(img.geometry().coordinates().get(0))).multiply(180 / Math.PI).rename('LIA');
  
      return img.addBands([LIAimg]).setMulti({
          lookAngleAzimuth: azimuthViewAngle
      });
  };
  
  // Apply the function to the Sentinel1 collection
  var LIAImgASC = sentinel1ASCDB.map(createLIAASC);
  var LIAImgDESC = sentinel1DESCDB.map(createLIADESC);
  
  // Merge databases of Descending and Ascending images, sort by time
  var LIAImages = (LIAImgDESC.merge(LIAImgASC)).sort('system:time_start');
  
  return LIAImages
}

exports.addLIA = addLIA
