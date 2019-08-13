# webpack4从零开始搭建一个vue项目

## 依赖项
>首先我们安装所需依赖，值得注意的是，安装webpack的正确方式是采用局部安装，因为每个项目所依赖的webpack版本会有所不同，局部安装可以更好的管理。

```
"dependencies": {
  /**
   * 相当于一个垫片
   * 对于一些某些版本的浏览器没有实现的功能，它会把这些使用了的功能挂载到全局环境中
   */
    "@babel/polyfill": "^7.4.4",
    "vue": "^2.6.10",
    "vue-router": "^3.1.2"
  },
  "devDependencies": {
  /* 为css属性添加厂商前缀 */
    "autoprefixer": "^9.6.1",
  "@babel/core": "^7.5.5",
  /**
   * 包含es6转es5的所有语法规则
   */
    "@babel/preset-env": "^7.5.5",
  /**
   * 只是webpack和babel之间沟通的桥梁，这个模块本身并不认识es6语法
   */
    "babel-loader": "^8.0.6",
  /**
   * 没次打包之前清除上一次打包完成的文件
   */
    "clean-webpack-plugin": "^3.0.0",
  /**
   * 引入目标文件，打包生成一个新的文件
   * 一般用于打包字体类的文件
   */
    "file-loader": "^4.2.0",
  /**
   * 模板工具
   */
    "html-webpack-plugin": "^3.2.0",
  /**
   * sass的依赖项
   */
    "node-sass": "^4.12.0",
  /**
   * Loader for webpack to process CSS with PostCSS
   */
    "postcss-loader": "^3.0.0",
  /**
   * 解析sass语法
   */
    "sass-loader": "^7.2.0",
  /**
   * 解析@import 和 url()语法
   */
    "css-loader": "^3.2.0",
  /**
   * 把解析完成的css文件通过<link-href>的方式引入，而不是以<style></style>的方式放在页面头部
   */
    "style-loader": "^1.0.0",
  /**
   * 类似file-loader
   * 可通过选项设置规定所打包文件小于某个值时，不输出文件，直接生成DataUrl(base64格式)
   * 这样的话在使用的时候就可以少发一次http请求
   */
    "url-loader": "^2.1.0",
  /**
   * 解析vue文件
   */
    "vue-loader": "^15.7.1",
  /**
   * 配合vue-loader使用解析vue文件的插件
   */
    "vue-template-compiler": "^2.6.10",
  /**
   * 主角，模块化打包工具
   */
    "webpack": "^4.39.1",
  /**
   * 脚手架工具，生成特定的文件目录
   */
    "webpack-cli": "^3.3.6",
  /**
   * 开发使用的工具
   * 可以启动一个服务器，实现自动刷新页面的功能
   * 提升开发效率
   */
    "webpack-dev-server": "^3.8.0",
  /**
   * 内置工具库文件，用于合并两个对象
   * 在这里我们用于合并配置文件(webpack开发环境和生产环境配置文件的些许不同)
   */
    "webpack-merge": "^4.2.1"
  },
```

## webpack配置文件
>因为要区分开发模式与生产模式，所以我们要准备两个配置文件，当然我们通常会把配置文件的公共部分放入一个文件中，我习惯命名为webpack.base.js。接下来就该轮到我们在依赖项中提到的工具方法webpack-merge 登场了，再新建两个文件，通常为webpack.dev.js(开发环境使用)、webpack.prod.js(生产环境中使用)。

编辑公共配置文件

```
module.exports = {
  /**
   * 入口文件，打包完成后直接被引入页面中
   * webpack默认入口文件为根目录下的index.js
   * 当然我们可以更给入口文件的路径，一个vue项目通常放在src目录下
   */
  entry: './src/index.js',
  /**
   * 这个模块里面定义了一系列的规则，告诉webpack如何处理不同类型的文件
   */
  module: {
    /**
     * 定义处理规则的数组，由多个对象组成
     * 一个对象定义了一种文件类型处理应该使用的加载器（loader）
     */
    rules: [
      {
        /**
         * 一个正则，匹配对应的文件
         */
        test: /\.js$/,
        /**
         * 使用对应的loader
         * 如果是多个loader需要写成数组的格式，单个直接写就可以了
         */
        use: 'babel-loader'
      }
    ]
  }
}
```
完整配置文件如下

```
/**
 * 插件(plugin)需要引入，然后通过new的方式使用
 * loader不需要再次引入，wepback会自动去node_modules中找
 * 如果使用了未安装的模块，会报错，不过不用担心，根据错误提示安装即可
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
/**
 * 使用vue-loader打包vue文件时，需要引入该插件
 * 把template语法转化为render函数
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin');
/**
 * webpack内置模块，包含路径处理的一系列方法
 */
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    /**
   * __dirname表示当前文件所在的目录，他是一个绝对路径
   * path.resolve() -- 方法可以将多个路径解析为一个规范化的绝对路径
   * path.join() -- 连接路径，将多个字符串路径合并成一个完整的路径
   */
    path: path.resolve(__dirname, '../dist'),
  /**
   * 定义打包之后的文件名，定义成你喜欢的名字
   */
    filename: 'bundle.js'
  },
  /**
   * 定义模块如何被解析
   */
  resolve: {
  /**
   * 为这些后缀名文件自动添加后缀名
   * 使用前引入一个vue import App from './App.vue'
   * 使用后 import App from './App'
   * 这样的好处是看起来更加简洁
   */
    extensions: ['.js', '.vue', '.json'],
  /**
   * 为特定目录设置别名
   */
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  /**
   * 定义模块解析使用的loader
   */
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
    /**
     * 这里我们使用babel-loader处理js文件
     * 值得注意的是，babel-loader只是连接webpack与babel之间的一个桥梁，本身不会翻译es6语法
     * 具体的babel配置我们在根目录下新建一个.babelrc配置babel
     */
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
      /**
       * importLoader 的意思是在使用css-loader之前好要使用两个loader
       * 主要用于使用import引入sass文件时不会使用sass-loader postcss-loader
       */
            options: {
              importLoaders: 2
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(ttf|svg|woff|woff2|eot)$/,
        use: 'file-loader'
      }
    ]
  },
  /**
   * plugins 使用时都需要通过new的方式
   */
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new VueLoaderPlugin()
  ]
}
```
编辑生产环境中的配置文件：webpack.prod.js

```
const merge = require('webpack-merge);
/**
 * 引入基础配置
 */
const baseConfig = require('./webpack.base.js);
/**
 * 合并两个对象，并导出
 */
module.exports = merge(baseConfig, {
  /**
   * 设置模式打包时会压缩代码
   */
  mode: 'production'
})
```

编辑开发环境中的配置文件：webpack.dev.js
```
  const merge = require('webpack-merge);
  const baseConfig = require('./webpack.base.js);
  module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
      /**
       * 从哪个文件中获取项目文件
       */
      contentBase: '',
      /**
       * 设置服务器端口
       */
      port: '',
      /**
       * 模块热更新，webpack感知到文件的修改就会自动刷新页面
       */
      hot: '',
      hotOnly: '',
      /**
       * 是否自动打开浏览器
       */
      open: ''
    }
  })
```
在此之后，我们还需要配置两个配置文件 babel和postcss
* .babelrc
>前面提到的babel-loader只是给webpack和babel之间搭建了一个桥梁，真正把es6语法翻译成es5语法的就是@babel/preset-env,它作为babel的一个插件

```
{
  presets: ["@babel/preset-env"]
}
```
* postcss.config.js

```
{
  module.exports = {
    plugins: [
      require('autoprefixer')
    ]
  }
}
```


这样的话，我们就配置好了wepback打包的相关配置。当然这还不够，我们得告诉它打包时使用哪个配置文件，以及何时使用开发模式打包，何时使用生产模式打包。
所以我们要在package.json 中配置打包命令：

```
"scripts": {
  /**
   * 当运行 npm run start 命令时，使用wepback-dev-server帮我们开启一个服务器，方便开发
   */
  "start": "webpack-dev-server --config ./build/webpack.dev.js",
  "build": "webpack --config ./build/webpack.prod.js"
}
```
*以上为基础配置项，如果只是简单搭建一个项目已经可以运行，后期有什么用到的loader或者plugin自行按照webpack官网文档即可*

## vue项目的目录
>此处可参照vue脚手架搭建的项目结构
目录如下：
+ src
  + assets -- 存放一些静态资源，比如图片，样式也可以放在里面
  + components -- 存放组件
  + styles -- 这里放入一些全局样式，包括初始化样式和字体文件
  + views -- 页面文件夹（也可以把页面和组件放入同一个文件夹）
  - App.vue -- 页面入口文件
  - index.html -- 入口页面
  - main.js -- 程序入口文件，加载各种公共组件

主要入口文件的编辑：
* App.vue
~~~
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
~~~

* index.html
~~~
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="view-port" content="width=device-width, initial-scale=1.0">
  <title>webpack vue</title>
</head>
<body>
  <div id="app">
    <h1>hello world</h1>
  </div>
</body>
</html>
~~~

* main.js
~~~
  import Vue from 'vue';
  import router from './router';
  import App from './App';

  import './styles/index.scss';

  new Vue({
    el: '#app',
    router,
    render: h => h(App)
  }).$mount('#app');
~~~



