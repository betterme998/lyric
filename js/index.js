// 解析歌词字符串，得到一个歌词对象的数组{time：开始时间，world：歌词内容}
function parseLrc() {
  var lines = lrc.split('\n')
  var result = []
  for (let i = 0; i < lines.length; i++) {
    var str = lines[i];
    var parts = str.split(']')
    var timeStr = parts[0].substring(1)
    var obj = {
      time:parseTime(timeStr),
      world:parts[1]
    };
    result.push(obj);
  }
  return result
}



// 将时间字符串解析为数字
function parseTime(timeStr){
  var parts = timeStr.split(':')
  return +parts[0]*60 + +parts[1]
}

var lrcData = parseLrc()

// 获取需要的dom
var doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container'),
}
// 计算出播放器当前播放进度下。歌词高亮显示下标.如果没有歌词显示得到-1
function findIndex() {
  // 当前播放时间
  var curTime = doms.audio.currentTime;

  for (let i = 0; i < lrcData.length; i++) {
    if (curTime < lrcData[i].time) {
      return i - 1;
    }
  }
  // 找遍了没有就说明是最后一句
  return lrcData.length - 1
}

// 界面
// 创建歌词元素li
function createLrcElements(){
  // 文档片段
  var frag = document.createDocumentFragment();
  for (let i = 0; i < lrcData.length; i++) {
    var li = document.createElement('li')
    li.textContent = lrcData[i].world;
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag);
}
createLrcElements()


// 容器高度
var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
// 最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight

// 数组ul元素的偏移量
function setOffset() {
  var index = findIndex();
  var offset = liHeight*index + liHeight/2 - containerHeight / 2;
  if (offset<0) offset = 0;
  if (offset>maxOffset) {
    offset = maxOffset
  }
  doms.ul.style.transform = `translateY(-${offset}px)` 
  // 去除之前active样式
  var li = doms.ul.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index];
  if (li) {
    li.classList.add('active')
  }
}

doms.audio.addEventListener('timeupdate', setOffset)
