## Tree Shaking
> tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，只支持 ES Module 语法。例如我们在一个文件中定义了多个方法，而在引用时只使用了一个，配置了 tree shaking，就会移除这些代码。

### 在开发环境中使用 Tree Shaking

```
// webpack.config.js
module.exports = {
  optimazation: {
    usedExports: true
  }
}
```

```
// package.json
{
  /**
   * tree shaking 默认会对所有导出但未引用的代码进行移除，但是诸如css文件就属于导出但未引用
   * 通过在 package.json 中添加 sideEffects 配置，对这些文件进行 tree shaking
   */
  "sideEffects": ['*.css']
}
```

### 生产环境中会默认开启 Tree shaking 功能，也就是说不需要设置 usedExports: true，sideEffect 按需设置

## Development 和 Production 模式的区别
开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。
所以我们要使用不同的配置文件进行打包，当然为了避免太多重复的配置代码，我们会先建立一个通用配置，包含开发环境和生产环境公用的配置，然后再额外建立两个配置文件，通过 webpack-merge 合成通用配置与私有配置。

**配置**
+ 新建一个 build 文件夹，新建三个文件 webpack.base.conf.js webpack.dev.conf.js webpack.prod.conf.js
+ 编辑通用配置文件 webpack.base.conf.js

```
module.expors = {}
```

+ 编辑不同环境的配置文件

```
// 引入合并对象的方法
const merge = 'webpack-merge';
// 引入通用配置
const baseConfig = require('./webpack.base.conf.js');
// 导出两者结合配置
module.exports = merge(baseConfig, {
  // 设置 mode
  mode: 'production' / 'development',
  ...
})
```

## Webpack 与 Code Splitting
> 随着开发的进行，我们可能需要引入相关的库文件，比如 lodash，再加上业务代码的增加，如果不加以配置，打包后的文件会非常的大，用户每次访问页面都要加载一遍这么大的文件，严重影响使用体验，代码分割变得刻不容缓。
> 代码分割可以按照一定的限制分割打包后的的代码成多个文件，优先加载主要业务逻辑，从一定程度上减少加载时间

### 事例之加载一个lodash库
* 第一种方法，直接在入口文件引入

```
// index.js
import _ from 'lodash';
```

* 第二种方法，新建一个 js 文件，引入 lodash，把 lodash 挂载到全局上，增加一个这个文件为入口文件

```
// lodash.js
import _ from 'lodash';
window._ = _

// webpack.config.js
module.exports = {
  entry: {
    main: '',
    lodash: './src/lodash.js'
  }
}
```

第一种方法会把 lodash 打包到 main.js 文件中，造成打包文件过大，加载时间会很长，当业务逻辑发生变化时，又要重新加载这个集成的大文件
第二种方法会分别打包 lodash 和 业务逻辑代码文件，打包成两个文件，分别引入 html 中，首次加载时间可能差不多，当业务逻辑发生变化时，只需要加载业务逻辑代码即可，从一定程度上提升了加载速度。

### 认识 Code Splitting
> 其实代码分割与 Webpack 是没有关系的，我们可以通过手动代码分割，把一个大文件分割成多个小文件，优先加载主要逻辑代码，可以提升页面加载速度；
> 之所以一提到代码分割就想到 Webpack，是因为 Webpack 在代码分割方面做的比较好。

**文件**

```
module.exports = {
  /**
   * 这样配置之后，Webpack 就按照一定的默认规则给我们的代码进行分割
   * 这样即使我们在入口文件中引入了其他类库，Webpack 也不会把它们打包在一起了
   */
  optimazation: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

**Webpack 实现代码分割的两种方式**
* 1、同步代码：只需要在 webpack.base.conf.js 中做 optimization 的配置
* 2、异步代码（import）： 无需做任何配置，会自动进行代码分割，依赖一个 babel 插件 -- @babel/plugin-syntax-dynamic-import，在配置文件中添加选项
*引入方式*

```
import(/* webpackChunkName: "lodash" */'lodash');
```


## SplitChunkPlugin
>Webpack 的代码分割底层使用了 SplitChunkPlugin 的技术，我们可以通过配置参数实现想要的代码分割方式。

**配置 splitChunks**

```
// 此为官方默认配置项，生产环境下这跟什么都不写是一样的效果
splitChunks: {
  /**
   * 'async': 只对异步代码生效
   * 'initial': 只对同步代码生效
   * 'all': 同步代码和异步代码都分割
   */
  chunks: "async",
  // 实行代码分割的大小，如果小于这个值则不会进行代码分割
  minSize: 30000,
  // 当一个模块被用了至少多少次的时候才会进行代码分割，打包完成过后至少有多少个 chunk 使用了模块才进行代码分割
  minChunks: 1,
  // 异步代码最多分割成多少个模块，后面的代码即使比较大也不会进行代码分割，因为分的模块太对，页面发起请求也会增加，影响性能
  maxAsyncRequests: 5,
  // 同步代码最多能分割多少个模块
  maxInitialRequests: 3,
  // 组和模块名之间的连接符
  automaticNameDelimiter: '~',
  name: true,
  // 缓存组，可以实现把多个模块打包在一个文件中
  cacheGroups: {
    // 根据是否是安装依赖中的依赖决定打包后的代码放入哪个以下哪个组中
    vendors: {
      // node_modules 里面的代码走此选项，打包后的代码文件名会包含 vendors 前缀
      test: /[\\/]node_modules[\\/]/,
      /**
       * 优先级，代码进入了这个组中，符合了该组的要求，并没有停止运行，会继续向下面走
       * 因为 default 组是没有文件路径的要求的，也会进入下面的组中，通过设置优先级决定到底放入哪个组中
       */
      priority: -10,
      filename: 'vendors.js'
    },
    // 默认放置分割后的代码的位置
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
}
```

## Lazy Loading 懒加载
>懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

比如说一个代码块需要通过特定的点击事件才能触发，我们就可以通过代码分割分离这块代码，在点击的时候在加载。
可以说是因为有了代码分割，我们才可以实现懒加载。

## Chunk 究竟是什么
每一个打包后的 js 文件都是一个 chunk。

## 打包分析，Preloading Prefetching
### 打包分析
>通过打包分析工具对打包后的代码进行分析，思考其合理性。

[Webpack 官方打包分析工具](https://github.com/webpack/analyse)

### 如何查看代码使用率
chrome 打开控制台，输入 ctrl+shift+p, 进入 Coverage 选项，刷新页面，浏览器会进行分析，得出代码使用率。

**提升代码使用率**
* prefetch 等待核心代码加载完成之后，再加载其他业务逻辑代码（常用）
* preload 与核心代码并行加载

*语法*

```
import(/*webpackPrefetch*/'./xxx.js', () => {})
```

## Css 文件的代码分割
>对于 css 文件，通过 postcss-loader、css-loader、style-loader 打包过后，css 会以 style 标签的形式放在 html 的 head 标签内部，如果引用了多个css文件，也会生成多个 style 标签，不够简洁，我们希望通过 link href 的方式引入一个完整的 css 文件，这时候就需要用到 MiniCssExtractPlugin，当然通过这个插件，也可以实现对 css 文件的代码分割。

**插件**
mini-css-extract-plugin

**配置**

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css/,
        use: {
          // 使用了这个 loader 就不能使用 style-loader 了，这两个功能互斥
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        }
      }
    ],
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].scss',
        chunkFilename: '[id].scss'
      })
    ]
  }
}
```
**压缩样式文件**
- optimize-css-assets-webpack-plugin
- 配置

```
/**
 * 压缩样式的操作我们只需要在生产环境中使用即可，开发模式没必要压缩
 * webpack.pord.conf.js
 */
const OptimizeCssAseetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCssAseetsPlugin({});
    ]
  }
}
```


**如何把多个css文件打包到一个组中（cacheGroup）**
在 splitChunks 的缓存组中增加一个选项，通过规则的匹配到样式类文件，缓存到组中，待样式文件全部打包完成，合并为一个文件。

```
module.exports = {
  optimization: {
    splitChunks: {
      chunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/
          }
        }
      }
    }
  }
}
```

## Webpack 与浏览器缓存（Caching）
>给每次打包后的 chunk 名增加一个hash值，就可以保证文件更新之后浏览器不会使用缓存中的文件。开发环境中，Webpack 热模块替换会自动帮助我们自动刷新，不需要配置文件名的hash值。

**配置**

```
module.exports = {
  output: {
    filename: '[name].[contentHash].js',
    chunkFilename: '[name].[contentHash].js'
  }
}
```

## Shimming 的作用
>相当于一个垫片，解决了 Webpack 打包过程中的兼容问题。比如 @babel/polyfill，在打包的过程中会自动添加一个低版本浏览器中的一些全局变量（Promsie等），以此来保证代码能够顺利运行。

##　环境变量的使用方法
>通过环境变量，我们合并通用配置文件和不同环境的的配置文件的方法可以有所不同。

webpack.dev.conf.js
```
module.exports = {}
```

webpack.prod.conf.js

```
module.exports = {}
```

webpack.base.conf.js

```
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.conf.js');
const pordConfig = require('./webpack.prod.conf.js');

const baseConfig = {}

module.exports = (env) => {
  if (env.production) {
    return merge(baseConfig, prodConfig)
  } else {
    return merge(baseConfig, devConfig)
  }
}
```
*这样的话，两个环境下的打包命令可以通过传入不同的环境变量使用一个配置文件来打包，不建议使用这种方式。*