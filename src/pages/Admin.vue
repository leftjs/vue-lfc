<template>
  <div>
    <mt-header :title="tabs[activeTab]">
      <img src="static/avatar.png" slot="right" class="avatar" @click="sheetVisible = !sheetVisible">
    </mt-header>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
    <el-tabs v-model="activeTab">
      <el-tab-pane name="manageClerk" label="业务员管理" class="pane_container">
        <el-table :data="clerks.clerk" stripe align='left'>
          <el-table-column prop="clerkId" label="工号">
            <template scope="scope">
              <span class="ellipsis_column">{{scope.row.clerkId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="password" label="密码">
            <template scope="scope">
              <span class="ellipsis_column">{{scope.row.password}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template scope="scope">
              <el-button size="small" @click="clerkForm = Object.assign({}, scope.row)">更新</el-button>
              <el-button size="small" type="danger" @click="deleteClerk(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="fetchClerks($event - 1, clerks.sizePerPage)"
          :current-page="+clerks.currentPage + 1"
          :total="+clerks.totalSize"
          layout="total, prev, pager, next"
          :page-size="+clerks.sizePerPage"
        ></el-pagination>
        <el-form :model="clerkForm" :rules="clerkFormRule" ref="clerkForm" class="form_container" label-width="90px" label-position="right" >
          <el-form-item label="工号" prop="clerkId">
            <el-input v-model="clerkForm.clerkId" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" >
            <el-input  v-model="clerkForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitClerkForm">提交</el-button>
            <el-button type="danger" @click="resetClerkForm">重填</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="manageAdmin" label="管理员管理">
        <el-table :data="admins.admin" stripe align='left'>
          <el-table-column prop="username" label="用户名">
            <template scope="scope">
              <span class="ellipsis_column">{{scope.row.username}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="password" label="密码">
            <template scope="scope">
              <span class="ellipsis_column">{{scope.row.password}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template scope="scope">
              <el-button size="small" @click="adminForm = Object.assign({}, scope.row)">更新</el-button>
              <el-button size="small" type="danger" @click="deleteAdmin(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="fetchAdmins($event - 1, admins.sizePerPage)"
          :current-page="+admins.currentPage + 1"
          :total="+admins.totalSize"
          layout="total, prev, pager, next"
          :page-size="+admins.sizePerPage"
        ></el-pagination>
        <el-form :model="adminForm" :rules="adminFormRule" ref="adminForm" class="form_container" label-width="90px" label-position="right" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adminForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" >
            <el-input  v-model="adminForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitAdminForm">提交</el-button>
            <el-button type="danger" @click="resetAdminForm">重填</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="manageInsurance" label="保单管理"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import request from '@/utils/request'
  export default {
    data() {
      return {
        // 菜单
        tabs: {
          manageClerk: '业务员管理',
          manageAdmin: '管理员管理',
          manageInsurance: '保单管理'

        },
        activeTab: 'manageClerk',

        // actionsheet
        sheetVisible: false,
        actions: [{
          name: '注销',
          method: () => {
            this.logout()
          }
        }],

        // 业务员
        clerks: {
          currentPage: '0',
          sizePerPage: '10',
          totalPages: '1',
          totalSize: '0',
          clerk: []
        },
        clerkForm: {
          clerkId: '',
          password: ''
        },
        clerkFormRule: {
          clerkId: {
            required: true, message: '工号不能为空', trigger: 'blur'
          },
          password: {
            required: true, message: '密码不能为空', trigger: 'blur'
          }
        },

        // 管理员
        admins: {
          currentPage: '0',
          sizePerPage: '10',
          totalPages: '1',
          totalSize: '0',
          admin: []
        },
        adminForm: {
          username: '',
          password: ''
        },
        adminFormRule: {
          username: {
            required: true, message: '用户名不能为空', trigger: 'blur'
          },
          password: {
            required: true, message: '密码不能为空', trigger: 'blur'
          }
        }


      }
    },
    methods: {
      logout() {
        localStorage.clear()
        this.$router.replace('/')
      },


      // clerk相关业务
      fetchClerks(page, size) {
        request().get(`clerks?page=${page}&size=${size}`).then(res => {
          console.log(res.data)
          this.clerks = res.data.clerkList
        }).catch(err => {
          console.error(err)
        })
      },
      deleteClerk(id) {
        request().delete(`/clerks/${id}`).then(res => {
          this.$notify({
            title: '成功',
            message: '业务员删除成功',
            type: 'success',
            duration: 2000
          })
          this.fetchClerks(this.clerks.currentPage, this.clerks.sizePerPage)

        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '业务员删除失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      submitClerkForm() {
        this.$refs.clerkForm.validate(valid => {
          if (valid) {
            let data = this.clerkForm
            let id = data.id
            if (!!id) {
              // 更新
              request().put(`/clerks/${id}`, {
                clerk: {
                  clerkId: data.clerkId,
                  password: data.password
                }
              }).then(res => {
                this.$notify({
                  title: '成功',
                  message: '业务员更新成功',
                  type: 'success',
                  duration: 2000
                })
                this.resetClerkForm()
                this.fetchClerks(this.clerks.currentPage, this.clerks.sizePerPage)

              }).catch(err => {
                let errorMessage = err.response.data.error.message;
                if (/INDEX.*CLERK_ID/.test(errorMessage)) {
                  errorMessage = '业务员工号已存在'
                }else {
                  errorMessage = '未知错误'
                }
                this.$notify({
                  title: '失败',
                  message: errorMessage,
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              // 新建
              request().post('/clerks', {
                clerk: {
                  clerkId: data.clerkId,
                  password: data.password
                }
              }).then(res => {
                this.$notify({
                  title: '成功',
                  message: '业务员新增成功',
                  type: 'success',
                  duration: 2000
                })
                this.resetClerkForm()
                this.fetchClerks(this.clerks.currentPage, this.clerks.sizePerPage)

              }).catch(err => {
                let errorMessage = err.response.data.error.message;
                if (/INDEX.*CLERK_ID/.test(errorMessage)) {
                  errorMessage = '业务员工号已存在'
                }else {
                  errorMessage = '未知错误'
                }
                this.$notify({
                  title: '失败',
                  message: errorMessage,
                  type: 'error',
                  duration: 2000
                })
              })
            }
          }else {
            console.log("error submit")
            return
          }
        })
      },
      resetClerkForm(){
        this.$refs.clerkForm.resetFields()
        this.clerkForm = {
          clerkId: '',
          password: ''
        }
      },

      // admin相关业务
      fetchAdmins(page, size) {
        request().get(`admins?page=${page}&size=${size}`).then(res => {
          console.log(res.data)
          this.admins = res.data.adminList
        }).catch(err => {
          console.error(err)
        })
      },
      deleteAdmin(id) {
        request().delete(`/admins/${id}`).then(res => {
          this.$notify({
            title: '成功',
            message: '管理员删除成功',
            type: 'success',
            duration: 2000
          })
          this.fetchAdmins(this.admins.currentPage, this.admins.sizePerPage)

        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '管理员删除失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      submitAdminForm() {
        this.$refs.adminForm.validate(valid => {
          if (valid) {
            let data = this.adminForm
            let id = data.id
            if (!!id) {
              // 更新
              request().put(`/admins/${id}`, {
                admin: {
                  username: data.username,
                  password: data.password
                }
              }).then(res => {
                this.$notify({
                  title: '成功',
                  message: '管理员更新成功',
                  type: 'success',
                  duration: 2000
                })
                this.resetAdminForm()
                this.fetchAdmins(this.admins.currentPage, this.admins.sizePerPage)


              }).catch(err => {
                let errorMessage = err.response.data.error.message;
                if (/INDEX.*USERNAME/.test(errorMessage)) {
                  errorMessage = '管理员用户名已存在'
                }else {
                  errorMessage = '未知错误'
                }
                this.$notify({
                  title: '失败',
                  message: errorMessage,
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              // 新建
              request().post('/admins', {
                admin: {
                  username: data.username,
                  password: data.password
                }
              }).then(res => {
                this.$notify({
                  title: '成功',
                  message: '业务员新增成功',
                  type: 'success',
                  duration: 2000
                })
                this.resetAdminForm()
                this.fetchAdmins(this.admins.currentPage, this.admins.sizePerPage)


              }).catch(err => {
                let errorMessage = err.response.data.error.message;
                if (/INDEX.*USERNAME/.test(errorMessage)) {
                  errorMessage = '管理员用户名已存在'
                }else {
                  errorMessage = '未知错误'
                }
                this.$notify({
                  title: '失败',
                  message: errorMessage,
                  type: 'error',
                  duration: 2000
                })
              })
            }
          }else {
            console.log("error submit")
            return
          }
        })
      },
      resetAdminForm(){
        this.$refs.adminForm.resetFields()
        this.adminForm = {
          username: '',
          password: ''
        }
      },
    },
    created() {
      this.fetchClerks(this.clerks.currentPage, this.clerks.sizePerPage)
      this.fetchAdmins(this.admins.currentPage, this.admins.sizePerPage)

    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .pane_container {
    padding: 0 20px;
    text-align: center;
  }
  .form_container {
    text-align: left;
    margin-top: 20px;
    padding: 20px 10px;
    box-shadow: lightgrey 0 1px 10px;
  }
</style>
