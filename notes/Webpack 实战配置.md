## Library 的打包
>打包库文件与之前的打包入口文件不同，库文件要求可以给别人使用，并且可以通过多种方式引入。

**配置**

```
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library',
    library: 'root',
    libraryTarget: 'umd'
  }
}
```

**发布到 NPM**
* 注册账号
* npm adduser
* npm publish


## PWA 的打包配置 -- Progressive Web Application(渐进式Web应用程序)
>如果用户成功访问了网站，然后服务器挂掉了，以前的 Web 技术会显示服务器禁止访问，使用 PWA 技术可以实现从缓存中取到数据，提升用户体验。
workbox-webpack-plugin



## 使用 WebpackDevServer 实现请求转发
>主要用于开发环境中的接口转发。

**配置**

```
module.exports = {
  devServer: {
    proxy: {
      // 当请求的字段中包含 /api,把它转化成 target 里面的值
      '/api': {
        target: 'http://www.xxx.com',
        pathRewrite: {
          // 开发的时候 xxx.json 接口可能没有开发好，先用 yyy.json 模拟代替
          'xxx.json': 'yyy.json'
        },
        // 设置请求头
        headers: {

        }
      }
    }
  }
}
```

*项目上线后接口的路径即为服务器的路径*



## WebpackDevServer 解决单页面路由问题

### Vue -- vue-router

**配置**

```
// 安装 vue-router，新建 router.js
import Vue from 'vue'
import Router from 'vue-router'
import Home from 'xxx'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
```

```
// index.js
// 引入所有路由
import router from './router'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')
```

## Eslint 在 Webpack 中的配置和使用
>Eslint 是一种约束代码的工具，有利于团队协作中代码的规范性和一致性。

**如何使用**
* npm install eslint --save-dev
* npx eslint --init -- 生成 eslint 配置文件，选择合适的配置项
* npx eslint src -- 命令行检测代码
* npm install eslint-loader --save-dev

**在 loader 中添加 js**

```
// webpack.base.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // eslint-loader 要在其他 loader 之前使用
        use: ['babel-loader', 'eslint-loader'],
      }
    ]
  }
}
```

**相关规则的解释**
* Expected linebreaks to be 'LF' but found 'CRLF' -- 操作系统不同导致默认换行符不一样导致的。
rules 里面 配置 "linebreak-style": [0 ,"error", "windows"], //允许windows开发环境
* Unable to resolve path to module './App'  import/no-unresolved -- eslint 不认识不加省略后缀的文件，在配置项中告诉它，我们在 webpack 配置项中使用了后缀省略

```
// npm install eslint-import-resolver-webpack --save-dev
// .eslintrc.js
module.exports = {
  settings: {
    'import/resolver': {
      webpack: {
        config: './build/webpack.base.js',
      },
    },
  }
}
```

## Webpack 性能优化
1、跟上技术的迭代（使用最新的 Webpack、Node、Npm）
2、在尽可能少的模块上应用 Loader -- 指定应用 Loader 的文件/夹 (合理使用 exclude include)
3、Plugin 尽可能精简并确保可靠
>某些实用工具， plugins 和 loaders 都只能在构建生产环境时才有用。在开发时使用 UglifyJsPlugin 来压缩和修改代码是没有意义的。

4、resolve 参数合理配置


## 多页面打包配置
> 多页面，多入口文件的打包。

* 首先，定义好模板文件；
* 使用 html-webpack-plugin 指定各个页面的模板文件
* 使用 html-loader 打包 html 页面，不使用这个 loader，无法实现实现对图片的打包
* 指定每个页面使用的入口文件（chunks）

**配置**

```
// webpack.base.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 模板
      template: '../src/index.html',
      // 打包过后的文件名
      filename: 'index.html',
      // 需要引入的入口文件
      chunks: ['jquery', 'index']
    }),
    new HtmlWebpackPlugin({
      template: '../src/login.html',
      filename: 'login.html',
      chunks: ['jquery', 'login']
    })
  ]
}
```

**多页面引用中引入 jquery**

* 安装依赖 npm i jquery --save
* 新建 jquery.js，引入 jquery，挂载到全局
* 配置入口文件，jquery.js
* 各个页面配置模板文件的时候引入 chunks