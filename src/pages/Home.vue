<template>
  <div>
    <mt-header :title="tabs[activeTab]">
    </mt-header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="添加保单" name="addInsurance" class="pane_container">
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
            <el-button type="danger" @click="$refs.addInsuranceForm.resetFields()">重填</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="管理保单" name="manageInsurance">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  import request from '@/utils/request'
  import moment from 'moment'

  export default {

    methods: {
      addInsuranceSubmit() {

        this.$refs.addInsuranceForm.validate(valid => {
          if (valid) {
            let data = this.addInsuranceForm
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
            }).catch(err => {

            })
          }else {
            console.log('error submit')
            return false
          }
        })
      }
    },
    data() {
      return {
        tabs: {
          addInsurance: '添加保单',
          manageInsurance: '保单管理'
        },
        activeTab: 'addInsurance',

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
        }
      }
    }
  }
</script>

<style>

  .pane_container {
    padding: 0 20px;
    text-align: left;
  }
  .insured_container {
  }
</style>
