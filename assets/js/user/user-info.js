$(function () {

    var form = layui.form;
    var layer = layui.layer
    form.verify({
        // value 表单的值
        nickname: function (value) {
            if (value.length > 6) {
                return '用户名必须在1~6个字符之间！'
            }
        }
    })

    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                // 快速为表单赋值 第一个值 需要赋值的表单  第二个值是对象
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault() //阻止了表单的默认提交行为
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            // 
            data: $(this).serialize(),

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 通过 window.parebt 调用父页面中的方法 重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })

})