$(function () {

    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确认退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 回到登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})



function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        },


        // // 无论成功还是失败都会调用 complete这个函数
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }




    })
}


// 渲染用户的头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        // name[0] 得到第一个字符  toUpperCase()将小写字母转为大写
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }
}