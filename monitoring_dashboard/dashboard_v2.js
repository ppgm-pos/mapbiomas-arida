/// Coleções de dados

//Coleção landsat 5 SR
var l5SR = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
              .filterDate('2000-01-01','2011-12-31');
                                   
//Coleção landsat 7 SR
var l7SR = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")
              .filterDate('2012-01-01','2013-12-31');
//print(l7toa.limit(5))       

//Coleção landsat 8 SR
var l8SR = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
              .filterDate('2014-01-01','3000-01-01');

//Merge Coleção landsat 5/7 SR
var l57SR = l5SR.merge(l7SR);

//Merge Coleção landsat 5/7/8 SR
var l578SR = l57SR.merge(l8SR)

//Coleção landsat Modis
var modis=ee.ImageCollection("MODIS/006/MOD13Q1")
            .filterDate('2000-01-01','3000-01-01');

var addvalueModis = function(image) {
  var NDVIescal = image.select('NDVI').multiply(0.0001).rename('NDVI_escal')
return image.addBands(NDVIescal);
};

modis=modis.map(addvalueModis)

print(modis.limit(10),'modis')
//Coleção landsat Sentinel
var dSentinel = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2000-01-01','3000-01-01');
                  
//print(dSentinel.limit(5))

//Inclui Logo
var logos = require('users/CartasSol/package:Arida/EXEINI').Aridas;


// This field contains UNIX time in milliseconds.
var timeField = 'system:time_start';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

var makssentinel = function(image) {
  var QA60 = image.select(['QA60'])
  var clouds = QA60.bitwiseAnd(1<<10).or(QA60.bitwiseAnd(1<<11))// this gives us cloudy pixels
  return image.updateMask(clouds.not()) // remove the clouds from image
};


var maskClouds = function(image) {
  var qa = image.select('pixel_qa');
  // If the cloud bit (5) is set and the cloud confidence (7) is high
  // or the cloud shadow bit is set (3), then it's a bad pixel.
  var cloud = qa.bitwiseAnd(1 << 5)
                  .and(qa.bitwiseAnd(1 << 7))
                  .or(qa.bitwiseAnd(1 << 3));
  // Remove edge pixels that don't occur in all bands
  var mask2 = image.mask().reduce(ee.Reducer.min());
  return image.updateMask(cloud.not()).updateMask(mask2);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Use this function to add variables for NDVI, time and a constant
// to Modis imagery.
var addVariablesM = function(image) {
  // Compute time in fractional years since the epoch.
  var date = ee.Date(image.get(timeField));
  var years = date.difference(ee.Date('1970-01-01'), 'year');
  // Return the image with the added bands.
  return image
    // Add an NDVI band.
    .addBands(image.select(['NDVI_escal'])).float() //.rename('NDVI-ESCAL')
    // Add a time band.
    .addBands(ee.Image(years).rename('t').float())
    // Add a constant band.
    .addBands(ee.Image.constant(1));
};


// Use this function to add variables for NDVI, time and a constant
// to Sentinel imagery.
var addVariablesS = function(image) {
  // Compute time in fractional years since the epoch.
  var date = ee.Date(image.get(timeField));
  var years = date.difference(ee.Date('1970-01-01'), 'year');
  // Return the image with the added bands.
  return image
    // Add an NDVI band.
    .addBands(image.normalizedDifference(['B8', 'B4']).rename('NDVI')).float()
    // Add a time band.
    .addBands(ee.Image(years).rename('t').float())
    // Add a constant band.
    .addBands(ee.Image.constant(1));
};


// Use this function to add variables for NDVI, time and a constant
// to L5/L7/8 imagery.
var addVariables578 = function(image) {
  // Compute time in fractional years since the epoch.
  var date = ee.Date(image.get(timeField));
  var years = date.difference(ee.Date('1970-01-01'), 'year');
  // Return the image with the added bands.
  return image
    // Add an NDVI band.
    .addBands(image.normalizedDifference(['B4', 'B3']).rename('NDVI')).float()
    // Add a time band.
    .addBands(ee.Image(years).rename('t').float())
    // Add a constant band.
    .addBands(ee.Image.constant(1));
};



////////////////////////// GUI p/ ferramenta

// Create a panel to hold our widgets.
var panel = ui.Panel();
panel.add(logos);
panel.style().set({ 'width': '500px',
                   'padding': '2px'//,
                   //'stretch': 'horizontal'
});

// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'Sistema de monitoramento Árida',
    style: {fontSize: '15px', fontWeight: 'bold'}
  }),
  ui.Label('Inspetor de descritores biofísicos'),
  ui.Label('Clique no mapa para inspeção')
]);
panel.add(intro);


// Create panels to hold lon/lat values.
var lon = ui.Label();
var lat = ui.Label();
panel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));

// Register a callback on the default map to be invoked when the map is clicked.

Map.onClick(function(coords) {
  // Update the lon/lat panel with values from the click event.
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));

  // Add a red dot for the point clicked on.
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var dot = ui.Map.Layer(point, {color: 'FF0000'});
  Map.layers().set(1, dot);
  
  
/////collection data  

// mODIS, add variables and filter to the area of interest.
var filteredLandsatM = modis
  .filterBounds(point)
  .map(addVariablesM);

print("Modis",filteredLandsatM)

  
// Remove Sentinel add variables and filter to the area of interest.
var filteredLandsatS = dSentinel
  .filterBounds(point)
  .map(makssentinel)
  .map(addVariablesS);  
//print(filteredLandsatS)


var filteredLandsat578 = l578SR
  .filterBounds(point)
  .map(maskClouds)
  .map(addVariables578);  
//print(filteredLandsat578)

// Linear trend ----------------------------------------------------------------
// List of the independent variable names
var independents = ee.List(['constant', 't']);

// Name of the dependent variable.
var dependent = ee.String('NDVI');

var dependentModis = ee.String('NDVI_escal');

// Compute a linear trend Modis.  This will have two bands: 'residuals' and 
// a 2x1 band called coefficients (columns are for dependent variables).
var trendM = filteredLandsatM.select(independents.add(dependentModis))
    .reduce(ee.Reducer.linearRegression(independents.length(), 1));
// Map.addLayer(trend, {}, 'trend array image');

// Compute a linear trend Sentinel.  This will have two bands: 'residuals' and 
// a 2x1 band called coefficients (columns are for dependent variables).
var trendS = filteredLandsatS.select(independents.add(dependent))
    .reduce(ee.Reducer.linearRegression(independents.length(), 1));
// Map.addLayer(trend, {}, 'trend array image');


// Compute a linear trend L5/L7/L8.  This will have two bands: 'residuals' and 
// a 2x1 band called coefficients (columns are for dependent variables).
var trend578 = filteredLandsat578.select(independents.add(dependent))
    .reduce(ee.Reducer.linearRegression(independents.length(), 1));
// Map.addLayer(trend, {}, 'trend array image');


/////////////////////////////////////////////////////////////////

// Flatten the coefficients into a 2-band image
var coefficientsM = trendM.select('coefficients')
  .arrayProject([0])
  .arrayFlatten([independents]);
  
// Flatten the coefficients into a 2-band image
var coefficientsS = trendS.select('coefficients')
  .arrayProject([0])
  .arrayFlatten([independents]);

// Flatten the coefficients into a 2-band image
var coefficients578 = trend578.select('coefficients')
  .arrayProject([0])
  .arrayFlatten([independents]);

/////////////////////////////////////////////////////////////////

// Compute a de-trended series.
var detrendedM = filteredLandsatM.map(function(image) {
  return image.select(dependentModis).subtract(
          image.select(independents).multiply(coefficientsM).reduce('sum'))
          .rename(dependentModis)
          .copyProperties(image, [timeField]);
});

// Compute a de-trended series.
var detrendedS = filteredLandsatS.map(function(image) {
  return image.select(dependent).subtract(
          image.select(independents).multiply(coefficientsS).reduce('sum'))
          .rename(dependent)
          .copyProperties(image, [timeField]);
});


// Compute a de-trended series.
var detrended578 = filteredLandsat578.map(function(image) {
  return image.select(dependent).subtract(
          image.select(independents).multiply(coefficientsS).reduce('sum'))
          .rename(dependent)
          .copyProperties(image, [timeField]);
});
/////////////////////////////////////////////////////////////////////////////////////

// Harmonic trend ----------------------------------------------------------------

// Use these independent variables in the harmonic regression Modis.
var harmonicIndependentsM = ee.List(['constant', 't', 'cos', 'sin']);

// Use these independent variables in the harmonic regression Sentinel.
var harmonicIndependentsS = ee.List(['constant', 't', 'cos', 'sin']);

// Use these independent variables in the harmonic regression L5/L7/L8.
var harmonicIndependents578 = ee.List(['constant', 't', 'cos', 'sin']);
//////////////////////////////////////////////////////////////////////////////////////

// Add harmonic terms as new image bands Modis.
var harmonicLandsatM = filteredLandsatM.map(function(image) {
  var timeRadians = image.select('t').multiply(2 * Math.PI);
  return image
    .addBands(timeRadians.cos().rename('cos'))
    .addBands(timeRadians.sin().rename('sin'));
});

// Add harmonic terms as new image bands Sentinel.
var harmonicLandsatS = filteredLandsatS.map(function(image) {
  var timeRadians = image.select('t').multiply(2 * Math.PI);
  return image
    .addBands(timeRadians.cos().rename('cos'))
    .addBands(timeRadians.sin().rename('sin'));
});

// Add harmonic terms as new image bands Sentinel.
var harmonicLandsat578 = filteredLandsat578.map(function(image) {
  var timeRadians = image.select('t').multiply(2 * Math.PI);
  return image
    .addBands(timeRadians.cos().rename('cos'))
    .addBands(timeRadians.sin().rename('sin'));
});
////////////////////////////////////////////////////////////////////////////////////
  
  // The output of the regression reduction is a 4x1 array image Modis.
var harmonicTrendM = harmonicLandsatM
  .select(harmonicIndependentsM.add(dependentModis))
  .reduce(ee.Reducer.linearRegression(harmonicIndependentsM.length(), 1));
  
  // The output of the regression reduction is a 4x1 array image Sentinel.
var harmonicTrendS = harmonicLandsatS
  .select(harmonicIndependentsS.add(dependent))
  .reduce(ee.Reducer.linearRegression(harmonicIndependentsS.length(), 1));
  
  // The output of the regression reduction is a 4x1 array image L5/L7/L8.
var harmonicTrend578 = harmonicLandsat578
  .select(harmonicIndependents578.add(dependent))
  .reduce(ee.Reducer.linearRegression(harmonicIndependents578.length(), 1));  
//////////////////////////////////////////////////////////////////////////////////////

// Turn the array image into a multi-band image of coefficients Modis.
var harmonicTrendCoefficientsM = harmonicTrendM.select('coefficients')
  .arrayProject([0])
  .arrayFlatten([harmonicIndependentsM]);
  
// Turn the array image into a multi-band image of coefficients Sentinel.
var harmonicTrendCoefficientsS = harmonicTrendS.select('coefficients')
  .arrayProject([0])
  .arrayFlatten([harmonicIndependentsS]);

// Turn the array image into a multi-band image of coefficients  L5/L7/L8.
var harmonicTrendCoefficients578 = harmonicTrend578.select('coefficients')
  .arrayProject([0])
  .arrayFlatten([harmonicIndependents578]);
/////////////////////////////////////////////////////////////////////////////////////

// Compute fitted values Modis.
var fittedHarmonicM = harmonicLandsatM.map(function(image) {
  return image.addBands(
    image.select(harmonicIndependentsM)
      .multiply(harmonicTrendCoefficientsM)
      .reduce('sum')
      .rename('fitted'));
});

// Compute fitted values Sentinel.
var fittedHarmonicS = harmonicLandsatS.map(function(image) {
  return image.addBands(
    image.select(harmonicIndependentsS)
      .multiply(harmonicTrendCoefficientsS)
      .reduce('sum')
      .rename('fitted'));
});

// Compute fitted values L5/L7/L8.
var fittedHarmonic578 = harmonicLandsat578.map(function(image) {
  return image.addBands(
    image.select(harmonicIndependents578)
      .multiply(harmonicTrendCoefficients578)
      .reduce('sum')
      .rename('fitted'));
});

////////////////////////////////////////////////////////////////////////////////
// Plot the fitted model and the original data at the ROI- Modis.
//print(
    var ndviChartM= ui.Chart.image.series(
      fittedHarmonicM.select(['fitted','NDVI_escal']), point, ee.Reducer.mean(), 30)
        .setSeriesNames(['IVDN', 'Ajustes'])
        .setOptions({
          trendlines: {0: {
            color: 'CC0000'
          }},
          title: 'Modis - Índice de Vegetação por Diferença Normalizada',
          lineWidth: 1,
          //max: 750,
          pointSize: 3,
    });
panel.widgets().set(2, ndviChartM);


// Plot the fitted model and the original data at the ROI- Modis.
//print(
    var ndviChart578= ui.Chart.image.series(
      fittedHarmonic578.select(['fitted','NDVI']), point, ee.Reducer.mean(), 10)
        .setSeriesNames(['IVDN', 'Ajustes'])
        .setOptions({
          trendlines: {0: {
            color: 'CC0000'
          }},
          title: 'L5/L7/L8 - Índice de Vegetação por Diferença Normalizada',
          lineWidth: 1,
          //max: 750,
          pointSize: 3,
    });
panel.widgets().set(3, ndviChart578);

// Plot the fitted model and the original data at the ROI- Sentinel.
    var ndviChartS= ui.Chart.image.series(
      fittedHarmonicS.select(['fitted','NDVI']), point, ee.Reducer.mean(), 10)
        .setSeriesNames(['IVDN', 'Ajustes'])
        .setOptions({
          trendlines: {0: {
            color: 'CC0000'
          }},
          title: 'Sentinel 2 - Índice de Vegetação por Diferença Normalizada',
          lineWidth: 1,
          //max: 750,
          pointSize: 3,
    });
panel.widgets().set(4, ndviChartS);


// Plot the fitted model and the original data at the ROI- Sentinel.


});

Map.style().set('cursor', 'crosshair');

// Add the panel to the ui.root.
ui.root.insert(0, panel);

Map.setCenter(-39.77, -8.23, 8)