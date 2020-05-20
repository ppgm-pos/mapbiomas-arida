/**
 * @name
 *      Arida User Toolkit Download
 * 
 * @description
 *      This is a support tool for mapbiomas data users.
 *  
 * @author
 *      João Siqueira
 *      contato@mapbiomas.org
 *      
 *      Edited By: Soltan Galano
 * 
 * 
 *
 * @version
 *    1.0.0 - Acess and download municipalites data
 *    1.1.0 - Acess and download state data
 *    1.2.0 - Acess and download transitions data
 *    1.2.1 - Fix bug in task name
 *    1.2.2 - Update states vector
 *    1.2.3 - Add nice mapbiomas logo :)
 *    1.2.4 - Acess and download biomes data
 *
 * @see
 *      Get the MapBiomas exported data in your "Google Drive/MAPBIOMAS-EXPORT" folder
 */
 
var palettes = require('users/mapbiomas/modules:Palettes.js');
var logos = require('users/CartasSol/package:Arida/EXEINI');

//print(logos)

var App = {

    options: {
        version: 'beta-1',
        logo: logos.Aridas,
        assets: {
            municipalities: "projects/mapbiomas-workspace/AUXILIAR/municipios-2016",
            states: "projects/mapbiomas-workspace/AUXILIAR/estados-2017",
            //biomes: "projects/mapbiomas-workspace/AUXILIAR/biomas",
            region: 'users/rnvuefsppgm/aridapolgeral',
            integration: 'projects/mapbiomas-workspace/public/collection3/mapbiomas_collection3_integration_v1',
            transitions: 'projects/mapbiomas-workspace/public/collection3/mapbiomas_collection3_transitions_v1',
            colArida: 'projects/mapbiomas-arida/ColecaoLandsat_v2'
        },

        periods: {
            'Coverage': [
                '2000', '2001', '2002', '2003', '2004','2005', '2006', '2007', '2008', '2009', 
                '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'
            ],
            'Transitions': [
                  "2000_2001","2001_2002","2002_2003","2003_2004", "2004_2005",
                  "2005_2006", "2006_2007","2007_2008","2008_2009", "2009_2010",
                  "2010_2011", "2011_2012","2012_2013","2013_2014", "2014_2015",
                  "2015_2016", "2016_2017", "2000_2005", "2005_2010","2010_2015", 
                  "2015_2017","2000_2010", "2010_2017", "2008_2017", "2012_2017",
                  "2002_2010", "2010_2016"
            ],
            'Carbon': [
                '2000', '2001', '2002', '2003', '2004','2005', '2006', '2007', '2008', '2009', 
                '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'
            ],
            'productivity': [
                '2000', '2001', '2002', '2003', '2004','2005', '2006', '2007', '2008', '2009', 
                '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'
            ],
            'water': [
                '2000', '2001', '2002', '2003', '2004','2005', '2006', '2007', '2008', '2009', 
                '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'
            ]
        },
        bandsNames: {
            'Coverage': 'classification_',
            'Transitions': 'transition_',
            'productivity': 'produtividade',
            'carbon': "carbono",
            'water':'classification_'
        },
        

        dataType: 'Coverage',

        data: {
            'Coverage': null,
            'Transitions': null,
            'Carbon':null,
            'productivity':null,
            'water':null
        },

        ranges: {
            'Coverage': {
                'min': 0,
                'max': 33
            },
            'Transitions': {
                'min': -2,
                'max': 3
            },
            'Carbon': {
                'min': 50,
                'max': 150
            },
            'productivity': {
                'min': 0,
                'max': 200
            },
            'water': {
                'min': 0,
                'max': 33
            },
        },

        states: null,
        
        municipalities: null,
        
        region: null,
        
        activeFeature: null,
        
        activeName: '',
        
        municipalitiesNames: [],
        
        regionsNames: {
          'region': "ÁREA INTERVENÇÔES"
        },
        
        biomesNames: {
            //'Amazônia': 'AMAZONIA',
            'Caatinga': 'CAATINGA',
            //'Cerrado': 'CERRADO',
            //'Mata Atlântica': 'MATAATLANTICA',
            //'Pampa': 'PAMPA',
            //'Pantanal': 'PANTANAL'
        },

        statesNames: {
            'None': 'None',
            //'Acre': '12',
            'Alagoas': '27',
            //'Amazonas': '13',
            //'Amapá': '16',
            'Bahia': '29',
            'Ceará': '23',
            //'Distrito Federal': '53',
            'Espírito Santo': '32',
            //'Goiás': '52',
            //'Maranhão': '21',
            'Minas Gerais': '31',
            //'Mato Grosso do Sul': '50',
            //'Mato Grosso': '51',
            //'Pará': '15',
            'Paraíba': '25',
            'Pernambuco': '26',
            'Piauí': '22',
            //'Paraná': '41',
            //'Rio de Janeiro': '33',
            'Rio Grande do Norte': '24',
            //'Rondônia': '11',
            //'Roraima': '14',
            //'Rio Grande do Sul': '43',
            //'Santa Catarina': '42',
            'Sergipe': '28',
            //'São Paulo': '35',
            //'Tocantins': '17'
        },

        palette: {
            'Coverage': palettes.get('classification2'),
            'Transitions': ['ffa500', 'ff0000', '818181', '06ff00', '4169e1', '8a2be2'],
            'productivity':'FFFFFF,FFFCFF,FFF9FF,FFF7FF,FFF4FF,FFF2FF,FFEFFF,FFECFF,FFEAFF,FFE7FF,FFE5FF,FFE2FF,FFE0FF,'+
                   'FFDDFF,FFDAFF,FFD8FF,FFD5FF,FFD3FF,FFD0FF,FFCEFF,FFCBFF,FFC8FF,FFC6FF,FFC3FF,FFC1FF,FFBEFF,'+
                   'BCFF,FFB9FF,FFB6FF,FFB4FF,FFB1FF,FFAFFF,FFACFF,FFAAFF,FFA7FF,FFA4FF,FFA2FF,FF9FFF,FF9DFF,'+
                   'FF9AFF,FF97FF,FF95FF,FF92FF,FF90FF,FF8DFF,FF8BFF,FF88FF,FF85FF,FF83FF,FF80FF,FF7EFF,FF7BFF,'+
                   'FF6EFF,FF6CFF,FF69FF,FF67FF,FF79FF,FF76FF,FF73FF,FF71FF,FF64FF,FF61FF,FF5FFF,FF5CFF,FF5AFF,'+
                   'FF57FF,FF55FF,FF52FF,FF4FFF,FF4DFF,FF4AFF,FF48FF,FF45FF,FF42FF,FF40FF,FF3DFF,FF3BFF,FF38FF,'+
                   'FF36FF,FF33FF,FF30FF,FF2EFF,FF2BFF,FF29FF,FF26FF,FF24FF,FF21FF,FF1EFF,FF1CFF,FF19FF,FF17FF,'+
                   'FF14FF,FF12FF,FF0FFF,FF0CFF,FF0AFF,FF07FF,FF05FF,FF02FF,FF00FF,FF00FF,FF0AF4,FF15E9,FF1FDF,'+
                   'FF2AD4,FF35C9,FF3FBF,FF4AB4,FF55AA,FF5F9F,FF6A94,FF748A,FF7F7F,FF8A74,FF946A,FF9F5F,FFAA55,'+
                   'FFB44A,FFBF3F,FFC935,FFD42A,FFDF1F,FFE915,FFF40A,FFFF00,FFFF00,FFFB00,FFF700,FFF300,FFF000,'+
                   'FFEC00,FFE800,FFE400,FFE100,FFDD00,FFD900,FFD500,FFD200,FFCE00,FFCA00,FFC600,FFC300,FFBF00,'+
                   'FFBB00,FFB700,FFB400,FFB000,FFAC00,FFA800,FFA500,FFA500,F7A400,F0A300,E8A200,E1A200,D9A100,'+
                   'D2A000,CA9F00,C39F00,BB9E00,B49D00,AC9C00,A59C00,9D9B00,969A00,8E9900,879900,7F9800,789700,'+
                   '709700,699600,619500,5A9400,529400,4B9300,439200,349100,2D9000,258F00,1E8E00,168E00,0F8D00,'+
                   '078C00,008C00,008C00,008700,008300,007F00,007A00,007600,007200,006E00,006900,006500,006100,'+
                   '005C00,005800,005400,005000,004C00',
            'water': palettes.get('classification2'),
            'Carbon': 'f90000, f0f900, 057709'
        },

        transitionsCodes: [{
                name: "1. Floresta",
                noChange: [1, 2, 3, 4, 5, 6, 7, 8],
                upVeg: [],
                downVeg: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
                downWater: [],
                upWater: [26, 33, 31],
                upPlantacao: [9],
                ignored: [27]
            },
            {
                name: "2. Formações Naturais não Florestais",
                noChange: [10, 11, 12, 13],
                upVeg: [],
                downVeg: [14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
                downWater: [],
                upWater: [26, 33, 31],
                upPlantacao: [9],
                ignored: [27, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                name: "3. Uso Agropecuário",
                noChange: [14, 15, 16, 17, 18, 19, 20, 21, 28],
                upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
                downVeg: [],
                downWater: [],
                upWater: [26, 31, 33],
                upPlantacao: [9],
                ignored: [27, 22, 23, 24, 25, 29, 30]
            },
            {
                name: "4.Áreas não vegetadas",
                noChange: [22, 23, 24, 25, 29, 30],
                upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
                downVeg: [],
                downWater: [],
                upWater: [26, 31, 33],
                upPlantacao: [9],
                ignored: [27, 14, 15, 18, 19, 20, 21, 28],
            },
            {
                name: "5. Corpos Dágua",
                noChange: [26, 31, 33],
                upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
                downVeg: [],
                downWater: [14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
                upWater: [],
                upPlantacao: [9],
                ignored: [27]
            },
            {
                name: "Plantacao Florestal",
                noChange: [9],
                upVeg: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 32],
                downVeg: [],
                downWater: [14, 15, 18, 19, 20, 21, 28, 22, 23, 24, 25, 29, 30],
                upWater: [26, 31, 33],
                upPlantacao: [],
                ignored: [27]
            },
            {
                name: "6. Não observado",
                noChange: [27],
                upVeg: [],
                downVeg: [],
                downWater: [],
                upWater: [],
                upPlantacao: [],
                ignored: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33]
            }
        ],

    },

    init: function () {

        this.ui.init();
        this.loadTables();
        this.loadImages();
        this.startMap();
    },

    //setVersion: function () {

        //App.ui.form.labelTitle.setValue('');  //'Arida User ' + App.options.version

    //},

    loadTables: function () {

        App.options.municipalities = ee.FeatureCollection(App.options.assets.municipalities);
        App.options.states = ee.FeatureCollection(App.options.assets.states);
        App.options.region = ee.FeatureCollection(App.options.assets.region);
        
        print("carregadas camadas:")
        print("region", App.options.region)
        print("estados", App.options.states)
        print("municipios", App.options.municipalities.size())
    },
    imagesExtras: function(type){
      
      var ColImgExp; 
      
      var myArr = ['Carbon', 'productivity'];
      
      var assetLand = ee.ImageCollection(App.options.assets.colArida)
                        .filterMetadata('biome', 'equals', 'CAATINGA')
      //print("ImgColl de Rodrigo", assetLand)
      
      if (type == myArr[0]){
        
        ColImgExp = assetLand.select(['max_evi2','max_pri'])
        
      }
      if (type == myArr[1]){
        
        ColImgExp = assetLand.select(['max_ndvi'])
        
      }
      
      return ColImgExp
    },

    loadImages: function () {
        var temporal = ee.Image(App.options.assets.integration);
        
        App.options.data.Coverage = temporal
        App.options.data.Transitions = ee.Image(App.options.assets.transitions);
        App.options.data.Carbon = App.imagesExtras('Carbon');
        App.options.data.productivity = App.imagesExtras('productivity');
        App.options.data.water = temporal
    },

    startMap: function () {

        Map.setCenter(-43.886, -10.766, 5);

    },

    formatName: function (name) {

        var formated = name
            .toLowerCase()
            .replace(/á/g, 'a')
            .replace(/à/g, 'a')
            .replace(/â/g, 'a')
            .replace(/ã/g, 'a')
            .replace(/ä/g, 'a')
            .replace(/ª/g, 'a')
            .replace(/é/g, 'e')
            .replace(/ê/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ô/g, 'o')
            .replace(/õ/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/ñ/g, 'n')
            .replace(/&/g, '')
            .replace(/@/g, '')
            .replace(/ /g, '');

        return formated;
    },

    remapTransitions: function (image) {
        var oldValues = [];
        var newValues = [];

        App.options.transitionsCodes.forEach(function (c1) {
            c1.noChange.forEach(function (noChange1) {
                c1.noChange.forEach(function (noChange2) {
                    var oldValue = (noChange1 * 100) + noChange2;
                    oldValues.push(oldValue);
                    newValues.push(0);
                });
                c1.upVeg.forEach(function (upVeg2) {
                    var oldValue = (noChange1 * 100) + upVeg2;
                    oldValues.push(oldValue);
                    newValues.push(1);
                });
                c1.downVeg.forEach(function (downVeg2) {
                    var oldValue = (noChange1 * 100) + downVeg2;
                    oldValues.push(oldValue);
                    newValues.push(-1);
                });
                c1.downWater.forEach(function (downWater2) {
                    var oldValue = (noChange1 * 100) + downWater2;
                    oldValues.push(oldValue);
                    newValues.push(-2);
                });
                c1.upWater.forEach(function (upWater2) {
                    var oldValue = (noChange1 * 100) + upWater2;
                    oldValues.push(oldValue);
                    newValues.push(2);
                });
                c1.upPlantacao.forEach(function (upPlantacao2) {
                    var oldValue = (noChange1 * 100) + upPlantacao2;
                    oldValues.push(oldValue);
                    newValues.push(3);
                });
                c1.ignored.forEach(function (ignored2) {
                    var oldValue = (noChange1 * 100) + ignored2;
                    oldValues.push(oldValue);
                    newValues.push(0);
                });
            });
        });

        return image.remap(oldValues, newValues).rename(image.bandNames());
    },

    ui: {

        init: function () {

            this.form.init();

        },

        setDataType: function (dataType) {

            App.options.dataType = dataType;

        },

        // loadBiomesList: function (biome) {

        //     App.ui.makeLayersList(biome, App.options.activeFeature, App.options.periods[App.options.dataType]);

        // },

        loadStatesList: function (biome) {

            App.ui.form.selectState.setPlaceholder('loading names...');

            ee.List(App.options.states.filterBounds(App.options.region.geometry())
                    .reduceColumns(ee.Reducer.toList(), ['CD_GEOCUF'])
                    .get('list'))
                .sort()
                .evaluate(
                    function (statesList, errorMsg) {

                        var filtered = Object.keys(App.options.statesNames)
                            .filter(
                                function (state) {
                                    return statesList.indexOf(App.options.statesNames[state]) != -1;
                                }
                            );
                        print(filtered);

                        App.ui.form.selectState = ui.Select({
                            'items': ['None'].concat(filtered),
                            'placeholder': 'select state',
                            'onChange': function (state) {
                                if (state != 'None') {
                                    App.options.activeName = state;

                                    App.ui.loadState(state);
                                    App.ui.loadMunicipalitiesList(App.options.statesNames[state]);
                                    App.ui.makeLayersList(state, App.options.activeFeature, App.options.periods[App.options.dataType]);
                                    App.ui.form.selectDataType.setDisabled(false);
                                }
                            },
                            'style': {
                                'stretch': 'horizontal'
                            }
                        });

                        App.ui.form.panelState.widgets()
                            .set(1, App.ui.form.selectState);

                    }
                );

        },

        loadMunicipalitiesList: function (state) {

            App.ui.form.selectMunicipalitie.setPlaceholder('loading names...');

            ee.List(App.options.municipalities
                    .filterMetadata('UF', 'equals', parseInt(state, 10))
                    .reduceColumns(ee.Reducer.toList(), ['NM_MUNICIP'])
                    .get('list'))
                .sort()
                .evaluate(
                    function (municipalities, errorMsg) {

                        App.options.municipalitiesNames = municipalities;

                        App.ui.form.selectMunicipalitie = ui.Select({
                            'items': ['None'].concat(App.options.municipalitiesNames),
                            'placeholder': 'select municipalitie',
                            'onChange': function (municipalitie) {
                                if (municipalitie != 'None') {
                                    App.options.activeName = municipalitie;

                                    App.ui.loadMunicipalitie(municipalitie);
                                    App.ui.makeLayersList(municipalitie, App.options.activeFeature,
                                        App.options.periods[App.options.dataType]);
                                }

                            },
                            'style': {
                                'stretch': 'horizontal'
                            }
                        });

                        App.ui.form.panelMunicipalities.widgets()
                            .set(1, App.ui.form.selectMunicipalitie);

                    }
                );

        },

        loadRegion: function (regionA) {

            App.options.activeFeature = App.options.region
                       //.filterMetadata('name', 'equals', String(App.options.biomesNames[biome]));
            
            print("region activa", App.options.activeFeature);
            
            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.addLayer(ee.Image().byte().paint(App.options.activeFeature, 1, 3), 
                {
                    'palette': 'ffffff,ff0000',
                    'min': 0,
                    'max': 1
                },
                regionA + ' boundary',
                true);
        },
        
        loadState: function (state) {

            App.options.activeFeature = App.options.states
                .filterMetadata('CD_GEOCUF', 'equals', String(App.options.statesNames[state]));

            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.addLayer(ee.Image().byte().paint(App.options.activeFeature, 1, 3), {
                    'palette': 'ffffff,ff0000',
                    'min': 0,
                    'max': 1
                },
                state + ' boundary',
                true);

        },

        loadMunicipalitie: function (municipalitie) {

            var uf = App.options.statesNames[App.ui.form.selectState.getValue()];

            App.options.activeFeature = App.options.municipalities
                .filterMetadata('NM_MUNICIP', 'equals', municipalitie)
                .filterMetadata('UF', 'equals', parseInt(uf, 10));

            Map.clear();

            Map.addLayer(ee.Image().byte().paint(App.options.activeFeature, 1, 3), {
                    'palette': 'ffffff,ff0000',
                    'min': 0,
                    'max': 1
                },
                municipalitie + ' boundary',
                true);

            Map.centerObject(App.options.activeFeature);

        },

        addImageLayer: function (period, label, region) {
            
            var image;
            
            if (App.options.dataType == 'Coverage') {
                image = App.options.data[App.options.dataType]
                          .select([App.options.bandsNames[App.options.dataType] + period])
                          .clip(region);
            }
            
            if (App.options.dataType == 'Transitions') {
                image = App.remapTransitions(image).clip(region);
            }
            
            if (App.options.dataType == 'Carbon') {
                //print("entrou", App.options.dataType)
                //print(App.options.data[App.options.dataType])
                var collection = App.options.data[App.options.dataType]
                                .filterMetadata('year','equals', parseInt(period)).mosaic()
                
                //Calcula o CO2flux
                image = ee.Image(collection).normalizedDifference(['max_evi2','max_pri']).clip(region);
                image = image.add(1).multiply(100);
            }
            
            if (App.options.dataType == 'productivity') {
              
                var coll = App.options.data[App.options.dataType]
                                .filterMetadata('year','equals', parseInt(period)).mosaic()
                
                //Carregou o NDVImax
                image = ee.Image(coll).clip(region);
            }
            
            if (App.options.dataType == 'water') {
              //print("estou en addImageLayer")
              //print(period)
              //print(App.options.dataType)
              //print(App.options.data[App.options.dataType])
                var mapaAgua = App.options.data[App.options.dataType]
                          .select([App.options.bandsNames[App.options.dataType] + period]);
                          //.clip(region);
                print(mapaAgua)
                //Remapear Agua
                image = ee.Image(mapaAgua)//.remap([33],[33],27);
                image = image.mask(image.eq(33)).clip(region);
            }
            
            var imageLayer = ui.Map.Layer({
                'eeObject': image,
                'visParams': {
                    'palette': App.options.palette[App.options.dataType],
                    'min': App.options.ranges[App.options.dataType].min,
                    'max': App.options.ranges[App.options.dataType].max,
                    'format': 'png'
                },
                'name': label,
                'shown': true,
                'opacity': 1.0
            });

            Map.layers().insert(
                Map.layers().length() - 1,
                imageLayer
            );

        },

        removeImageLayer: function (label) {

            for (var i = 0; i < Map.layers().length(); i++) {

                var layer = Map.layers().get(i);

                if (label === layer.get('name')) {
                    Map.remove(layer);
                }
            }

        },

        manageLayers: function (checked, period, label, region) {

            if (checked) {
                App.ui.addImageLayer(period, label, region);
            } else {
                App.ui.removeImageLayer(label);
            }
        },

        makeLayersList: function (regionName, region, periods) {
              //App.options.activeName, App.options.activeFeature, App.options.periods[dataType]
            App.ui.form.panelLayersList.clear();

            periods.forEach(
                function (period, index, array) {
                    App.ui.form.panelLayersList.add(
                        
                        ui.Checkbox({
                            "label": regionName + ' ' + period,
                            "value": false,
                            "onChange": function (checked) {
                                App.ui.manageLayers(checked, period, regionName + ' ' + period, region);
                            },
                            "disabled": false,
                            "style": {
                                'padding': '2px',
                                'stretch': 'horizontal',
                                'backgroundColor': '#dddddd',
                                'fontSize': '12px'
                            }
                        })
                    );

                }
            );

        },

        export2Drive: function () {

            var layers = App.ui.form.panelLayersList.widgets();

            for (var i = 0; i < layers.length(); i++) {

                var selected = layers.get(i).getValue();

                if (selected) {

                    var period = App.options.periods[App.options.dataType][i];
                    var municName = App.formatName(App.ui.form.selectMunicipalitie.getValue() || '');
                    var stateName = App.formatName(App.ui.form.selectState.getValue() || '');
                    var regionName = App.formatName(App.ui.form.selectRegionA.getValue() || '');

                    var fileName = 'mapbiomas-' + regionName + '-' + stateName + '-' + municName + '-' + period;

                    fileName = fileName.replace(/--/g, '-').replace(/--/g, '-');

                    Export.image.toDrive({
                        image: App.options.data[App.options.dataType]
                            .select([App.options.bandsNames[App.options.dataType] + period])
                            .clip(App.options.activeFeature),
                        description: fileName,
                        folder: 'MAPBIOMAS-EXPORT',
                        fileNamePrefix: fileName,
                        region: App.options.activeFeature.geometry().bounds(),
                        scale: 30,
                        maxPixels: 1e13,
                        skipEmptyTiles: true,
                        fileDimensions: 256 * 512,
                    });
                }
            }
        },

        form: {

            init: function () {

                this.panelMain.add(this.panelLogo);
                //this.panelMain.add(this.labelTitle);

                this.panelLogo.add(App.options.logo);
                this.panelRegionA.add(this.labelRegionA);
                this.panelRegionA.add(this.selectRegionA);

                this.panelState.add(this.labelState);
                this.panelState.add(this.selectState);

                this.panelMunicipalities.add(this.labelMunicipalitie);
                this.panelMunicipalities.add(this.selectMunicipalitie);

                this.panelDataType.add(this.labelDataType);
                this.panelDataType.add(this.selectDataType);

                this.panelMain.add(this.panelRegionA);
                this.panelMain.add(this.panelState);
                this.panelMain.add(this.panelMunicipalities);
                this.panelMain.add(this.panelDataType);

                this.panelMain.add(this.labelLayers);
                this.panelMain.add(this.panelLayersList);

                this.panelMain.add(this.buttonExport2Drive);
                this.panelMain.add(this.labelNotes);

                ui.root.add(this.panelMain);
            },

            panelMain: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '360px',
                    'position': 'bottom-left',
                    'margin': '0px 0px 0px 0px',
                },
            }),

            panelLogo: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'margin': '0px 0px 0px 20px',
                },
            }),

            panelRegionA: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelState: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelMunicipalities: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelDataType: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelLayersList: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'height': '300px',
                    'stretch': 'vertical',
                    'backgroundColor': '#cccccc',
                },
            }),
            /*
            labelTitle: ui.Label('Arida User', {
                'fontWeight': 'bold',
                'padding': '1px',
                'fontSize': '16px'
            }),
            */
            labelRegionA: ui.Label('Area interventions:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelState: ui.Label('State:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelMunicipalitie: ui.Label('Municipalities:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelDataType: ui.Label('Data Type:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelLayers: ui.Label('Layers: Years', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelNotes: ui.Label('Go to Task tab to run the export task.', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            selectRegionA: ui.Select({
                'items': [
                    'None', 'Area interventions'
                ],
                'placeholder': 'select Area',
                'onChange': function (reg) {
                    if (reg != 'None') {

                        App.options.activeName = reg;

                        App.ui.loadRegion(reg);
                        
                        App.ui.loadStatesList(reg);
                        
                        App.ui.makeLayersList(reg, App.options.activeFeature, App.options.periods[App.options.dataType]);
                        
                        // App.ui.loadMunicipalitiesList(App.options.statesNames[state]);
                        App.ui.form.selectDataType.setDisabled(false);
                    }
                },
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectState: ui.Select({
                'items': [
                    'None', 'Alagoas', 'Bahia',
                    'Ceará', 'Espírito Santo','Maranhão',
                    'Minas Gerais', 'Paraíba',
                    'Pernambuco', 'Piauí', 'Rio Grande do Norte',
                    'Sergipe'
                    
                ],
                'placeholder': 'select state',
                'onChange': function (state) {
                    if (state != 'None') {
                        App.options.activeName = state;

                        App.ui.loadState(state);
                        // App.ui.loadStatesList(state);
                        App.ui.loadMunicipalitiesList(App.options.statesNames[state]);
                        App.ui.makeLayersList(state, App.options.activeFeature, App.options.periods[App.options.dataType]);
                        App.ui.form.selectDataType.setDisabled(false);
                    }
                },
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectMunicipalitie: ui.Select({
                'items': [],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectDataType: ui.Select({
                'items': ['Coverage', 'Transitions','Carbon','productivity','water'],
                'placeholder': 'Coverage',
                'style': {
                    'stretch': 'horizontal'
                },
                'disabled': true,
                'onChange': function (dataType) {
                  
                    App.ui.setDataType(dataType); // Mudar
                    print("camadas")
                    print(App.options.activeFeature)
                    print(App.options.activeName)
                    print(App.options.periods[dataType])
                    App.ui.makeLayersList(App.options.activeName, App.options.activeFeature, App.options.periods[dataType]);

                },
            }),

            buttonExport2Drive: ui.Button({
                "label": "Export images to Google Drive",
                "onClick": function () {
                    App.ui.export2Drive();
                },
                "disabled": false,
                "style": {
                    'padding': '2px',
                    'stretch': 'horizontal'
                }
            }),

        },
    }
};

App.init();

//App.setVersion();