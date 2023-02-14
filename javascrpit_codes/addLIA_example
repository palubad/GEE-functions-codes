// This is an example demonstration of the addLIA function, which adds 
// Local Incidence Angle (LIA) to each image in the selected Sentinel-1 GEE ImageCollection 
// using the Copernicus DEM for the selected region of interest (geometry). 
// This function is a part of the paper in Remote Sensing journal: 
// Paluba et al. (2021): "Land Cover-Specific Local Incidence Angle Correction: A Method for 
// Time-Series Analysis of Forest Ecosystems" https://www.mdpi.com/2072-4292/13/9/1743 
// (doi: 10.3390/rs13091743). The code for the full algorithm developed is available in this 
// GitHub repository: https://github.com/palubad/LC-SLIAC. 
// Please refer to this paper if using the addLIA function. 

var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[15.79266459322555, 50.38479900990016],
          [15.79266459322555, 50.02618734014969],
          [16.20671183443649, 50.02618734014969],
          [16.20671183443649, 50.38479900990016]]], null, false);

// set start and end date
var startDate = '2021-03-01',
    endDate = '2021-10-31';

// filter the S1 data collection
var S1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
                  .filterBounds(geometry)
                  .filterDate(startDate, endDate);

// call the function 
var addLIA = require('users/danielp/functions:addLIA');

// apply the function
var S1withLIA = addLIA.addLIA(S1Collection,geometry);
print(S1withLIA.first());

Map.addLayer(S1withLIA.select('VH'),{min:-25,max:5},'VH');
Map.addLayer(S1withLIA.select('LIA'),{min:0,max:60},'LIA');
