## Webpack初探

### Webpack究竟是什么
>对于刚接触Webpack的人来说，Webpack给人的第一感官就是一个js翻译器，把一些浏览器不能识别的代码翻译成可识别的，但是这样的理解是不准确的或者说错误的。因为Webpack只认识import export这样的语法。

### 什么时模块打包工具
>Webpack就是一个模块打包工具，本身不认识js语法，只认识模块导入和导出的语法，把相互依赖的内容打包到一起。

**模块导入规范**
* ES Module -- es6规范

~~~
// 导出
export defualt xxx
// 引入
import xxx from ''

// 导出
export const xxx = xxx
import { XXX } from ''
~~~

* CommonJS -- Node.js

~~~
// 导出
module.exports = {}
// 引入
const xxx = reqiure('')
~~~

* CMD
>CMD是另一种js模块化方案，它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。
* AMD
> AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

### Webpack的正确安装方式
**搭建Webpack环境**
* 安装 Node
* 新建一个项目文件夹，初始化项目 -- npm init -y => 生成package.json 文件
* 安装webpack webpack-cli
>全局安装 npm insall webpack webpack-cli -g -- 不推荐，每个项目webpack版本会有所不同
>局部安装 npm install webpack webpack-cli -D -- 推荐，可以更好的管理项目

**打包方式**
* 如果全局安装了Webpack，我们只需在命令行运行 webpack 即可
* 在项目内部安装了 Webpack，运行 webpack 这样的命令是不能进行打包的，因为使用该命令找的是全局中的webpack，因为全局中没有，所以会报错，这时候运行 npx webpack index.js 即可

**安装特定版本的Webpack**
* 查看Webpack所有版本号 -- npm info webpack
* 查看当前局部 Webpack 版本号 -- npx webpack -v
* 安装 -- npm install webpack@ + 版本号


### 使用Webpack的配置文件
>Webpack 没有智能到我们给它文件它就会自动打包，这时候就需要使用 Webpack 的配置文件了。其实，Webpack内置了默认配置文件，所以我们使用 webpack 打包命令时，会输出相应的内容。

**Webpack 配置文件概览**

~~~
module.exports = {
  // 入口文件: 指定webpack开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库
  entry: '',
  // 打包模式，生产环境下会自动压缩代码
  mode: 'production' || 'development',
  // 
  devtool: '',
  // loader 处理规则
  module: {
    rule: {
      ···
    }
  },
  // 定义一些特殊的加载方式
  resolve: {
    ···
  },
  // 插件列表
  plugins: [
    ···
  ],
  // 配置输出文件路径和文件名
  output: {
    filename: '',
    path:
  }
}
~~~

**如何使用配置文件**
* 命令行直接使用 -- npx webpack --config + 配置文件名
* 在 package.json 中增加命令
~~~
scripts: {
  // 现在直接在命令行中运行 npm run build 即可实行打包命令
  "build": "webpack --config webpack.config.js"
}
~~~

### 浅析 Webpack 打包输出内容

~~~
Hash: e48b39004546f203c7a4
Version: webpack 4.39.1
Time: 30935ms
Built at: 2019-08-13 22:11:29
     Asset       Size  Chunks             Chunk Names
 bundle.js   99.3 KiB       0  [emitted]  main
index.html  317 bytes          [emitted]
Entrypoint main = bundle.js
~~~

**打包输出内容解析**
* Hash -- 本次打包唯一的表示符
* Version -- 版本号
* Time -- 本次打包时间
* Build at -- 本次打包完成时间
* Asset -- 打包形成文件名称
* Size -- 大小
* Chunks -- 代码块数量
* Chunk Names











