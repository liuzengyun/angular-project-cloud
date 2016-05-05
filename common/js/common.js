// 定义统一url的前半部分
var url = "http://localhost/cloud_api/index.php/";
//var url = "http://api.beyondwinlaw.com/test/cloud_api/index.php/";

// 定义统一的console.log()
function consoleLog(data) {
    console.log(data);
}

// 进度
function speed($scope, $http, pid, uid) {
    $http.get(url + "common/record", {params: {uid: uid, pid: pid}}).success(function (data) {
        consoleLog(data);
        $scope.data = data;
        return $scope.data;
    })
}

// 文件
function files($scope, $http, pid, uid, file_type) {
    $http.get(url + "common/files", {params: {uid: uid, pid: pid, file_type: file_type}}).success(function (data) {
        $scope.filesData = data;
        consoleLog($scope.filesData);
    })
}

// 结项
function result($scope, $http, pid, uid) {
    $http.get(url + "common/project_modules", {params: {uid: uid, pid: pid}}).success(function (data) {
        consoleLog(data);
        $scope.endProjectData = data;
    });
}

// 结项条目
function projectModule($scope, $http, pmid, uid) {
    $http.get(url + "common/items", {params: {pmid: pmid, uid: uid}}).success(function (data) {
        $scope.projectModuleData = data;
        consoleLog(data);
    })
}

// 操作条目 公共接口
function projectItem($scope, $http, data) {
    $http.post(url + "common/item_update", data).success(function (result) {
        consoleLog(result);
        window.location.reload();
    })
}

// 修改个人信息
function editBaseInfo($scope, $http, data) {
    $http.post(url + "common/user_update", data).success(function (data) {
        consoleLog(data);
        alert(data.message);
        window.location.reload();
    })
}

// 查看项目信息
function commonProject($scope, $http, params) {
    $http.get(url + "common/project", {params: params}).success(function (data) {
        $scope.data = data.data;
        consoleLog($scope.data);
    })
}