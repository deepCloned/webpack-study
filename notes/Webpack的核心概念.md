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
> sourceMap 是一个映射关系，它知道dist目录下main.js文件中代码的每一行对应打包之前文件的行数。
> 如果有一行代码出错了,通过设置不同的 devtool 显示不同的报错信息。
> 通过配置devtool设置souceMap，不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。
> 比如我们在src目录下的某一行代码出错了，默认情况下控制台报错显示的是打包过后的文件报错的行数，但是我们期望定位到原始出错位置。
> webpack 文档中有关于各种模式的 devtool 的打包效率对比。

**配置**

```
module.exports = {
  // development 模式下
  devtool: 'cheap-module-eval-source-map'
  // production 模式下
  devtool: 'cheap-module-source-map'
}
```

## WebpackDevServer的使用
> 它为我们提供了一个简单的 web 服务器，并且能够实时重新加载，有利于提高开发效率。
> 开发模式下使用。

**配置**

```
module: {
  // 默认在 localhost:8080 下建立服务
  devServer: {
    // 将 dist 目录下的文件，作为可访问文件。
    contentBase: './dist',
    // 为了不与其他端口号冲突，可配置端口
    port: '8000'
  }
}
```

**添加脚本命令运行devServer**

```
// package.json 文件中
scripts: {
  // --open 表示自动打开默认浏览器
  "dev": "webpack-dev-server --open"
}
```

现在，命令行运行 npm run dev 即可开启 webpack-dev-server 开启服务器辅助开发。
*通过 webpack-dev-server 打包命令打包后，不会显示的出现dist目录，这是被放入了电脑内存中，有利于提高性能*

##　Hot Moudle Replacement -- 模块热替换
> 当我们更改项目代码的时候，webpack-dev-server 会感知到变化，然后自动刷新页面，然后并不是每一次改动我们都希望它自动刷新页面。
> 当更改样式时，为了代码的调试方便，我们只希望更改页面的样式，而不希望刷新整个页面，就需要启用模块热替换。

**配置**

```
const webpack = require('webpack');
module.exports = {
  module: {
    devServer: {
      contentBase: './dist',
      port: 8000,
      hot: true,
      hotOnly: true
    },
    plugins: [
      new webpack.hotModuleReplacementPlugin()
    ]
  }
}
```

## 使用 Babel 处理 ES6 语法
> 我们在开发的过程中会使用大量的 ECMAScript 2015+ 版本的语法，但是某些浏览器中较低的版本没有实现该功能语法，这个时候我们就需要借助 Babel 编译 ES6 语法成浏览器能够识别的代码。

### 定义
Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

**功能**
* 语法转换
* 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
* 源码转换 (codemods)

### 在 Webpack 中使用 Babel
进入 Babel 官网，进入设置，然后选择 Webapck，按照提示进行相关包的安装和配置。

**安装模块**
* babel-loader
Webpack 与 Babel 之间通信的桥梁，本身不认识 ES6 语法。
* @babel/core
Babel 中的一个核心库，让 Babel 识别代码中的内容，转化为抽象语法树。
* @babel/preset-env
Babel 中核心模块，包含一系列语法转换的规则，把 ECMAScript 2015+ 的语法转化为我们希望它能用的浏览器或环境（通过 targets 配置）。
* @babel/polyfill
Babel包含一个polyfill，它包含一个自定义的再生器运行时和core-js。
这将模拟完整的ES2015 +环境，引入该模块，可以自动添加在项目中使用了但运行环境中还没有实现的功能，比如（Primise），默认引入所有功能，可通过设置按需引入。
*该模块需要安装在生产环境中。*

** 配置 **

```
// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      // 忽略第三方模块，不需要进行打包
      exclude: /node_modules/,
      use: 'babel-loader'
    }
  ]
}

// .babelrc
// preset -- 预置
{
  "preset": ["@babel/preset-env"]
  /**
   * 如果使用多个预置，使用数组隔开
   * 如果使用的 preset 还有其他配置，则数组的第一位写名称，第二位写配置对象
   */
  "presets": [
    [
      "@babel/preset-env",
      {
        targets: {
          // 目标设置最低浏览器运行的版本，如果该浏览器已经实现了 ES2015 + 的相关功能，则不需要再次引入
          chrome: 67
        },
        // 按需引入，使用了哪些 ES2015 + 语法，就引入哪些
        "useBuiltIns": "usage"
      }
    ]
  ]
}

// main.js -- 入口文件顶部引入
import '@babel/polyfill';
```

以上的配置是在打包业务逻辑代码时使用，如果是打包一个库类的文件，这些配置就有些不合适了，因为在引入 @babel/polyfill 时会污染全局。

** 打包库类文件的配置 **
+ 模块：
- @babel/plugin-transform-runtime
- @babel/runtime
- @babel/runtime-corejs2

```
// .babelrc
{
  "presets": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        // 默认 false，修改为 2
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```










