module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Add fallback for 'os' module
        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback,
        //   os: require.resolve("os-browserify/browser"),
        //   vm: require.resolve("vm-browserify"),
        //   path: require.resolve("path-browserify"),
        //   crypto: require.resolve("crypto-browserify"),
        //   url: require.resolve("url/"),
        //   console: require.resolve("console-browserify"),
        //   http: require.resolve("stream-http"),
        //   assert: require.resolve("assert/"),
        // stream: require.resolve("stream-browserify")
        fs: false,
        os: false,
        path: false,
        stream: false,
        util: false,
        crypto : false, 
        vm: false,
        console: false,
        http: false,
        zlib: false,
        querystring: false,
        diagnostics_channel: false,
        worker_threads: false,
        async_hooks: false,
        net: false,
        tls: false,
        https: false,
        domain: false,
        child_process: false,
        repl: false,
        url: require.resolve('url/'),
        constants: false,
        
        perf_hooks: false,
        
        assert: require.resolve('assert/'),
        };
        // webpackConfig.plugins.push(
        //     new webpack.IgnorePlugin({
        //       resourceRegExp: /^\.\/locale$/,
        //       contextRegExp: /moment$/,
        //     })
        //   );
        webpackConfig.resolve.alias.module = false;
        
        return webpackConfig;
      },
    },
  };
  