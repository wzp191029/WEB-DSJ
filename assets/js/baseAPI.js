$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url


    // 统一为有权限的接口设置headers请求头
    // 如果options.url中不包含有 /my  indexOf的值为-1 不等于-1 就是包含
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})