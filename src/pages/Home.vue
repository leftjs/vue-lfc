<template>
  <div>
    <mt-header :title="tabs[activeTab]">
    </mt-header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="添加保单" name="addInsurance">
        <el-form :model="addInsuranceForm" :rules="addInsuranceRule" ref="addInsuranceForm" label-position="top">
          <el-form-item label="投保人" prop="holderName">

          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="管理保单" name="manageInsurance"></el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  import request from '@/utils/request'

  export default {
    data() {
      return {
        tabs: {
          addInsurance: '添加保单',
          manageInsurance: '保单管理'
        },
        activeTab: 'addInsurance',

        addInsuranceForm: {
          holderName: '',
          sex: '',
          birthDate: '',
          mobile: '',
          polName: '',
          money: 0

        },
        addInsuranceRule: {

        }
      }
    }
  }
</script>

<style>

</style>
