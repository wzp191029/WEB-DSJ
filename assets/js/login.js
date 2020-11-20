$(function () {
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //从layui中拿到form对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6到12位，且不能出现空格'],

        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })


    $('#form-reg').on('submit', function (e) {
        e.preventDefault() //阻止表单的默认提交行为
        $.post('/api/reguser', {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            $('#link-login').click()
        })
    })


    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(), //快速获取表单中的值  必须带有name属性
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 将登录成功得到的 token 字符串，保存到 localStorage 中

                localStorage.setItem('token', res.token)
                // 将登录成功得到的 token 字符串，保存到 localStorage 中

                location.href = '/index.html'
            }


        })

    })

})