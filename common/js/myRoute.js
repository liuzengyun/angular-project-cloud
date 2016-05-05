//这些事一些公用的angularJS文件,所以统一定义到这里
var id = sessionStorage.getItem("id");
// 引入路由和动态懒加载和分页依赖
var cloud = angular.module("cloud", ["ngRoute", "infinite-scroll", "ui.bootstrap", "ngFileUpload"]);
if (id == "" || id == "undefined" || id == null) {
    window.location.href = "../index.html";
}
// 公用的一些接口
cloud.controller("commonCtrl", function ($scope, $http) {
    $scope.uid = sessionStorage.getItem("id");
    // 登陆成功,获取登陆信息
    $http.get(url+"common/user", {params:{id: id}}).success(function(data) {
        consoleLog(data);
        $scope.name = data.data[0].name;
        $scope.email = data.data[0].email;
        $scope.phone = data.data[0].phone;
        $scope.tel = data.data[0].tel;
    });

    // 修改基本信息
    $scope.editBaseInfo = function() {
        var data = {
            id: id,
            phone: $scope.phone,
            tel: $scope.tel,
            email: $scope.email
        };
        editBaseInfo($scope, $http, data);
    };
    // 退出
    $scope.loginOut = function () {
        // 清除h5本地session
        sessionStorage.clear();
        $http.get(url + "login/logout").success(function (data) {
            window.location.href = "../index.html";
            console.log(data);
        });
    };
    //修改密码
    $scope.updatePassword = function (argue) {
        if ($scope.newPass != $scope.oldPassToo) {
            alert("新密码两次输入不一致");
            return false;
        }
        else {
            if ($scope.newPass == "") {
                alert("新密码不能为空");
            }
            else {
                var data = {
                    uid: $scope.uid,
                    old_pass: $scope.oldPass,
                    new_pass: $scope.newPass
                };
                consoleLog(data);
                $http.post(url + argue, data).success(function (data) {
                    alert(data.message);
                    window.location.reload();
                    consoleLog(data);
                })
            }
        }
    };
    // 通知是否过期
    $http.get(url + "common/item_status", {params: {uid: id}}).success(function (data) {
        consoleLog(data);
    });
    // 是否有新的通知
    $http.get(url + "common/notices", {params: {uid: id}}).success(function (data) {
        consoleLog(data);
        if (data.length > 0) {
            $scope.noticeData = data;
            $scope.noticeStatus = false;
        }
        else {
            $scope.noticeStatus = true;
        }
    });
    // 修改通知状态
    $scope.noticeStatusFun = function (nid) {
        $http.get(url + "common/notice_update", {params: {nid: nid}}).success(function (data) {
            consoleLog(data);
            window.location.href = "#/project/" + nid;
        });
    }
});


// 自定义鼠标单击效果指令
cloud.directive('hoverBg', function () {
    return {
        restrict: "C",
        link: function (scope, element, attrs) {
            element.mouseover(function () {
                element.addClass('hoverBg');
            });
            element.mouseout(function () {
                element.removeClass('hoverBg');
            });
        }
    }
});

// 自定义分割过滤 名称splite
cloud.filter('splite', function () {
    return function (str) {
        // 刚加载 先判断一下 如果为空 那么就停止执行, 如果有值,那么菜分割
        if (str == undefined) {
            return false;
        }
        var arr = str.split("##");
        var finalString = "";
        if (arr.length == 1) {
            finalString = arr[0];
        }
        else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != "") {
                    finalString += i + 1 + ". " + arr[i] + "  ";
                }
            }
        }
        return finalString;
    }
});

// splitArr
cloud.filter('splitArr', function () {
    return function (str) {
        // 刚加载 先判断一下 如果为空 那么就停止执行, 如果有值,那么菜分割
        if (str == undefined) {
            return "";
        }
        var splitArr = str.split("##");
        return splitArr;
    }
});

// 自定义过滤 如果没有天数 那么默认为0
cloud.filter('underfinedNull', function () {
    return function (str) {
        if (str == "" || str == "undefined" || str == null) {
            str = 0;
            return str;
        }
        else {
            return str;
        }
    }
});

// 自定义单击导航字体高亮 指令
//cloud.directive("clickBg", function () {
//    return {
//        restrict: 'C',
//        link: function (scope, element, attrs) {
//            element.click(function () {
//                element.css("color", "#fff");
//                element.parent().siblings().not(".dropdown").find("a").css("color", "#ddd");
//            });
//        }
//    }
//});