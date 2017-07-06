/**
 * Created by 14798 on 2017/7/6.
 */
module.exports = {
    imgCahnge:function (img) {
        var data=img.split(":");
        if(data[0]=='https'){
            return img;
        }else {
            return '/img/'+img;
        }
    }
};
