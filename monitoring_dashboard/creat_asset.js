
var dirasset = 'projects/mapbiomas-arida/ColecaoLandsat_v1/';
var parametros = require('users/CartasSol/package:Arida/GUIexport_Vrs0')
var version = '1'

var anos = ['2000'];
var sensores = ['LX'];

//var anos = ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017'];
//var sensores = ['L7','L7','L7','L5','L5','L5','L5','L5','L5','L5','L5','L5','L7','L8','L8','L8','L8','L8'];

var seco_ini = '01';
var seco_fim = '07';

var umido_ini = '07';
var umido_fim = '12';

var buffer_carta = 100;

var cc = 90;

var biome = 'CAATINGA';

//Carrega módulos externos
var IndexModule = require('users/marcosrosa/MapBiomas_Arida:biblioteca/calcula_indices');
var AddIndex = IndexModule.AddIndex

var TDOMModule = require('users/marcosrosa/MapBiomas_Arida:biblioteca/remove_cloud_TDOM');
var TDOMmask= TDOMModule.TDOMmask

var ImageCollModule = require('users/marcosrosa/MapBiomas_Arida:biblioteca/ImageColl_LandsatTOA_col1');
var getImageCollection = ImageCollModule.getImageCollection;
var cloudMaskLX = ImageCollModule.cloudMaskLX;
var cloudMaskL8 = ImageCollModule.cloudMaskL8;

var fill_gap_ano = true;

var filtro_nuvem_adicional = true; // true ou false to add another cloud filter
var adiciona_temas = false; // true ou false to add layers to Map

// Grid Landsat para cortar bordas das cenas
var landgrid = ee.FeatureCollection('ft:1qNHyIqgUjShP2gQAcfGXw-XoxWwCRn5ZXNVqKIS5');
var gridFeatureCollection = ee.FeatureCollection('ft:1wCmguQD-xQs2gMH3B-hdOdrwy_hZAq4XFw1rU8PN');

///////////////////////////
//FUNCTION: Border Remove
var clip_cena = function(img){
    var tile = ee.String('T').cat(ee.String(img.get('WRS_PATH'))).cat(ee.String('0')).cat(ee.String(img.get('WRS_ROW')));
   var limite_img = landgrid.filterMetadata('TILE_T', 'equals', tile);
		return img.clip(limite_img.map(function(poli){return poli.buffer(4000)}));
};

///////////////////////////////////////////////////////////////////////////////
//Function to clip with grid limit
var clipcarta = function(image) {
return  image.clip(limite);
};

///////////////////////////
// Create Symbol palets
var ndfi_color = 
  'FFFFFF,FFFCFF,FFF9FF,FFF7FF,FFF4FF,FFF2FF,FFEFFF,FFECFF,FFEAFF,FFE7FF,FFE5FF,FFE2FF,FFE0FF,FFDDFF,FFDAFF,FFD8FF,FFD5FF,FFD3FF,FFD0FF,FFCEFF,FFCBFF,FFC8FF,FFC6FF,FFC3FF,FFC1FF,FFBEFF,FFBCFF,FFB9FF,FFB6FF,FFB4FF,FFB1FF,FFAFFF,FFACFF,FFAAFF,FFA7FF,FFA4FF,FFA2FF,FF9FFF,FF9DFF,FF9AFF,FF97FF,FF95FF,FF92FF,FF90FF,FF8DFF,FF8BFF,FF88FF,FF85FF,FF83FF,FF80FF,FF7EFF,FF7BFF,FF79FF,FF76FF,FF73FF,FF71FF,FF6EFF,FF6CFF,FF69FF,FF67FF,'+
  'FF64FF,FF61FF,FF5FFF,FF5CFF,FF5AFF,FF57FF,FF55FF,FF52FF,FF4FFF,FF4DFF,FF4AFF,FF48FF,FF45FF,FF42FF,FF40FF,FF3DFF,FF3BFF,FF38FF,FF36FF,FF33FF,FF30FF,FF2EFF,FF2BFF,FF29FF,FF26FF,FF24FF,FF21FF,FF1EFF,FF1CFF,FF19FF,FF17FF,FF14FF,FF12FF,FF0FFF,FF0CFF,FF0AFF,FF07FF,FF05FF,FF02FF,FF00FF,FF00FF,FF0AF4,FF15E9,FF1FDF,FF2AD4,FF35C9,FF3FBF,FF4AB4,FF55AA,FF5F9F,FF6A94,FF748A,FF7F7F,FF8A74,FF946A,FF9F5F,FFAA55,FFB44A,FFBF3F,FFC935,'+
  'FFD42A,FFDF1F,FFE915,FFF40A,FFFF00,FFFF00,FFFB00,FFF700,FFF300,FFF000,FFEC00,FFE800,FFE400,FFE100,FFDD00,FFD900,FFD500,FFD200,FFCE00,FFCA00,FFC600,FFC300,FFBF00,FFBB00,FFB700,FFB400,FFB000,FFAC00,FFA800,FFA500,FFA500,F7A400,F0A300,E8A200,E1A200,D9A100,D2A000,CA9F00,C39F00,BB9E00,B49D00,AC9C00,A59C00,9D9B00,969A00,8E9900,879900,7F9800,789700,709700,699600,619500,5A9400,529400,4B9300,439200,349100,2D9000,258F00,1E8E00,'+
  '168E00,0F8D00,078C00,008C00,008C00,008700,008300,007F00,007A00,007600,007200,006E00,006900,006500,006100,005C00,005800,005400,005000,004C00';
var visNDFI = {'min':0, 'max':200, 'palette':ndfi_color};
var visNDFI100 = {'min':0, 'max':100, 'palette':ndfi_color};
var vizParams = {'min': 0.00,'max': 0.40, 'bands':'swir1,nir,red','gamma':1.0};
var visPar = {'bands':['swir1','nir','red'], 'gain':[800,600,2000],'gamma':0.5 };
var visParMedian = {'bands':['swir1med_year','nirmed_year','redmed_year'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };
var visParMax = {'bands':['swir1max','nirmax','redmax'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };
var visParMin = {'bands':['swir1min','nirmin','redmin'], 'gain':[0.08, 0.06,0.2],'gamma':0.5 };
var visSMA  = {'bands':['medSoil', 'medGV', 'medNPV'], 'gain': [6.0,4.0,6.0]};

var limite = geometry;
var umido_ini = '01';
var umido_fim = '06';

var seco_ini = '07';
var seco_fim = '12';
///////////////////////////
//FUNCTION: LOOP for each year
var exportMosaics = function(anoI){
  var ano = String(anoI);
  var sensor = sensores[0];

  var IC_umido = getImageCollection(limite,ano+'-'+umido_ini+'-01',ano+'-'+umido_fim+'-30',sensor, cc);
  var IC_seco = getImageCollection(limite,ano+'-'+seco_ini+'-01',ano+'-'+seco_fim+'-30',sensor, cc);
  var IC_year = getImageCollection(limite,ano+'-01-01',ano+'-12-30',sensor, cc);
  var IC_yearBQA = getImageCollection(limite,ano+'-01-01',ano+'-12-30',sensor, cc);   
  
  //apply TDOM)
  if (filtro_nuvem_adicional === true) {
    IC_umido = TDOMmask(IC_umido)
    IC_seco = TDOMmask(IC_seco)
    IC_year = TDOMmask(IC_year)
  }
  //Corta Limite Cartas
    IC_umido = IC_umido.map(clipcarta); 
    IC_seco = IC_seco.map(clipcarta); 
    IC_year = IC_year.map(clipcarta); 
    IC_yearBQA = IC_yearBQA.map(clipcarta); 

  //Aplly filter using BQA
  if (sensor == 'L8') {
    IC_umido = IC_umido.map(cloudMaskL8);
    IC_seco = IC_seco.map(cloudMaskL8);
    IC_year = IC_year.map(cloudMaskL8);
    IC_yearBQA = IC_yearBQA.map(cloudMaskL8);      
  } else {
    IC_umido = IC_umido.map(cloudMaskLX);
    IC_seco = IC_seco.map(cloudMaskLX);
    IC_year = IC_year.map(cloudMaskLX);
    IC_yearBQA = IC_yearBQA.map(cloudMaskLX);
  }
  //remove border of landsat image
  IC_umido = IC_umido.map(clip_cena);
  IC_seco = IC_seco.map(clip_cena);
  IC_year = IC_year.map(clip_cena);
  IC_yearBQA = IC_yearBQA.map(clip_cena);

  IC_umido = IC_umido.map(AddIndex)
  IC_seco = IC_seco.map(AddIndex)
  IC_year = IC_year.map(AddIndex)
  IC_yearBQA = IC_yearBQA.map(AddIndex)
  
  // Get Median
  var IC_wet_Median = IC_umido.median();
  var IC_dry_Median = IC_seco.median();
  var IC_year_Median = IC_year.median();
  var IC_year_MedianBQA = IC_yearBQA.median();
  
  IC_year_MedianBQA = IC_year_MedianBQA.addBands(IC_year_MedianBQA.select(["NDVI","NDVI","NDVI"],["cloudMask", "TDOMMask", "cloudShadowMask"]))
  
  // Fill cloud gaps with Period2 and Year mosaic
  if (fill_gap_ano == true) {
    IC_wet_Median = IC_wet_Median.unmask(IC_year_Median);
    IC_dry_Median = IC_dry_Median.unmask(IC_year_Median);
    IC_year_Median = IC_year_Median.unmask(IC_year_MedianBQA);
    IC_wet_Median = IC_wet_Median.unmask(IC_year_MedianBQA);
    IC_dry_Median = IC_dry_Median.unmask(IC_year_MedianBQA);
  }

  // Get Min, Max, Amp and Std from Year image
  var IC_year_Min = IC_year.min();
  var IC_year_Max = IC_year.max();
  var IC_year_Amp = IC_year_Max.subtract(IC_year_Min);
  var IC_year_Std = IC_year.reduce(ee.Reducer.stdDev());
  //Create new image to add new bands
  var img_asset = IC_year_Median.select(['blue'],['median_blue']).multiply(10000).uint16();
//  var img_asset = IC_wet_Median.select(['blue'],['median_blue_wet']).multiply(10000).uint16();
//  var img_asset = IC_dry_Median.select(['blue'],['median_blue_dry']).multiply(10000).uint16();

  // Add Median values to image bands
  img_asset = img_asset.addBands(IC_year_Median.select(['green'],['median_green']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_year_Median.select(['red'],['median_red']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_year_Median.select(['nir'],['median_nir']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_year_Median.select(['swir1'],['median_swir1']).multiply(10000).uint16());
//  img_asset = img_asset.addBands(IC_year_Median.select(['swir2'],['median_swir2']).multiply(10000).uint16());
//  img_asset = img_asset.addBands(IC_year_Median.select(['temp'],['median_temp']).multiply(10000).uint16());

  // Add Median Wet values to image bands
//  img_asset = img_asset.addBands(IC_wet_Median.select(['green'],['median_green_wet']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_wet_Median.select(['red'],['median_red_wet']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_wet_Median.select(['nir'],['median_nir_wet']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_wet_Median.select(['swir1'],['median_swir1_wet']).multiply(10000).uint16());
//  img_asset = img_asset.addBands(IC_wet_Median.select(['swir2'],['median_swir2__wet']).multiply(10000).uint16());
//  img_asset = img_asset.addBands(IC_wet_Median.select(['temp'],['median_temp_wet']).multiply(10000).uint16());

  // Add Median Dry values to image bands
//  img_asset = img_asset.addBands(IC_dry_Median.select(['green'],['median_green_dry']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_dry_Median.select(['red'],['median_red_dry']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_dry_Median.select(['nir'],['median_nir_dry']).multiply(10000).uint16());
  img_asset = img_asset.addBands(IC_dry_Median.select(['swir1'],['median_swir1_dry']).multiply(10000).uint16());
//  img_asset = img_asset.addBands(IC_dry_Median.select(['swir2'],['median_swir2_dry']).multiply(10000).uint16());
//  img_asset = img_asset.addBands(IC_dry_Median.select(['temp'],['median_temp_dry']).multiply(10000).uint16());

  // Add NDVI Year
  img_asset = img_asset.addBands(IC_year_Median.select(['NDVI']).select([0],['median_ndvi']).uint8());
  img_asset = img_asset.addBands(IC_year_Amp.select(['NDVI'],['amp_ndvi']).uint8());
  img_asset = img_asset.addBands(IC_year_Std.select(['NDVI_stdDev'],['stdDev_ndvi']).uint8());
  // Add PRI Year
  img_asset = img_asset.addBands(IC_year_Median.select(['PRI']).select([0],['median_pri']).uint8());
//  img_asset = img_asset.addBands(IC_year_Amp.select(['PRI'],['amp_pri']).uint8());
//  img_asset = img_asset.addBands(IC_year_Std.select(['PRI_stdDev'],['stdDev_pri']).uint8());
  // Add EVI2
  img_asset = img_asset.addBands(IC_year_Median.select(['EVI2']).select([0],['median_evi2']).uint8());
//  img_asset = img_asset.addBands(IC_year_Amp.select(['EVI2'],['amp_evi2']).uint8());
  img_asset = img_asset.addBands(IC_year_Std.select(['EVI2_stdDev'],['stdDev_evi2']).uint8());

  // Add Dry index
  img_asset = img_asset.addBands(IC_dry_Median.select(['NDVI']).select([0],['median_ndvi_dry']).uint8());
//  img_asset = img_asset.addBands(IC_dry_Median.select(['EVI2']).select([0],['median_evi2_dry']).uint8());
//  img_asset = img_asset.addBands(IC_dry_Median.select(['PRI']).select([0],['median_pri_dry']).uint8());
  
  // Add Wet index
//  img_asset = img_asset.addBands(IC_wet_Median.select(['NDVI']).select([0],['median_ndvi_wet']).uint8());
//  img_asset = img_asset.addBands(IC_wet_Median.select(['EVI2']).select([0],['median_evi2_wet']).uint8());
//  img_asset = img_asset.addBands(IC_wet_Median.select(['PRI']).select([0],['median_pri_wet']).uint8());
  // Add MAX index
  img_asset = img_asset.addBands(IC_year_Max.select(['NDVI']).select([0],['max_ndvi']).uint8());
  img_asset = img_asset.addBands(IC_year_Max.select(['EVI2']).select([0],['max_evi2']).uint8());
  img_asset = img_asset.addBands(IC_year_Max.select(['PRI']).select([0],['max_pri']).uint8());

if (adiciona_temas === true){

    Map.addLayer(img_asset, {'bands':['median_ndvi_dry' ],'min':30, 'max':160, 'palette':ndfi_color}, 'NDVI med seco'+ano, false);
    Map.addLayer(img_asset, {'bands':['median_ndvi_wet'],'min':30, 'max':160, 'palette':ndfi_color}, 'NDVI med umido'+ano, false);
    Map.addLayer(img_asset, {'bands':['median_ndvi' ],'min':30, 'max':160, 'palette':ndfi_color}, 'NDVI med year'+ano, false);
    Map.addLayer(img_asset, {'bands':['max_ndvi' ],'min':30, 'max':160, 'palette':ndfi_color}, 'NDVI max year'+ano, false);

    Map.addLayer(img_asset, {'bands':['median_evi2' ],'min':0, 'max':160, 'palette':ndfi_color}, 'EVI2 med year'+ano, false);
    Map.addLayer(img_asset, {'bands':['stdDev_evi2' ],'min':0, 'max':50, 'palette':ndfi_color}, 'EVI2 std year'+ano, false);
    Map.addLayer(img_asset, {'bands':['amp_evi2' ],'min':0, 'max':160, 'palette':ndfi_color}, 'EVI2 amp year'+ano, false);
    Map.addLayer(img_asset, {'bands':['median_swir1_dry', 'median_nir_dry', 'median_red_dry' ], 'gain':[0.09, 0.07,0.2],'gamma':0.5 }, 'LandMedian dry '+ano, image_dry_visible);
    Map.addLayer(img_asset, {'bands':['median_swir1_wet', 'median_nir_wet', 'median_red_wet' ], 'gain':[0.09, 0.07,0.2],'gamma':0.5 }, 'LandMedian wet '+ano, image_wet_visible);

    }
//  Map.addLayer(img_asset, {'bands':['median_swir1','median_nir','median_red' ], 'gain':[0.09, 0.07,0.2],'gamma':0.5 }, 'LandMedian year '+ano, true);

  var imgemProp = img_asset
      .set('year',parseInt(ano,10))
      .set('date_end', ano+'-12-30')
      .set('task_id', 1)
      .set('collection', 3)
      .set('version', version)
      .set('sensor_id', sensor)
      .set('biome', biome)      
      .set('date_initial', ano+'-01-01')  
      .set('cloud_cover', cc)

  var paramExp = {
        image: imgemProp, 
        description: "arida_"+ano+"_v0"+version, 
        assetId: dirasset+"arida_"+ano+"_v0"+version, 
        scale: 30, 
        pyramidingPolicy: {'.default': 'mode'}, 
        maxPixels: 1e13, 
        region: limite
    }
  
    Export.image.toAsset(paramExp)
}


//var ColecaoMODIS = ee.ImageCollection('MODIS/MOD09GA_NDVI')
//                     .filterDate(t0, t1)      
//var imgMODISNDVImax = ColecaoMODIS.max().clip();
// Gera LandLike
// var LandLike = imgNDVImaxLand.select([0]).unmask(imgMODISNDVImax);

var blank = ee.Image(0).mask(0);
var outline = blank.paint(limite, 'AA0000', 2); 
var visPar = {'palette':'000000','opacity': 0.6};
Map.addLayer(outline, visPar, 'Limite', false);

var getParameters = function(){
  
    var startDate = parametros.yearI.getValue();
    var endDate = parametros.yearF.getValue();
    var casset = parametros.asset;
           
    var param = {      
      "startDate": startDate, 
      "endDate": endDate, 
      "idAsset": casset, 
    }
    
    return param
}


var procesoExport = function(){

    var parameters = getParameters()
    
    var startDate = parameters["startDate"];
    var endDate = parameters["endDate"];
    var dirasset = parameters["idAsset"];
    print('ano inicial , ano final')
    print(startDate, endDate);
    
    
    var t00 = parseInt(startDate)
    var t11 = parseInt(endDate)
    var seq = ee.List.sequence(t00, t11)
    print(t00)
    print(seq)

    seq.evaluate(function(secuencia){
        secuencia.forEach(function(ano){
            exportMosaics(ano);
        })
    })
    //var fileName = grid_name + "-" + startDate + "-" + endDate + "-" + cadence;
    
    //var valores_CSV = exportMosaics(grid_name, startDate, endDate, cadence)
    
    //Export.table.toDrive({
    //    collection: valores_CSV,
    //    description: fileName,
    //    folder: 'teste',
    //    fileNamePrefix: fileName,
    //    fileFormat: 'CSV'
    //});
}



parametros.export.onClick(procesoExport)