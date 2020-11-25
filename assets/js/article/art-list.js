$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据  默认2条
        cate_id: '', //文章分类的id
        state: '' //文章发布的状态
    }


    // 获取文章列表数据的方法
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //用模板引擎渲染文章列表
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)

                renderPage(res.total)
            }
        })
    }


    // 格式化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear() //年
        var m = padZero(dt.getMonth() + 1) //月
        var d = padZero(dt.getDate()) //日
        var hh = padZero(dt.getHours()) //时
        var mm = padZero(dt.getMinutes()) //分
        var ss = padZero(dt.getUTCSeconds()) //秒
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 通过模板引擎渲染文章分类的可选项
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                // 通知layui重新渲染表单区域的ui结构
                form.render();
            }
        })
    }

    // 为筛选按钮绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render 的方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id 不加#
            count: total, //总数据的条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 6, ],

            // 触发jump回调的两种方法
            // 1.点击页码的时候触发
            // 2.只要调用了laypage.render 方法就会触发
            jump: function (obj, first) {
                // console.log(obj.curr); 得到的是最新的页码值
                q.pagenum = obj.curr;
                //得到最新的每页显示的条数
                q.pagesize = obj.limit;
                // 通过first的值来判断是通过哪种方式触发jump回调的
                // 如果值为ture证明是方式2触发的 否则就是方式一触发的
                if (!first) {
                    initTable()
                }
            }
        })
    }


    // 为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        // console.log('ok');
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }
            })

            layer.close(index);
        });
    })
})