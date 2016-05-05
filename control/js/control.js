function cloudCtrl($routeProvider) {
    $routeProvider
        .when("/", {
            controller: projectCtrl,
            templateUrl: 'project.html'
        })
        .when("/baseInfo/:id", {
            controller: baseInfoCtrl,
            templateUrl: 'baseInfo.html'
        })

        .when("/files/:id", {
            controller: filesCtrl,
            templateUrl: 'files.html'
        })
        .when("/fileInfo/:id", {
            controller: fileInfoCtrl,
            templateUrl: 'fileInfo.html'
        })
        .otherwise({
            redirectTo: "/"
        });
}
// 配置路由到angularjs
cloud.config(cloudCtrl);

// 读取项目的控制器
// 设置默认待评审项目
function projectCtrl($scope, $http) {
    // 查询项目
    $http.get(url + "control/projects", {params: {uid: id, status: "待评审项目"}}).success(function (data) {
        consoleLog(data);
        if (data.status == true) {
            $scope.data = data.data.data;
            $scope.maxItems = data.data.maxRows;
            $scope.maxPage = data.data.maxPage;

            // 插件中默认是10条为一页,现在是9条一页 所以要修改插件
            $scope.maxSize = 5; // 显示最大页数
            $scope.bigTotalItems = $scope.maxItems;
            $scope.bigCurrentPage = 1;
        }
    });
    // 搜索项目
    // 初始化
    $scope.statusChange = function () {
        $http.get(url + "control/projects", {params: {uid: id, status: $scope.status}}).success(function (data) {
            consoleLog(data);
            if (data.status == true) {
                $scope.data = data.data.data;
                $scope.maxItems = data.data.maxRows;
                $scope.maxPage = data.data.maxPage;

                $scope.maxSize = 5; // 显示最大页数
                $scope.bigTotalItems = $scope.maxItems;
                $scope.bigCurrentPage = 1;
            }
        });
    };
    // 分页ng-change()传递参数为当前页
    $scope.status = "待评审项目";
    //页面传递过来单击页码参数
    $scope.pageChanged = function (page) {
        $http.get(url + "control/projects", {
            params: {
                uid: id,
                page: page,
                status: $scope.status
            }
        }).success(function (data) {
            $scope.data = data.data.data;
            consoleLog(data);
        });
    };

    // 补充材料单击,传递pid
    $scope.addFiles = function (pid) {
        $scope.signPid = pid;
    };

    // 打回
    $scope.signBack = function (pid) {
        if (confirm("您确定打回此项目吗?")) {
            $http.get(url + "control/push_back", {params: {uid: id, pid: pid}}).success(function (data) {
                consoleLog(data);
                window.location.reload();
            });
        }
    }
}
// 项目基本信息的控制器
function baseInfoCtrl($scope, $http, $routeParams) {
    // 每次单击将pid存储到session中
    sessionStorage.setItem("commonPid", $routeParams.id);
    $scope.commonPid = $routeParams.id;

    // 调用公共接口 查看基本信息
    var params = {
        pid: $routeParams.id
    };
    commonProject($scope, $http, params);

    //修改基本信息
    $scope.editInfo = function () {
        var data = {
            pid: $routeParams.id,
            uid: id,
            project_name: $scope.data.project.name
        };
        consoleLog(data);
        $http.post(url + "control/project_name_update", data).success(function (data) {
            alert(data.message);
            window.location.reload();
            consoleLog(data);
        });
    };
}
function filesCtrl($scope, $http, $routeParams) {
    // 每次单击将pid存储到session中
    sessionStorage.setItem("commonPid", $routeParams.id);
    $scope.commonPid = $routeParams.id;

}
function fileInfoCtrl($scope, $http, $routeParams) {
    $scope.commonPid = sessionStorage.getItem("commonPid");
    // 调用这个就会返回 filesData
    files($scope, $http, $scope.commonPid, id, $routeParams.id);

    $scope.typeId = $routeParams.id;

}
// 提交评审,补充材料,上传文件
cloud.controller("signFile", ['$scope', 'Upload', function ($scope, Upload) {
    $scope.fileInfo = $scope.file;
    $scope.signFile = function () {
        $scope.upload($scope.file);
    };
    $scope.upload = function (file) {
        var data = {
            uid: id,
            pid: $scope.signPid,
            file: file,
            res: $scope.signResult,
            time: $scope.signTime
        };
        consoleLog(data);
        Upload.upload({
            url: url + 'control/review',
            data: {
                uid: id,
                pid: $scope.signPid,
                file: file,
                res: $scope.signResult,
                time: $scope.signTime
            }
            //成功的情况
        }).progress(function (evt) {
            //这就是进度的对象
            consoleLog(evt);
            //进度条
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.pro = progressPercentage;
            consoleLog('progess:' + progressPercentage + '%');
            $(".progress-striped").show();
            $scope.progress = $scope.pro;
            //失败的情况
            setTimeout(function () {
                if ($scope.progress == 100) {
                    window.location.reload();
                }
            }, 1000);
        }).success(function (data, status, headers, config) {
            consoleLog(data);
        }).error(function (data) {
            consoleLog(data);
        })
    }
}]);
// 上传案件材料
cloud.controller("uploadFile", ['$scope', 'Upload', function ($scope, Upload) {
    $scope.fileInfo = $scope.file;
    $scope.signFile = function () {
        $scope.upload($scope.file);
    };
    $scope.upload = function (file) {
        Upload.upload({
            url: url + 'common/file',
            data: {
                uid: id,
                pid: $scope.commonPid,
                file: file,
                type: 1
            }
            //成功的情况
        }).progress(function (evt) {
            //这就是进度的对象
            consoleLog(evt);
            //进度条
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.pro = progressPercentage;
            consoleLog('progess:' + progressPercentage + '%');
            $(".progress-striped").show();
            $scope.progress = $scope.pro;
            //失败的情况
            setTimeout(function () {
                if ($scope.progress == 100) {
                    window.location.reload();
                }
            }, 1000);
        }).success(function (data, status, headers, config) {
            consoleLog(data);
        }).error(function (data) {
            consoleLog(data);
        })
    }
}]);

