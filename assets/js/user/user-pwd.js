$(function () {

    var form = layui.form
    form.verify({
        // 第一项是正则表达式 第二项是不满足要求时的提示内容
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            // value 是用了samePwd表单的值 
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致'
            }
        }
    })


    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                //重置表单 reset()
                // $('.layui-form')[0]将JQuery元素转为DOM元素
                $('.layui-form')[0].reset()
            }
        })
    })




})