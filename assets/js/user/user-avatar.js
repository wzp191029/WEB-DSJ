$(function () {

    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)




    $('#btn').on('click', function () {
        // 模拟人为点击文件选择框
        $('#file').click()
    })


    // 
    $('#file').on('change', function (e) { //文件发生变化就会触发change事件
        // console.log(e);
        // 获取用户选择的文件
        // console.log(this.files===e.target.files);
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片')
        }

        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 将文件转化为路径  URL.createObjectURL(file)
        var newImgURL = URL.createObjectURL(file)
        // 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })

})