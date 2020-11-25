$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
            }
        })
    }


    var indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    })


    // 通过代理的形式为form表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        // console.log('ok');
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            //serialize() 快速获取表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg(res.message);
                //根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })


    var indexEdit = null;
    // 通过代理的形式为btn-edit 注册点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        $.ajax({
            method: "get",
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexEdit);
            }
        })
    })




    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res, status !== 0) {
                        layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(index);

                }
            })

        });
    })


})