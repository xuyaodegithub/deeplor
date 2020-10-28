<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'App',
        data(){
            return {
                baseUrl: 'http://restapidev.picup.shop/oss/upload',
                data: {a: 1},
                pressType:'quality',
                maxSize:2048
            }
        },
        methods:{
            beforeUpload(file){
                console.log(file,111111)
            },
            successUpload(res){
                console.log(res.data,22222)
            },
            uploadEnd(){
                console.log('上传完成')
            },
            errUpload(err){
                console.log('上传失败',err)
            }
        }
    }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    /*margin-top: 60px;*/
    /*height:100%;*/

  }
</style>
