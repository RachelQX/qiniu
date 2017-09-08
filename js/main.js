/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

$(function() {
    var uploader = Qiniu.uploader({
        disable_statistics_report: true,
        makeLogFunc: 1,
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '10000mb',
        //flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: false,
        chunk_size: '4mb',
        multi_selection: true,
        uptoken : $('#uptoken').val(),
        //uptoken_url : 'http://app.yscase.com/qiniu/upload/upload_token.php?1501661704642',
        unique_names: true,
        max_retries: 5,                     // 上传失败最大重试次数
        domain: $('#domain').val(),
        get_new_uptoken: true,
        filters: {
            mime_types : [
                { title : "Image files", extensions : "jpg,jpeg,gif,png" },
            ],
            max_file_size : '10mb', //最大只能上传10mb的文件
            prevent_duplicates : true //不允许选取重复文件
        },
        resize: {
            width: 400,
            quality: 70,
            preserve_headers: true
        },
        auto_start: true,
        log_level: 5,
        init: {
            'BeforeChunkUpload':function (up,file) {
                console.log("1 before chunk upload:",file.name);
            },
            'FilesAdded': function(up, files) {
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    console.log('filetype: ' + file.type);
                    if(file.type=='image/jpeg'||file.type=='image/jpg'||file.type=='image/png'||file.type=='image/gif' || file.type=='jpeg'){
                        console.log('2 type:' + file.type);
                        isUpload =true;
                        // file.album_name=album_name;
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setStatus("等待...");
                        progress.bindUploadCancel(up);
                    }else {
                        isUpload = false;
                        up.removeFile(file);
                        console.log('2 上传类型只能是.jpg,.jpeg,.png,.gif,');
                        return false;
                    }});
            },
            'BeforeUpload': function(up, file) {
                console.log("3 this is a beforeupload function from init");
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
        }
    });
    uploader.bind('FilesAdded', function() {
        console.log("hello man, a file added");
    });
    uploader.bind('BeforeUpload', function () {
        console.log("hello man, i am going to upload a file");
    });
    uploader.bind('FileUploaded', function () {
        console.log('hello man,a file is uploaded');
    });
    $('#up_load').on('click', function(){
        uploader.start();
    });
    $('#stop_load').on('click', function(){
        uploader.stop();
    });
    $('#retry').on('click', function(){
        uploader.stop();
        uploader.start();
    });
    // $('#container').on(
    //     'dragenter',
    //     function(e) {
    //         e.preventDefault();
    //         $('#container').addClass('draging');
    //         e.stopPropagation();
    //     }
    // ).on('drop', function(e) {
    //     e.preventDefault();
    //     $('#container').removeClass('draging');
    //     e.stopPropagation();
    // }).on('dragleave', function(e) {
    //     e.preventDefault();
    //     $('#container').removeClass('draging');
    //     e.stopPropagation();
    // }).on('dragover', function(e) {
    //     e.preventDefault();
    //     $('#container').addClass('draging');
    //     e.stopPropagation();
    // });
});
