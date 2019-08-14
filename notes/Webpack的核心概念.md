## 什么是 Loader
> Loader 可以简单的理解为一个处理函数，对于不同类型的文件（js文件、图片文件、字体文件），我们使用不同的 Loader 进行处理。Loader 是不包含在 Webpack 中的，如果我们要处理各种文件，就要安装不同的 Loader，因为 Webpack 本质上只能处理 js文件，所以我们告诉它遇到什么文件使用什么样的 Loader。

**Loader的配置方法**

```
module.exports = {
  entry: '',
  // 定义一系列处理规则的模块
  module: {
    // 规则列表
    rules: [
      {
        // 匹配文件
        test: /\.js$/,
        /**
         * 使用什么样的 loader
         * 如果使用的 loader是一个数组，每一个 loader 都是一个对象，如果这个 loader 没有任何配置项，直接以字符串的形式写入名称即可
         */
        use: [
          {
            // loader 名称
            loader: 'babel-loader',
            // 配置项
            options: {}
          }
        ],
        /**
         * 每一个 Loader 都有一个打包范围的选项，可以限制打包范围，或者打包时忽略某些文件
         */
        // 打包路径
        include: 
        // 忽略的文件夹
        exclude:
      }
    ]
  }
}
```
Loader 就是一个打包方案。

## 使用 Loader 打包图片文件
>对于图片资源，我们可以使用 file-loader 或者 url-loader。

**file-loader**：默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。

```
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            /**
             * 默认打包后的文件名为 MD5 哈希值
             * 通过 name 属性配置打包过后的文件名
             */
            name: '[name].[ext]',
            /**
             * 输出之后放入哪个路径，默认放在 dist 跟目录下
             * 设置的路径是相对于 dist 目录的，'images/' -- 即在 dist 目录下新建一个文件夹，打包完成的图片放入里面
             */
            outputPath: 'images/'
          }
        }
      ]
    }
  ]
}
```

**url-loader**: 作用跟 file-loader 类似，但可以通过配置选项里的 limit 属性限制文件小于某个值时直接返回一个 DataUrl，这样的话使用该图片资源就不用额外请求资源了。

```
// url-loader 配置项基本与 file-loader 一致
module: {
  rules: [
    {
      loader: 'url-loader',
      options: {
        // 如果打包的图片小于此大小，就会直接打包到入口文件里，页面使用时不需要再发送 http 请求
        limit: 8192
      }
    }
  ]
}
```

## 使用 Loader 打包样式
### 处理css文件
* postcss-loader -- 添加厂商前缀
* css-loader -- 用来处理css文件中的url路径（解析@import 和 url()语法）
* style-loader -- 可以把css文件变成style标签的形式插入到head中

**具体配置**
```
module: {
  rules: [
    {
      test: /\.css$/,
      // 多个loader有执行顺序的要求，从右向左，从下往上，对于处理css文件不能搞混loader执行的先后顺序
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            /**
             * 当在一个css文件中如果通过 import 的方式引入了其他css文件，解析这个css文件默认从css-loader开始
             * 如果配置了 importLoaders，就等于告诉了 Webpack在执行该loader之前还有两个loader需要执行
             * Webpack 会自动往前寻找指定数量的loader执行，就避免了引入的css文件处理不完整的问题
             */
            importLoaders: 1
          } 
        },
        'postcss-loader'
      ]
    }
  ]
}
```
*如果打包sass、less类型的文件，只需在其他css-loader执行之前加载相应的loader即可*

### 处理字体文件
**file-loader**

```
module: {
  rules: [
    {
      test: /\.(eot|woff|svg|ttf|woff2)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    }
  ]
}
```

## 使用 Plugins 使打包更加便捷
>可以在 Webpack 运行到某个时刻的时候，做一些特定的事情（类似生命周期函数）;
Plugin 使用时需要引入，然后实例化

### 常用的 Plugins

* html-webpack-plugin -- 会在每次打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个hmtl文件中，可以设置模板文件，使用该模板作为这个html文件
```
// 引入插件，命名以大写字母开头，因为后面要实例化
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 使用插件
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 设置模板文件
      template: ''
    })
  ]
}
```
* clean-webpack-plugin -- 每次打包之前都清除 dist 目录下的所有文件，可配置清除目录

## Entry 与 Output 配置
>打包入口文件和输入文件的路径设置
**打包单个入口文件**

```
module.exports = {
  entry: './src/xxx.js',
  output: {
    filename: 'bundle',
    path: path.resolve(__dirname, 'dist')
  }
}
```

**打包多个入口文件**

```
module.exports = {
  entry: {
    main: './src/main.js',
    index: './src/index.js'
  },
  output: {
    // 为js文件增加前缀
    publicPath: 'https://cdn.com.cn',
    // 使用 name 占位符，会根据入口文件的配置自动生成多个文件
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

## SourceMap 的配置

## WebpackDevServer的使用

##　Hot Moudle Replacement

## 使用 Babel 处理 ES6 语法











