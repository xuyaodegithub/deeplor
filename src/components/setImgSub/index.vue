<template>
  <div class=" flex j-b content" v-show="canvasShow && this.files.length<2">
    <i style="position: absolute;right: 10px;top: 10px;font-size: 24px;color: #999;" class="el-icon-close cu"
       @click="clearFile()"></i>
    <div class="left">
      <div class="img">
        <!--              <img :src="other" alt="" v-if="!backimgShow">-->
        <div style="position: relative;" v-show="!backimgShow">
          <canvas id="hiddenCanvas" width="500" height="500">您的游览器不支持此功能，请换别的游览器试试...</canvas>
          <canvas id="hiddenCanvasTwo" width="500" height="500">您的游览器不支持此功能，请换别的游览器试试...</canvas>
          <canvas id="hiddenCanvasThree" :width="TwoW" :height="TwoH">您的游览器不支持此功能，请换别的游览器试试...</canvas>
        </div>
        <div v-show="backimgShow" class="imgList">
          <div class="flex j-b">
            <span>背景图片</span>
            <el-button round icon="el-icon-upload2" style="width:160px;" @click="upBackImgS()">选择一张图片</el-button>
          </div>
          <div class="titleList">
                <span v-for="(val,index) in titleList" :key="index" :class="{'active': index==titleIndex}" class="cu"
                      @click="changeimgList(index)">{{val}}</span>
          </div>
          <div class="imgAll flex">
            <img :src="item" alt="" v-for="(item,index) in imgAllList[titleIndex]" :key="index"
                 @click="addBackImg(item)" class="cu">
          </div>
          <el-button type="primary" round style="display:block;width:100px; margin: 50px auto;" size="small"
                     @click="backimgShow=false">确定
          </el-button>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="canvas" @mousedown="mouseDown($event)" @mousemove.prevent="moeseMove($event)"
           @mouseup="mouseUp($event)" :class="{'cours' : clearOrdraw===3}">
        <canvas id="cDown" width="500" height="500">您的游览器不支持此功能，请换别的游览器试试...</canvas>
        <canvas id="cUp" width="500" height="500">您的游览器不支持此功能，请换别的游览器试试...</canvas>
        <div class="border" v-show="borderShow"
             :style="{'top':borderLocal.y,'left':borderLocal.x,'width':borderLocal.width,'height': borderLocal.height}">
        </div>
      </div>
      <div class="btns clear">
        <!--              <el-button round>圆角按钮</el-button><el-button round icon="el-icon-edit">圆角按钮</el-button>-->
        <span>前景</span>
        <!--            v-if="!leftwhichcanvas"-->
        <div>
          <div class="cu btn" :class="{'active':clearOrdraw===1}" @click="clearOrdraw=1" slot="reference"><i
            class="icon iconfont icon-xiangpi"></i>擦除
          </div>
          <div class="cu btn" :class="{'active':clearOrdraw===2}" @click="clearOrdraw=2"><i
            class="icon iconfont icon-qianbi"></i>还原
          </div>
        </div>
        <div class="cu btn" :class="{'active':clearOrdraw===3}" @click="clearOrdraw=3"><i
          class="el-icon-rank"></i>移动
        </div>
        <div class="back">
          <div class="cu re" @click="backReset()"><i
            class="icon iconfont icon-chexiaofanhuichehuishangyibu"></i>撤回
          </div>
          <div class="cu re" @click="reset()"><i class="icon iconfont icon-zhongzhi"></i>复位</div>
        </div>
      </div>
      <div style="padding-left: 20px;line-height: 38px;" class="flex">
        <div style="width:200px;margin-right: 10px;">
          <el-slider v-model="eraserWidthSelect" tooltip-effect="light" :min="1" :max="20"
                     :show-tooltip="showThost"></el-slider>
        </div>
        <span>{{eraserWidthSelect}}px</span>
      </div>
      <div class="otherBtn flex a-i">
        <span>背景</span>
        <div v-for="(item,index) in color" :key="index" :style="backg" @click="choseBackColor(item,index)"
             class="cu" :class="{'bordershow' : index==choseBack}" v-if="index===0"></div>
        <div v-for="(item,index) in color" :key="index" :style="{'background':item }"
             @click="choseBackColor(item,index)" class="cu" :class="{'bordershow' : index==choseBack}"
             v-if="index!==0"></div>
        <!--              <el-button round icon="el-icon-more" size="mini" @click="choseColor()"></el-button>-->
        <span style="height: 28px;"><el-color-picker v-model="colorValue" size="mini" ref="colorS"
                                                     @change="choseColor()"
                                                     :class="{'bordershow': choseBack=='span'}"></el-color-picker></span>
        <p :style="back" class="cu" @click="backimgShow=!backimgShow"><i class="icon iconfont icon-zhaoxiangji"></i>背景图片
        </p>
      </div>
      <el-button type="primary" round icon="el-icon-download" style="width:160px;margin: 50px 0 0 150px;"
                 @click="save()">下载
      </el-button>
      <div style="position: absolute;top:76px; right: 0px;">
        <el-slider
          v-model="clunmValue"
          vertical
          :min="-400"
          :max="400"
          height="460px"
          :marks="marks"
          @change="changeClunmValue(0,0,1)">
        </el-slider>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
      name: "index",
      props:{
        canvasShow:{
          type:Boolean,
        },
        files:{
          type:Array,
        }
      },
      data(){
        return {
          backimgShow:false,
          TwoW: 500,
          TwoH: 500,
          clearOrdraw: 1,//擦除//复原//拖拽
          borderShow: false,//鼠标圆圈显示
          borderLocal: {x: '', y: '', width: '', height: ''},//鼠标圆圈位置
          eraserWidthSelect: 5,//鼠标圆大小
          showThost: false,
          color: ['rgba(255,255,255,0)', '#ffffff', '#eeeeee', '#5d5d5d'],
          colorValue: '#409EFF',
          back: {
            backgroundImage: "url(" + require("../assets/btnback.png") + ")",
            backgroundRepeat: 'mo-repeat',
            backgroundSize: 'cover'
          },
          backg: {
            backgroundImage: "url(" + require("../assets/opacity.jpg") + ")",
            backgroundRepeat: 'mo-repeat',
            backgroundSize: 'center'
          },
          choseBack: 0,//选中的背景色
          clunmValue: 0,
          marks: {
            0: {
              style: {
                color: '#1989FA'
              },
              label: this.$createElement('strong', '原点')
            }
          },
          cDown: '',//下层canvas
          cDownTxt: '',
          cUp: '',//上层canvas
          cUpTxt: '',
          hiddenCanvas: '',//左边原图canvas
          hiddenCanvasTxt: '',
          hiddenCanvasTwo: '',//左边隐藏原图canvas
          hiddenCanvasTwoTxt: '',
        }
      },
      mounted(){
        this.hiddenCanvas = document.getElementById('hiddenCanvas')
        this.hiddenCanvasTxt = this.hiddenCanvas.getContext('2d')
        this.hiddenCanvasTwo = document.getElementById('hiddenCanvasTwo')
        this.hiddenCanvasTwoTxt = this.hiddenCanvasTwo.getContext('2d')
        this.hiddenCanvasThree = document.getElementById('hiddenCanvasThree')
        this.hiddenCanvasThreeTxt = this.hiddenCanvasThree.getContext('2d')
        this.cDown = document.getElementById('cDown')
        this.cDownTxt = this.cDown.getContext('2d')
        this.cUp = document.getElementById('cUp')
        this.cUpTxt = this.cUp.getContext('2d');
        this.initImgData()
      },
      methods:{
        initImgData(){
          let oldImgData = this.cUpTxt.getImageData(this.eraserWidthSelect, this.eraserWidthSelect, 2 * this.eraserWidthSelect, 2 * this.eraserWidthSelect)
          let oldImgData2 = this.hiddenCanvasTwoTxt.getImageData(this.eraserWidthSelect, this.eraserWidthSelect, 2 * this.eraserWidthSelect, 2 * this.eraserWidthSelect)
          let oldImgData3 = this.hiddenCanvasTxt.getImageData(this.eraserWidthSelect, this.eraserWidthSelect, 2 * this.eraserWidthSelect, 2 * this.eraserWidthSelect)
          let oldImgData4 = this.hiddenCanvasThreeTxt.getImageData(this.eraserWidthSelect, this.eraserWidthSelect, 2 * this.eraserWidthSelect, 2 * this.eraserWidthSelect)
        },
        initData() {//每次上传图片是初始化数据
          this.historySet = [];//储存历史记录
          this.historySetTwo = [];//储存历史记录
          // this.imgUrl='';
          this.setImgOne = '';
          this.imgobj = {left: '', right: ''};
          this.clearOrdraw = 1;
          this.moveXY = {x: 250 - this.canveaContentW / 2, y: 250 - this.canveaContentH / 2};
          this.clunmValue = 0;
          this.moveXYTwo = {x: 250 - this.canveaContentW / 2, y: 250 - this.canveaContentH / 2};
        },
        resetBImg() {//重置背景大小
          this.backImgW = 500//背景图片大小
          this.backImgH = 500
        },
        clearFile() {//关闭画布
          this.canvasShow = false
          this.$refs.upImg.value = ''
        },
        choseColor() {//选择颜色背景
          this.choseBack = 'span'
          this.cDownTxt.clearRect(0, 0, this.cDown.width, this.cDown.height)
          this.cDownTxt.fillStyle = this.colorValue
          this.cDownTxt.fillRect(250 - this.canveaContentW / 2, 250 - this.canveaContentH / 2, this.canveaContentW, this.canveaContentH)
        },
        choseBackColor(color, index) {//纯色背景切换
          this.choseBack = index
          if (index == 0) {
            this.resetBImg();
            this.drawImg(this.opacity, [this.cDown], 0, 1);
            return
          }
          // this.clearCanvas()
          this.cDownTxt.clearRect(0, 0, this.cDown.width, this.cDown.height);
          this.cDownTxt.fillStyle = color;
          this.cDownTxt.fillRect(250 - this.canveaContentW / 2, 250 - this.canveaContentH / 2, this.canveaContentW, this.canveaContentH)
        },
        backReset() {//返回上一步
          let _self = this
          let x = this.moveXY.x
          let y = this.moveXY.y
          if (this.historySet.length > 0) {
            this.hiddenCanvasTwoTxt.clearRect(0, 0, this.hiddenCanvasTwo.width, this.hiddenCanvasTwo.height);
            this.hiddenCanvasTwoTxt.putImageData(this.historySet[this.historySet.length - 1], 250 - this.canveaContentW / 2, 250 - this.canveaContentH / 2);
            let url = this.initImg(1)
            let img = new Image()
            img.crossOrigin = ""
            img.src = url
            img.onload = function () {
              _self.cUpTxt.clearRect(0, 0, _self.cUp.width, _self.cUp.height);
              _self.cUpTxt.drawImage(img, x, y, _self.canveaContentW - _self.clunmValue, (_self.canveaContentW - _self.clunmValue) * _self.canveaContentH / _self.canveaContentW)
            }
            this.historySet.pop();
          } else {
            this.$message({
              message: '不能再继续撤回了',
              type: 'warning'
            })
          }
        },
        reset() {//重置
          this.initData()
          this.TwoW = 500
          this.TwoH = 500
          this.hiddenCanvasThreeTxt.clearRect(0, 0, this.TwoW, this.TwoH)
          let url = '';
          if (this.upOrCopy) url = this.upImgUrl;
          else url = this.copyBackImg;
          this.choseBack = 0;
          // this.clearOrdraw = 1;
          this.resetBImg();
          this.clearCanvas();
          this.drawImg(url, [this.cUp]);
          this.drawImg(url, [this.hiddenCanvasTwo]);
          this.drawImg(this.upImgUrlTwo, [this.hiddenCanvasThree]);
          this.drawImg(this.opacity, [this.cDown])
        },
        // 下载原图比例图
        downOldImg() {
          // let  _self=this
          let oImg = new Image();
          oImg.crossOrigin = "";
          oImg.onload = function () {
            let cans = document.createElement('canvas');
            let ctxs = cans.getContext('2d');
            cans.width = oImg.width;
            cans.height = oImg.height;
            ctxs.drawImage(oImg, 0, 0, cans.width, cans.height);
            let url = cans.toDataURL("image/png");
            let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = url;
            save_link.download = 'test.png';
            let event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          }
          oImg.src = this.upOrCopy ? this.upImgUrl : this.copyBackImg
        },
        //下载多张抠图
        saveMove(){
          let arr=this.rightMove.filter((val,index)=>{
            return !val.status
          })
          this.StoreDowQrcode(arr)
        },

        //批量下载图片
        StoreDowQrcode(arr, blogTitle = "图片包") {
          var zip = new JSZip();
          var imgs = zip.folder(blogTitle);
          var baseList = [];
          var _this = this;
          for (var i = 0; i < arr.length; i++) {
            let name = arr[i].name; //图片名称
            let image = new Image();
            image.crossOrigin='';
            image.onload = function() {
              let canvas = document.createElement("canvas");
              canvas.width = image.width;
              canvas.height = image.height;
              let context = canvas.getContext("2d");
              context.drawImage(image, 0, 0, image.width, image.height);
              let url = canvas.toDataURL(); // 得到图片的base64编码数据 let url =
              canvas.toDataURL("image/png");
              baseList.push({ name: name, img: url.substring(22) });
              if (baseList.length === arr.length) {
                if (baseList.length > 0) {
                  for (let k = 0; k < baseList.length; k++) {
                    imgs.file(baseList[k].name + ".png", baseList[k].img, {
                      base64: true
                    });
                  }
                  zip.generateAsync({ type: "blob" }).then(function(content) {
                    // see FileSaver.js
                    FileSaver.saveAs(content, blogTitle + ".zip");
                  });
                } else {
                  _this.$message.error({
                    title: "错误",
                    message: "暂无图片可下载"
                  });
                }
              }
            };
            image.src = arr[i].img;
          }
        },
        save() {//保存下载
          if (this.historySet.length <= 0 && this.choseBack == 0 && !this.clunmValue) {
            this.downOldImg()
            return
          }
          let _self = this
          let can = document.createElement('canvas')
          can.width = this.canveaContentW
          can.height = this.canveaContentH
          let ctx = can.getContext('2d')
          if (this.choseBack !== 0) {
            let backData = this.cDownTxt.getImageData(250 - _self.canveaContentW / 2, 250 - _self.canveaContentH / 2, _self.canveaContentW, _self.canveaContentH)
            ctx.putImageData(backData, 0, 0)
            _self.saveTwo(can, ctx)
          } else {
            _self.saveTwo(can, ctx)
          }
        },
        saveTwo(can, ctx) {//保存方法提取
          let _self = this
          let can2 = document.createElement('canvas')
          can2.width = this.canveaContentW
          can2.height = this.canveaContentH
          let ctx2 = can2.getContext('2d')
          let upData = this.cUpTxt.getImageData(250 - _self.canveaContentW / 2, 250 - _self.canveaContentH / 2, _self.canveaContentW, _self.canveaContentH)
          ctx2.putImageData(upData, 0, 0)
          let dataURL = can2.toDataURL("image/png");
          let imgA = new Image()
          imgA.src = dataURL
          imgA.crossOrigin = ""
          imgA.onload = (e) => {
            ctx.drawImage(imgA, 0, 0, can.width, can.height)
            let url = can.toDataURL("image/png");
            let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = url;
            save_link.download = 'test.png';
            let event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          }
        },
        clearCanvas(k) {//清除画布
          if (k) this.hiddenCanvasTxt.clearRect(0, 0, this.hiddenCanvas.width, this.hiddenCanvas.height)
          this.cUpTxt.clearRect(0, 0, this.cUp.width, this.cUp.height)
          this.cDownTxt.clearRect(0, 0, this.cUp.width, this.cUp.height)
          this.hiddenCanvasTwoTxt.clearRect(0, 0, this.hiddenCanvasTwo.width, this.hiddenCanvasTwo.height)
        },
        copyImgUrl() {//粘贴图片链接确定
          if (!this.imgUrl) {
            this.$message({
              message: '图片路径不可为空',
              type: 'warning'
            })
            return
          }
          this.files=[]
          let _self = this;
          this.backimgShow = false;
          this.upOrCopy = false;
          this.canvasShow = false;
          this.percentValue = 0;
          this.upLoading = true;
          this.upGuodu();
          this.resetBImg();//重置背景大小
          // this.clearCanvas()
          this.clearCanvas('all');
          this.toscroll()
          let data = {url: this.imgUrl};
          copyUpload(data).then(res => {
            if (_self.timer) {
              clearInterval(_self.timer)
              _self.timer = null
            }
            // if (res.data.code == 0) {
            this.upLoading = false;
            this.copyBackImg = res.data.bgRemoved;
            let image = new Image();
            image.src = res.data.bgRemoved;
            image.onload = function () {
              let arrThis = [image.width, image.height];
              let bigOne = _self.fingBig(arrThis);
              if (bigOne == arrThis[0]) {
                if (bigOne > 500) {
                  image.height = 500 * image.height / image.width;
                  image.width = 500
                }
              } else {
                if (bigOne > 500) {
                  image.width = 500 * image.width / image.height;
                  image.height = 500
                }
              }
              _self.canveaContentW = image.width;//画到画布上的大小
              _self.canveaContentH = image.height;
              _self.drawImg(res.data.bgRemoved, [_self.hiddenCanvasTwo])//隐藏扣过的
              _self.drawImg(res.data.original, [_self.hiddenCanvasThree])//隐藏原图的
              _self.drawImg(res.data.original, [_self.hiddenCanvas]);
              _self.upImgUrlTwo = res.data.original
              _self.drawImg(res.data.bgRemoved, [_self.cUp], 'closeLoading');
              _self.drawImg(_self.opacity, [_self.cDown])
              _self.initData()//初始化数据
            }

            // } else this.$message({message: res.data.msg, type: 'warning'})
          }).catch(err => {
            if (_self.timer) {
              clearInterval(_self.timer);
              _self.timer = null
            }
            // this.$message({message: '网络错误,请重新尝试', type: 'warning'})
          })
        },
        fingBig(val) {//找最大
          let big = val[0];
          val.map((v, i) => {
            if (big < v) {
              big = v
            }
          });
          return big
        },
        drawImg(url, arr, close, clear) {//画图封装
          let _self = this;
          let image = new Image();
          image.crossOrigin = ""
          image.onload = function (ev) {
            arr.map((obj, index) => {
              if (obj == _self.cDown) {
                obj.getContext('2d').drawImage(image, _self.backImgW / 2 - _self.canveaContentW / 2, _self.backImgH / 2 - _self.canveaContentH / 2, _self.canveaContentW, _self.canveaContentH, 250 - _self.canveaContentW / 2, 250 - _self.canveaContentH / 2, _self.canveaContentW, _self.canveaContentH);
              } else obj.getContext('2d').drawImage(image, 250 - _self.canveaContentW / 2, 250 - _self.canveaContentH / 2, _self.canveaContentW, _self.canveaContentH);
            })
            _self.upLoading = false
            _self.percentValue =0
            _self.$refs.upImg.value = ''
            if (close) _self.canvasShow = true
            if (!clear) _self.historySet = []
          }
          image.src = url
        },
        upGuodu() {//定时器过度
          this.timer = setInterval(() => {
            if (this.percentValue < 99) {
              this.percentValue += 1
            } else {
              clearInterval(this.timer)
              this.percentValue = 99
            }
          }, 100)
        },
        changeImg(e) {//图片上传
          this.toscroll()
          let _self = this
          if(!this.addNewImg){
            this.files=[]
            this.leftMove=[]
            this.rightMove=[]
            for(let i=0;i<this.$refs.upImg.files.length;i++){
              this.files.push(this.$refs.upImg.files[i])
            }
            if(this.files.length>1){
              this.canvasShow=true
              this.upmoreImg(this.files)
              return
            }
          }else {
            this.addNewImg=false;
            let arr=[]
            for(let i=0;i<this.$refs.upImg.files.length;i++){
              arr.push(this.$refs.upImg.files[i])
              this.files.push(this.$refs.upImg.files[i])
            }
            // this.files.push(this.$refs.upImg.files[0])
            this.upmoreImg(arr)
            return
          }
          let file = this.$refs.upImg.files[0]
          this.resetBImg()
          if (!file) return
          this.upLoading = true
          this.canvasShow = false
          this.upGuodu()
          if (window.FileReader) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            //监听文件读取结束后事件
            reader.onloadend = function (e) {
              if (_self.upBackImg) {//上传背景
                let oImg = new Image()
                oImg.src = e.target.result
                oImg.onload = function () {
                  _self.backImgW = oImg.width
                  _self.backImgH = oImg.height
                }
                _self.cDownTxt.clearRect(0, 0, _self.cDown.width, _self.cDown.height)
                _self.drawImg(e.target.result, [_self.cDown], 'close', 'noclear')
                _self.upBackImg = false
                return
              }
              _self.setImgInitialization(file, e.target.result)
              _self.upOrCopy = true
            };
          }
        },
        //上传多张图片
        upmoreImg(arr){
          let _self=this
          arr.map((val,index)=>{
            let file=val
            if (window.FileReader) {
              let reader = new FileReader();
              reader.readAsDataURL(file);
              //监听文件读取结束后事件
              reader.onloadend = function (e) {
                let param = new FormData();
                param.append('file', file, file.name)
                uploadImgApi(param).then(res=> {
                  _self.leftMove.push(e.target.result)
                  if (_self.timer) {
                    clearInterval(_self.timer)
                    _self.timer = null
                  }
                  if (res.code == 0) {
                    let obj={
                      name:val.name.substring(0,val.name.lastIndexOf('.')),
                      img:res.data.bgRemoved,
                      status:0,
                      msg:''
                    }
                    _self.rightMove.push(obj)
                  } else {
                    let obj={
                      name:val.name.substring(0,val.name.lastIndexOf('.')),
                      img:'',
                      status:1,
                      msg:'抠图失败'
                    }
                    _self.rightMove.push(obj)
                  }
                }).catch(err=> {
                  if (_self.timer) {
                    clearInterval(_self.timer)
                    _self.timer = null
                  }
                  console.log(err)
                })
              };
            }
          })

        },
        windowToCanvas(x, y) { //这个函数的作用是捕捉鼠标点在canvas上的坐标
          let bbox = this.cUp.getBoundingClientRect()
          return {
            x: x - bbox.left,
            y: y - bbox.top
          }
        },
        setImgInitialization(file, e) {//图片上传接口
          let _self = this
          let param = new FormData();
          param.append('file', file, file.name)
          uploadImgApi(param).then(res => {
            // if (res.data.code == 0) {
            _self.clearCanvas('all')
            let image = new Image()
            image.src = res.data.bgRemoved
            image.onload = function () {
              let arrThis = [image.width, image.height]
              let bigOne = _self.fingBig(arrThis)
              if (bigOne == arrThis[0]) {
                if (bigOne > 500) {
                  image.height = 500 * image.height / image.width
                  image.width = 500
                }
              } else {
                if (bigOne > 500) {
                  image.width = 500 * image.width / image.height
                  image.height = 500
                }
              }
              _self.canveaContentW = image.width//画到画布上的位置
              _self.canveaContentH = image.height
              _self.drawImg(res.data.original, [_self.hiddenCanvas])
              _self.drawImg(res.data.bgRemoved, [_self.hiddenCanvasTwo])//隐藏扣过的
              _self.drawImg(res.data.original, [_self.hiddenCanvasThree])//隐藏原图的
              _self.upImgUrlTwo = res.data.original
              _self.upImgUrl = res.data.bgRemoved
              _self.drawImg(res.data.bgRemoved, [_self.cUp], 'closeLoading')
              _self.drawImg(_self.opacity, [_self.cDown])
              _self.initData()//初始化数据
              if (_self.timer) {
                clearInterval(_self.timer)
                _self.timer = null
              }
            }
            // } else _self.$message({message: res.data.msg, type: 'warning'});
          }).catch(err=> {
            if (_self.timer) {
              clearInterval(_self.timer)
              _self.timer = null
            }
            _self.$refs.upImg.value = ''
            // _self.$message({message: '网络错误,请重新尝试', type: 'warning'})
          })
        },
        //圆圈位置
        setLocal(e, key) {
          // let scrollTop=document.documentElement.scrollTop || document.body.scrollTop
          let loc = this.windowToCanvas(e.clientX, e.clientY)
          if (key) this.borderShow = true
          else this.borderShow = false
          this.borderLocal.width = 2 * this.eraserWidthSelect + 'px'
          this.borderLocal.height = 2 * this.eraserWidthSelect + 'px'
          this.borderLocal.x = (loc.x - this.eraserWidthSelect) + 'px'
          this.borderLocal.y = (loc.y - this.eraserWidthSelect) + 'px'
        },
        setImgDataNum(x, y, r, key) {//计算鼠标圆像素
          let dataArr = [];
          for (let i = y - r; i < y + r; i++) {//计算离鼠标圆圆心的距离
            for (let j = x - r; j < x + r; j++) {
              let radius = Math.sqrt((x - j) * (x - j) + (y - i) * (y - i))//坐标离鼠标的距离
              if (radius > r) {
                if (key === 1) dataArr = [...dataArr, ...this.hiddenCanvasTwoTxt.getImageData(j, i, 1, 1).data]
                else dataArr = [...dataArr, ...this.cUpTxt.getImageData(j - this.moveXYTwo.x + this.moveXY.x, i - this.moveXYTwo.y + this.moveXY.y, 1, 1).data]
              } else {
                if (key === 1) dataArr = [...dataArr, ...this.hiddenCanvasTxt.getImageData(j, i, 1, 1).data]
                else dataArr = [...dataArr, ...this.hiddenCanvasThreeTxt.getImageData(j, i, 1, 1).data]
              }
            }
          }
          return dataArr
        },
        drawCri(x, y, z) {//复原状态填充
          let oldImgData, nowImgData
          let lx = (x - this.moveXY.x) / (this.canveaContentW - this.clunmValue) * this.canveaContentW
          let ly = (y - this.moveXY.y) / ((this.canveaContentW - this.clunmValue) * this.canveaContentH / this.canveaContentW) * this.canveaContentH
          let px = 250 - this.canveaContentW / 2
          let py = 250 - this.canveaContentH / 2
          let or = Math.round(this.eraserWidthSelect / (this.canveaContentW - this.clunmValue) * this.canveaContentW)
          let xx = Math.round(lx + px);
          let yy = Math.round(ly + py);
          let rightx = (x - this.moveXY.x) + this.moveXYTwo.x;
          let righty = (y - this.moveXY.y) + this.moveXYTwo.y;
          oldImgData = this.hiddenCanvasTxt.getImageData(xx - or, yy - or, 2 * or, 2 * or);
          // oldImgData2 = this.hiddenCanvasTwoTxt.getImageData(xx - o, yy - o, 2 * o, 2 * o)
          nowImgData = this.hiddenCanvasThreeTxt.getImageData(rightx - this.eraserWidthSelect, righty - this.eraserWidthSelect, 2 * this.eraserWidthSelect, 2 * this.eraserWidthSelect)
          if (!z) {
            let dataArr2 = this.setImgDataNum(rightx, righty, this.eraserWidthSelect, 0);
            for (let i = 0; i < dataArr2.length; i++) {
              nowImgData.data[i] = dataArr2[i]
            }
            this.cUpTxt.putImageData(nowImgData, x - this.eraserWidthSelect, y - this.eraserWidthSelect)
          } else {
            let dataArr = this.setImgDataNum(xx, yy, or, 1);
            for (let i = 0; i < dataArr.length; i++) {
              oldImgData.data[i] = dataArr[i]
            }
            this.hiddenCanvasTwoTxt.putImageData(oldImgData, xx - or, yy - or)
          }


        },
        drawrubber(x, y, z) {//绘制中心圆
          if (!z) {
            this.cUpTxt.beginPath();
            this.cUpTxt.arc(x, y, this.eraserWidthSelect, 0, Math.PI * 2, false);
            this.cUpTxt.clip();
          } else {
            let lx = (x - this.moveXY.x) / (this.canveaContentW - this.clunmValue) * this.canveaContentW
            let ly = (y - this.moveXY.y) / ((this.canveaContentW - this.clunmValue) * this.canveaContentH / this.canveaContentW) * this.canveaContentH
            let px = 250 - this.canveaContentW / 2
            let py = 250 - this.canveaContentH / 2
            let o = Math.sqrt((this.canveaContentW * this.canveaContentH * this.eraserWidthSelect * this.eraserWidthSelect) / ((this.canveaContentW - this.clunmValue) * ((this.canveaContentW - this.clunmValue) * this.canveaContentH / this.canveaContentW)))
            let xx = lx + px;
            let yy = ly + py;
            this.hiddenCanvasTwoTxt.beginPath();
            this.hiddenCanvasTwoTxt.arc(xx, yy, o, 0, Math.PI * 2, false);
            this.hiddenCanvasTwoTxt.clip()
          }
        },
        drawGrid(key) { //这个函数的作用是填充进橡皮擦的剪辑区域
          if (key === 1) this.cUpTxt.clearRect(0, 0, this.cUp.width, this.cUp.height);
          else this.hiddenCanvasTwoTxt.clearRect(0, 0, this.hiddenCanvasTwo.width, this.hiddenCanvasTwo.height);
        },
        mouseDown(e) {
          if (this.clearOrdraw !== 3) this.historySet.push(this.hiddenCanvasTwoTxt.getImageData(250 - this.canveaContentW / 2, 250 - this.canveaContentH / 2, this.canveaContentW, this.canveaContentH));
          let loc = this.windowToCanvas(e.clientX, e.clientY);
          this.mousedown.x = loc.x//画布中鼠标x坐标
          this.mousedown.y = loc.y//画布中鼠标y坐标
          this.lastLocal.x = loc.x
          this.lastLocal.y = loc.y
          this.downOrup = true
          // context.save()
          this.setLocal(e, 1)
        },
        moeseMove(e) {
          if (this.downOrup) {
            this.setLocal(e, 1)
            let loc = this.windowToCanvas(e.clientX, e.clientY)
            if (this.clearOrdraw === 2) { //如果复原状态
              this.cUpTxt.save()//保存当前画布状态
              this.drawCri(loc.x, loc.y)
              this.cUpTxt.restore()//恢复画布之前状态
              this.hiddenCanvasTwoTxt.save()//保存当前画布状态
              this.drawCri(loc.x, loc.y, 1)
              this.hiddenCanvasTwoTxt.restore()//恢复画布之前状态
            } else if (this.clearOrdraw === 1) { //如果是橡皮擦状态
              this.cUpTxt.save()//保存当前画布状态
              this.drawrubber(loc.x, loc.y)//绘制鼠标中心圆
              this.drawGrid(1)//填充中心圆
              this.cUpTxt.restore()//恢复画布之前状态
              //
              this.hiddenCanvasTwoTxt.save()//保存当前画布状态
              this.drawrubber(loc.x, loc.y, 'Two')//绘制鼠标中心圆
              this.drawGrid(2)//填充中心圆
              this.hiddenCanvasTwoTxt.restore()//恢复画布之前状态
            } else {//移动状态
              let x = loc.x - this.mousedown.x;
              let y = loc.y - this.mousedown.y;
              this.changeMoveValue(x, y)
            }
          }
        },
        mouseUp(e) {
          this.downOrup = false;
          let loc = this.windowToCanvas(e.clientX, e.clientY)
          if (this.clearOrdraw === 2) {
            this.lastLocal.x = loc.x;
            this.lastLocal.y = loc.y;
            // restoreDrawingSurface()
            this.drawCri(this.lastLocal.x, this.lastLocal.y)
            this.drawCri(this.lastLocal.x, this.lastLocal.y, 1)
          } else if (this.clearOrdraw === 1) {
            this.cUpTxt.save()
            this.drawrubber(loc.x, loc.y)
            this.drawGrid(1)
            this.cUpTxt.restore()
            //
            this.hiddenCanvasTwoTxt.save()//保存当前画布状态
            this.drawrubber(loc.x, loc.y, 'Two')//绘制鼠标中心圆
            this.drawGrid(2)//填充中心圆
            this.hiddenCanvasTwoTxt.restore()//恢复画布之前状态
          } else {
            let x = loc.x - this.mousedown.x;
            let y = loc.y - this.mousedown.y;
            let _self = this
            if (this.moveXY.x === 0 || this.moveXY.y === 0) {
              this.moveXY = {
                x: 250 - ((this.canveaContentW - this.clunmValue) / 2) + x,
                y: 250 - (((this.canveaContentW - this.clunmValue) * (this.canveaContentH)) / this.canveaContentW / 2) + y
              }
            } else this.moveXY = {x: this.moveXY.x + x, y: this.moveXY.y + y}
            this.imgobj.right = ''
          }
          // restoreDrawingSurface()
          this.setLocal(e)
        },
        changeClunmValue(x = 0, y = 0, z) {
          this.initImg();
          let _self = this;
          let num = this.clunmValue;
          let xx, yy;
          xx = 250 - ((_self.canveaContentW - num) / 2) + x;
          yy = 250 - (((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW / 2) + y;
          this.moveXY = {x: xx, y: yy};
          _self.cUpTxt.clearRect(0, 0, _self.cUp.width, _self.cUp.height);
          let image = new Image();
          image.crossOrigin = "";
          image.src = this.setImgOne;
          image.onload = function (ev) {
            _self.cUpTxt.drawImage(image, xx, yy, _self.canveaContentW - num, ((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW);
          }
          ////////
          _self.hiddenCanvasThreeTxt.clearRect(0, 0, _self.hiddenCanvasThree.width, _self.hiddenCanvasThree.height)
          let w = 500 * (_self.canveaContentW - num) / _self.canveaContentW
          _self.TwoW = w
          _self.TwoH = w
          _self.moveXYTwo = {
            x: w / 2 - (_self.canveaContentW - num) / 2,
            y: w / 2 - (((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW / 2)
          }
          let imageleft = new Image();
          imageleft.crossOrigin = "";
          imageleft.src = this.upImgUrlTwo;
          imageleft.onload = function (ev) {
            _self.hiddenCanvasThreeTxt.drawImage(imageleft, _self.moveXYTwo.x, _self.moveXYTwo.y, _self.canveaContentW - num, ((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW);
          }
          this.initImgData()
        },
        changeMoveValue(x, y) {
          let _self = this
          let num = this.clunmValue
          let xx, yy;
          if (_self.moveXY.x === 0 || _self.moveXY.y === 0) {
            xx = 250 - ((_self.canveaContentW - num) / 2) + x;
            yy = 250 - (((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW / 2) + y;
          } else {
            xx = _self.moveXY.x + x;
            yy = _self.moveXY.y + y;
          }
          _self.cUpTxt.clearRect(0, 0, _self.cUp.width, _self.cUp.height);
          if (this.imgobj.right) {//this.imgobj.left &&
            _self.cUpTxt.drawImage(this.imgobj.right, xx, yy, _self.canveaContentW - num, ((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW);
          } else {
            this.initImg()
            let image = new Image();
            image.crossOrigin = "";
            image.src = this.setImgOne
            image.onload = function (ev) {
              _self.imgobj.right = image
              _self.cUpTxt.drawImage(image, xx, yy, _self.canveaContentW - num, ((_self.canveaContentW - num) * (_self.canveaContentH)) / _self.canveaContentW);
            }
          }
          this.initImgData()
        },
        initImg(x) {//每次拖拽或放大缩小都操作左边隐藏的图
          let can2 = document.createElement('canvas');
          can2.width = this.canveaContentW;
          can2.height = this.canveaContentH;
          let ctx2 = can2.getContext('2d');
          let upData = this.hiddenCanvasTwoTxt.getImageData(250 - this.canveaContentW / 2, 250 - this.canveaContentH / 2, this.canveaContentW, this.canveaContentH);
          ctx2.putImageData(upData, 0, 0);
          if (x) return can2.toDataURL("image/png");
          else this.setImgOne = can2.toDataURL("image/png");
        },
      }
    }
</script>

<style scoped>

</style>
