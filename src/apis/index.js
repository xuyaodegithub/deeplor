import https from './request'
/**
 * 上传图片
 */
 export const uploadImgApi=(data)=>{
  return https.upPost('/webMatting/matting2',data)
}

/**
 * 粘贴抠图
 */
 export const copyUpload=(data)=>{
  return https.paramspost('/webMatting/mattingByUrl2',data)
}

/**
 * 获取排队中图片信息
 **/
export const getMattingInfo=(data)=>{
  return https.get('/webMatting/getMattingInfo',data)
}
