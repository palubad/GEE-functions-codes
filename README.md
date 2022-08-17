# Google Earth Engine functions & codes <sub>[under construction - new codes will be added soon]<sub>
This repository contains Google Earth Engine (GEE) codes and functions that I have created in the course of my work in GEE and which I find useful for the wider GEE community.

## makeMosaicsFromOverlappingTiles(collection,ROI) function
This function creates mosaic images from GEE ImageCollection image tiles that overlaps the selected region of interest (ROI) and originates from the same overpass.

</b> Input parameters:
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
<br/>
## bandsToImgCollection(image) function
This function creates an ee.ImageCollection from bands of a selected image.
  
</b> Input parameters:
  - image: selected image to convert its band to an Image Collection

#### How to use this function?
1. Define the Image from which bands you want create an Image Collection
2. Load the GEE repository using `require('users/danielp/functions:bandsToImgCollection')`, e.g. `var theFunction = require('users/danielp/functions:bandsToImgCollection')`
3. Add the input parameter (image) and use the function, e.g. `var finalCollection = theFunction.bandsToImgCollection(YOUR_IMAGE))`
