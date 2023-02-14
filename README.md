# Google Earth Engine functions & codes <sub>[new codes will be added soon]</sub>
This repository contains Google Earth Engine (GEE) codes and functions that I have created during my works in GEE and which I find useful for the wider GEE community.

## addLAI(collection,geometry) function
This function adds Local Incidence Angle (LIA) to aach image in a selected Sentinel-1 GEE ImageCollection using the [Copernicus DEM](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_DEM_GLO30) for the selected region of interest (geometry).
This function is a part of the paper in Remote Sensing journal: [Paluba et al. (2021): "Land Cover-Specific Local Incidence Angle Correction: A Method for Time-Series Analysis of Forest Ecosystems"](https://www.mdpi.com/2072-4292/13/9/1743/) (doi: 10.3390/rs13091743). The code for the full algorithm developed is available [in this GitHub repository](https://github.com/palubad/LC-SLIAC). Please refer to this paper if using the *addLIA function*.

Input parameters:
  - collection: *Sentinel-1 ImageCollection to use. It is recommended to filter this collection at least by Date and geometry.*
  - geometry: *the geometry for which the DEM mosaic will be created.*

#### How to use this function?
1. Define the Sentinel-1 Image Collection you want to use, define the geometry and filter the selected Image Collection by date and ROI.
2. Load the GEE repository using `require('users/danielp/functions:addLIA')`, e.g. `var addLAI = require('users/danielp/functions:addLIA')`
3. Add input parameters (collection and geometry) and use the function, e.g. `var finalCollection = addLAI.addLAI(your_collection, your_geometry)`
4. Use the mosaiced Image Collection

Take a look at the example code [here](https://code.earthengine.google.com/f6eba4163ea5bb915500abbd7cec34fc).
The source code of the function can be found in the *javascript_codes* folder of this repository.

##### Possible improvements in the future
  - add option to select different DEMs available in GEE --> currently you can do it changing the source code of the addLIA function


## makeMosaicsFromOverlappingTiles(collection,ROI) function
This function creates mosaic images from GEE ImageCollection image tiles that overlaps the selected region of interest (ROI) and originates from the same overpass.

Input parameters:
  - collection: *ImageCollection to use. It is recommended to filter this collection at least by Date.*
  - ROI: *the geometry for which you want to create mosaics.*

#### How to use this function?
1. Define the Image Collection you want to use, define the ROI and filter the selected Image Collection by date and ROI.
2. Load the GEE repository using `require('users/danielp/functions:makeMosaicsFromOverlappingTiles_function')`, e.g. `var theFunction = require('users/danielp/functions:makeMosaicsFromOverlappingTiles_function')`
3. Add input parameters (collection and ROI) and use the function, e.g. `var finalCollection = theFunction.makeMosaicsFromOverlappingTiles(your_collection, your_geometry)`
4. Use the mosaiced Image Collection

Take a look at the example code [here](https://code.earthengine.google.com/eeed2f691e03f7447367777e76b0e847).
The source code of the function can be found in the *javascript_codes* folder of this repository.

<br/>

## bandsToImgCollection(image) function
This function creates an ee.ImageCollection from bands of a selected image.
  
Input parameters:
  - image: *selected image to convert its band to an Image Collection*

#### How to use this function?
1. Define the Image from which bands you want create an Image Collection
2. Load the GEE repository using `require('users/danielp/functions:bandsToImgCollection')`, e.g. `var theFunction = require('users/danielp/functions:bandsToImgCollection')`
3. Add the input parameter (image) and use the function, e.g. `var finalCollection = theFunction.bandsToImgCollection(YOUR_IMAGE))`
