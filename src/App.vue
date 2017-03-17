<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>

  /*app全局样式*/
  #app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100vw;
    height: 100vh;
  }

  .el-message {
    border-radius: 20px !important;
  }


  /*清除outline*/
  input, button, a, div {
    outline: none;
  }


  /*clerfix*/
  .clearfix:before,.clearfix:after {
    content: "";
    display: table;
  }
  .clearfix:after {
    clear: both;
  }

  .clearfix {
    zoom: 1; /*IE/7/6*/

  }
</style>
