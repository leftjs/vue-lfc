<template>
  <div id="app">
    <transition name="fadeLeft" mode="out-in">
      <router-view></router-view>
    </transition>
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

  /*更改element的样式*/
  .el-message {
    border-radius: 20px !important;
  }
  .el-table__expand-icon{
    cursor: default !important;
  }


    /*清除outline*/
  input, button, a, div {
    outline: none;
  }

  /*修改默认的css动画时间*/
  .fadeLeft-enter-active,
  .fadeInLeft,
  .fadeLeft-leave-active,
  .fadeOutLeft {
    animation-duration: 0.5s !important;
  }

  .fadeUp-enter-active,
  .fadeInUp,
  .fadeUp-leave-active,
  .fadeOutUp {
    animation-duration: 0.5s !important;
  }

  .bounce-enter-active,
  .bounceIn,
  .bounce-leave-active,
  .bounceOut {
    animation-duration: 0.5s !important;
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
