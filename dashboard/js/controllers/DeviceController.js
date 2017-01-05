;angular.module('SeanApp')

.controller('MTSController', ['commService','$rootScope', '$scope', '$http', '$timeout','$state','$filter', function(commService,$rootScope, $scope, $http, $timeout,$state,$filter) {

    //渲染时序
    $scope.renderEquipTimeStatus = function(equipState,equipTime){
        var equipData = [];
        for(var i=0;i<equipTime.length;i++){
            equipData.push([equipTime[i],   equipState[i]]);
        }

        var StateOption = {
            grid:{
                x:40,
                y:43,
                x2:20,
                y2:76
            },
            tooltip: {
                
                formatter:function(a,b,c,d){
                    var date = $filter('date')(new Date(a.value[0]), 'yyyy/MM/dd hh:mm:ss');
                    var status = parseInt(a.value[1])==1?"运行":"停止";
                    return date+" "+status;
                }
            },
            dataZoom:[
                {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '60%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    textStyle:{
                        color:'#fff'
                    }
                }
            ],
            calculable: true,
            xAxis: [{
                type: 'time',
                boundaryGap: true,//??
                splitLine:{ 
                    show:false
                },
                axisLabel: {
                    textStyle:{
                        color:'#fff'
                    }
                }
            }],
            yAxis: [{
                max:1,
                type: 'value',
                splitLine:{ 
                    show:false
                },
                axisLabel: {
                    formatter: function(a){
                        return a==1?"运行":"停止";
                    },

                    textStyle:{
                        color:'#fff'
                    }
                },
                splitNumber: 1
            }],
            series: [{
                name: '状态',
                type: 'line',
                step: 'start',
                smooth:false,
                areaStyle: {
                    normal: {
                        color:'#A6E528'
                    }
                },
                lineStyle: {
                    normal: {
                        color:'#A6E528'
                    }
                },
                data: equipData
            }]
        };

        var myChart = echarts.init(document.getElementById('TimeStatus'),theme);
        myChart.setOption(StateOption);
    }
    //RPC表格初始化
    $scope.$on('ngRepeatFinished2', function(repeatFinishedEvent, element) {
        console.log('ngRepeatFinished2');
        $("#rpc").removeClass("hide");
        var warningMTSConfig = {

            "bStateSave": false,
            "orderable": false,
            "autoWidth": false,
        "aoColumns": [
              {
                  sWidth: '80px'
              },{
                  sWidth: '100px'
              },{
                  sWidth: '60px'
              },{
                  sWidth: '40px'
              },{
                sWidth: '40px'
              }
        ],
        "pagingType":'bootstrap_full_number2',
        "bProcessing": true,
        "bLengthChange":false,
        "searching":false,
        "lengthMenu": [
            [5, 10, 10, -1],
            [5, 10, 10, "All"] // change per page values here
        ],
        "columnDefs": [{  // set default column settings
                'width':'20%',
                'orderable': false,
                "targets":0
            }, {
                'width':'40%',
                "searchable": false,
                "targets":0
            }, {
                'width':'20%',
                "searchable": false,
                "targets":0
            }, {
                'width':'10%',
                "searchable": false,
                "targets":0
            }, {
                'width':'10%',
                "searchable": false,
                "targets":0
            }],
            "order": [
                [0, "desc"]
            ]
        };

        $.extend($rootScope.tableConfig,warningMTSConfig);

        // if(typeof $scope.rpcTable != "undefined"){
        //     $scope.rpcTable.Rows.Clear();
        //     // $("#station").DataTable().destroy();
        // }

                    
        $scope.rpcTable = $("#rpc").DataTable($rootScope.tableConfig);
    });

    $scope.$on('ngRepeatFinished', function(repeatFinishedEvent, element) {
        console.log('ngRepeatFinished');

        // $('input').uniform();
        $("#station").removeClass("hide");

        var warningMTSConfig = {
            "bStateSave": false,
            "orderable": false,
            "autoWidth": false,
            "autoWidth": false,
        "pagingType":'bootstrap_full_number2',
        "bProcessing": true,
        "bLengthChange":false,
        "searching":false,
        "aoColumns": [
              {
                  sWidth: '150px'
              },{
                  sWidth: '200px'
              }
        ],
        "lengthMenu": [
            [5, 10, 15, -1],
            [5, 10, 15, "All"] // change per page values here
        ],
        "columnDefs": [{  // set default column settings
                'orderable': false,
                "targets": [0,1]
            }, {
                "searchable": false,
                "targets": [0,1]
            }],
        "order": [
            [0, "desc"]
        ]
        };

        $.extend($rootScope.tableConfig,warningMTSConfig);

        // if(typeof $scope.stationTable != "undefined"){
        //     $scope.stationTable.Rows.Clear();
        //     // $("#station").DataTable().destroy();
        // }

        $scope.stationTable = $("#station").DataTable(warningMTSConfig);  
    });
    //mptWarning表格初始化
    $scope.$on('ngRepeatFinished3', function(repeatFinishedEvent, element) {

        var $mptWarning=$("#mpt-warning");
        //$mpt.removeClass("hide");
        var warningMTSConfig = {

            "bStateSave": false,
            "orderable": false,
            "autoWidth": false,
            "aoColumns": [
                {
                    sWidth: '90px'
                },{
                    sWidth: '60px'
                },{
                    sWidth: '30px'
                },{
                    sWidth: '60px'
                }
            ],
            "pagingType":'bootstrap_full_number2',
            "bProcessing": true,
            "bLengthChange":false,
            "searching":false,
            "lengthMenu": [
                [5, 10, 10, -1],
                [5, 10, 10, "All"] // change per page values here
            ],
            "columnDefs": [{  // set default column settings
                'width':'20%',
                'orderable': false,
                "targets":0
            }, {
                'width':'40%',
                "searchable": false,
                "targets":0
            }, {
                'width':'20%',
                "searchable": false,
                "targets":0
            }, {
                'width':'10%',
                "searchable": false,
                "targets":0
            }],
            "order": [
                [0, "desc"]
            ]
        };

        $.extend($rootScope.tableConfig,warningMTSConfig);

        // if(typeof $scope.rpcTable != "undefined"){
        //     $scope.rpcTable.Rows.Clear();
        //     // $("#station").DataTable().destroy();
        // }


        $scope.mptWarningTable = $mptWarning.DataTable($rootScope.tableConfig);
    });
    //mptNormal表格初始化
    $scope.$on('ngRepeatFinished4', function(repeatFinishedEvent, element) {

        var $mptNormal=$("#mpt-normal");
        //$mpt.removeClass("hide");
        var warningMTSConfig = {

            "bStateSave": false,
            "orderable": false,
            "autoWidth": false,
            "aoColumns": [
                {
                    sWidth: '90px'
                },{
                    sWidth: '60px'
                },{
                    sWidth: '30px'
                },{
                    sWidth: '60px'
                }
            ],
            "pagingType":'bootstrap_full_number2',
            "bProcessing": true,
            "bLengthChange":false,
            "searching":false,
            "lengthMenu": [
                [5, 10, 10, -1],
                [5, 10, 10, "All"] // change per page values here
            ],
            "columnDefs": [{  // set default column settings
                'width':'20%',
                'orderable': false,
                "targets":0
            }, {
                'width':'40%',
                "searchable": false,
                "targets":0
            }, {
                'width':'20%',
                "searchable": false,
                "targets":0
            }, {
                'width':'10%',
                "searchable": false,
                "targets":0
            }],
            "order": [
                [0, "desc"]
            ]
        };

        $.extend($rootScope.tableConfig,warningMTSConfig);

        // if(typeof $scope.rpcTable != "undefined"){
        //     $scope.rpcTable.Rows.Clear();
        //     // $("#station").DataTable().destroy();
        // }


        $scope.mptNormalTable = $mptNormal.DataTable($rootScope.tableConfig);
    });
    $scope.$on('$viewContentLoaded', function() {   
        $(".btn-group button").click(function(){
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
        })

        var agilentOption = {
                grid:{
                    x:40,
                    y:43,
                    x2:20,
                    y2:76
                },
                tooltip: {
                    trigger: 'axis'
                    ,
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                dataZoom:[
                    {
                        start: 0,
                        end: 100,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '60%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                        textStyle:{
                            color:'#fff'
                        }
                    }
                ],
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    splitLine:{ 
                        show:false
                    },
                    data: ['', '', '', '', '', '', ''],
                    axisLabel: {
                        textStyle:{
                            color:'#fff'
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine:{ 
                        show:false
                    },
                    axisLabel: {
                        formatter: '{value} °C',

                        textStyle:{
                            color:'#fff'
                        }
                    }
                }],
                series: []
        };
        var agilent = echarts.init(document.getElementById('bar2'),theme);
        agilent.setOption(agilentOption);


        $("#hoverBtn").on("hide.bs.dropdown",function(){
            $scope.chShowList=[];
            $scope.request=[];
            agilentOption.series=[{
                name: '',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0]

            }];
            $("#CHList input[type=checkbox]").each(function(i,e){
                
                if($(this).is(":checked")){
                    var id=$(this).attr("data-id");
                    $scope.chShowList.push(id);
                    $scope.request.push(id);


                }
            });

            //agilent温度
            var api = $rootScope.settings.apiPath + "/equippage/getAgilentTemp";
            var request = {channelCode:$scope.request};


            $http.post(api,request)
            .success(function(response){
                //TODO 改list
                $scope.chShowList=$scope.agilentTemp = response;

                //agilent温度
                var api = $rootScope.settings.apiPath + "/equippage/getAgilentTime";
                // var request = {channelCode:$scope.request};
                console.log($scope.agilentTemp )
                $http.post(api,request)
                .success(function(response){
                    
                    var series = [];
                    var xAxis = [];
                    //TODO 改list

                    $scope.agilentTime=response;

                    if(response.length==0||response[0].agilentTemp.length==0){
                        for(var i=0;i<response.length;i++){
                            response[i].agilentTemp=[0,0,0,0,0,0,0,0];
                            response[i].agilentTime=[" ", " ", " ", " ", " ", "", " "];
                        }
                    }

                    // agilent = echarts.init(document.getElementById('bar2'));
                    // agilent.setOption(agilentOption);
                    //点击温度更新图表

                    agilentOption.series=[];
                    agilentOption.xAxis[0].data=[];

                    if(response.length!=0&&response[0].agilentTemp.length!=0){
                        for(var i=0;i<response.length;i++){
                            for(var j= 0,len=response[i].agilentTime.length;j<len;j++){
                                if(response[i].agilentTime[j]!=null){
                                    response[i].agilentTime[j]=commService.getTime({time:response[i].agilentTime[j],rule:'MM-dd hh:mm:ss'});
                                }
                            }

                            agilentOption.series.push({
                                name: 'CH'+response[i].channelCode,
                                type: 'line',
                                data: response[i].agilentTemp.reverse()
                            });
                            agilentOption.xAxis[0].data=response[i].agilentTime.reverse();

                        }
                        agilentOption.xAxis[0].data;
                        agilent.setOption(agilentOption);
                    }
                });

            })
        })


        var chartReady4={};
        window.onresize=function(){
            clearTimeout(chartReady4.timer);
            chartReady4.timer=setTimeout(function(){
                var json = $scope.getEquipTimeStatus;
                $scope.renderEquipTimeStatus(json.equipState,json.equipTime);

                agilent = echarts.init(document.getElementById('bar2'),theme);
                agilent.setOption(agilentOption);
            },100)
        }
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = false;
    $rootScope.settings.layout.setFullscreen = false;
    $rootScope.settings.layout.setDeviceButton = true;
    $rootScope.settings.layout.setLabButton = false;


    $scope.deviceType = $state.current.name;
    $scope.deviceId = $state.params.id;

    $scope.chList = [];
    $scope.chShowList = [];
    for(var ch=103;ch<123;ch++){
        $scope.chList.push(ch);
    }

    // $rootScope.deviceName = $state.params.id;
    //设备菜单
    var url = "/equippage/getMainEquipMenu";
    var data = {equipType:"MTS"};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        
        $rootScope.equipMenu = json;
        for(var i=0;i<json.length;i++){
            if(json[i].equipNo == $state.params.id){
                $rootScope.deviceName = json[i].equipName;
            }
        }

    });

    //获取设备状态
    var url = "/experipage/getEquipState";
    var data = {equipNo:$state.params.id,equipType:$state.current.name};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json) {

        $scope.statusInfo = {
            "0":{
                name:"停止",
                color:'#DA7C19'
            },
            "1":{
                name:"运行",
                color:'#31A82C'
            },
            "2":{
                name:"故障",
                color:'#e35b5a'
            },
            "3":{
                name:"空闲",
                color:'#dddddd'
            },
            "4":{
                name:"占位",
                color:'#e35b5a'
            },
        };
        var status=0;
        $rootScope.getMainExperiMenu = json;
        for(var i=0;len=json.length;i++){
            if(json[i].equipNo===$state.params.id){
                status=json[i].status;break;
            }
        }
        $scope.statusText=$scope.statusInfo[status].name;
        $scope.statusColor={color:$scope.statusInfo[status].color};
    });


    $scope.getWarnning = function(param,type){

        var type = type || "normal";
        if(param=="RPC"){
            var url = "/equippage/getWarnningRPC";
            var data = {equipNo:$state.params.id};
            $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
                if(typeof $scope.rpcTable != "undefined"){
                    $scope.rpcTable.destroy();
                }
                $scope.RPC.data= json;
            });
        }else if(param=="MPT"&& type=="warning"){
            var url = "/equippage/getWarnningMTS";
            var data = {equipNo:$state.params.id,equipType:"MPT",statusType:'warning'};
            $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){

                //console.log($scope.rpcTable,json)
                if(typeof $scope.mptWarningTable != "undefined"){
                    $scope.mptWarningTable.destroy();
                    // $("#rpc").destroy();
                }

                $scope.mptWarning.data = json;

            });
        }else if(param=="MPT"&& type=="normal"){
            var url = "/equippage/getWarnningMTS";
            var data = {equipNo:$state.params.id,equipType:"MPT",statusType:'normal'};
            $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){

                //console.log($scope.rpcTable,json)
                if(typeof $scope.mptNormalTable != "undefined"){
                    $scope.mptNormalTable.destroy();
                    // $("#rpc").destroy();
                }

                $scope.mptNormal.data = json;

            });
        }else if(param=="Station"){
            var url = "/equippage/getWarnningMTS";
            var data = {equipNo:$state.params.id,equipType:"Station",statusType:type};
            $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
                //console.log(1,json)
                if(typeof $scope.stationTable != "undefined"){
                    $scope.stationTable.destroy();
                    // $("#rpc").destroy();
                }

                $scope.station = json;

            });
        }
        /*switch(param){
            case "RPC":
                //log
                var url = "/equippage/getWarnningRPC";
                var data = {equipNo:$state.params.id};
                $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
                    if(typeof $scope.rpcTable != "undefined"){
                        $scope.rpcTable.destroy();
                    }
                    $scope.RPC.data= json;
                });
            break;
            case "Station":

                var url = "/equippage/getWarnningMTS";
                var data = {equipNo:$state.params.id,equipType:"Station",statusType:type};
                $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
                    //console.log(1,json)
                     if(typeof $scope.stationTable != "undefined"){
                         $scope.stationTable.destroy();
                         // $("#rpc").destroy();
                     }

                    $scope.station = json;

                });

            break;
            case "MPT":
                //log
                var url = "/equippage/getWarnningMTS";
                var data = {equipNo:$state.params.id,equipType:"MPT",statusType:type};
                $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
             
                    //console.log($scope.rpcTable,json)
                    if(typeof $scope.rpcTable != "undefined"){
                        $scope.rpcTable.destroy();
                        // $("#rpc").destroy();
                    }

                    $scope.MPT.data = json;

                });

            break;
        }*/

    }

    $scope.getWarnning("Station","warning");
    $scope.getWarnning("RPC");
    $scope.getWarnning("MPT");
    $scope.getWarnning("MPT",'warning');
    var RPCData=[{
        channel:"RF Brake Force  XDCR",
        currentValue: 0.845445,
        equipNo: "PEC0-01991",
        limitValue: -0.35723,
        seq:null,
        sequence: "rro_4_withouttwist_nobrake_5_DRV_RSP",
        time:0}];
    var mptWarningData=[{
        equipNo: "mptWarningData",
        level: "4",
        msg: "Undefined Controlling Application.",
        time: 1471269693000}];
    var mptNormalData=[{
        equipNo: "mptNormalData",
        level: "6",
        msg: "Undefined Controlling Application.",
        time: 1471269693000}];
    //一开始就加载，非点击才加载

    $scope.RPC={};//RPC==1 show,RPC==0 hide;
    $scope.MPT={};
    $scope.mptWarning={};
    $scope.mptNormal={};
    $scope.showWarnningData=function(param,type){
        $scope.RPC.show=0;
        $scope.MPT.show=0;
        $scope.mptNormal.show=0;
        $scope.mptWarning.show=0;
        var type = type || "normal";
        if(param=="RPC"){
            $scope.RPC.show=1;
            //$scope.RPC.data=RPCData;
        }else if(param=="MPT"&& type=="warning"){
            $scope.MPT.show=1;
            $scope.mptWarning.show=1;
            //$scope.mptWarning.data=mptWarningData;
        }else if(param=="MPT"&& type=="normal"){
            $scope.MPT.show=1;
            $scope.mptNormal.show=1;
            //$scope.mptNormal.data=mptNormalData;
        }
    }
    $scope.showWarnningData("RPC");
    //时序
    url = "/equippage/getEquipTimeStatus";
    data = {equipNo:$state.params.id,equipType:$state.current.name};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        $scope.getEquipTimeStatus = json;
        $scope.renderEquipTimeStatus(json.equipState,json.equipTime);

    });
}])

.controller('HPUController', ['$rootScope', '$scope', '$http', '$timeout','$state',function($rootScope, $scope, $http, $timeout,$state) {
    $scope.$on('$viewContentLoaded', function() {   
        // 指定图表的配置项和数据
        var option = {
                title: {
                    text: 'Weekly Weather',
                    subtext: 'Lorem ipsum'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['High', 'Low']
                },
                
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C',
                        textStyle:{
                            color:'#fff'
                        }
                    }
                }],
                series: [{
                    name: 'High',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [{
                            type: 'max',
                            name: 'Max'
                        }, {
                            type: 'min',
                            name: 'Min'
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: 'Mean'
                        }]
                    }
                }, {
                    name: 'Low',
                    type: 'line',
                    data: [1, -2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [{
                            name: 'Lowest',
                            value: -2,
                            xAxis: 1,
                            yAxis: -1.5
                        }]
                    },
                    markLine: {
                        data: [{
                            type: 'average',
                            name: 'Mean'
                        }]
                    }
                }]
            };

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('bar1'),theme);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

         var barReady2={};
         $(window).resize(function(){
             clearTimeout(barReady2.timer);
             barReady2.timer=setTimeout(function(){
                 var myChart = echarts.init(document.getElementById('bar1'),theme);
                 myChart.setOption(option);

                 var json = $scope.getEquipTimeStatus;
                 $scope.renderEquipTimeStatus(json.equipState,json.equipTime);

                 renderChart("bar3",$scope.timeOptionWater);
                 renderChart("bar4",$scope.timeOptionOil);
             },100);
        });

    });

    var renderChart = function(selector,option){
        var myChart = echarts.init(document.getElementById(selector),theme);
        myChart.setOption(option);
    }

    //渲染时序
    $scope.renderEquipTimeStatus = function(equipState,equipTime){
        var equipData = [];
        for(var i=0;i<equipTime.length;i++){
            equipData.push([equipTime[i],   equipState[i]]);
        }

        var StateOption = {
            grid:{
                x:40,
                y:43,
                x2:20,
                y2:76
            },
            tooltip: {
                
                formatter:function(a,b,c,d){
                    var date = $filter('date')(new Date(a.value[0]), 'yyyy/MM/dd hh:mm:ss');
                    var status = parseInt(a.value[1])==1?"运行":"停止";
                    return date+" "+status;
                }
            },
            dataZoom:[
                {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '60%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    textStyle:{
                        color:'#fff'
                    }
                }
            ],
            calculable: true,
            xAxis: [{
                type: 'time',
                boundaryGap: true,//??
                splitLine:{ 
                    show:false
                },
                axisLabel: {
                    textStyle:{
                        color:'#fff'
                    }
                }
            }],
            yAxis: [{
                max:1,
                type: 'value',
                splitLine:{ 
                    show:false
                },
                axisLabel: {
                    formatter: function(a){
                        return a==1?"运行":"停止";
                    },

                    textStyle:{
                        color:'#fff'
                    }
                },
                splitNumber: 1
            }],
            series: [{
                name: '状态',
                type: 'line',
                step: 'start',
                smooth:false,
                areaStyle: {
                    normal: {
                        color:'#A6E528'
                    }
                },
                data: equipData
            }]
        };

        var myChart = echarts.init(document.getElementById('TimeStatus'),theme);
        myChart.setOption(StateOption);
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = false;
    $rootScope.settings.layout.setFullscreen = false;
    $rootScope.settings.layout.setDeviceButton = true;
    $rootScope.settings.layout.setLabButton = false;
    
    // $scope.deviceId = $state.params.id;
    $scope.deviceType = $state.current.name;


    var gaugeOption = {
        grid:{
            x:0,
            y:0,
            x2:0,
            y2:0
        },

        tooltip : {
            formatter: "{b} : {c} °C"
        },
        // toolbox: {
        //     feature: {
        //         restore: {},
        //         saveAsImage: {}
        //     }
        // },
        series: [
            {
                center : ['51%', '50%'],
                title : {
                    offsetCenter: [0, '118%'],
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: '雅黑',
                        color:"#fff"
                    }
                },
                type: 'gauge',
                detail: {
                    formatter:'{value} °C',
                    offsetCenter: [2, '78%'],  
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color:'#fff',
                        fontSize:12
                    }},
                data: [{value: 50, name: '进水口温度'}],
                axisLine: {// 坐标轴线
                    length: 1,
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 5
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                     }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 5,
                    length:9,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        width:1
                    }
                },
                splitLine: {           // 分隔线
                    length :10,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:4
                    }
                }
            }   
        ]
    };

    var waterIn = echarts.init(document.getElementById("waterIn"),theme);
    var waterOut = echarts.init(document.getElementById("waterOut"),theme);
    var oilIn = echarts.init(document.getElementById("oilIn"),theme);
    var oilOut = echarts.init(document.getElementById("oilOut"),theme);
    var oilOutAlarmLowValue= 0,oilOutAlarmHeighValue=0;
    waterIn.setOption(gaugeOption);
    waterOut.setOption(gaugeOption);
    oilIn.setOption(gaugeOption);
    oilOut.setOption(gaugeOption);

    var barReady={};
    $(window).resize(function(){
        clearTimeout(barReady.timer);
        barReady.timer=setTimeout(function(){

                waterIn = echarts.init(document.getElementById("waterIn"),theme);
                waterOut = echarts.init(document.getElementById("waterOut"),theme);
                oilIn = echarts.init(document.getElementById("oilIn"),theme);
                oilOut = echarts.init(document.getElementById("oilOut"),theme);
                //上下限颜色
                gaugeOption.series[0].axisLine.lineStyle.color=[[0, '#2EC5C7'], [1, '#5AB1EF'], [1, '#C7737B']];
                gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterIn;
                gaugeOption.series[0].data[0].name = "进水口温度";

                waterIn.setOption(gaugeOption);

                gaugeOption.series[0].data[0].name = "出水口温度";
                gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterOut;
                waterOut.setOption(gaugeOption);

                gaugeOption.series[0].data[0].name = "进油口温度";
                gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilIn;
                oilIn.setOption(gaugeOption);

                if(oilOutAlarmLowValue==''||oilOutAlarmLowValue==0){
                    gaugeOption.series[0].axisLine.lineStyle.color=[[0, '#5AB1EF'], [oilOutAlarmHeighValue/100, '#5AB1EF'], [1, '#C7737B']];
                }else{
                    gaugeOption.series[0].axisLine.lineStyle.color=[[oilOutAlarmLowValue/100, '#C7737B'], [oilOutAlarmHeighValue/100, '#5AB1EF'], [1, '#C7737B']];
                }
                gaugeOption.series[0].data[0].name = "出油口温度";
                gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilOut;
                oilOut.setOption(gaugeOption);

                //出水温差，出油温差
                renderChart("bar4",$scope.timeOptionOil);
                renderChart("bar3",$scope.timeOptionWater);
        },100);

    })

    //设备菜单
    var url = "/equippage/getMainEquipMenu";
    var data = {equipType:"HPU"};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){

        $rootScope.equipMenu = json;
        for(var i=0;i<json.length;i++){
            if($state.params.id==json[i].equipNo){
                $rootScope.deviceName = json[i].equipName;
            }
        }

        if($rootScope.deviceName == ""){
            $rootScope.deviceName = json[0].equipName;
        }
    });

    //var id = $state.params.id.replace("PE00-01993-0","HPU");
    var id = $state.params.id;
    //HPU时点
    url = "/equippage/getIndexMomentHPU";
    data = {equipNo:id,indexName:["Iso4U","Iso6U","Iso14U","NAS","Saturation","T_Env","T_WaterIn","T_WaterOut","T_OilIn","T_OilOut","WaterPressure"]};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        $scope.getIndexMomentHPU = json;

        waterIn = echarts.init(document.getElementById("waterIn"),theme);
        waterOut = echarts.init(document.getElementById("waterOut"),theme);
        oilIn = echarts.init(document.getElementById("oilIn"),theme);
        oilOut = echarts.init(document.getElementById("oilOut"),theme);

        //上下限颜色
        gaugeOption.series[0].axisLine.lineStyle.color=[[0, '#2EC5C7'], [1, '#5AB1EF'], [1, '#C7737B']]
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterIn;
        gaugeOption.series[0].data[0].name = "进水口温度";

        waterIn.setOption(gaugeOption);
        
        gaugeOption.series[0].data[0].name = "出水口温度";
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterOut;

        waterOut.setOption(gaugeOption);
        
        gaugeOption.series[0].data[0].name = "进油口温度";
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilIn;

        oilIn.setOption(gaugeOption);

        //上下限显示红线范围
        oilOutAlarmHeighValue=json.oilOutAlarmHeighValue==''?100:json.oilOutAlarmHeighValue;

        oilOutAlarmLowValue=json.oilOutAlarmLowValue;
        if(oilOutAlarmLowValue==''||oilOutAlarmLowValue==0){
            gaugeOption.series[0].axisLine.lineStyle.color=[[0, '#5AB1EF'], [oilOutAlarmHeighValue/100, '#5AB1EF'], [1, '#C7737B']];
        }else{
            gaugeOption.series[0].axisLine.lineStyle.color=[[oilOutAlarmLowValue/100, '#C7737B'], [oilOutAlarmHeighValue/100, '#5AB1EF'], [1, '#C7737B']];
        }

        gaugeOption.series[0].data[0].name = "出油口温度";
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilOut;


        oilOut.setOption(gaugeOption);



    });

    //HPU时序
    url = "/equippage/getIndexTimeHPU";
    data = {equipNo:id};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        
        $scope.getTractiveEffort = json;
        console.log(json)
        var time = json.timeHPU;
        if(time == null) return;

        time = time.map(function (str) {
            var d = new Date(str);
            var t = (d.getMonth()+1)+"/"+d.getDate()+" "+d.getHours()+":"+d.getMinutes();
            //console.log(t);
            return t;
        });

        var date = time.reverse();
        var data = json.equipState;
        //max min
        var maxNum=Math.max.apply(null,json.oilIn);
        maxNum=Math.ceil(maxNum+maxNum*0.2);
        $scope.timeOptionOil = {
            grid:{
                x:28,
                y:23,
                x2:0,
                y2:68
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend: {
                top: 'bottom',
                data:['时间']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date,
                splitLine:{ 
                    show:false
                },

                axisLabel:{
                    textStyle:{
                        color:'#fff',
                    }
                },
            },
            yAxis: {
                max:maxNum,
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine:{ 
                    show:false
                },
                axisLabel:{
                    textStyle:{
                        color:'#fff',
                    }
                },
                splitNumber: 5,
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle:{
                    color:'#fff'
                }
            }],
            series: [{
                name: '进油',
                type: 'line',
                data: json.oilIn.reverse()
            }, {
                name: '出油',
                type: 'line',
                data: json.oilOut.reverse()
            }, {
                name: '温差',
                type: 'line',
                data: json.oilGap.reverse()
            }]
        };
        renderChart("bar4",$scope.timeOptionOil);
        
        var date = time;

        var data = json.equipState;
        //max min
        var maxNum=Math.max.apply(null,json.waterOut);
        maxNum=Math.ceil(maxNum+maxNum*0.2);
        $scope.timeOptionWater = {
            grid:{
                x:28,
                y:23,
                x2:0,
                y2:68
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend: {
                top: 'bottom',
                data:['时间']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date,
                splitLine:{ 
                    show:false
                },
                axisLabel:{
                    textStyle:{
                        color:'#fff',
                    }
                },
            },
            yAxis: {
                max:maxNum,
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine:{ 
                    show:false
                },
                axisLabel:{
                    textStyle:{
                        color:'#fff',
                    }
                },
                splitNumber: 5,
            },
            dataZoom: [{
                type: 'inside',
                start: 90,
                end: 100
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle:{
                    color:'#fff'
                }
            }],
            series: [{
                name: '进水',
                type: 'line',
                data: json.waterIn.reverse()
            }, {
                name: '出水',
                type: 'line',
                data: json.waterOut.reverse()
            }, {
                name: '温差',
                type: 'line',
                data: json.waterGap.reverse()
            }
            ],
            // series: [
            //     {
            //         name:'当前状态',
            //         type:'line',
            //         smooth:true,
            //         symbol: 'none',
            //         sampling: 'average',
            //         itemStyle: {normal: {}},
            //         areaStyle: {normal: {}},
            //         data: data
            //     }
            // ]
        };
        renderChart("bar3",$scope.timeOptionWater);
    });

    var timeOption={};
    //时序
    url = "/equippage/getEquipTimeStatus";
    data = {equipNo:"BEP",equipType:id};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        $scope.getEquipTimeStatus = json;
        $scope.renderEquipTimeStatus(json.equipState,json.equipTime);
    });
}])


.controller('BEPController', ['commService','$rootScope', '$scope', '$http', '$timeout','$state',function(commService,$rootScope, $scope, $http, $timeout,$state) {
    
    $scope.$on('ngRepeatFinished', function(repeatFinishedEvent, element) {
        var warningBEPConfig = {
            "bStateSave": false,
            "orderable": false,
            "autoWidth": false,
            "bLengthChange":false,
            "searching":false,
            "pagingType":'bootstrap_full_number2',
            "aoColumns": [
                  {
                      sWidth: '170px'
                  },{
                      sWidth: '300px'
                  }
            ],
            "lengthMenu": [
                [ 7, 10, -1],
                [ 7, 10, "All"] // change per page values here
            ],
            "columnDefs": [
                {  // set default column settings
                    'orderable': false,
                    "targets": [0,1]
                }, 
                {
                    "searchable": false,
                    "targets": [0,1]
                }],
                "order": [
                    [0, "desc"]
                ]
        };
        var tableConfig = $rootScope.tableConfig;
        $.extend(tableConfig,warningBEPConfig);


        $('#warningBEP').DataTable(tableConfig);
    });

    $scope.$on('$viewContentLoaded', function() {   
        // 指定图表的配置项和数据
        var option = {
                grid:{
                    x:38,
                    y:43,
                    x2:40,
                    y2:85
                },
                tooltip: {
                    trigger: 'axis'
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: [' ', ' ', ' ', ' ', ' ', ' ', ' '],
                    splitLine:{ 
                        show:false
                    },
                    axisLabel: {
                        textStyle:{
                            color:'#fff'
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine:{ 
                        show:false
                    },
                    axisLabel: {
                        formatter: '{value} N',
                        textStyle:{
                            color:'#fff'
                        }
                    }
                }],

                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    textStyle:{
                        color:'#fff'
                    }
                }],
                series: [{
                    name: 'High',
                    type: 'line',
                    data: [ ,  ,  ,  ,  ,  ,  ]
                    // markPoint: {
                    //     data: [{
                    //         type: 'max',
                    //         name: 'Max'
                    //     }, {
                    //         type: 'min',
                    //         name: 'Min'
                    //     }]
                    // },
                    // markLine: {
                    //     data: [{
                    //         type: 'average',
                    //         name: 'Mean'
                    //     }]
                    // }
                }]
            };
        $scope.option=option;
        

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('bar1'),theme);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        // var myChart = echarts.init(document.getElementById('bar2'),theme);
        // myChart.setOption(StateOption);
         var chartReady5={};
         $(window).resize(function(){
             clearTimeout(chartReady5.timer);
             chartReady5.timer=setTimeout(function(){
                 var json = $scope.getEquipTimeStatus;
                 $scope.renderEquipTimeStatus(json.equipState,json.equipTime);

                 myChart = echarts.init(document.getElementById('bar1'),theme);
                 myChart.setOption(option);
             },100);
             /*var myChart = echarts.init(document.getElementById('bar2'),theme);
             myChart.setOption(StateOption);*/
        });

    });

    //渲染时序
    $scope.renderEquipTimeStatus = function(equipState,equipTime){
        var equipData = [];
        for(var i=0;i<equipTime.length;i++){
            equipData.push([equipTime[i],   equipState[i]]);
        }

        var StateOption = {
            grid:{
                x:40,
                y:43,
                x2:20,
                y2:76
            },
            tooltip: {
                
                formatter:function(a,b,c,d){
                    var date = $filter('date')(new Date(a.value[0]), 'yyyy/MM/dd hh:mm:ss');
                    var status = parseInt(a.value[1])==1?"运行":"停止";
                    return date+" "+status;
                }
            },
            dataZoom:[
                {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '60%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    textStyle:{
                        color:'#fff'
                    }
                }
            ],
            calculable: true,
            xAxis: [{
                type: 'time',
                boundaryGap: true,
                splitLine:{ 
                    show:false
                },
                axisLabel: {
                    textStyle:{
                        color:'#fff'
                    }
                }
            }],
            yAxis: [{
                max:1,
                type: 'value',
                splitLine:{ 
                    show:false
                },
                axisLabel: {
                    formatter: function(a){
                        return a==1?"运行":"停止";
                    },

                    textStyle:{
                        color:'#fff'
                    }
                },
                splitNumber: 1
            }],
            series: [{
                name: '状态',
                type: 'line',
                step: 'start',
                smooth:false,
                areaStyle: {
                    normal: {
                        color:'#A6E528'
                    }
                },
                lineStyle: {
                    normal: {
                        color:'#A6E528'
                    }
                },
                data: equipData
            }]
        };

        var myChart = echarts.init(document.getElementById('TimeStatus'),theme);
        myChart.setOption(StateOption);
    }

    var timeOption = {};

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = false;
    $rootScope.settings.layout.setFullscreen = false;
    $rootScope.settings.layout.setDeviceButton = true;
    $rootScope.settings.layout.setLabButton = false;

    $rootScope.deviceName = $state.params.id;
    $rootScope.deviceId = $state.params.id;
    $scope.deviceType = $state.current.name;

    //设备菜单
    var url = "/equippage/getMainEquipMenu";
    var data = {equipType:"BEP"};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){

        $rootScope.equipMenu = json;
        for(var i=0;i<json.length;i++){
            if(json[i].equipNo == $state.params.id){
                $rootScope.deviceName = json[i].equipName;
                //console.log(json[i].equipNo,$state.params.id);
            }
        }

        //TODO: error id , BEP 
    });

    //获取设备状态
    var url = "/experipage/getEquipState";
    var data = {equipNo:$state.params.id,equipType:$state.current.name};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json) {

        $scope.statusInfo = {
            "0":{
                name:"停止",
                color:'#DA7C19'
            },
            "1":{
                name:"运行",
                color:'#31A82C'
            },
            "2":{
                name:"故障",
                color:'#e35b5a'
            },
            "3":{
                name:"空闲",
                color:'#dddddd'
            },
            "4":{
                name:"占位",
                color:'#e35b5a'
            },
        };
        var status=0;
        $rootScope.getMainExperiMenu = json;
        for(var i=0;len=json.length;i++){
            if(json[i].equipNo===$state.params.id){
                status=json[i].status;break;
            }
        }
        $scope.statusText=$scope.statusInfo[status].name;
        $scope.statusColor={color:$scope.statusInfo[status].color};
    });
    //速度&风速&牵引力
    url = "/equippage/getIndexMomentBEP";
    data = {equipNo:$state.params.id};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        $scope.getIndexMomentBEP = json;
    });

    //BEP报警
    url = "/equippage/getWarnningBEP";
    data = {equipNo:$state.params.id};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        
        $scope.getWarnningBEP = json;
    });

    //牵引力曲线
    url = "/equippage/getTractiveEffort";
    data = {equipNo:$state.params.id};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        //commService
        $scope.getTractiveEffort = json;

        if(json.tractiveEffortTime&&json.tractiveEffortTime.length>=1){
            var timeArr=[];
            json.tractiveEffortTime.forEach(function(item,index){
                timeArr.unshift(commService.getTime({time:item,rule:'MM-dd hh:mm:ss'}));
            });
            $scope.option.xAxis[0].data=timeArr;
            $scope.option.series[0].data=json.tractiveEffort;
            var myChart = echarts.init(document.getElementById('bar1'),theme);
            myChart.setOption($scope.option);
        }


    });

    //时序
    url = "/equippage/getEquipTimeStatus";
    data = {equipNo:$state.params.id,equipType:$state.current.name};
    $http.post($rootScope.settings.apiPath + url,JSON.stringify(data)).success(function(json){
        $scope.getEquipTimeStatus = json;
        $scope.renderEquipTimeStatus(json.equipState,json.equipTime);
    });
}])

.filter('moment', function () {
  return function (input, momentFn /*, param1, param2, ...param n */) {
    var args = Array.prototype.slice.call(arguments, 2),
        
        momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
})
.filter('waterPressureFilter', function () {
    return function (waterPressure) {
        console.log(waterPressure)
        return waterPressure==1?'超限':'正常';
    };
});
