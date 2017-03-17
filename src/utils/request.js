/**
 * Created by jason on 2017/3/16.
 */
import axios from 'axios'
import X2JS from './x2js'
import _ from 'lodash'

const x2js = new X2JS()

export default function factory() {
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
      if (typeof value == 'object') {
        result[_.toUpper(_.snakeCase(key))] = walk(value)
      }else {
        result[_.toUpper(_.snakeCase(key))] = value
      }
    }, {})
  }

  function deWalk(data) {
    return _.transform(data, function (result, value, key) {
      if (typeof value == 'object') {
        result[_.camelCase(key)] = deWalk(value)
      }else {
        result[_.camelCase(key)] = value
      }
    }, {})
  }

  return axios.create({
    baseURL: 'http://localhost:8080/api/',
    timeout: 1000,
    headers: headers,
    transformRequest: [function(data) {
      data = walk(data)
      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>${x2js.json2xml_str(data)}`
      console.log(xmlString)
      return xmlString
    }],

    transformResponse: [function(data) {
      data = deWalk(x2js.xml_str2json(data))
      console.log(data)
      return data
    }]
  })

}

