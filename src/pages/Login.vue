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
      <a @click="isClerk = !isClerk" >{{ isClerk ? '管理员' : '业务员' }}</a>
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
        isLogin: true
      }
    },
    methods: {
      submit() {
        if(!this.form.username || !this.form.password) {
          this.$message({
            type: 'error',
            message: '用户名或密码不能为空'
          })
          return
        }
        if(this.isClerk && this.isLogin) {
          // 业务员登录
          request().post("/token/clerk", {
            clerk: {
              clerkId: this.form.username,
              password: this.form.password
            }
          }).then(res => {
            let tokenRoot = res.data.tokenRoot
            localStorage.setItem('token', tokenRoot.token)
            localStorage.setItem('expiredAt', parseInt(tokenRoot.expiredAt))
            localStorage.setItem('clerkId', this.form.username)
            this.$router.push('/home')
          }).catch((err) => {
            let error = err.response.data.error
            if(!error) {
              this.$message({
                type: 'warning',
                message: '正在清理缓存，请重新提交'
              })
              localStorage.clear()
              return
            }
            let errorMessage = error.message;
            this.$message({
              type: 'error',
              message: errorMessage
            })
          })
        }else if (this.isClerk && !this.isLogin) {
          if (this.form.password !== this.form.confirm) {
            this.$message({
              type: 'error',
              message: '两次输入的密码不一样'
            })
            return
          }
          // 业务员注册
          request().post("/clerks", {
            clerk: {
              clerkId: this.form.username,
              password: this.form.password
            }
          }).then(() => {
            this.$message({
              type: 'success',
              message: `${this.form.username} 业务员注册成功`
            })
            this.isLogin = true
          }).catch(err => {
            let error = err.response.data.error
            if(!error) {
              this.$message({
                type: 'warning',
                message: '正在清理缓存，请重新提交'
              })
              localStorage.clear()
              return
            }
            let errorMessage = error.message;
            if (/INDEX.*CLERK_ID/.test(errorMessage) || /ConstraintViolationException/.test(errorMessage)) {
              errorMessage = '业务员工号已存在'
            }else {
              errorMessage = '未知错误'
            }
            this.$message({
              type: 'error',
              message: errorMessage
            })
          })
        } else if (!this.isClerk && !this.isLogin) {
          // 管理员注册
          if (this.form.password !== this.form.confirm) {
            this.$message({
              type: 'error',
              message: '两次输入的密码不一样'
            })
            return
          }

          request().post('/admins', {
            admin: {
              username: this.form.username,
              password: this.form.password
            }
          }).then(res => {
            this.$message({
              type: 'success',
              message: `${this.form.username} 管理员注册成功`
            })
            this.isLogin = true

          }).catch(err => {
            let error = err.response.data.error
            if(!error) {
              this.$message({
                type: 'warning',
                message: '正在清理缓存，请重新提交'
              })
              localStorage.clear()

              return
            }
            let errorMessage = error.message;
            if (/INDEX.*USERNAME/.test(errorMessage) || /ConstraintViolationException/.test(errorMessage)) {
              errorMessage = '管理员用户名已存在'
            }else {
              errorMessage = '未知错误'
            }
            this.$message({
              type: 'error',
              message: errorMessage
            })
          })
        } else {
          // 管理员登录
          request().post("/token/admin", {
            admin: {
              username: this.form.username,
              password: this.form.password
            }
          }).then(res => {
            let tokenRoot = res.data.tokenRoot
            localStorage.setItem('token', tokenRoot.token)
            localStorage.setItem('expiredAt', parseInt(tokenRoot.expiredAt))
            localStorage.setItem('adminId', this.form.username)
            this.$router.push('/admin')
          }).catch((err) => {
            let error = err.response.data.error
            if(!error) {
              this.$message({
                type: 'warning',
                message: '正在清理缓存，请重新提交'
              })
              localStorage.clear()
              return
            }
            let errorMessage = error.message;
            this.$message({
              type: 'error',
              message: errorMessage
            })
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

