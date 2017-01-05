;angular.module('SeanApp')
.controller('DashboardController',['$rootScope', '$scope','$http', '$timeout','$interval', function($rootScope, $scope, $http, $timeout,$interval) {
    $scope.$on('$viewContentLoaded', function() {


        var timer = $interval(function(){

            if($rootScope.threeReady && $rootScope.license){
                for(var i=0;i<$rootScope.license.length;i++){
                    if($rootScope.license[i].url && $rootScope.license[i].url.indexOf('lab')>-1){
                        
                        var id = $rootScope.license[i].url.split('#/lab/')[1];
                        for(var j=0;j<fieldJson.objects.length;j++){

                            if(fieldJson.objects[j].client && fieldJson.objects[j].client.id == id && $rootScope.license[i].url.indexOf('lab')>-1){
                                
                                //  console.log(fieldJson.objects[j].client.name);
                                fieldJson.objects[j].client.validateLicense = true;
                                // fieldJson.objects[j].sideColor =  '#759bc2';
                                // fieldJson.objects[j].topColor = '#759bc2';
                                fieldJson.objects[j].client['m.envmap.image'] =  ['./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png'];
                            }
                        }
                    }
                }

                // var position = {
                //     w:1000,
                //     h:1000,
                //     d:2000
                // };
                // var tooltip = new Tooltip(['试验室名：'],['000000']);
                // demo.init('3d_view',fieldJson,0,0,position,tooltip);

                demo.Default.setupRoomFiled("3d_view");
                $interval.cancel(timer);
            }else if($rootScope.settings.mode !="server"){
                 
                for(var j=0;j<fieldJson.objects.length;j++){

                    if(fieldJson.objects[j].client){
                        fieldJson.objects[j].client.validateLicense = true;
                        fieldJson.objects[j].sideColor =  '#ff6b02';
                        fieldJson.objects[j].topColor = '#ff6b02';
                        fieldJson.objects[j].client['m.envmap.image'] =  ['./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png','./js/3d/eim/images/sky.png'];
                    }
                }

                demo.Default.setupRoomFiled("3d_view");
                $interval.cancel(timer);
                
            }else{
                console.log('not ready or no license')
            }

        },1000);
        
        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = true;
    $rootScope.settings.layout.setLabButton = false;
    $rootScope.settings.layout.setDeviceButton = false;

    
    // SUCCESS
    // $http.post($rootScope.settings.apiPath+"/experipage/getHoverContent",{equipNo:'MTS01'})
    // .success(function(json){
    //     console.log(json);
    // });

    //indexName: startRate/intactRate/utilizRate/durautilizRate/efficiencyCoeff
    // $http.post($rootScope.settings.apiPath+"/experipage/getExperiIndex",{equipNo:'MTS01',indexName:'startRate'})
    // .success(function(json){
    //     console.log(json);
    // });


}]);