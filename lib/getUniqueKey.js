/**
 * Get unique key
 * @return {Number} n
 * @author zwcong
 * @example
 */
var _loadTime = (new Date()).getTime().toString(), _i = 1;
/**
 * 
 * @param {Object} num 位数
 * @param {Object} sta 0 小写，1 大写，2 大小写
 */
var getRandomAZ=function(num,sta){
    var ls=[];
    var base = !sta ? 97:65;
    var len = sta==2 ? 52:26;
    var key
    for(var i=0;i<num;i++){
        key=base+parseInt(Math.random()*len,10);
        if(key>90 && key<97){
            key=97;
        }
        ls.push(String.fromCharCode(key));
    }
    return ls;
}
module.exports=function(isSimple,num,sta) {
    if(!isSimple){
	    return _loadTime + (_i++);
	}
	return getRandomAZ(num,sta).join('')+_loadTime + (_i++);
	
};
