;
angular.module('SeanApp').controller('UserController', [
  'commService',
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$state',
  function (commService, $rootScope, $scope, $http, $timeout, $state) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = false;
    $rootScope.settings.layout.setLabButton = false;
    $rootScope.settings.layout.setDeviceButton = false;
    $scope.obj = 'user';
    //var modal=$("#draggable");
    $scope.$on('$viewContentLoaded', function () {
      $('.modal').on('hidden.bs.modal', function () {
        $('.form-group').removeClass('has-error');
      });
    });
    $scope.datas = [];
    $scope.data = {};
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      var table = $('#' + $scope.obj);
      table.removeClass('hide');
      // table.find(".checkboxes").uniform();
      table.find('.group-checkable').change(function () {
        var set = jQuery(this).attr('data-set');
        var checked = jQuery(this).is(':checked');
        jQuery(set).each(function () {
          if (checked) {
            $(this).prop('checked', true);
          } else {
            $(this).prop('checked', false);
          }
        });
        jQuery.uniform.update(set);
      });
      var config = {
          'ordering': false,
          'searching': false,
          'bLengthChange': false,
          'autoWidth': false,
          'bStateSave': false,
          'lengthMenu': [
            [
              10,
              15,
              20,
              -1
            ],
            [
              10,
              15,
              20,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1,
                2,
                3,
                4
              ]
            },
            {
              'searchable': false,
              'targets': [0]
            }
          ],
          rowCallback: function (nRow, aData, iDisplayIndex, dataIndex) {
            return nRow;
          }
        };
      var t = $rootScope.tableConfig;
      $.extend(t, config);
      $scope.datatable = table.DataTable(config);
    });
    $scope.getUserList = function () {
      $http.get($rootScope.settings.apiPath + '/' + $scope.obj + '/list').success(function (json) {
        $scope.datas = json;  //$('#'+ $scope.obj +' .checkboxes').uniform();
      });
    };
    $scope.getUserList();
    $scope.save = function (form) {
      var result = commService.emailPattern($scope.data.email);
      if (result && result.error == 1) {
        $scope.emailPattern(result.msg, 'simple');
        return false;
      } else if (result) {
        $scope.emailPattern(result.msg, 'simple');
      }
      if (!form.validate()) {
        return;
      }
      var selectedElmsIds = $('#tree_2').jstree('get_selected');
      $scope.data.roleids = selectedElmsIds.join(',');
      $('.modal').modal('hide');
      $http.post($rootScope.settings.apiPath + '/' + $scope.obj + '/addOrUpdate', $scope.data).success(function (json) {
        window.location.reload();
      });
    };
    $scope.create = function () {
      $scope.action = '\u521b\u5efa\u7528\u6237';
      $scope.data = {};
      $http.get($rootScope.settings.apiPath + '/role/list').success(function (json) {
        var data = [];
        for (var i = 0; i < json.length; i++) {
          data.push({
            text: json[i].roleName,
            id: parseInt(json[i].id),
            state: { selected: false }
          });
        }
        $('#tree_2').data('jstree', false).empty();
        $('#tree_2').jstree({
          'plugins': [
            'wholerow',
            'checkbox',
            'types'
          ],
          'core': {
            'themes': { 'responsive': false },
            'data': data
          },
          'types': {
            'default': { 'icon': 'fa fa-user font-green icon-lg' },
            'file': { 'icon': 'fa fa-file icon-state-warning icon-lg' }
          }
        });
      });
      $('.modal').modal('show');
    };
    $('#tree_2').on('changed.jstree', function (e, data) {
    });
    /*
    * 修改按钮
    * 获取点击当条数据
    * */
    $scope.upDataUser = function (ev) {
      $scope.action = '\u7f16\u8f91\u7528\u6237';
      var srcEl = ev.target, id = srcEl.getAttribute('data-id');
      for (var i = 0, len = $scope.datas.length; i < len; i++) {
        if ($scope.datas[i].id == id) {
          $scope.data = JSON.parse(JSON.stringify($scope.datas[i]));
        }
      }
      $http.get($rootScope.settings.apiPath + '/role/list').success(function (json) {
        $http.post($rootScope.settings.apiPath + '/user/getUserRoleList', { userId: $scope.data.id }).success(function (result) {
          var roleList = [];
          for (var i = 0; i < result[0].userRoleList.length; i++) {
            roleList.push(result[0].userRoleList[i].roleId);
          }
          var data = [];
          for (var i = 0; i < json.length; i++) {
            if (roleList.indexOf(json[i].id) > -1) {
              data.push({
                text: json[i].roleName,
                id: parseInt(json[i].id),
                state: { selected: true }
              });
              console.log(json[i].roleName + ':' + true);
            } else {
              data.push({
                text: json[i].roleName,
                id: parseInt(json[i].id),
                state: { selected: false }
              });
              console.log(json[i].roleName + ':' + false);
            }
          }
          $('#tree_2').data('jstree', false).empty();
          $('#tree_2').jstree({
            'plugins': [
              'wholerow',
              'checkbox',
              'types'
            ],
            'core': {
              'themes': { 'responsive': false },
              'data': data
            },
            'types': {
              'default': { 'icon': 'fa fa-user font-green icon-lg' },
              'file': { 'icon': 'fa fa-file icon-state-warning icon-lg' }
            }
          });
        });
      });
    };
    $scope.delData = function (id) {
      if (!confirm('\u786e\u5b9a\u8981\u5220\u9664\u5f53\u524d\u7528\u6237\u5417?')) {
        return false;
      }
      var url = $rootScope.settings.apiPath + '/' + $scope.obj + '/delete';
      $http({
        method: 'GET',
        url: url,
        params: { ids: id }
      }).success(function (json) {
        window.location.reload();
      });
    };
  }
]).controller('RoleController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  function ($rootScope, $scope, $http, $timeout) {
    $scope.obj = 'role';
    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.datas = [];
    $scope.data = {};
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      var table = $('#' + $scope.obj);
      table.removeClass('hide');
      // table.find(".checkboxes").uniform();
      // table.find('.group-checkable').change(function () {
      //     var set = jQuery(this).attr("data-set");
      //     var checked = jQuery(this).is(":checked");
      //     jQuery(set).each(function () {
      //         if (checked) {
      //             $(this).prop("checked", true);
      //         } else {
      //             $(this).prop("checked", false);
      //         }
      //     });
      //     jQuery.uniform.update(set);
      // });
      var config = {
          'ordering': false,
          'searching': false,
          'bLengthChange': false,
          'autoWidth': false,
          'bStateSave': false,
          'lengthMenu': [
            [
              10,
              15,
              20,
              -1
            ],
            [
              10,
              15,
              20,
              'All'
            ]
          ],
          'aoColumns': [
            {
              sWidth: '30px',
              visible: false
            },
            { sWidth: '200px' },
            { sWidth: '200px' },
            { sWidth: '200px' },
            { sWidth: '160px' }
          ],
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1,
                2,
                3,
                4
              ]
            },
            {
              'searchable': false,
              'targets': [0]
            }
          ],
          rowCallback: function (nRow, aData, iDisplayIndex, dataIndex) {
            return nRow;
          }
        };
      var t = $rootScope.tableConfig;
      $.extend(t, config);
      $scope.datatable = table.DataTable(config);
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = false;
    $scope.save = function (form) {
      var selectedElmsIds = $('#tree_2').jstree('get_selected');
      $scope.data.resourceIds = selectedElmsIds.join(',');
      if (!form.validate()) {
        return;
      }
      $('.modal').modal('hide');
      $http.post($rootScope.settings.apiPath + '/' + $scope.obj + '/addOrUpdate', $scope.data).success(function (json) {
        window.location.reload();
      });
    };
    $('#tree_2').on('changed.jstree', function (e, data) {
      console.log(data.selected);
    });
    $scope.getRoleList = function () {
      $http.get($rootScope.settings.apiPath + '/' + $scope.obj + '/list').success(function (json) {
        $scope.datas = json;
      });
    };
    $scope.getRoleList();
    $scope.create = function () {
      $scope.action = '\u521b\u5efa\u89d2\u8272';
      $scope.data = {};
      $('.modal').modal('show');
      $http.get($rootScope.settings.apiPath + '/resource/list').success(function (json) {
        var data = [];
        for (var i = 0; i < json.length; i++) {
          data.push({
            text: json[i].resourceName,
            id: parseInt(json[i].id),
            state: { selected: false }
          });
        }
        $('#tree_2').data('jstree', false).empty();
        $('#tree_2').jstree({
          'plugins': [
            'wholerow',
            'checkbox',
            'types'
          ],
          'core': {
            'themes': { 'responsive': false },
            'data': data
          },
          'types': {
            'default': { 'icon': 'fa fa-user font-green icon-lg' },
            'file': { 'icon': 'fa fa-file icon-state-warning icon-lg' }
          }
        });
      });
    };
    /*
     * 修改按钮
     * 获取点击当条数据
     * */
    $scope.upData = function (ev) {
      $scope.action = '\u7f16\u8f91\u89d2\u8272';
      var srcEl = ev.target, id = $(srcEl).data('id');
      for (var i = 0, len = $scope.datas.length; i < len; i++) {
        if ($scope.datas[i].id == id) {
          $scope.data = JSON.parse(JSON.stringify($scope.datas[i]));
        }
      }
      $http.get($rootScope.settings.apiPath + '/resource/list').success(function (json) {
        $http.post($rootScope.settings.apiPath + '/role/getRoleResList', { ids: $scope.data.id }).success(function (result) {
          var roleList = [];
          for (var i = 0; i < result[0].roleResList.length; i++) {
            roleList.push(result[0].roleResList[i].resourceId);
          }
          var data = [];
          for (var i = 0; i < json.length; i++) {
            if (roleList.indexOf(json[i].id) > -1) {
              data.push({
                text: json[i].resourceName,
                id: parseInt(json[i].id),
                state: { selected: true }
              });
              console.log(json[i].resourceName + ':' + true);
            } else {
              data.push({
                text: json[i].resourceName,
                id: parseInt(json[i].id),
                state: { selected: false }
              });
              console.log(json[i].resourceName + ':' + false);
            }
          }
          $('#tree_2').data('jstree', false).empty();
          $('#tree_2').jstree({
            'plugins': [
              'wholerow',
              'checkbox',
              'types'
            ],
            'core': {
              'themes': { 'responsive': false },
              'data': data
            },
            'types': {
              'default': { 'icon': 'fa fa-user font-green icon-lg' },
              'file': { 'icon': 'fa fa-file icon-state-warning icon-lg' }
            }
          });
        });
      });
    };
    $scope.delData = function (id) {
      if (!confirm('\u786e\u5b9a\u8981\u5220\u9664\u5f53\u524d\u89d2\u8272\u5417?')) {
        return false;
      }
      var url = $rootScope.settings.apiPath + '/' + $scope.obj + '/delete';
      $http({
        method: 'GET',
        url: url,
        params: { ids: id }
      }).success(function (json) {
        window.location.reload();
      });
    };
  }
]).controller('ResourceController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  function ($rootScope, $scope, $http, $timeout) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = false;
    $scope.obj = 'resource';
    $scope.datas = [];
    $scope.data = {};
    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      console.log('ResourceController');
      var table = $('#' + $scope.obj);
      table.removeClass('hide');
      // table.find(".checkboxes").uniform();
      // table.find('.group-checkable').change(function () {
      //     var set = jQuery(this).attr("data-set");
      //     var checked = jQuery(this).is(":checked");
      //     jQuery(set).each(function () {
      //         if (checked) {
      //             $(this).prop("checked", true);
      //         } else {
      //             $(this).prop("checked", false);
      //         }
      //     });
      //     jQuery.uniform.update(set);
      // });
      var config = {
          'ordering': false,
          'searching': false,
          'bLengthChange': false,
          'autoWidth': false,
          'bStateSave': false,
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1,
                2,
                3,
                4
              ]
            },
            {
              'searchable': false,
              'targets': [0]
            }
          ],
          'bStateSave': false,
          'lengthMenu': [
            [
              10,
              15,
              20,
              -1
            ],
            [
              10,
              15,
              20,
              'All'
            ]
          ],
          rowCallback: function (nRow, aData, iDisplayIndex, dataIndex) {
            return nRow;
          }
        };
      var t = $rootScope.tableConfig;
      $.extend(t, config);
      $scope.datatable = table.DataTable(config);
    });
    $scope.getResourceList = function () {
      $http.get($rootScope.settings.apiPath + '/' + $scope.obj + '/list').success(function (json) {
        $scope.datas = json;  //$('#'+ $scope.obj +' .checkboxes').uniform();
      });
    };
    $scope.getResourceList();
    $scope.save = function (form) {
      if (!form.validate()) {
        console.log('fail');
        return;
      }
      $http.post($rootScope.settings.apiPath + '/' + $scope.obj + '/addOrUpdate', $scope.data).success(function (json) {
        console.log(json);
        $('.modal').modal('hide');
        window.location.reload();
      });
    };
    $scope.create = function () {
      $scope.action = '\u521b\u5efa\u8d44\u6e90';
      $scope.data = {};
      $('.modal').modal('show');
    };
    /*
     * 修改按钮
     * 获取点击当条数据
     * */
    $scope.upData = function (ev) {
      var srcEl = ev.target, id = $(srcEl).data('id');
      for (var i = 0, len = $scope.datas.length; i < len; i++) {
        if ($scope.datas[i].id == id) {
          $scope.data = JSON.parse(JSON.stringify($scope.datas[i]));
        }
      }
      $scope.action = '\u7f16\u8f91\u8d44\u6e90 id:' + id;
    };
    $scope.delData = function (id) {
      if (!confirm('\u786e\u5b9a\u8981\u5220\u9664\u5f53\u524d\u8d44\u6e90\u5417?')) {
        return false;
      }
      var url = $rootScope.settings.apiPath + '/' + $scope.obj + '/delete';
      $http({
        method: 'GET',
        url: url,
        params: { ids: id }
      }).success(function (json) {
        window.location.reload();
      });
    };
  }
]).controller('WarningController', [
  'commService',
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  function (commService, $rootScope, $scope, $http, $timeout) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = false;
    $scope.datas = [];
    $scope.data = {};
    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      console.log('ResourceController');
      var table = $('#warning');
      table.removeClass('hide');
      //table.find(".checkboxes").uniform();
      table.find('.group-checkable').change(function () {
        var set = jQuery(this).attr('data-set');
        var checked = jQuery(this).is(':checked');
        jQuery(set).each(function () {
          if (checked) {
            $(this).prop('checked', true);
          } else {
            $(this).prop('checked', false);
          }
        });
        jQuery.uniform.update(set);
      });
      var config = {
          'autoWidth': false,
          'bStateSave': false,
          'lengthMenu': [
            [
              10,
              15,
              20,
              -1
            ],
            [
              10,
              15,
              20,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1,
                2,
                3,
                4
              ]
            },
            {
              'searchable': false,
              'targets': [0]
            }
          ],
          rowCallback: function (nRow, aData, iDisplayIndex, dataIndex) {
            // $("button[action=delete]", nRow).click(function() {
            //   console.log(111);
            //   if(!confirm("确定要删除记录吗?")){
            //       return false
            //   }
            //   var url = $rootScope.settings.apiPath + "/hpualarm/delete";
            //   var id = $(this).attr('data-id');
            //   $http.post(url,{eqptNo:[id]}).success(function(json){
            //       $(nRow).remove();
            //   })
            // });
            /*$("button[action=edit]", nRow).click(function() {
                    console.log(1);
                    $scope.temp = $scope.datas[dataIndex];
                    console.log($scope.data);
                    $scope.action = "编辑HPU出油口温度";
                    $scope.$apply();
              });*/
            return nRow;
          }
        };
      var t = $rootScope.tableConfig;
      $.extend(t, config);
      $scope.datatable = table.DataTable(t);
    });
    $scope.getWarningList = function () {
      $http.get($rootScope.settings.apiPath + '/hpualarm/getHpuAlarmList').success(function (json) {
        $scope.datas = json;
        console.log($scope.datas);
      });
    };
    $scope.getWarningList();
    $scope.save = function (form) {
      if (!form.validate()) {
        console.log('fail');
        return;
      }
      var result = commService.emailPattern($scope.temp.email);
      if (result && result.error == 1) {
        $scope.emailPattern(result.msg);
        return false;
      }
      $http.post($rootScope.settings.apiPath + '/hpualarm/addOrUpdate', $scope.temp).success(function (json) {
        $('.modal').modal('hide');
        window.location.reload();
      });
    };
    $scope.create = function () {
      $scope.action = '\u521b\u5efa\u7f16\u8f91HPU\u51fa\u6cb9\u53e3\u6e29\u5ea6';
      $scope.data = {};
      $('.modal').modal('show');
    };
    /*
     * 修改按钮
     * 获取点击当条数据
     * */
    $scope.upData = function (ev) {
      var srcEl = ev.target, id = $(srcEl).data('id');
      for (var i = 0, len = $scope.datas.length; i < len; i++) {
        if ($scope.datas[i].eqptNo == id) {
          $scope.temp = JSON.parse(JSON.stringify($scope.datas[i]));
        }
      }
      $scope.action = '\u7f16\u8f91HPU\u51fa\u6cb9\u53e3\u6e29\u5ea6';
    };
  }
]).controller('LogController', [
  'commService',
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  function (commService, $rootScope, $scope, $http, $timeout) {
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = false;
    $scope.datas = [];
    $scope.data = {};
    $scope.$on('$viewContentLoaded', function () {
    });
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      console.log('LogController');
      var table = $('#log');
      table.removeClass('hide');
      //table.find(".checkboxes").uniform();
      table.find('.group-checkable').change(function () {
        var set = jQuery(this).attr('data-set');
        var checked = jQuery(this).is(':checked');
        jQuery(set).each(function () {
          if (checked) {
            $(this).prop('checked', true);
          } else {
            $(this).prop('checked', false);
          }
        });
        jQuery.uniform.update(set);
      });
      var config = {
          'autoWidth': false,
          'bStateSave': false,
          'lengthMenu': [
            [
              10,
              15,
              20,
              -1
            ],
            [
              10,
              15,
              20,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1,
                2,
                3,
                4
              ]
            },
            {
              'searchable': false,
              'targets': [0]
            }
          ],
          rowCallback: function (nRow, aData, iDisplayIndex, dataIndex) {
            return nRow;
          }
        };
      var t = $rootScope.tableConfig;
      $.extend(t, config);
      $scope.datatable = table.DataTable(t);
    });
    $scope.getWarningList = function () {
      $http.get($rootScope.settings.apiPath + '/eqptlogAlarm/getEqptlogAlarmList').success(function (json) {
        $scope.datas = json;  //$('#'+ $scope.obj +' .checkboxes').uniform();
      });
    };
    $scope.getWarningList();
    $scope.save = function (form) {
      if (!form.validate()) {
        console.log('fail');
        return;
      }
      var result = commService.emailPattern($scope.temp.email);
      if (result && result.error == 1) {
        $scope.emailPattern(result.msg);
        return false;
      }
      $http.post($rootScope.settings.apiPath + '/eqptlogAlarm/addOrUpdate', $scope.temp).success(function (json) {
        $('.modal').modal('hide');
        window.location.reload();
      });
    };
    $scope.create = function () {
      $scope.action = '\u521b\u5efa\u62a5\u8b66\u65e5\u5fd7\u9600\u503c';
      $scope.data = {};
      $('.modal').modal('show');
    };
    /*
     * 修改按钮
     * 获取点击当条数据
     * */
    $scope.upData = function (ev) {
      var srcEl = ev.target, id = $(srcEl).data('id');
      for (var i = 0, len = $scope.datas.length; i < len; i++) {
        if ($scope.datas[i].eqptNo == id) {
          $scope.temp = angular.copy($scope.datas[i]);  //JSON.parse(JSON.stringify($scope.datas[i]));
        }
      }
      $scope.action = '\u7f16\u8f91\u62a5\u8b66\u65e5\u5fd7\u9600\u503c';
    };
  }
]).filter('userStatus', function () {
  return function (input, userStatus) {
    var args = Array.prototype.slice.call(arguments, 2);
    switch (input) {
    case 0:
      return '\u7981\u7528';
      break;
    case 1:
      return '\u53ef\u7528';
      break;
    default:
      return '\u672a\u77e5';
      break;
    }  // return momentObj[momentFn].apply(momentObj, args);
  };
}).filter('checkStatus', function () {
  return function (input, userStatus) {
    var args = Array.prototype.slice.call(arguments, 2);
    switch (input) {
    case 0:
      return false;
      break;
    case 1:
      return true;
      break;
    default:
      return false;
      break;
    }  // return momentObj[momentFn].apply(momentObj, args);
  };
}).config([
  '$validatorProvider',
  function ($validatorProvider) {
    $validatorProvider.setDefaults({
      errorElement: 'span',
      errorClass: 'help-block',
      highlight: function (element) {
        // hightlight error inputs
        $(element).closest('.form-group').addClass('has-error');  // set error class to the control group
      },
      errorPlacement: function (error, element) {
        error.insertAfter(element);
        $(error).show();
      },
      success: function (error, element) {
        $(error).parents('.form-group').removeClass('has-error');
        $(error).remove();
      }
    });
    $validatorProvider.setDefaultMessages({
      required: '\u8bf7\u8f93\u5165\u5fc5\u586b\u9879.',
      remote: '\u8bf7\u4fee\u6539.',
      email: '\u9519\u8bef\u90ae\u7bb1\u683c\u5f0f.',
      url: '\u9519\u8befurl\u683c\u5f0f.',
      date: '\u9519\u8bef\u65f6\u95f4\u683c\u5f0f.',
      dateISO: '\u9519\u8befISO\u65f6\u95f4\u683c\u5f0f.',
      number: '\u975e\u6cd5\u6570\u5b57\u683c\u5f0f.',
      digits: 'Please enter only digits.',
      creditcard: '\u8bf7\u8f93\u5165\u6b63\u786e\u4fe1\u7528\u5361\u683c\u5f0f.',
      equalTo: '2\u6b21\u8f93\u5165\u4e0d\u4e00\u81f4.',
      accept: '\u8bf7\u8f93\u5165\u6b63\u786e\u9a8c\u8bc1\u4fe1\u606f.',
      tnc: '\u8bf7\u5148\u9605\u8bfb\u653f\u7b56',
      maxlength: $validatorProvider.format('\u6700\u5927\u4e0d\u8d85\u8fc7 {0} \u4f4d.'),
      minlength: $validatorProvider.format('\u6700\u5c0f\u4e0d\u8d85\u8fc7 {0} \u4f4d.'),
      rangelength: $validatorProvider.format('\u53ef\u4ee5\u8f93\u5165 {0} \u5230 {1} \u4f4d.'),
      range: $validatorProvider.format('\u53ef\u8f93\u5165 {0} \u5230 {1}.'),
      max: $validatorProvider.format('\u4e0d\u5927\u4e8e {0}.'),
      min: $validatorProvider.format('\u4e0d\u5c0f\u4e8e {0}.')
    });
  }
]);
;
angular.module('SeanApp').controller('DashboardController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$interval',
  function ($rootScope, $scope, $http, $timeout, $interval) {
    $scope.$on('$viewContentLoaded', function () {
      var timer = $interval(function () {
          if ($rootScope.threeReady && $rootScope.license) {
            for (var i = 0; i < $rootScope.license.length; i++) {
              if ($rootScope.license[i].url && $rootScope.license[i].url.indexOf('lab') > -1) {
                var id = $rootScope.license[i].url.split('#/lab/')[1];
                for (var j = 0; j < fieldJson.objects.length; j++) {
                  if (fieldJson.objects[j].client && fieldJson.objects[j].client.id == id && $rootScope.license[i].url.indexOf('lab') > -1) {
                    //  console.log(fieldJson.objects[j].client.name);
                    fieldJson.objects[j].client.validateLicense = true;
                    // fieldJson.objects[j].sideColor =  '#759bc2';
                    // fieldJson.objects[j].topColor = '#759bc2';
                    fieldJson.objects[j].client['m.envmap.image'] = [
                      './js/3d/eim/images/sky.png',
                      './js/3d/eim/images/sky.png',
                      './js/3d/eim/images/sky.png',
                      './js/3d/eim/images/sky.png',
                      './js/3d/eim/images/sky.png',
                      './js/3d/eim/images/sky.png'
                    ];
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
            demo.Default.setupRoomFiled('3d_view');
            $interval.cancel(timer);
          } else if ($rootScope.settings.mode != 'server') {
            for (var j = 0; j < fieldJson.objects.length; j++) {
              if (fieldJson.objects[j].client) {
                fieldJson.objects[j].client.validateLicense = true;
                fieldJson.objects[j].sideColor = '#ff6b02';
                fieldJson.objects[j].topColor = '#ff6b02';
                fieldJson.objects[j].client['m.envmap.image'] = [
                  './js/3d/eim/images/sky.png',
                  './js/3d/eim/images/sky.png',
                  './js/3d/eim/images/sky.png',
                  './js/3d/eim/images/sky.png',
                  './js/3d/eim/images/sky.png',
                  './js/3d/eim/images/sky.png'
                ];
              }
            }
            demo.Default.setupRoomFiled('3d_view');
            $interval.cancel(timer);
          } else {
            console.log('not ready or no license');
          }
        }, 1000);
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.setSidebar = true;
    $rootScope.settings.layout.setFullscreen = true;
    $rootScope.settings.layout.setLabButton = false;
    $rootScope.settings.layout.setDeviceButton = false;  // SUCCESS
                                                         // $http.post($rootScope.settings.apiPath+"/experipage/getHoverContent",{equipNo:'MTS01'})
                                                         // .success(function(json){
                                                         //     console.log(json);
                                                         // });
                                                         //indexName: startRate/intactRate/utilizRate/durautilizRate/efficiencyCoeff
                                                         // $http.post($rootScope.settings.apiPath+"/experipage/getExperiIndex",{equipNo:'MTS01',indexName:'startRate'})
                                                         // .success(function(json){
                                                         //     console.log(json);
                                                         // });
  }
]);
;
angular.module('SeanApp').controller('MTSController', [
  'commService',
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$state',
  '$filter',
  function (commService, $rootScope, $scope, $http, $timeout, $state, $filter) {
    //渲染时序
    $scope.renderEquipTimeStatus = function (equipState, equipTime) {
      var equipData = [];
      for (var i = 0; i < equipTime.length; i++) {
        equipData.push([
          equipTime[i],
          equipState[i]
        ]);
      }
      var StateOption = {
          grid: {
            x: 40,
            y: 43,
            x2: 20,
            y2: 76
          },
          tooltip: {
            formatter: function (a, b, c, d) {
              var date = $filter('date')(new Date(a.value[0]), 'yyyy/MM/dd hh:mm:ss');
              var status = parseInt(a.value[1]) == 1 ? '\u8fd0\u884c' : '\u505c\u6b62';
              return date + ' ' + status;
            }
          },
          dataZoom: [{
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
              textStyle: { color: '#fff' }
            }],
          calculable: true,
          xAxis: [{
              type: 'time',
              boundaryGap: true,
              splitLine: { show: false },
              axisLabel: { textStyle: { color: '#fff' } }
            }],
          yAxis: [{
              max: 1,
              type: 'value',
              splitLine: { show: false },
              axisLabel: {
                formatter: function (a) {
                  return a == 1 ? '\u8fd0\u884c' : '\u505c\u6b62';
                },
                textStyle: { color: '#fff' }
              },
              splitNumber: 1
            }],
          series: [{
              name: '\u72b6\u6001',
              type: 'line',
              step: 'start',
              smooth: false,
              areaStyle: { normal: { color: '#A6E528' } },
              lineStyle: { normal: { color: '#A6E528' } },
              data: equipData
            }]
        };
      var myChart = echarts.init(document.getElementById('TimeStatus'), theme);
      myChart.setOption(StateOption);
    };
    //RPC表格初始化
    $scope.$on('ngRepeatFinished2', function (repeatFinishedEvent, element) {
      console.log('ngRepeatFinished2');
      $('#rpc').removeClass('hide');
      var warningMTSConfig = {
          'bStateSave': false,
          'orderable': false,
          'autoWidth': false,
          'aoColumns': [
            { sWidth: '80px' },
            { sWidth: '100px' },
            { sWidth: '60px' },
            { sWidth: '40px' },
            { sWidth: '40px' }
          ],
          'pagingType': 'bootstrap_full_number2',
          'bProcessing': true,
          'bLengthChange': false,
          'searching': false,
          'lengthMenu': [
            [
              5,
              10,
              10,
              -1
            ],
            [
              5,
              10,
              10,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'width': '20%',
              'orderable': false,
              'targets': 0
            },
            {
              'width': '40%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '20%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '10%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '10%',
              'searchable': false,
              'targets': 0
            }
          ],
          'order': [[
              0,
              'desc'
            ]]
        };
      $.extend($rootScope.tableConfig, warningMTSConfig);
      // if(typeof $scope.rpcTable != "undefined"){
      //     $scope.rpcTable.Rows.Clear();
      //     // $("#station").DataTable().destroy();
      // }
      $scope.rpcTable = $('#rpc').DataTable($rootScope.tableConfig);
    });
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      console.log('ngRepeatFinished');
      // $('input').uniform();
      $('#station').removeClass('hide');
      var warningMTSConfig = {
          'bStateSave': false,
          'orderable': false,
          'autoWidth': false,
          'autoWidth': false,
          'pagingType': 'bootstrap_full_number2',
          'bProcessing': true,
          'bLengthChange': false,
          'searching': false,
          'aoColumns': [
            { sWidth: '150px' },
            { sWidth: '200px' }
          ],
          'lengthMenu': [
            [
              5,
              10,
              15,
              -1
            ],
            [
              5,
              10,
              15,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1
              ]
            },
            {
              'searchable': false,
              'targets': [
                0,
                1
              ]
            }
          ],
          'order': [[
              0,
              'desc'
            ]]
        };
      $.extend($rootScope.tableConfig, warningMTSConfig);
      // if(typeof $scope.stationTable != "undefined"){
      //     $scope.stationTable.Rows.Clear();
      //     // $("#station").DataTable().destroy();
      // }
      $scope.stationTable = $('#station').DataTable(warningMTSConfig);
    });
    //mptWarning表格初始化
    $scope.$on('ngRepeatFinished3', function (repeatFinishedEvent, element) {
      var $mptWarning = $('#mpt-warning');
      //$mpt.removeClass("hide");
      var warningMTSConfig = {
          'bStateSave': false,
          'orderable': false,
          'autoWidth': false,
          'aoColumns': [
            { sWidth: '90px' },
            { sWidth: '60px' },
            { sWidth: '30px' },
            { sWidth: '60px' }
          ],
          'pagingType': 'bootstrap_full_number2',
          'bProcessing': true,
          'bLengthChange': false,
          'searching': false,
          'lengthMenu': [
            [
              5,
              10,
              10,
              -1
            ],
            [
              5,
              10,
              10,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'width': '20%',
              'orderable': false,
              'targets': 0
            },
            {
              'width': '40%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '20%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '10%',
              'searchable': false,
              'targets': 0
            }
          ],
          'order': [[
              0,
              'desc'
            ]]
        };
      $.extend($rootScope.tableConfig, warningMTSConfig);
      // if(typeof $scope.rpcTable != "undefined"){
      //     $scope.rpcTable.Rows.Clear();
      //     // $("#station").DataTable().destroy();
      // }
      $scope.mptWarningTable = $mptWarning.DataTable($rootScope.tableConfig);
    });
    //mptNormal表格初始化
    $scope.$on('ngRepeatFinished4', function (repeatFinishedEvent, element) {
      var $mptNormal = $('#mpt-normal');
      //$mpt.removeClass("hide");
      var warningMTSConfig = {
          'bStateSave': false,
          'orderable': false,
          'autoWidth': false,
          'aoColumns': [
            { sWidth: '90px' },
            { sWidth: '60px' },
            { sWidth: '30px' },
            { sWidth: '60px' }
          ],
          'pagingType': 'bootstrap_full_number2',
          'bProcessing': true,
          'bLengthChange': false,
          'searching': false,
          'lengthMenu': [
            [
              5,
              10,
              10,
              -1
            ],
            [
              5,
              10,
              10,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'width': '20%',
              'orderable': false,
              'targets': 0
            },
            {
              'width': '40%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '20%',
              'searchable': false,
              'targets': 0
            },
            {
              'width': '10%',
              'searchable': false,
              'targets': 0
            }
          ],
          'order': [[
              0,
              'desc'
            ]]
        };
      $.extend($rootScope.tableConfig, warningMTSConfig);
      // if(typeof $scope.rpcTable != "undefined"){
      //     $scope.rpcTable.Rows.Clear();
      //     // $("#station").DataTable().destroy();
      // }
      $scope.mptNormalTable = $mptNormal.DataTable($rootScope.tableConfig);
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.btn-group button').click(function () {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
      });
      var agilentOption = {
          grid: {
            x: 40,
            y: 43,
            x2: 20,
            y2: 76
          },
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [
                pt[0],
                '10%'
              ];
            }
          },
          dataZoom: [{
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
              textStyle: { color: '#fff' }
            }],
          calculable: true,
          xAxis: [{
              type: 'category',
              boundaryGap: true,
              splitLine: { show: false },
              data: [
                '',
                '',
                '',
                '',
                '',
                '',
                ''
              ],
              axisLabel: { textStyle: { color: '#fff' } }
            }],
          yAxis: [{
              type: 'value',
              splitLine: { show: false },
              axisLabel: {
                formatter: '{value} \xb0C',
                textStyle: { color: '#fff' }
              }
            }],
          series: []
        };
      var agilent = echarts.init(document.getElementById('bar2'), theme);
      agilent.setOption(agilentOption);
      $('#hoverBtn').on('hide.bs.dropdown', function () {
        $scope.chShowList = [];
        $scope.request = [];
        agilentOption.series = [{
            name: '',
            type: 'line',
            data: [
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          }];
        $('#CHList input[type=checkbox]').each(function (i, e) {
          if ($(this).is(':checked')) {
            var id = $(this).attr('data-id');
            $scope.chShowList.push(id);
            $scope.request.push(id);
          }
        });
        //agilent温度
        var api = $rootScope.settings.apiPath + '/equippage/getAgilentTemp';
        var request = { channelCode: $scope.request };
        $http.post(api, request).success(function (response) {
          //TODO 改list
          $scope.chShowList = $scope.agilentTemp = response;
          //agilent温度
          var api = $rootScope.settings.apiPath + '/equippage/getAgilentTime';
          // var request = {channelCode:$scope.request};
          console.log($scope.agilentTemp);
          $http.post(api, request).success(function (response) {
            var series = [];
            var xAxis = [];
            //TODO 改list
            $scope.agilentTime = response;
            if (response.length == 0 || response[0].agilentTemp.length == 0) {
              for (var i = 0; i < response.length; i++) {
                response[i].agilentTemp = [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                response[i].agilentTime = [
                  ' ',
                  ' ',
                  ' ',
                  ' ',
                  ' ',
                  '',
                  ' '
                ];
              }
            }
            // agilent = echarts.init(document.getElementById('bar2'));
            // agilent.setOption(agilentOption);
            //点击温度更新图表
            agilentOption.series = [];
            agilentOption.xAxis[0].data = [];
            if (response.length != 0 && response[0].agilentTemp.length != 0) {
              for (var i = 0; i < response.length; i++) {
                for (var j = 0, len = response[i].agilentTime.length; j < len; j++) {
                  if (response[i].agilentTime[j] != null) {
                    response[i].agilentTime[j] = commService.getTime({
                      time: response[i].agilentTime[j],
                      rule: 'MM-dd hh:mm:ss'
                    });
                  }
                }
                agilentOption.series.push({
                  name: 'CH' + response[i].channelCode,
                  type: 'line',
                  data: response[i].agilentTemp.reverse()
                });
                agilentOption.xAxis[0].data = response[i].agilentTime.reverse();
              }
              agilentOption.xAxis[0].data;
              agilent.setOption(agilentOption);
            }
          });
        });
      });
      var chartReady4 = {};
      window.onresize = function () {
        clearTimeout(chartReady4.timer);
        chartReady4.timer = setTimeout(function () {
          var json = $scope.getEquipTimeStatus;
          $scope.renderEquipTimeStatus(json.equipState, json.equipTime);
          agilent = echarts.init(document.getElementById('bar2'), theme);
          agilent.setOption(agilentOption);
        }, 100);
      };
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
    for (var ch = 103; ch < 123; ch++) {
      $scope.chList.push(ch);
    }
    // $rootScope.deviceName = $state.params.id;
    //设备菜单
    var url = '/equippage/getMainEquipMenu';
    var data = { equipType: 'MTS' };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $rootScope.equipMenu = json;
      for (var i = 0; i < json.length; i++) {
        if (json[i].equipNo == $state.params.id) {
          $rootScope.deviceName = json[i].equipName;
        }
      }
    });
    //获取设备状态
    var url = '/experipage/getEquipState';
    var data = {
        equipNo: $state.params.id,
        equipType: $state.current.name
      };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.statusInfo = {
        '0': {
          name: '\u505c\u6b62',
          color: '#DA7C19'
        },
        '1': {
          name: '\u8fd0\u884c',
          color: '#31A82C'
        },
        '2': {
          name: '\u6545\u969c',
          color: '#e35b5a'
        },
        '3': {
          name: '\u7a7a\u95f2',
          color: '#dddddd'
        },
        '4': {
          name: '\u5360\u4f4d',
          color: '#e35b5a'
        }
      };
      var status = 0;
      $rootScope.getMainExperiMenu = json;
      for (var i = 0; len = json.length; i++) {
        if (json[i].equipNo === $state.params.id) {
          status = json[i].status;
          break;
        }
      }
      $scope.statusText = $scope.statusInfo[status].name;
      $scope.statusColor = { color: $scope.statusInfo[status].color };
    });
    $scope.getWarnning = function (param, type) {
      var type = type || 'normal';
      if (param == 'RPC') {
        var url = '/equippage/getWarnningRPC';
        var data = { equipNo: $state.params.id };
        $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
          if (typeof $scope.rpcTable != 'undefined') {
            $scope.rpcTable.destroy();
          }
          $scope.RPC.data = json;
        });
      } else if (param == 'MPT' && type == 'warning') {
        var url = '/equippage/getWarnningMTS';
        var data = {
            equipNo: $state.params.id,
            equipType: 'MPT',
            statusType: 'warning'
          };
        $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
          //console.log($scope.rpcTable,json)
          if (typeof $scope.mptWarningTable != 'undefined') {
            $scope.mptWarningTable.destroy();  // $("#rpc").destroy();
          }
          $scope.mptWarning.data = json;
        });
      } else if (param == 'MPT' && type == 'normal') {
        var url = '/equippage/getWarnningMTS';
        var data = {
            equipNo: $state.params.id,
            equipType: 'MPT',
            statusType: 'normal'
          };
        $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
          //console.log($scope.rpcTable,json)
          if (typeof $scope.mptNormalTable != 'undefined') {
            $scope.mptNormalTable.destroy();  // $("#rpc").destroy();
          }
          $scope.mptNormal.data = json;
        });
      } else if (param == 'Station') {
        var url = '/equippage/getWarnningMTS';
        var data = {
            equipNo: $state.params.id,
            equipType: 'Station',
            statusType: type
          };
        $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
          //console.log(1,json)
          if (typeof $scope.stationTable != 'undefined') {
            $scope.stationTable.destroy();  // $("#rpc").destroy();
          }
          $scope.station = json;
        });
      }  /*switch(param){
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
    };
    $scope.getWarnning('Station', 'warning');
    $scope.getWarnning('RPC');
    $scope.getWarnning('MPT');
    $scope.getWarnning('MPT', 'warning');
    var RPCData = [{
          channel: 'RF Brake Force  XDCR',
          currentValue: 0.845445,
          equipNo: 'PEC0-01991',
          limitValue: -0.35723,
          seq: null,
          sequence: 'rro_4_withouttwist_nobrake_5_DRV_RSP',
          time: 0
        }];
    var mptWarningData = [{
          equipNo: 'mptWarningData',
          level: '4',
          msg: 'Undefined Controlling Application.',
          time: 1471269693000
        }];
    var mptNormalData = [{
          equipNo: 'mptNormalData',
          level: '6',
          msg: 'Undefined Controlling Application.',
          time: 1471269693000
        }];
    //一开始就加载，非点击才加载
    $scope.RPC = {};
    //RPC==1 show,RPC==0 hide;
    $scope.MPT = {};
    $scope.mptWarning = {};
    $scope.mptNormal = {};
    $scope.showWarnningData = function (param, type) {
      $scope.RPC.show = 0;
      $scope.MPT.show = 0;
      $scope.mptNormal.show = 0;
      $scope.mptWarning.show = 0;
      var type = type || 'normal';
      if (param == 'RPC') {
        $scope.RPC.show = 1;  //$scope.RPC.data=RPCData;
      } else if (param == 'MPT' && type == 'warning') {
        $scope.MPT.show = 1;
        $scope.mptWarning.show = 1;  //$scope.mptWarning.data=mptWarningData;
      } else if (param == 'MPT' && type == 'normal') {
        $scope.MPT.show = 1;
        $scope.mptNormal.show = 1;  //$scope.mptNormal.data=mptNormalData;
      }
    };
    $scope.showWarnningData('RPC');
    //时序
    url = '/equippage/getEquipTimeStatus';
    data = {
      equipNo: $state.params.id,
      equipType: $state.current.name
    };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getEquipTimeStatus = json;
      $scope.renderEquipTimeStatus(json.equipState, json.equipTime);
    });
  }
]).controller('HPUController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$state',
  function ($rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('$viewContentLoaded', function () {
      // 指定图表的配置项和数据
      var option = {
          title: {
            text: 'Weekly Weather',
            subtext: 'Lorem ipsum'
          },
          tooltip: { trigger: 'axis' },
          legend: {
            data: [
              'High',
              'Low'
            ]
          },
          calculable: true,
          xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: [
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sun'
              ]
            }],
          yAxis: [{
              type: 'value',
              axisLabel: {
                formatter: '{value} \xb0C',
                textStyle: { color: '#fff' }
              }
            }],
          series: [
            {
              name: 'High',
              type: 'line',
              data: [
                11,
                11,
                15,
                13,
                12,
                13,
                10
              ],
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: 'Max'
                  },
                  {
                    type: 'min',
                    name: 'Min'
                  }
                ]
              },
              markLine: {
                data: [{
                    type: 'average',
                    name: 'Mean'
                  }]
              }
            },
            {
              name: 'Low',
              type: 'line',
              data: [
                1,
                -2,
                2,
                5,
                3,
                2,
                0
              ],
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
            }
          ]
        };
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('bar1'), theme);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      var barReady2 = {};
      $(window).resize(function () {
        clearTimeout(barReady2.timer);
        barReady2.timer = setTimeout(function () {
          var myChart = echarts.init(document.getElementById('bar1'), theme);
          myChart.setOption(option);
          var json = $scope.getEquipTimeStatus;
          $scope.renderEquipTimeStatus(json.equipState, json.equipTime);
          renderChart('bar3', $scope.timeOptionWater);
          renderChart('bar4', $scope.timeOptionOil);
        }, 100);
      });
    });
    var renderChart = function (selector, option) {
      var myChart = echarts.init(document.getElementById(selector), theme);
      myChart.setOption(option);
    };
    //渲染时序
    $scope.renderEquipTimeStatus = function (equipState, equipTime) {
      var equipData = [];
      for (var i = 0; i < equipTime.length; i++) {
        equipData.push([
          equipTime[i],
          equipState[i]
        ]);
      }
      var StateOption = {
          grid: {
            x: 40,
            y: 43,
            x2: 20,
            y2: 76
          },
          tooltip: {
            formatter: function (a, b, c, d) {
              var date = $filter('date')(new Date(a.value[0]), 'yyyy/MM/dd hh:mm:ss');
              var status = parseInt(a.value[1]) == 1 ? '\u8fd0\u884c' : '\u505c\u6b62';
              return date + ' ' + status;
            }
          },
          dataZoom: [{
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
              textStyle: { color: '#fff' }
            }],
          calculable: true,
          xAxis: [{
              type: 'time',
              boundaryGap: true,
              splitLine: { show: false },
              axisLabel: { textStyle: { color: '#fff' } }
            }],
          yAxis: [{
              max: 1,
              type: 'value',
              splitLine: { show: false },
              axisLabel: {
                formatter: function (a) {
                  return a == 1 ? '\u8fd0\u884c' : '\u505c\u6b62';
                },
                textStyle: { color: '#fff' }
              },
              splitNumber: 1
            }],
          series: [{
              name: '\u72b6\u6001',
              type: 'line',
              step: 'start',
              smooth: false,
              areaStyle: { normal: { color: '#A6E528' } },
              data: equipData
            }]
        };
      var myChart = echarts.init(document.getElementById('TimeStatus'), theme);
      myChart.setOption(StateOption);
    };
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
        grid: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0
        },
        tooltip: { formatter: '{b} : {c} \xb0C' },
        series: [{
            center: [
              '51%',
              '50%'
            ],
            title: {
              offsetCenter: [
                0,
                '118%'
              ],
              textStyle: {
                fontWeight: 'bolder',
                fontSize: 14,
                fontStyle: '\u96c5\u9ed1',
                color: '#fff'
              }
            },
            type: 'gauge',
            detail: {
              formatter: '{value} \xb0C',
              offsetCenter: [
                2,
                '78%'
              ],
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            data: [{
                value: 50,
                name: '\u8fdb\u6c34\u53e3\u6e29\u5ea6'
              }],
            axisLine: {
              length: 1,
              lineStyle: { width: 5 }
            },
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            axisTick: {
              splitNumber: 5,
              length: 9,
              lineStyle: {
                color: 'auto',
                width: 1
              }
            },
            splitLine: {
              length: 10,
              lineStyle: { width: 4 }
            }
          }]
      };
    var waterIn = echarts.init(document.getElementById('waterIn'), theme);
    var waterOut = echarts.init(document.getElementById('waterOut'), theme);
    var oilIn = echarts.init(document.getElementById('oilIn'), theme);
    var oilOut = echarts.init(document.getElementById('oilOut'), theme);
    var oilOutAlarmLowValue = 0, oilOutAlarmHeighValue = 0;
    waterIn.setOption(gaugeOption);
    waterOut.setOption(gaugeOption);
    oilIn.setOption(gaugeOption);
    oilOut.setOption(gaugeOption);
    var barReady = {};
    $(window).resize(function () {
      clearTimeout(barReady.timer);
      barReady.timer = setTimeout(function () {
        waterIn = echarts.init(document.getElementById('waterIn'), theme);
        waterOut = echarts.init(document.getElementById('waterOut'), theme);
        oilIn = echarts.init(document.getElementById('oilIn'), theme);
        oilOut = echarts.init(document.getElementById('oilOut'), theme);
        //上下限颜色
        gaugeOption.series[0].axisLine.lineStyle.color = [
          [
            0,
            '#2EC5C7'
          ],
          [
            1,
            '#5AB1EF'
          ],
          [
            1,
            '#C7737B'
          ]
        ];
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterIn;
        gaugeOption.series[0].data[0].name = '\u8fdb\u6c34\u53e3\u6e29\u5ea6';
        waterIn.setOption(gaugeOption);
        gaugeOption.series[0].data[0].name = '\u51fa\u6c34\u53e3\u6e29\u5ea6';
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterOut;
        waterOut.setOption(gaugeOption);
        gaugeOption.series[0].data[0].name = '\u8fdb\u6cb9\u53e3\u6e29\u5ea6';
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilIn;
        oilIn.setOption(gaugeOption);
        if (oilOutAlarmLowValue == '' || oilOutAlarmLowValue == 0) {
          gaugeOption.series[0].axisLine.lineStyle.color = [
            [
              0,
              '#5AB1EF'
            ],
            [
              oilOutAlarmHeighValue / 100,
              '#5AB1EF'
            ],
            [
              1,
              '#C7737B'
            ]
          ];
        } else {
          gaugeOption.series[0].axisLine.lineStyle.color = [
            [
              oilOutAlarmLowValue / 100,
              '#C7737B'
            ],
            [
              oilOutAlarmHeighValue / 100,
              '#5AB1EF'
            ],
            [
              1,
              '#C7737B'
            ]
          ];
        }
        gaugeOption.series[0].data[0].name = '\u51fa\u6cb9\u53e3\u6e29\u5ea6';
        gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilOut;
        oilOut.setOption(gaugeOption);
        //出水温差，出油温差
        renderChart('bar4', $scope.timeOptionOil);
        renderChart('bar3', $scope.timeOptionWater);
      }, 100);
    });
    //设备菜单
    var url = '/equippage/getMainEquipMenu';
    var data = { equipType: 'HPU' };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $rootScope.equipMenu = json;
      for (var i = 0; i < json.length; i++) {
        if ($state.params.id == json[i].equipNo) {
          $rootScope.deviceName = json[i].equipName;
        }
      }
      if ($rootScope.deviceName == '') {
        $rootScope.deviceName = json[0].equipName;
      }
    });
    //var id = $state.params.id.replace("PE00-01993-0","HPU");
    var id = $state.params.id;
    //HPU时点
    url = '/equippage/getIndexMomentHPU';
    data = {
      equipNo: id,
      indexName: [
        'Iso4U',
        'Iso6U',
        'Iso14U',
        'NAS',
        'Saturation',
        'T_Env',
        'T_WaterIn',
        'T_WaterOut',
        'T_OilIn',
        'T_OilOut',
        'WaterPressure'
      ]
    };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getIndexMomentHPU = json;
      waterIn = echarts.init(document.getElementById('waterIn'), theme);
      waterOut = echarts.init(document.getElementById('waterOut'), theme);
      oilIn = echarts.init(document.getElementById('oilIn'), theme);
      oilOut = echarts.init(document.getElementById('oilOut'), theme);
      //上下限颜色
      gaugeOption.series[0].axisLine.lineStyle.color = [
        [
          0,
          '#2EC5C7'
        ],
        [
          1,
          '#5AB1EF'
        ],
        [
          1,
          '#C7737B'
        ]
      ];
      gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterIn;
      gaugeOption.series[0].data[0].name = '\u8fdb\u6c34\u53e3\u6e29\u5ea6';
      waterIn.setOption(gaugeOption);
      gaugeOption.series[0].data[0].name = '\u51fa\u6c34\u53e3\u6e29\u5ea6';
      gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_WaterOut;
      waterOut.setOption(gaugeOption);
      gaugeOption.series[0].data[0].name = '\u8fdb\u6cb9\u53e3\u6e29\u5ea6';
      gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilIn;
      oilIn.setOption(gaugeOption);
      //上下限显示红线范围
      oilOutAlarmHeighValue = json.oilOutAlarmHeighValue == '' ? 100 : json.oilOutAlarmHeighValue;
      oilOutAlarmLowValue = json.oilOutAlarmLowValue;
      if (oilOutAlarmLowValue == '' || oilOutAlarmLowValue == 0) {
        gaugeOption.series[0].axisLine.lineStyle.color = [
          [
            0,
            '#5AB1EF'
          ],
          [
            oilOutAlarmHeighValue / 100,
            '#5AB1EF'
          ],
          [
            1,
            '#C7737B'
          ]
        ];
      } else {
        gaugeOption.series[0].axisLine.lineStyle.color = [
          [
            oilOutAlarmLowValue / 100,
            '#C7737B'
          ],
          [
            oilOutAlarmHeighValue / 100,
            '#5AB1EF'
          ],
          [
            1,
            '#C7737B'
          ]
        ];
      }
      gaugeOption.series[0].data[0].name = '\u51fa\u6cb9\u53e3\u6e29\u5ea6';
      gaugeOption.series[0].data[0].value = $scope.getIndexMomentHPU.t_OilOut;
      oilOut.setOption(gaugeOption);
    });
    //HPU时序
    url = '/equippage/getIndexTimeHPU';
    data = { equipNo: id };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getTractiveEffort = json;
      console.log(json);
      var time = json.timeHPU;
      if (time == null)
        return;
      time = time.map(function (str) {
        var d = new Date(str);
        var t = d.getMonth() + 1 + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
        //console.log(t);
        return t;
      });
      var date = time.reverse();
      var data = json.equipState;
      //max min
      var maxNum = Math.max.apply(null, json.oilIn);
      maxNum = Math.ceil(maxNum + maxNum * 0.2);
      $scope.timeOptionOil = {
        grid: {
          x: 28,
          y: 23,
          x2: 0,
          y2: 68
        },
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [
              pt[0],
              '10%'
            ];
          }
        },
        legend: {
          top: 'bottom',
          data: ['\u65f6\u95f4']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date,
          splitLine: { show: false },
          axisLabel: { textStyle: { color: '#fff' } }
        },
        yAxis: {
          max: maxNum,
          type: 'value',
          boundaryGap: [
            0,
            '100%'
          ],
          splitLine: { show: false },
          axisLabel: { textStyle: { color: '#fff' } },
          splitNumber: 5
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
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
            textStyle: { color: '#fff' }
          }
        ],
        series: [
          {
            name: '\u8fdb\u6cb9',
            type: 'line',
            data: json.oilIn.reverse()
          },
          {
            name: '\u51fa\u6cb9',
            type: 'line',
            data: json.oilOut.reverse()
          },
          {
            name: '\u6e29\u5dee',
            type: 'line',
            data: json.oilGap.reverse()
          }
        ]
      };
      renderChart('bar4', $scope.timeOptionOil);
      var date = time;
      var data = json.equipState;
      //max min
      var maxNum = Math.max.apply(null, json.waterOut);
      maxNum = Math.ceil(maxNum + maxNum * 0.2);
      $scope.timeOptionWater = {
        grid: {
          x: 28,
          y: 23,
          x2: 0,
          y2: 68
        },
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [
              pt[0],
              '10%'
            ];
          }
        },
        legend: {
          top: 'bottom',
          data: ['\u65f6\u95f4']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date,
          splitLine: { show: false },
          axisLabel: { textStyle: { color: '#fff' } }
        },
        yAxis: {
          max: maxNum,
          type: 'value',
          boundaryGap: [
            0,
            '100%'
          ],
          splitLine: { show: false },
          axisLabel: { textStyle: { color: '#fff' } },
          splitNumber: 5
        },
        dataZoom: [
          {
            type: 'inside',
            start: 90,
            end: 100
          },
          {
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
            textStyle: { color: '#fff' }
          }
        ],
        series: [
          {
            name: '\u8fdb\u6c34',
            type: 'line',
            data: json.waterIn.reverse()
          },
          {
            name: '\u51fa\u6c34',
            type: 'line',
            data: json.waterOut.reverse()
          },
          {
            name: '\u6e29\u5dee',
            type: 'line',
            data: json.waterGap.reverse()
          }
        ]
      };
      renderChart('bar3', $scope.timeOptionWater);
    });
    var timeOption = {};
    //时序
    url = '/equippage/getEquipTimeStatus';
    data = {
      equipNo: 'BEP',
      equipType: id
    };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getEquipTimeStatus = json;
      $scope.renderEquipTimeStatus(json.equipState, json.equipTime);
    });
  }
]).controller('BEPController', [
  'commService',
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$state',
  function (commService, $rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent, element) {
      var warningBEPConfig = {
          'bStateSave': false,
          'orderable': false,
          'autoWidth': false,
          'bLengthChange': false,
          'searching': false,
          'pagingType': 'bootstrap_full_number2',
          'aoColumns': [
            { sWidth: '170px' },
            { sWidth: '300px' }
          ],
          'lengthMenu': [
            [
              7,
              10,
              -1
            ],
            [
              7,
              10,
              'All'
            ]
          ],
          'columnDefs': [
            {
              'orderable': false,
              'targets': [
                0,
                1
              ]
            },
            {
              'searchable': false,
              'targets': [
                0,
                1
              ]
            }
          ],
          'order': [[
              0,
              'desc'
            ]]
        };
      var tableConfig = $rootScope.tableConfig;
      $.extend(tableConfig, warningBEPConfig);
      $('#warningBEP').DataTable(tableConfig);
    });
    $scope.$on('$viewContentLoaded', function () {
      // 指定图表的配置项和数据
      var option = {
          grid: {
            x: 38,
            y: 43,
            x2: 40,
            y2: 85
          },
          tooltip: { trigger: 'axis' },
          calculable: true,
          xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: [
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' '
              ],
              splitLine: { show: false },
              axisLabel: { textStyle: { color: '#fff' } }
            }],
          yAxis: [{
              type: 'value',
              splitLine: { show: false },
              axisLabel: {
                formatter: '{value} N',
                textStyle: { color: '#fff' }
              }
            }],
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
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
              textStyle: { color: '#fff' }
            }
          ],
          series: [{
              name: 'High',
              type: 'line',
              data: [
                ,
                ,
                ,
                ,
                ,
                ,
              ]
            }]
        };
      $scope.option = option;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('bar1'), theme);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      // var myChart = echarts.init(document.getElementById('bar2'),theme);
      // myChart.setOption(StateOption);
      var chartReady5 = {};
      $(window).resize(function () {
        clearTimeout(chartReady5.timer);
        chartReady5.timer = setTimeout(function () {
          var json = $scope.getEquipTimeStatus;
          $scope.renderEquipTimeStatus(json.equipState, json.equipTime);
          myChart = echarts.init(document.getElementById('bar1'), theme);
          myChart.setOption(option);
        }, 100);  /*var myChart = echarts.init(document.getElementById('bar2'),theme);
             myChart.setOption(StateOption);*/
      });
    });
    //渲染时序
    $scope.renderEquipTimeStatus = function (equipState, equipTime) {
      var equipData = [];
      for (var i = 0; i < equipTime.length; i++) {
        equipData.push([
          equipTime[i],
          equipState[i]
        ]);
      }
      var StateOption = {
          grid: {
            x: 40,
            y: 43,
            x2: 20,
            y2: 76
          },
          tooltip: {
            formatter: function (a, b, c, d) {
              var date = $filter('date')(new Date(a.value[0]), 'yyyy/MM/dd hh:mm:ss');
              var status = parseInt(a.value[1]) == 1 ? '\u8fd0\u884c' : '\u505c\u6b62';
              return date + ' ' + status;
            }
          },
          dataZoom: [{
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
              textStyle: { color: '#fff' }
            }],
          calculable: true,
          xAxis: [{
              type: 'time',
              boundaryGap: true,
              splitLine: { show: false },
              axisLabel: { textStyle: { color: '#fff' } }
            }],
          yAxis: [{
              max: 1,
              type: 'value',
              splitLine: { show: false },
              axisLabel: {
                formatter: function (a) {
                  return a == 1 ? '\u8fd0\u884c' : '\u505c\u6b62';
                },
                textStyle: { color: '#fff' }
              },
              splitNumber: 1
            }],
          series: [{
              name: '\u72b6\u6001',
              type: 'line',
              step: 'start',
              smooth: false,
              areaStyle: { normal: { color: '#A6E528' } },
              lineStyle: { normal: { color: '#A6E528' } },
              data: equipData
            }]
        };
      var myChart = echarts.init(document.getElementById('TimeStatus'), theme);
      myChart.setOption(StateOption);
    };
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
    var url = '/equippage/getMainEquipMenu';
    var data = { equipType: 'BEP' };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $rootScope.equipMenu = json;
      for (var i = 0; i < json.length; i++) {
        if (json[i].equipNo == $state.params.id) {
          $rootScope.deviceName = json[i].equipName;  //console.log(json[i].equipNo,$state.params.id);
        }
      }  //TODO: error id , BEP 
    });
    //获取设备状态
    var url = '/experipage/getEquipState';
    var data = {
        equipNo: $state.params.id,
        equipType: $state.current.name
      };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.statusInfo = {
        '0': {
          name: '\u505c\u6b62',
          color: '#DA7C19'
        },
        '1': {
          name: '\u8fd0\u884c',
          color: '#31A82C'
        },
        '2': {
          name: '\u6545\u969c',
          color: '#e35b5a'
        },
        '3': {
          name: '\u7a7a\u95f2',
          color: '#dddddd'
        },
        '4': {
          name: '\u5360\u4f4d',
          color: '#e35b5a'
        }
      };
      var status = 0;
      $rootScope.getMainExperiMenu = json;
      for (var i = 0; len = json.length; i++) {
        if (json[i].equipNo === $state.params.id) {
          status = json[i].status;
          break;
        }
      }
      $scope.statusText = $scope.statusInfo[status].name;
      $scope.statusColor = { color: $scope.statusInfo[status].color };
    });
    //速度&风速&牵引力
    url = '/equippage/getIndexMomentBEP';
    data = { equipNo: $state.params.id };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getIndexMomentBEP = json;
    });
    //BEP报警
    url = '/equippage/getWarnningBEP';
    data = { equipNo: $state.params.id };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getWarnningBEP = json;
    });
    //牵引力曲线
    url = '/equippage/getTractiveEffort';
    data = { equipNo: $state.params.id };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      //commService
      $scope.getTractiveEffort = json;
      if (json.tractiveEffortTime && json.tractiveEffortTime.length >= 1) {
        var timeArr = [];
        json.tractiveEffortTime.forEach(function (item, index) {
          timeArr.unshift(commService.getTime({
            time: item,
            rule: 'MM-dd hh:mm:ss'
          }));
        });
        $scope.option.xAxis[0].data = timeArr;
        $scope.option.series[0].data = json.tractiveEffort;
        var myChart = echarts.init(document.getElementById('bar1'), theme);
        myChart.setOption($scope.option);
      }
    });
    //时序
    url = '/equippage/getEquipTimeStatus';
    data = {
      equipNo: $state.params.id,
      equipType: $state.current.name
    };
    $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
      $scope.getEquipTimeStatus = json;
      $scope.renderEquipTimeStatus(json.equipState, json.equipTime);
    });
  }
]).filter('moment', function () {
  return function (input, momentFn) {
    var args = Array.prototype.slice.call(arguments, 2), momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
}).filter('waterPressureFilter', function () {
  return function (waterPressure) {
    console.log(waterPressure);
    return waterPressure == 1 ? '\u8d85\u9650' : '\u6b63\u5e38';
  };
});
;
angular.module('SeanApp').controller('LabController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$state',
  '$window',
  '$filter',
  function ($rootScope, $scope, $http, $timeout, $state, $window, $filter) {
    var render3D = function (tooltip) {
      if (labInfo[$state.params.id].area.length == 2) {
        var position = {
            w: 800,
            h: 1400,
            d: 1400
          };
        $scope.doubleLabel = true;
        $scope.areaName = [
          labInfo[$state.params.id].area[0].name,
          labInfo[$state.params.id].area[1].name
        ];
        var tooltip = new Tooltip([
            '\u8bbe\u5907\u540d\u79f0\uff1a',
            '\u8bbe\u5907\u72b6\u6001\uff1a',
            '\u8bd5\u9a8c\u6b21\u6570\uff1a',
            '\u8bd5\u9a8c\u8fdb\u5ea6\uff1a',
            '\u6545\u969c\u63cf\u8ff0\uff1a'
          ], [
            '',
            '',
            '',
            '',
            ''
          ]);
        var a = demo.init('3d_view1', labInfo[$state.params.id].area[0]['json'], 1200, 500, position, tooltip);
        var b = demo.init('3d_view2', labInfo[$state.params.id].area[1]['json'], 1200, 500, position, tooltip);
      } else if (labInfo[$state.params.id].area.length == 1) {
        var position = {
            w: 800,
            h: 1400,
            d: 1400
          };
        $scope.doubleLabel = false;
        $scope.areaName = [labInfo[$state.params.id].area[0].name];
        var tooltip = new Tooltip([
            '\u8bbe\u5907\u540d\u79f0\uff1a',
            '\u8bbe\u5907\u72b6\u6001\uff1a',
            '\u6545\u969c\u63cf\u8ff0\uff1a'
          ], [
            '',
            '',
            ''
          ]);
        demo.init('3d_view1', labInfo[$state.params.id].area[0]['json'], 360, 500, position, tooltip);
      }
    };
    $scope.statusInfo = {
      '0': {
        name: '\u505c\u6b62',
        color: '#DA7C19',
        sideColor: '#c17424',
        topColor: '#DA7C19'
      },
      '1': {
        name: '\u8fd0\u884c',
        color: '#31A82C',
        sideColor: '#2d802a',
        topColor: '#31A82C'
      },
      '2': {
        name: '\u6545\u969c',
        color: '#e35b5a',
        sideColor: '#ae5958',
        topColor: '#e35b5a'
      },
      '3': {
        name: '\u7a7a\u95f2',
        color: '#dddddd',
        sideColor: '#999999',
        topColor: '#dddddd'
      },
      '4': {
        name: '\u5360\u4f4d',
        color: '#e35b5a',
        sideColor: '#b35554',
        topColor: '#e35b5a'
      }
    };
    $scope.status = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    };

    //报表配置项
      var optBar = {
        title: {show:false},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            tooltip: {
              show: true,
              formatter: "{b0}: {c0}%",
              trigger: 'item',
              axisPointer : {
                  type : 'shadow'
              }
            },
            xAxis: [{
              show: false,
              type: "category",
                data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                axisLabel: {interval:0}
            }],
            yAxis: [{
              show: false,
              type: "value"
            }],
            series: [{
              name: "",
                type: "bar"
            },{
              type: "line",
              name: "今年平均",
              markLine: {
                data: [{
                  name: "今年平均",
                  yAxis: 3
                }],
                itemStyle: {
                  normal: {
                    color: "#5c9bd1"
                  }
                }
              }
            }],
            color: ["#2b475d"]
      };
      var optLine = {
        title: {show:false},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            tooltip: {
              show: true,
              formatter: "{b0}: {c0}",
              trigger: 'axis',
              axisPointer : {
                  type : 'shadow'
              }
            },
            xAxis: [{
              show: false,
              type: "category",
                data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                axisLabel: {interval:0}
            }],
            yAxis: [{
              show: false,
              type: "value"
            }],
            series: [{
              name: "",
                type: "line",
                areaStyle: {normal: {}}
                
            },{
              type: "line",
              name: "今年平均",
              markLine: {
                data: [{
                  name: "今年平均",
                  yAxis: 3
                }],
                itemStyle: {
                  normal: {
                    color: "#ffc000"
                  }
                }
              }
            }],
            color: ["#ffbb00"]
      };

      var dataObj={},numArr=[],perArr=[];
      //初始化报表
      var efficiencyCoeffChart = echarts.init(document.getElementById("efficiencyCoeffDiv")); //实验效能系数
      var intactRateChart = echarts.init(document.getElementById("intactRateDiv")); //重点设备完好率
      var utilizRateChart = echarts.init(document.getElementById("utilizRateDiv")); //耐久型设备利用率
      var durautilizRateChart = echarts.init(document.getElementById("durautilizRateDiv")); //非耐久型设备利用率
      var startRateChart = echarts.init(document.getElementById("startRateDiv")); //在线设备开动率

      //根据Div的id获取EChart实例
      function getChartInst(divId) {
        switch(divId) {
          case "efficiencyCoeffDiv": 
            return efficiencyCoeffChart;
            break;
          case "intactRateDiv":
            return intactRateChart;
            break;
          case "utilizRateDiv":
            return utilizRateChart;
            break;
          case "durautilizRateDiv":
            return durautilizRateChart;
            break;
          case "startRateDiv": 
            return startRateChart;
            break;
          default: 
            return null;
            break;
        };
      }

      //根据Div的id获取EChart实例Dom
      function getChartDom(divId) {
        switch(divId) {
          case "efficiencyCoeffDiv": 
            return efficiencyCoeffChart.getDom();
            break;
          case "intactRateDiv":
            return intactRateChart.getDom();
            break;
          case "utilizRateDiv":
            return utilizRateChart.getDom();
            break;
          case "durautilizRateDiv":
            return durautilizRateChart.getDom();
            break;
          case "startRateDiv": 
            return startRateChart.getDom();
            break;
          default: 
            return null;
            break;
        };
      }

    $scope.$on('$viewContentLoaded', function () {

        //点击切换
        $(".chart-wrapper").on("click", function() {
          if(!$(this).hasClass("chart-wrapper-m")) {
            //交换信息位置
            var barMeta = $(this).find(".chart-meta").html();
            var lineMeta = $("#chartWrapper .chart-meta").html();
            $(this).find(".chart-meta").html(lineMeta);
            $("#chartWrapper .chart-meta").html(barMeta)
            //交换报表位置
            var barDivId = $(this).find(".chart-div").attr("id");
            var lineDivId = $("#chartWrapper .chart-div").attr("id");
            var barChart = getChartInst(barDivId);
            var lineChart = getChartInst(lineDivId);
            var barChartDom = getChartDom(barDivId);
            var lineChartDom = getChartDom(lineDivId);
            $("#chartWrapper").remove(".chart-div").append(barChartDom);
            $(this).remove(".chart-div").append(lineChartDom);
            //更改报表类型及大小
            optBar.series[0].data = dataObj[lineDivId].indexValue;
            optBar.series[1].markLine.data[0].yAxis = dataObj[lineDivId].indexCurrAvg;
            optBar.xAxis[0].data =  dataObj[lineDivId].indexDimension;
            lineChart.setOption(optBar);
            lineChart.resize();

            optLine.series[0].data = dataObj[barDivId].indexValue;
            optLine.series[1].markLine.data[0].yAxis = dataObj[barDivId].indexCurrAvg;
            optLine.xAxis[0].data =  dataObj[barDivId].indexDimension;
            barChart.setOption(optLine);
            barChart.resize();
          }
        });
    
      //浏览器窗口改变时，重置报表大小
      window.setTimeout(function() {
        window.onresize = function() {
          efficiencyCoeffChart.resize();
          intactRateChart.resize();
          utilizRateChart.resize();
          durautilizRateChart.resize();
          startRateChart.resize();
        };
      }, 200);

  });

  var labInfo = {
      'LAB02': {
        name: '\u7ed3\u6784\u8bd5\u9a8c\u5ba4',
        area: [
          {
            name: '\u8f66\u8eab\u7ed3\u6784\u8bd5\u9a8c\u533a',
            json: LAB02_HPU
          },
          {
            name: '\u5e95\u76d8\u7ed3\u6784\u8bd5\u9a8c\u533a',
            json: LAB02_MTS
          }
        ]
      },
      'LAB03': {
        name: 'PS\u6574\u8f66\u6392\u653e\u53ca\u6027\u80fd\u8bd5\u9a8c\u5ba4',
        area: [{
            name: 'PS\u6574\u8f66\u6392\u653e\u53ca\u6027\u80fd\u8bd5\u9a8c\u533a',
            json: LAB03_BEP
          }]
      }
  };

  render3D();

  if (typeof labInfo[$state.params.id] == 'undefined') {
    $window.history.back();
    return;
  }
  $rootScope.labName = labInfo[$state.params.id].name;
  // set sidebar closed and body solid layout mode
  $rootScope.settings.layout.pageContentWhite = true;
  $rootScope.settings.layout.pageBodySolid = false;
  $rootScope.settings.layout.pageSidebarClosed = false;
  $rootScope.settings.layout.setSidebar = false;
  $rootScope.settings.layout.setFullscreen = false;
  $rootScope.settings.layout.setDeviceButton = false;
  $rootScope.settings.layout.setLabButton = true;
  
  var url = '/experipage/getExperiIndex';
  var data = {
    experiNo: $state.params.id,
    indexName: [
      'startRate',
      'intactRate',
      'utilizRate',
      'durautilizRate',
      'efficiencyCoeff'
    ]
  };
  

  $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
    $scope.getExperiIndex = json;

    for (var i = 0; i < json.length; i++) {
      //(function(i){
      // var maxNum = Math.max(json[i].indexAvgValue, json[i].indexLastValue, Math.max.apply(null, json[i].indexValue));
      // maxNum = Math.ceil(maxNum + maxNum * 0.2);
      if (json[i].indexName === 'startRate') {
        // var op = JSON.stringify(option);
        // $scope.startRate = JSON.parse(op);
        // $scope.startRate.tooltip.text = '\u8bbe\u5907\u5f00\u52a8\u7387';
        // $scope.startRate.series[0].data = json[i].indexValue;
        // $scope.startRate.series[1].markLine.data[0].yAxis = json[i].indexAvgValue;
        // $scope.startRate.series[2].markLine.data[0].yAxis = json[i].indexLastValue;
        // //maxNum=maxNum>100?100:maxNum;
        // $scope.startRate.yAxis[0].max = 100;
        // var myChart1 = echarts.init(document.getElementById('startRate'), theme);
        // myChart1.setOption($scope.startRate);
        $scope.startRate = json[i];
      } else if (json[i].indexName === 'intactRate') {
        // var op = JSON.stringify(option);
        // $scope.intactRate = JSON.parse(op);
        // $scope.intactRate.series[0].data = json[i].indexValue;
        // $scope.intactRate.series[1].markLine.data[0].yAxis = json[i].indexAvgValue;
        // $scope.intactRate.series[2].markLine.data[0].yAxis = json[i].indexLastValue;
        // //maxNum=maxNum>100?100:maxNum;
        // $scope.intactRate.yAxis[0].max = 110;
        // $scope.intactRate.yAxis[0].min = 80;
        // var myChart2 = echarts.init(document.getElementById('intactRate'), theme);
        // myChart2.setOption($scope.intactRate);

        $scope.intactRate = json[i];
      } else if (json[i].indexName === 'utilizRate') {
        // var op = JSON.stringify(option);
        // $scope.utilizRate = JSON.parse(op);
        // if (json[i].indexValue) {
        //   json[i].indexValue = json[i].indexValue.map(function (item, index) {
        //     return item < 20 ? '&nbps;' : item;
        //   });
        // }
        // $scope.utilizRate.series[0].data = json[i].indexValue;
        // $scope.utilizRate.series[1].markLine.data[0].yAxis = json[i].indexAvgValue;
        // $scope.utilizRate.series[2].markLine.data[0].yAxis = json[i].indexLastValue;
        // $scope.utilizRate.yAxis[0].max = 80;
        // $scope.utilizRate.yAxis[0].min = 20;
        // var myChart3 = echarts.init(document.getElementById('utilizRate'), theme);
        // myChart3.setOption($scope.utilizRate);
        $scope.utilizRate = json[i];
      } else if (json[i].indexName === 'durautilizRate') {
        // var op = JSON.stringify(option);
        // $scope.durautilizRate = JSON.parse(op);
        // $scope.durautilizRate.series[0].data = json[i].indexValue;
        // $scope.durautilizRate.series[1].markLine.data[0].yAxis = json[i].indexAvgValue;
        // $scope.durautilizRate.series[2].markLine.data[0].yAxis = json[i].indexLastValue;
        // //maxNum=maxNum>100?100:maxNum;
        // $scope.durautilizRate.yAxis[0].max = 300;
        // var myChart4 = echarts.init(document.getElementById('durautilizRate'), theme);
        // myChart4.setOption($scope.durautilizRate);
        $scope.durautilizRate = json[i];
      } else if (json[i].indexName === 'efficiencyCoeff') {
        // var op = JSON.stringify(option);
        // $scope.efficiencyCoeff = JSON.parse(op);
        // $scope.efficiencyCoeff.series[0].data = json[i].indexValue;
        // $scope.efficiencyCoeff.series[1].markLine.data[0].yAxis = json[i].indexAvgValue;
        // $scope.efficiencyCoeff.series[2].markLine.data[0].yAxis = json[i].indexLastValue;
        // $scope.efficiencyCoeff.yAxis[0].max = maxNum;
        // var myChart5 = echarts.init(document.getElementById('efficiencyCoeff'), theme);
        // myChart5.setOption($scope.efficiencyCoeff);
        $scope.efficiencyCoeff = json[i];
      }  //})(i);
    }

    var hash = window.location.hash;
    if(hash=="#/lab/LAB02") {
      dataObj = {
        efficiencyCoeffDiv: {
          indexValue:$scope.efficiencyCoeff.indexValue,
          indexCurrAvg:$scope.efficiencyCoeff.indexCurrAvg,
          indexDimension:$scope.efficiencyCoeff.indexDimension
        },
        intactRateDiv:{
          indexValue:$scope.intactRate.indexValue,
          indexCurrAvg:$scope.intactRate.indexCurrAvg,
          indexDimension:$scope.intactRate.indexDimension
        },
        utilizRateDiv:{
          indexValue:$scope.utilizRate.indexValue,
          indexCurrAvg:$scope.utilizRate.indexCurrAvg,
          indexDimension:$scope.utilizRate.indexDimension
        },
        durautilizRateDiv: {
          indexValue:$scope.durautilizRate.indexValue,
          indexCurrAvg:$scope.durautilizRate.indexCurrAvg,
          indexDimension:$scope.durautilizRate.indexDimension
        },
        startRateDiv: {
          indexValue:$scope.startRate.indexValue,
          indexCurrAvg:$scope.startRate.indexCurrAvg,
          indexDimension:$scope.startRate.indexDimension
        }
      };

      //初始化进度条
      numArr = [$scope.efficiencyCoeff.indexCurrValue, 
      $scope.intactRate.indexCurrValue, 
      $scope.utilizRate.indexCurrValue, 
      $scope.durautilizRate.indexCurrValue, 
      $scope.startRate.indexCurrValue];

      perArr = [$scope.efficiencyCoeff.indexYOYValue, 
      $scope.intactRate.indexYOYValue, 
      $scope.utilizRate.indexYOYValue, 
      $scope.durautilizRate.indexYOYValue, 
      $scope.startRate.indexYOYValue];

      //初始化进度条
      $(".chart-meta h3").each(function(i) {
        $(this).html(numArr[i]);
        console.log(perArr[i]);
        if(perArr[i]<0){
           $(this).addClass('h3-red');
        }

      });
      
      $(".progress-bar").each(function(i) {
        var w = Math.abs(perArr[i]) + "%";
        $(this).animate({
          width: w
        }, 800);

        if(perArr[i]<0){
           $(this).addClass('progress-bar-red');
        }

      });

      $(".chart-num").each(function(i) {
        $(this).html(Math.abs(perArr[i]));

        var arrow = $(this).prev('.fa');
        if(perArr[i]>0){
          arrow.addClass('fa-long-arrow-up');
        }else if(perArr[i]<0){
          arrow.addClass('fa-long-arrow-down');
        }
      });

    }else {
      dataObj = {
        efficiencyCoeffDiv: {
          indexValue:$scope.efficiencyCoeff.indexValue,
          indexCurrAvg:$scope.efficiencyCoeff.indexCurrAvg,
          indexDimension:$scope.efficiencyCoeff.indexDimension
        },
        intactRateDiv:{
          indexValue:$scope.intactRate.indexValue,
          indexCurrAvg:$scope.intactRate.indexCurrAvg,
          indexDimension:$scope.intactRate.indexDimension
        },
        utilizRateDiv:{
          indexValue:$scope.utilizRate.indexValue,
          indexCurrAvg:$scope.utilizRate.indexCurrAvg,
          indexDimension:$scope.utilizRate.indexDimension
        },
        durautilizRateDiv: {
          indexValue:$scope.durautilizRate.indexValue,
          indexCurrAvg:$scope.durautilizRate.indexCurrAvg,
          indexDimension:$scope.durautilizRate.indexDimension
        },
        startRateDiv: {
          indexValue:$scope.startRate.indexValue,
          indexCurrAvg:$scope.startRate.indexCurrAvg,
          indexDimension:$scope.startRate.indexDimension
        }
      };

      //初始化进度条
      numArr = [$scope.efficiencyCoeff.indexCurrValue, 
      $scope.intactRate.indexCurrValue, 
      $scope.utilizRate.indexCurrValue, 
      $scope.durautilizRate.indexCurrValue, 
      $scope.startRate.indexCurrValue];

      perArr = [$scope.efficiencyCoeff.indexYOYValue, 
      $scope.intactRate.indexYOYValue, 
      $scope.utilizRate.indexYOYValue, 
      $scope.durautilizRate.indexYOYValue, 
      $scope.startRate.indexYOYValue];

      $(".chart-meta h3").each(function(i) {
        $(this).html(numArr[i]);
        console.log(perArr[i]);
        if(perArr[i]<0){
           $(this).addClass('h3-red');
        }

      });
      
      $(".progress-bar").each(function(i) {
        var w = Math.abs(perArr[i]) + "%";
        $(this).animate({
          width: w
        }, 800);

        if(perArr[i]<0){
           $(this).addClass('progress-bar-red');
        }

      });

      $(".chart-num").each(function(i) {
        $(this).html(Math.abs(perArr[i]));

        var arrow = $(this).prev('.fa');
        if(perArr[i]>0){
          arrow.addClass('fa-long-arrow-up');
        }else if(perArr[i]<0){
          arrow.addClass('fa-long-arrow-down');
        }
      });
    }

    console.log(dataObj['efficiencyCoeffDiv']);

    //配置报表
    var opLineCopy = angular.copy(optLine);
    opLineCopy.series[0].data = dataObj['efficiencyCoeffDiv'].indexValue;
    opLineCopy.series[1].markLine.data[0].yAxis = dataObj['efficiencyCoeffDiv'].indexCurrAvg;
    opLineCopy.xAxis[0].data =  dataObj['efficiencyCoeffDiv'].indexDimension;
    efficiencyCoeffChart.setOption(opLineCopy);

    var optBarCopy = angular.copy(optBar);
    optBarCopy.series[0].data = dataObj['intactRateDiv'].indexValue;
    optBarCopy.series[1].markLine.data[0].yAxis = dataObj['intactRateDiv'].indexCurrAvg;
    optBarCopy.xAxis[0].data =  dataObj['intactRateDiv'].indexDimension;
    intactRateChart.setOption(optBarCopy);

    var optBarCopy = angular.copy(optBar);
    optBarCopy.series[0].data = dataObj['utilizRateDiv'].indexValue;
    optBarCopy.series[1].markLine.data[0].yAxis = dataObj['utilizRateDiv'].indexCurrAvg;
    optBarCopy.xAxis[0].data =  dataObj['utilizRateDiv'].indexDimension;
    utilizRateChart.setOption(optBarCopy);

    var optBarCopy = angular.copy(optBar);
    optBarCopy.series[0].data = dataObj['durautilizRateDiv'].indexValue;
    optBarCopy.series[1].markLine.data[0].yAxis = dataObj['durautilizRateDiv'].indexCurrAvg;
    optBarCopy.xAxis[0].data =  dataObj['durautilizRateDiv'].indexDimension;
    durautilizRateChart.setOption(optBarCopy);

    var optBarCopy = angular.copy(optBar);
    optBarCopy.series[0].data = dataObj['startRateDiv'].indexValue;
    optBarCopy.series[1].markLine.data[0].yAxis = dataObj['startRateDiv'].indexCurrAvg;
    optBarCopy.xAxis[0].data =  dataObj['startRateDiv'].indexDimension;
    startRateChart.setOption(optBarCopy);

  });
  //实验室对应设备
  var url = '/experipage/getMainExperiMenu';
  var data = { experiNo: $state.params.id };
  $http.post($rootScope.settings.apiPath + url, JSON.stringify(data)).success(function (json) {
    var json3D = null;
    if (labInfo[$state.params.id].area.length == 2) {
      json3D = labInfo[$state.params.id].area[1]['json'].objects;
    } else if (labInfo[$state.params.id].area.length == 1) {
      json3D = labInfo[$state.params.id].area[0]['json'].objects;
    }
    $rootScope.getMainExperiMenu = json;
    //change state
    for (var i = 0; i < json.length; i++) {
      $scope.status[json[i].status - 0]++;
    }
    for (var i = 0; i < json.length; i++) {
      for (var j = 0; j < json3D.length; j++) {
        if (json3D[j].client && json[i].equipNo == json3D[j].client.id) {
          //$scope.status[1]++;
          var status = parseInt(json[i].status) || '0';
          //??
          status = status.toString();
          json3D[j].client.status = $scope.statusInfo[status].name;
          json3D[j].client.cycle = json[i].cycle;
          json3D[j].client.progress = json[i].progress;
          json3D[j].client.faultMsg = json[i].faultMsg;
          json3D[j].sideColor = $scope.statusInfo[status].sideColor;
          json3D[j].topColor = $scope.statusInfo[status].topColor;
        }
      }
    }
    //render
    render3D();
  });
}
]);