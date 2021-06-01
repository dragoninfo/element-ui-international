const fs = require('fs');

const fileUrl = './lib/index.css'; // 目标文件
const fileCopyUrl = './lib/fileCopy.css'; // 目标文件副本
const resultFile = './src/rtl.scss'; // 过滤后的文件

// 过滤的目标字段
const filterTexts = [
  'left',
  'right',
  'rotateY(0)',
  'rotate(180deg)',
  'rotate(0deg)',
  'translateY(-50%) translateX(100%)',
  'translateX(0)',
  'translateX(100%)'
];
let resultData = ''; // 写入文件的数据
let parent = ''; // .test{ 存储父级字段
let content = ''; // left: 1px; 存储确定保留的内容
let cachContent = ''; // widht:1px; 存储待检测内容

const getFile = () => {
  resultData = '';
  resetData();
  // fs.readFile(fileCopyUrl, 'utf-8', (err, data) => {
  // if (err) {
  fs.readFile(fileUrl, 'utf-8', (err, data) => {
    if (err) return console.error(err);

    writeFile(fileCopyUrl, data, (err) => {
      // 写入成功
      if (!err) filterFile(data);
    });
  });
  // return;
  // }
  // filterFile(data);
  // });
};

// 写入文件
const writeFile = (path, data, callback) => {
  fs.writeFile(path, data, function(err) {
    if (err) return callback(err);
    return callback(null);
  });
};

// 过滤文件
const filterFile = (data) => {
  console.log('过滤中....');

  for (let i = 0, len = data.length; i < len; i++) {
    const el = data[i];
    // console.log('进度：',i, '/',len);

    if (el === '}') {
      console.log('进度：', i, '/', len);
      // console.log('} --', cachContent, content);
      if (!cachContent && content) {
        // 有保留数据，赋值给resultData， 并重置
        content += el;
        resultData += parent;
        resultData += content;
      }

      if (cachContent) {
        // 还有带检测数据
        const isHas = filterData(cachContent, 1);
        if (isHas) content += cachContent;
        if (content) {
          content += el;
          resultData += parent;
          resultData += content;
        }
      }

      resetData();
      continue;
    }

    if (parent.indexOf('{') >= 0) {
      if (el === ';') {
        // 检测cachContent
        const isHas = filterData(cachContent, 2);
        if (isHas) {
          content += cachContent;
          content += el;
        }
        cachContent = '';
        continue;
      }

      cachContent += el;
      // console.log('cachContent-', cachContent);
      continue;
    }

    // 放入父级容器
    parent += el;
    // console.log('parent-', parent);
  }

  // console.log('遍历结束--resultData:', resultData);
  const info = '.element-rtl{' + resultData + '}';
  // 遍历结束
  writeFile(resultFile, info, (err) => {
    // 写入成功
    if (!err) console.log('完成');
  });
};

// 检测是否包含方向性内容
// data: width:1px;
const filterData = (data, type) => {
  if (!data) return false;
  let isHas = false;
  // console.log('带检测data--', type, data);
  for (let i = 0; i < filterTexts.length; i++) {
    const filterText = filterTexts[i];
    if (data.indexOf(filterText) >= 0) {
      isHas = true;
      break;
    }
  }
  // const special = ['margin', 'padding', 'border-width'];
  // 检测是否包含 margin: 0px 2px 0 1px; 这种格式
  if (!isHas && (data.indexOf('margin') >= 0 || data.indexOf('padding') >= 0 || data.indexOf('border-width') >= 0)) {
    const dataArr = data.split(':');
    dataArr[1] = dataArr[1].trim(); // 去掉前后空格
    const valArr = dataArr[1].split(' ');

    if (valArr.length > 3 && valArr[1] !== valArr[3]) {
      isHas = true;
    }
  }

  // console.log('检测filterData--:', data, '结果', isHas);
  return isHas;
};

// 重置数据
const resetData = () => {
  parent = '';
  content = '';
  cachContent = '';
};

getFile();

/**
 * 步骤：
 * 1.过滤出对应文件
 * 2.方向词对换（left->right)
 * 3.针对包含有left:xx; 的代码 新增left：auto/right:auto

 * 4.不需要替换的代码：
  // .el-checkbox__inner::after {
  //   border-right: 0;
  //   right: 4px;
  // }
  // .el-radio__inner::after {
  //   right: 50%;
  // }
 */
