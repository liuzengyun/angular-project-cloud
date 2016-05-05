var cloud = angular.module("cloud", [], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
// angularjs post提交数据转换
cloud.config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
});

cloud.controller("loginCtrl", function ($scope, $http) {
    $scope.message = "";
    $scope.submitLogin = function () {
        var data = {
            username: $scope.username,
            pass: $scope.password
        };
        console.log(data);
        $http.post(url + "login/login", data).success(function (data) {
            console.log(data);
            $scope.message = data.message;
            if (data.status == true) {
                if (data.user["status"] == 1) {
                    sessionStorage.setItem("id", data.user.id);
                    sessionStorage.setItem("phone", data.user.phone);
                    sessionStorage.setItem("type", data.user.type);
                    sessionStorage.setItem("name", data.user.name);
                    sessionStorage.setItem("firm", data.user.firm);
                    sessionStorage.setItem("email", data.user.email);
                    sessionStorage.setItem("tel", data.user.tel);
                    sessionStorage.setItem("position", data.user.position);

                    switch (data.user["type"]) {
                        case "0":
                            window.location.href = "admin/index.html";
                            break;
                        case "1":
                            window.location.href = "sales/index.html";
                            break;
                        case "2":
                            window.location.href = "control/index.html";
                            break;
                        case "3":
                            window.location.href = "manager/index.html";
                            break;
                        case "4":
                            window.location.href = "client/index.html";
                            break;
                        case "5":
                            window.location.href = "lawyer/index.html";
                            break;
                    }
                }
                if (data.user["status"] == 2) {
                    alert("账号待激活!");
                }
                if (data.user["status"] == 3) {
                    alert("禁用账号!");
                }
                if (data.user["status"] == 4) {
                    sessionStorage.setItem("id", data.user.id);
                    sessionStorage.setItem("phone", data.user.phone);
                    sessionStorage.setItem("type", data.user.type);
                    sessionStorage.setItem("name", data.user.name);
                    sessionStorage.setItem("firm", data.user.firm);
                    sessionStorage.setItem("email", data.user.email);
                    sessionStorage.setItem("tel", data.user.tel);
                    sessionStorage.setItem("position", data.user.position);
                    alert("第一次登录,请先修改密码!");
                    window.location.href = "logincheck.html";
                }
            }
        });
    }
});