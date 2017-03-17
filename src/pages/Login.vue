<template>
  <div>
    <div class="login_container">
      <input type="text" class="input_container"  v-model="form.username" :placeholder=" isClerk ? '业务员工号' : '管理员用户名' " >
      <input type="password" class="input_container" v-model="form.password" placeholder="密码">
      <transition name="bounce"
                  enter-active-class="bounceInLeft"
                  leave-active-class="bounceOutRight"
                  mode="out-in">
        <input v-if="!isLogin" type="password" class="input_container" v-model="form.confirm" placeholder="确认密码">
      </transition>
      <transition name="fadeUp" mode="out-in">
        <el-button class="input_container submit" v-if="isLogin" type="success" @click="submit" key="login">登录</el-button>
        <el-button class="input_container submit" v-if="!isLogin" type="success" @click="submit" key="register">注册</el-button>
      </transition>
    </div>
    <div class="btn_group">
      <a @click="isLogin = !isLogin">{{ isLogin ? '没有账号?注册': '已有账号?登录' }}</a>
      <a @click="isClerk = !isClerk" >{{ isClerk ? '管理员登录' : '业务员登录' }}</a>
    </div>
  </div>
</template>

<script>

  import request from '@/utils/request'
  export default {
    components: {
    },
    data() {
      return {
        form: {
          username: '',
          password: '',
          confirm: ''
        },
        isClerk: true,
        isLogin: false
      }
    },
    methods: {
      submit() {
        if(this.isClerk && this.isLogin) {
          // 业务员登录
          request().post("/token/clerk", {
            clerkId: this.form.username,
            password: this.form.password
          }).then(() => {
            console.log('success')
          }).catch((err) => {
            console.error(err)
          })
        }else if (this.isClerk && !this.isLogin) {
          // 业务员注册
          request().post("/clerks", {
            clerk: {
//              clerkId: this.form.username,
              clerkId: "张加胜1",
              password: this.form.password
            }
          }).then(() => {
            console.log('success')
          }).catch(err => {
            console.error(err)
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

  .login_container {
    background: url("~@/assets/back.png");
    background-size: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input_container {
    height: 50px;
    line-height: 50px;
    width: 80%;
    border: 1px solid #DBDADA;
    border-radius: 50px;
    background: transparent;
    padding: 0 25px;
    box-sizing: border-box;
    &, &::-webkit-input-placeholder {
      color: #ECEBEB;
    }
    & + .input_container {
      margin-top: 30px;
    }
  }

  .submit {
    background: #13CE66 ;
    border: none;
    font-size: 1.2rem;
  }

  .btn_group {
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: 40px;
    right: 40px;
    bottom: 20px;

    a {
      text-decoration: none;
      color: #ECEBEB;
      &:hover, &:active, &:focus {
        color: #d3ece2;
      }
    }

  }

</style>

