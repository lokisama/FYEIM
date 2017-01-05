/***
Sean AngularJS App Main Script
***/

/* Sean App */
var SeanApp = angular.module("SeanApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    'ngValidate'
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
SeanApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/*Content-Type application/json*/
SeanApp.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push("$httpInterceptor");
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
SeanApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
SeanApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000, // auto scroll to top on page load
            hideSidebar: true,
            setFullscreen: false,
            setDeviceButton:false,
            setLabButton:false,
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
        apiPath:'',
        jsPath:'',
        mode:'local',
        version:'3.5',
        api:{
            dashboard:"http://10.203.97.123:7003/pataceim-rest",
            local:"http://10.203.97.123:7003/pataceim-rest",
            //local:"http://10.203.97.123:7003/pataceim-rest",
        },
        debug: {
            request:false,
            requestError:false,
            response:false,
            responseError:false
        }
    };

    settings.apiPath = settings.mode==="local"?settings.api.local:settings.api.dashboard;

    $rootScope.settings = settings;
    $rootScope.isLogin = true;
    return settings;
}]);


/*HttpInterceptor Factory*/
SeanApp.factory("$httpInterceptor",["$q", "$rootScope", function($q, $rootScope) {
    return {
        request: function(json) {
            if($rootScope.settings.debug.request){
                console.log("[request]:"+json.url);
            }

            json.headers['Content-Type'] = 'application/json;charset=utf-8';
            json.headers['Cache-Control'] = 'no-cache';
            json.headers['Pragma'] = 'no-cache';

            return json || $q.when(json);
        },
    　　 requestError: function(json) {
            if($rootScope.settings.debug.requestError){
                console.log("[requestError]:" + json.status);
            }
            
    　　　　 return $q.reject(json)
    　　 },
        response: function(json) {
            // console.log(json);
            if($rootScope.settings.debug.response){
                console.log("[response]:"+json.status+","+json.config.url);
            }
            
            return json || $q.when(json);
        },
        responseError : function(json) {
            if($rootScope.settings.debug.responseError){
                console.log("[responseError]:"+JSON.stringify(json));
            }

            return $q.reject(json);
        }
    };
}]);

SeanApp.directive('onRepeatFinished', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
}])
.directive('onRepeatFinished2', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished2');
                });
            }
        }
    };
}])
.directive('onRepeatFinished3', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished3');
                });
            }
        }
    };
}])
.directive('onRepeatFinished4', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished4');
                });
            }
        }
    };
}]);
/* Setup App Main Controller */
SeanApp.controller('AppController', ['$scope', function($scope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
SeanApp.controller('HeaderController', ['$rootScope','$scope','$http','$state', function($rootScope,$scope,$http,$state) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initHeader(); // init header
    });
    
    $scope.setDevice = function(type,id,name){
        $rootScope.deviceName = name;
        $state.go(type,{id:id});
    }

    $scope.setLab = function(id){
        $state.go("lab",{id:id});
    }

    $scope.logInOut = function(isLogin){
        $rootScope.isLogin = isLogin;
        if(isLogin){
           
        }else{
            window.location.href = "/pkmslogout.html?filename=eimlogout.html";
        }
    }

}]);

/* Setup Layout Part - Sidebar */
SeanApp.controller('SidebarController', ['$scope','$state', function($scope,$state) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });

    $scope.open = function(router,$event){
        window.open(router);
        $event.stopPropagation();
    }
}]);

/* Setup Layout Part - Quick Sidebar */
SeanApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
SeanApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
SeanApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
SeanApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    var jsPath = '../dashboard/js/3d';
    // var jsPath = '../plugins';

    $urlRouterProvider.otherwise("/dashboard");  
    
    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/dashboard.html');
            }],

            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                           jsPath + '/lib3d.js'
                        ] 
                    })
                    .then(function(){
                        return $ocLazyLoad.load({
                            name: 'SeanApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                jsPath + '/eim.js',
                                // './js/controllers/DashboardController.js',
                            ] 
                        })
                    });
                }]
            }
        })

        // Lab
        .state('lab', {
            url: "/lab/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/lab.html');
            }],

            data: {pageTitle: 'Lab Template'},
            controller: "LabController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            './js/scripts/macarons.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            jsPath + '/lib3d.js'
                        ] 
                    })
                    .then(function(){
                        return $ocLazyLoad.load({
                            name: 'SeanApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [

                                 jsPath + '/device.js',
                                // './js/controllers/LabController.js',
                            ] 
                        })
                    })
                    ;
                }]
            }
        })

        // Dashboard
        .state('MTS', {
            url: "/MTS/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/mts.html');
            }],
            data: {pageTitle: 'Device Template'},
            controller: "MTSController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/global/plugins/moment.min.js',
                            "../assets/global/plugins/echarts/echarts.js",

                            './js/scripts/macarons.js',
                            // './js/controllers/DeviceController.js',
                        ] 
                    });
                }]
            }
        })

        // Dashboard
        .state('HPU', {
            url: "/HPU/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/hpu.html');
            }],
            data: {pageTitle: 'Device1 Template'},
            controller: "HPUController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            './js/scripts/macarons.js',
                            "../assets/global/plugins/echarts/echarts.js",
                            // './js/controllers/DeviceController.js',
                        ] 
                    });
                }]
            }
        })

        // Dashboard
        .state('BEP', {
            url: "/BEP/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/bep.html');
            }],
            data: {pageTitle: 'Device Template'},
            controller: "BEPController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            './js/scripts/macarons.js',
                            "../assets/global/plugins/echarts/echarts.js",
                            // './js/controllers/DeviceController.js',
                        ] 
                    });
                }]
            }
        })

        // Dashboard
        .state('admin', {
            url: "/admin",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin.html');
            }],
            data: {pageTitle: 'Lab Template'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/global/plugins/jquery-ui/jquery-ui.min.js',
                            // './js/controllers/AdminController.js',
                        ] 
                    });
                }]
            }
        })

        // Dashboard
        .state('admin.user', {
            url: "/user",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin-user.html');
            }], 
            controller: "UserController",          
            data: {pageTitle: 'User Template'},
        })

        // Dashboard
        .state('admin.user.edit', {
            url: "/edit",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin-edit.html');
            }]
        })

        // Dashboard
        .state('admin.role', {
            url: "/role",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin-role.html');
            }],  
            controller: "RoleController",          
            data: {pageTitle: 'Role Template'},
        })

        // Dashboard
        .state('admin.resource', {
            url: "/resource",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin-resource.html');
            }], 
            controller: "ResourceController",           
            data: {pageTitle: 'Resource Template'},
        })

        // Dashboard
        .state('admin.alarm', {
            url: "/alarm",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin-warning.html');
            }],  
            controller: "WarningController",           
            data: {pageTitle: 'Alarm Template'},
        })

        // Dashboard
        .state('admin.log', {
            url: "/log",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/admin-log.html');
            }], 
            controller: "LogController",           
            data: {pageTitle: 'Log Template'},
        });;
        

}]);

/* Init global settings and run the app */
SeanApp.run(["$rootScope", "settings", "$state", "$http", "$interval", function($rootScope, settings, $state,$http,$interval) {
    var timer = $interval(function(){
        $rootScope.time = moment().format('YYYY年 MM月D日 HH:mm:ss');
    },1000);
    

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "positionClass": "toast-top-center",
      "onclick": null,
      "showDuration": "1000",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    $rootScope.tableConfig = {
            //"ordering": false,
            "searching":false,
            "bLengthChange":false,
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "空表",
                "info": " _START_ - _END_ /共 _TOTAL_ 条",
                "infoEmpty": "没有数据",
                "infoFiltered": "(从 _MAX_ 条数据中检索)",
                "lengthMenu": "每页显示 _MENU_ 条记录",
                "search": "查询:",
                "zeroRecords": "无查询结果",
                "sProcessing": "正在加载中...", 
                "paginate": {
                    "previous":"上一页",
                    "next": "下一页",
                    "last": "尾页",
                    "first": "首页",
                    "page": "第",
                    "pageOf": "页"
                }
            },
            "bStateSave": true,
            "lengthMenu": [
                [5, 10, 20, -1],
                [5, 10, 20, "All"] // change per page values here
            ],
            "columnDefs": [{  // set default column settings
                'orderable': false,
                "targets": [0]
            }, {
                "searchable": false,
                "targets": [0]
            }]
        };

        if($rootScope.settings.mode != "server"){
            $rootScope.threeReady = true;
        }

        //server apis
        $http.get($rootScope.settings.apiPath+"/user/getLoginUser")
            .success(function(json){

                $rootScope.realName = '测试用户01';
                $rootScope.userName = 'apptest01';
                //TODO: userstatus 01 没有权限  02 session过期  00 正常登陆

                if(settings.mode==="server"){
                    $rootScope.userName = json.userName;
                    $rootScope.realName = json.realName;
                    switch(json.userstatus){
                        case "01":
                            toastr.clear();
                            toastr["warning"]("没有权限","");
                            setTimeout(function(){window.location.href = "/pkmslogout.html?filename=eimlogout.html";},3000);
                            break;

                        case "02":
                            toastr.clear();
                            toastr["warning"]("session过期","");
                            setTimeout(function(){window.location.href = "/pkmslogout.html?filename=eimlogout.html";},3000);
                            break;

                        case "00":
                        default:
                            break;
                    }
                }

                $http.post($rootScope.settings.apiPath+"/user/login",{userName:$rootScope.userName})
                .success(function(json){
                    var menu = [];

                    for(var i=0;i<json.length;i++){

                        if(json[i].parentId == undefined){
                            json[i].parentId=0;
                        }

                        if(typeof menu[json[i].parentId] == "undefined"){
                            menu[json[i].parentId]=[];
                        }

                    }


                    // 权限校验
                    $rootScope.license = json;

                    $rootScope.threeReady = true;

                    

                    var tmp = [];
                    for(var i=json.length-1;i>=0;i--){
                        for(var j=0;j<json.length;j++){
                            if(json[j].id==json[i].parentId){
                                if(json[j]['child']==undefined) json[j]['child'] = [];
                                json[j]['child'].unshift( json[i] );
                            }
                        }
                       
                    }

                    var menuList = [];
                    for(var i=0;i<json.length;i++){
                        if(json[i].parentId==0){
                            menuList.push(json[i]);
                        }

                    }

                    $rootScope.menu = menuList;

                }); 
        })

        
}]);
/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
SeanApp.directive('ngSpinnerBar', ['$rootScope','$http','$state',
    function($rootScope,$http,$state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    element.removeClass('hide'); // show spinner bar

                    if(toState.name=='login') return;

                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    // Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                    
                   
                    // auto scorll to page top
                    // setTimeout(function () {
                    //     App.scrollTop(); // scroll to the top on content load
                    // }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
SeanApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
SeanApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});
SeanApp.factory("commService",function() {
    var commService={};
    commService.emailPattern=function(email){
        var result={};
        result.error=0;
        if(email!="" && email!=undefined){
            var emailPattern=/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
            //var emailPattern=/\w[-\w.+]*@saic-gm.com/;
            var arr=email.split(";");
            for (var i = 0; i < arr.length; i++) {
                if(!emailPattern.test(arr[i])&&arr[i]!=""){
                    if(arr.length==1){
                        //alert("邮箱有误");
                        result.error=1;
                        result.msg="邮箱有误";
                        return result;
                    }
                    //alert("第"+(i+1)+"个邮箱有误");
                    result.error=1;
                    result.msg="第"+(i+1)+"个邮箱有误";
                    return result;
                }else if(arr[i]==""){
                    //alert("第"+(i+1)+"个为空邮箱");
                    result.error=1;
                    result.msg="第"+(i+1)+"个为空邮箱";
                    return result;
                }else if(/\,|\:|\；/.test(email)){
                    //alert("邮箱分隔符有误");
                    result.error=1;
                    result.msg="邮箱分隔符有误";
                    return result;
                }
            }
            result.error=0;
            result.msg='';
            return result;
        }

    };
    commService.getTime=function(opts){
        /*获取当前时间*/
        var d=new Date(opts.time)||new Date();
        var year=d.getFullYear();
        var month=d.getMonth()+1;
        //month=common.fillZero(month);
        var date=d.getDate();
        //date=common.fillZero(date);
        var hours=d.getHours();
        //hours=common.fillZero(hours);
        var minutes=d.getMinutes();
        //minutes=common.fillZero(minutes);
        var seconds=d.getSeconds();
        //seconds=common.fillZero(seconds);
        switch(opts.rule){
            case "yyyy-MM-dd":
                return year+"-"+month+"-"+date;
                break;
            case "MM-dd hh:mm:ss":
                return month+"/"+date+" "+hours+":"+minutes+":"+seconds;
                break;
            default:
                return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
        }

    };
    return commService;
});
//邮箱错误信息
SeanApp.directive("errorMsg",function(){
    return {
        restrict: "AE",
        transclude: true,
        template: '<div  class="emailError" style="display:none;position: absolute;left:0;top:113px;color: "red">\
                            <span>{{email.error}}</span>\
                     </div>'
        ,
        link: function (scope, element, attr) {
            //console.log(scope,element,attr)
            var email=element[0].querySelector(".emailError");
            scope.email={};
            scope.emailPattern=function(msg,simple){
                console.log(msg)
                if(!simple){
                    scope.email.error=msg;
                    email.style.display="block";
                }else{
                    console.log(msg)
                    if(msg==""){
                        email.parentNode.parentNode.classList.remove("has-error");
                    }else{
                        email.parentNode.parentNode.classList.add("has-error");
                    }

                }
            };
            //has-error

        }
    }
});