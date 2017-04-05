/**
 * Created by jason on 2017/3/16.
 */
import axios from 'axios'
import _ from 'lodash'
import X2JS from './x2js'
import router from '@/router'
const x2js = new X2JS({
  arrayAccessFormPaths : [
    'INSURANCES.INSURANCE',
    'CLERK_LIST.CLERK',
    'ADMIN_LIST.ADMIN'
  ]
})


export default function () {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/xml',
    'Accept': 'application/xml'

  }
  let token = localStorage.getItem('token')
  if (!!token) {
    headers['Authorization'] = token
  }

  function walk(data) {
    return _.transform(data, function (result, value, key) {
      result[_.toUpper(_.snakeCase(key))] = _.isObject(value) ? walk(value) : value
    })
  }

  function deWalk(data) {
    return _.transform(data, function (result, value, key) {
     result[_.camelCase(key)] = _.isObject(value) ? deWalk(value) : value
    })
  }


  let instance = axios.create({
    baseURL: 'http://localhost:8080/lfc/api/',
    timeout: 1000,
    headers: headers,
    transformRequest: [function(data) {
      data = walk(data)
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${x2js.json2xml_str(data)}`
    }],

    transformResponse: [function(data) {
      return deWalk(x2js.xml_str2json(data))
    }]
  })

  instance.interceptors.response.use(function (response){
    return response
  }, function(error){
    if (error.message == "Network Error" || error.message.indexOf('401') > -1) {
      localStorage.removeItem('token')
      localStorage.removeItem('expiredAt')
      router.replace('/')
    }
    return Promise.reject(error)
  })

  return instance

}
