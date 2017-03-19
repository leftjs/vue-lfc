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
      <el-tab-pane name="manageAdmin" label="管理员管理" class="pane_container">
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
      <el-tab-pane name="manageInsurance" label="保单管理">
        <div>
          <el-input placeholder="请输入内容" v-model="queryString">
            <el-select v-model="isQueryClerk" slot="prepend" placeholder="请选择" style="width: 100px;">
              <el-option label="业务员" :value="true"></el-option>
              <el-option label="投保人" :value="false"></el-option>
            </el-select>
            <el-button slot="append" icon="search" @click="insuranceQuery"></el-button>
          </el-input>
        </div>
        <el-table :data="insurances.insurance" align="left" stripe style="margin-top: 15px">
          <el-table-column type="expand" >
            <template scope="scope">
              <el-form label-position="left" inline class="expand_insurance_form">
                <el-form-item label="险种">
                  <span>{{ scope.row.info.polName}}</span>
                </el-form-item>
                <el-form-item label="保费">
                  <span>{{ scope.row.info.money }} 元</span>
                </el-form-item>
                <el-form-item label="生日">
                  <span>{{ scope.row.info.birthDate }}</span>
                </el-form-item>
                <el-form-item label="性别">
                  <span>{{ scope.row.info.sex }} / {{ scope.row.info.sex === 'M' ? '男' : '女' }}</span>
                </el-form-item>
                <el-form-item label="业务员">
                  <span>{{ scope.row.info.clerk }}</span>
                </el-form-item>
                <el-form-item label="手机号">
                  <span>{{ scope.row.info.mobile }}</span>
                </el-form-item>
                <el-form-item label="创建日期">
                  <span>{{ scope.row.info.inforceTime }}</span>
                </el-form-item>
                <el-form-item label="被保人关系">
                  <span>{{ scope.row.insureds.insured[0].rel}}</span>
                </el-form-item>
                <el-form-item label="姓名">
                  <span>{{ scope.row.insureds.insured[0].insureName}}</span>
                </el-form-item>
                <el-form-item label="被保人关系">
                  <span>{{ scope.row.insureds.insured[1].rel}}</span>
                </el-form-item>
                <el-form-item label="姓名">
                  <span>{{ scope.row.insureds.insured[1].insureName}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="info.baodanNo" label="保单号"></el-table-column>
          <el-table-column prop="info.holderName" width="80" label="投保人">
            <template scope="scope">
              <span class="ellipsis_column">{{scope.row.info.holderName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" >
            <template scope="scope" >
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="fetchInsurances({page: $event - 1, size: insurances.sizePerPage, isQueryClerk, queryString})"
          :current-page="+insurances.currentPage + 1"
          :total="+insurances.totalSize"
          layout="total, prev, pager, next"
          :page-size="+insurances.sizePerPage"
        ></el-pagination>
        <transition name="fadeLeft" >
          <el-form
            :model="updateInsuranceForm"
            :rules="updateInsuranceRule"
            ref="updateInsuranceForm"
            label-width="90px"
            class="form_container"
            style="margin-left: 20px; margin-right: 20px;"
            v-show="editMode"
            label-position="right">
            <el-form-item label="投保人" prop="holderName" >
              <el-input v-model="updateInsuranceForm.holderName" placeholder="请输入投保人姓名" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="updateInsuranceForm.sex">
                <el-radio label="F">女</el-radio>
                <el-radio label="M">男</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker v-model="updateInsuranceForm.birthDate" type="date" placeholder="选择出生日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="创建日期" prop="inforceTime">
              <el-date-picker v-model="updateInsuranceForm.inforceTime" type="date" placeholder="选择创建时间" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="updateInsuranceForm.mobile" type="number" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="险种名称" prop="polName">
              <el-select v-model="updateInsuranceForm.polName" placeholder="请选择险种" style="width: 100%;" clearable>
                <el-option label="意外险" value="意外险"></el-option>
                <el-option label="健康险" value="健康险"></el-option>
                <el-option label="补充医疗险" value="补充医疗险"></el-option>
                <el-option label="分红险" value="分红险"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="clerk">
              <el-select v-model="updateInsuranceForm.clerk" placeholder="请选择业务员" style="width: 100%;" clearable>
                <el-option v-for="(clerk,index) in clerks.clerk" :label="clerk.clerkId" :value="clerk.clerkId" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="保费" prop="money">
              <el-input type="number" placeholder="请输入保费" v-model="updateInsuranceForm.money">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="被保人1" prop="insuredRel1">
              <el-input v-model="updateInsuranceForm.insuredRel1" placeholder="与被保人关系"></el-input>
            </el-form-item>
            <el-form-item prop="insuredName1">
              <el-input v-model="updateInsuranceForm.insuredName1" placeholder="请输入被保人姓名"></el-input>
            </el-form-item>
            <el-form-item label="被保人2" prop="insuredRel2">
              <el-input v-model="updateInsuranceForm.insuredRel2" placeholder="与被保人关系"></el-input>
            </el-form-item>
            <el-form-item prop="insuredName2">
              <el-input v-model="updateInsuranceForm.insuredName2" placeholder="请输入被保人姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInsuranceSubmit">提交</el-button>
              <el-button type="danger" @click="resetUpdateInsuranceForm">取消</el-button>
            </el-form-item>
          </el-form>

        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import moment from 'moment'
  export default {
    data() {
      return {
        // 菜单
        tabs: {
          manageClerk: '业务员管理',
          manageAdmin: '管理员管理',
          manageInsurance: '保单管理'

        },
        activeTab: 'manageInsurance',

        // actionsheet
        sheetVisible: false,
        actions: [{
          name: `注销管理员: ${localStorage.getItem('adminId')}?`,
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
        },

        // 保单
        isQueryClerk: true,  // 是否是业务员的id为查询方式
        queryString: '', // 查询字符串
        queryMode: false, // 是否启用查询模式
        editMode: false, // 是否是编辑模式
        insurances: {
          currentPage: '0',
          sizePerPage: '10',
          totalPages: '1',
          totalSize: '0',
          insurance: []
        },
        updateInsuranceForm: {
          holderName: '',
          sex: 'F',
          birthDate: '',
          inforceTime: '',
          clerk: '',
          mobile: '',
          polName: '',
          money: NaN,
          insuredRel1: '',
          insuredName1: '',
          insuredRel2: '',
          insuredName2: ''
        }, // 保单表单
        updateInsuranceRule: {
          holderName: [{
            required: true, message: '请输入投保人姓名', trigger: 'blur'
          }],
          sex: [{
            required: true, message: '选择性别', trigger: 'blur'
          }],
          birthDate: [{
            required: true, type: 'date', message: '请选择出生日期', trigger: 'blur'
          }],
          inforceTime: [{
            required: true, type: 'date', message: '请选择创建时间', trigger: 'blur'
          }],
          clerk: [{
            required: true, message: '请选择业务员', trigger: 'change'
          }],
          mobile: [{
            required: true, message: '请输入手机号码', trigger: 'blur'
          }, {
            pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'
          }],
          polName: [{
            required: true, message: '请输入险种名称', trigger: 'change'
          }],
          money: [{
            required: true, message: '请输入保费', trigger: 'blur'
          }],
          insuredRel1: [{
            required: true, message: '请输入与被保人关系', trigger: 'blur'
          }],
          insuredName1: [{
            required: true, message: '请输入被保人姓名', trigger: 'blur'
          }],
          insuredRel2: [{
            required: true, message: '请输入与被保人关系', trigger: 'blur'
          }],
          insuredName2: [{
            required: true, message: '请输入被保人姓名', trigger: 'blur'
          }],
        },


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

      // insurance相关业务
      fetchInsurances({page, size, isQueryClerk, queryString}) {
        if (!queryString) {
          // 非搜索
          request().get(`/insurances?page=${page}&size=${size}`).then(res => {
            console.log(res.data)
            this.insurances = res.data.insurances
          }).catch(err => {
            console.error(err)
          })
        }else {
          // 搜索
          if (isQueryClerk) {
            // 以业务员工号为检索方式
            request().get(`/insurances/query?clerk=${queryString}&page=${page}&size=${size}`).then(res => {
              console.log(res.data)
              this.insurances = res.data.insurances
            }).catch(err => {
              console.error(err)
            })
          } else {
            // 以投保人名字为检索方式
            request().get(`/insurances/query?holder=${queryString}&page=${page}&size=${size}`).then(res => {
              console.log(res.data)
              this.insurances = res.data.insurances
            }).catch(err => {
              console.error(err)
            })
          }
        }
      },
      updateInsuranceSubmit() {
        this.$refs.updateInsuranceForm.validate(valid => {
          if (valid) {
            let data = this.updateInsuranceForm
            if(!!data.id) {
              // 更新提交
              console.log('更新提交')
              request().put(`/insurances/${data.id}`, {
                root: {
                  info: {
                    id: data.insurance.info.id,
                    holderName: data.holderName,
                    sex: data.sex,
                    birthDate: moment(data.birthDate).format('YYYY-MM-DD'),
                    mobile: data.mobile,
                    polName: data.polName,
                    money: data.money,
                    inforceTime: moment(data.inforceTime).format('YYYY-MM-DD'),
                    clerk: data.clerk,
                    baodanNo: data.insurance.info.baodanNo
                  },
                  insureds: {
                    insured: [
                      {
                        id: data.insurance.insureds.insured[0].id,
                        rel: data.insuredRel1,
                        insureName: data.insuredName1
                      }, {
                        id: data.insurance.insureds.insured[1].id,
                        rel: data.insuredRel2,
                        insureName: data.insuredName2
                      }
                    ]
                  }
                }
              }).then(res => {
                this.$notify({
                  title: '成功',
                  message: '保单更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetUpdateInsuranceForm()
                this.fetchInsurances({
                  page: this.insurances.currentPage,
                  size: this.insurances.sizePerPage,
                  isQueryClerk: this.isQueryClerk,
                  queryString: this.queryMode ? this.queryString : ''
                })

                console.log(res.data)
              }).catch(err => {
                console.error(err)
              })
            }
          }else {
            console.log('error submit')
            return false
          }
        })
      },
      insuranceQuery(){
        this.fetchInsurances({
          page: this.insurances.currentPage,
          size: this.insurances.sizePerPage,
          isQueryClerk: this.isQueryClerk,
          queryString: this.queryMode ? this.queryString : ''
        })
      },
      resetUpdateInsuranceForm(){
        this.$refs.updateInsuranceForm.resetFields()
        this.updateInsuranceForm = {
          holderName: '',
          sex: 'F',
          birthDate: '',
          mobile: '',
          polName: '',
          money: NaN,
          insuredRel1: '',
          insuredName1: '',
          insuredRel2: '',
          insuredName2: '',
          inforceTime: '',
          clerk: '',
        }
        this.editMode = false

      },
      handleEdit(data) {
        console.log(data)
        this.updateInsuranceForm = {
          id: data.id,
          holderName: data.info.holderName,
          sex: data.info.sex,
          birthDate: moment(data.info.birthDate).toDate(),
          mobile: data.info.mobile,
          polName: data.info.polName,
          money: data.info.money,
          clerk: data.info.clerk,
          inforceTime: moment(data.info.inforceTime).toDate(),
          insuredRel1: data.insureds.insured[0].rel,
          insuredName1: data.insureds.insured[0].insureName,
          insuredRel2: data.insureds.insured[1].rel,
          insuredName2: data.insureds.insured[1].insureName,
          insurance: data
        }
        this.editMode = true

      },
      handleDelete(id) {
        console.log(id)
        request().delete(`/insurances/${id}`).then(res => {
          this.$notify({
            title: '成功',
            message: '保单删除成功',
            type: 'success',
            duration: 2000
          });
          this.fetchInsurances({
            page: this.insurances.currentPage,
            size: this.insurances.sizePerPage,
            isQueryClerk: this.isQueryClerk,
            queryString: this.queryMode ? this.queryString : ''
          })
        })
      },
    },
    watch: {
      queryString:function(input){
        this.queryMode = input !== ''
      }
    },
    created() {
      this.fetchClerks(this.clerks.currentPage, this.clerks.sizePerPage)
      this.fetchAdmins(this.admins.currentPage, this.admins.sizePerPage)
      this.fetchInsurances({
        page: this.insurances.currentPage,
        size: this.insurances.sizePerPage,
        isQueryClerk: this.isQueryClerk,
        queryString: this.queryMode ? this.queryString : ''
      })
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .pane_container {
    padding: 0 20px;
    text-align: center;
  }
  .form_container {
    text-align: left;
    margin: 20px 0;
    padding: 20px 10px;
    box-shadow: lightgrey 0 1px 10px;
  }
</style>
