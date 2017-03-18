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
      <el-tab-pane label="添改保单" name="addInsurance" class="pane_container">
        <el-form :model="addInsuranceForm" :rules="addInsuranceRule" ref="addInsuranceForm"  label-width="90px" label-position="right">
          <el-form-item label="投保人" prop="holderName">
            <el-input v-model="addInsuranceForm.holderName" placeholder="请输入投保人姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="addInsuranceForm.sex">
              <el-radio label="F">女</el-radio>
              <el-radio label="M">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker v-model="addInsuranceForm.birthDate" type="date" placeholder="选择出生日期" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addInsuranceForm.mobile" type="number" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="险种名称" prop="polName">
            <el-select v-model="addInsuranceForm.polName" placeholder="请选择险种" style="width: 100%;" clearable>
              <el-option label="意外险" value="意外险"></el-option>
              <el-option label="健康险" value="健康险"></el-option>
              <el-option label="补充医疗险" value="补充医疗险"></el-option>
              <el-option label="分红险" value="分红险"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保费" prop="money">
            <el-input type="number" placeholder="请输入保费" v-model="addInsuranceForm.money">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="被保人1" prop="insuredRel1">
            <el-input v-model="addInsuranceForm.insuredRel1" placeholder="与被保人关系"></el-input>
          </el-form-item>
          <el-form-item prop="insuredName1">
            <el-input v-model="addInsuranceForm.insuredName1" placeholder="请输入被保人姓名"></el-input>
          </el-form-item>
          <el-form-item label="被保人2" prop="insuredRel2">
            <el-input v-model="addInsuranceForm.insuredRel2" placeholder="与被保人关系"></el-input>
          </el-form-item>
          <el-form-item prop="insuredName2">
            <el-input v-model="addInsuranceForm.insuredName2" placeholder="请输入被保人姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addInsuranceSubmit">提交</el-button>
            <el-button type="danger" @click="resetAddInsuranceForm">重填</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="管理保单" name="manageInsurance">
        <el-table :data="insurances.insurance" align="left" stripe>
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
          @current-change="fetchInsurances($event - 1, insurances.sizePerPage)"
          :current-page="+insurances.currentPage + 1"
          :total="+insurances.totalSize"
          layout="total, prev, pager, next"
          :page-size="+insurances.sizePerPage"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  import request from '@/utils/request'
  import moment from 'moment'

  export default {
    created() {
      this.fetchInsurances(this.insurances.currentPage, this.insurances.sizePerPage)
//      this.fetchInsurances(0, )
    },

    methods: {
      addInsuranceSubmit() {

        this.$refs.addInsuranceForm.validate(valid => {
          if (valid) {
            let data = this.addInsuranceForm
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
                    inforceTime: data.insurance.info.inforceTime,
                    clerk: data.insurance.info.clerk,
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
                this.resetAddInsuranceForm()
                this.fetchInsurances(this.insurances.currentPage, this.insurances.sizePerPage)

                console.log(res.data)
              }).catch(err => {
                console.error(err)
              })
            } else {
              request().post('/insurances', {
                root: {
                  info: {
                    holderName: data.holderName,
                    sex: data.sex,
                    birthDate: moment(data.birthDate).format('YYYY-MM-DD'),
                    mobile: data.mobile,
                    polName: data.polName,
                    money: data.money,
                  },
                  insureds: {
                    insured: [
                      {
                        rel: data.insuredRel1,
                        insureName: data.insuredName1
                      }, {
                        rel: data.insuredRel2,
                        insureName: data.insuredName2
                      }
                    ]
                  }
                }
              }).then(res => {
                this.$notify({
                  title: '成功',
                  message: '保单创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetAddInsuranceForm()
                this.fetchInsurances(this.insurances.currentPage, this.insurances.sizePerPage)

              }).catch(err => {

              })
            }


          }else {
            console.log('error submit')
            return false
          }
        })
      },
      resetAddInsuranceForm(){
        this.$refs.addInsuranceForm.resetFields()
        this.addInsuranceForm = {
          holderName: '',
          sex: 'F',
          birthDate: '',
          mobile: '',
          polName: '',
          money: NaN,
          insuredRel1: '',
          insuredName1: '',
          insuredRel2: '',
          insuredName2: ''
        }
      },
      fetchInsurances(page, size) {
        console.log(page, size)
        let clerkId = localStorage.getItem('clerkId')
        if (!clerkId) {
          return
        }
        request().get(`/insurances/query?clerk=${clerkId}&page=${page}&size=${size}`).then(res => {
          this.insurances = res.data.insurances || {insurance: []}
          console.log(this.insurances)
        }).catch(err => {
          console.error(err)
        })
      },
      handleEdit(data) {
        console.log(data)
        this.addInsuranceForm = {
          id: data.id,
          holderName: data.info.holderName,
          sex: data.info.sex,
          birthDate: moment(data.info.birthDate).toDate(),
          mobile: data.info.mobile,
          polName: data.info.polName,
          money: data.info.money,
          insuredRel1: data.insureds.insured[0].rel,
          insuredName1: data.insureds.insured[0].insureName,
          insuredRel2: data.insureds.insured[1].rel,
          insuredName2: data.insureds.insured[1].insureName,
          insurance: data
        }
        this.activeTab = "addInsurance"
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
          this.fetchInsurances(this.insurances.currentPage, this.insurances.sizePerPage)
        })
      },
      logout() {
        localStorage.clear()
        this.$router.replace('/')
      }
    },
    data() {
      return {
        // 菜单
        tabs: {
          addInsurance: '添改保单',
          manageInsurance: '保单管理'
        },
        activeTab: 'manageInsurance',

        // actionsheet
        sheetVisible: false,
        actions: [{
          name: '注销',
          method: () => {
            this.logout()
          }
        }],

        // 添加保单
        addInsuranceForm: {
          holderName: '',
          sex: 'F',
          birthDate: '',
          mobile: '',
          polName: '',
          money: NaN,
          insuredRel1: '',
          insuredName1: '',
          insuredRel2: '',
          insuredName2: ''

        },
        addInsuranceRule: {
          holderName: [{
            required: true, message: '请输入投保人姓名', trigger: 'blur'
          }],
          sex: [{
            required: true, message: '选择性别', trigger: 'blur'
          }],
          birthDate: [{
            required: true, type: 'date', message: '请选择出生日期', trigger: 'blur'
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

        // 管理表单
        insurances: {
          currentPage: "0",
          sizePerPage: "10",
          totalPages: "1",
          totalSize: "0",
          insurance: []
        }
      }
    }
  }
</script>


<style scope lang="scss" rel="stylesheet/scss">
  .pane_container {
    padding: 0 20px;
    text-align: left;
  }
</style>

<style lang="scss" rel="stylesheet/scss">
  .ellipsis_column {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .avatar {
    width: 34px;
    border-radius: 17px;
  }
  .pane_container {
    padding: 0 20px;
    text-align: left;
  }
  .expand_insurance_form {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 80%;
    }
  }
</style>
