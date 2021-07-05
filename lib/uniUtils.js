
import Vue from 'vue'

/**
 * @author zwcong
 * @time 2019-11-05
 * @description uni 图片压缩（h5）
 * 
 * 最大宽度 500px
 * 
 */
function compress(src) {
    return new Promise((resolve, reject) => {
        try {
            Vue.prototype.$loading.show({
                duration: 100000
            })
            uni.getImageInfo({
                src,
                success(res) {
                    let canvasWidth = res.width //图片原始长宽
                    let canvasHeight = res.height

                    let base = canvasWidth/canvasHeight

                    if(canvasWidth > 500){
                        canvasWidth = 500;
                        canvasHeight = Math.floor(canvasWidth/base)
                    }

                    let img = new Image()
                    img.src = res.path
                    let canvas = document.createElement('canvas')

                    let ctx = canvas.getContext('2d')
                    canvas.width = canvasWidth
                    canvas.height = canvasHeight
                    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

                    canvas.toBlob((fileSrc) => {
                        let imgSrc = window.URL.createObjectURL(fileSrc)
                        return resolve(imgSrc)
                    })
                },
                complete: () => {
                    Vue.prototype.$loading.hide()
                }
            })
        }catch(err){
            return reject(err)
        }
    })
}

/**
 * @author zwcong
 * @time 2019-11-05
 * @description uni 上传图片返回地址（h5）
 * 
 */
function uploadImg(url){
    return new Promise((resolve, reject) => {
        try {
            Vue.prototype.$loading.show({
                duration: 100000
            })
            uni.uploadFile({
                url: '/api/user/upload-img', 
                filePath: url,
                name: 'img',
                success: (uploadFileRes) => {
                    let data = JSON.parse(uploadFileRes.data)

                    if(data.code === 0){
                        return resolve(data.data.img)
                    }else{
                        if(data.code === 10001){
                            uni.removeStorageSync('user')
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })  
                        }else{
                            Vue.prototype.$toast.info(data.message)
                        }
                    }
                    
                },
                complete: () => {
                    Vue.prototype.$loading.hide()
                }
            });
        }catch(err){
            return reject(err)
        }
    })
}

export { compress, uploadImg }