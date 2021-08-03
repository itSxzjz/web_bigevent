$(function() {

    var layer = layui.layer
    var form = layui.form

    initArtCateList();
    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }



    // 为添加类别按钮绑定事件  绑定之前先要导入 layui.layer  这个方法
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1, // 1代表页面层 0代表默认有一个确认按钮
            area: ['500px', '260px'],
            title: '添加文章分类',
            //这样的做法是  可以在模板中写HTML语句了  不会像直接在content中写HTML语句有问题
            content: $('#dialog-add').html()
        });
    })

    //通过代理的方式，为form-add 表单绑定submit事件
    // $('#form-add').on('click', function(e) {}) // 这是之前的写法，因为HTML代码在 常规位置，而现在在script中
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式，为btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //因为是动态生成的表单  所以通过代理的形式，为修改分类的表单绑定submit 事件

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }
                layer.msg('更新分类成功')
                layer.close(indexEdit)
                initArtCateList()
            }

        })
    })


    //通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            //提示用户是否要删除
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败了哦！')
                    }
                    layer.msg('删除分类成功啦！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })



})