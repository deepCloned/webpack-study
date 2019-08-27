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


## 多页面打包配置