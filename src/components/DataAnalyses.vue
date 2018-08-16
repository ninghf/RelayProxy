<template>
  <el-container>
    <el-header height="53px">
      <img src="../../static/Butel.png" height="53" width="120"/>
      <span style="face:Helvetica;font-size:45px;font-weight:bold;">&nbsp;&nbsp;RedSDN分析系统——RelayProxy数据分析</span>
    </el-header>
    <el-main>
      <el-tabs type="card">
        <el-tab-pane label="数据分析" name="first">
          <el-form :inline=true ref="form" :model="form" label-width="80px">
            <el-form-item label="开始时间">
              <el-col>
                <el-date-picker
                  v-model="form.StartTime"
                  type="datetime"
                  :editable="true"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  placeholder="选择日期时间"
                  align="left">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-col>
                <el-date-picker
                  v-model="form.EndTime"
                  type="datetime"
                  :editable="true"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="传输耗时">
              <el-row>
                <el-input v-model="form.TransTime"
                          placeholder="默认传输耗时300"
                          class="form__input--normal"></el-input>
                <span>ms</span>
              </el-row>
            </el-form-item>
            <el-form-item label="SuperSocketID" label-width="100px;">
              <el-input v-model="form.SuperSocketID" placeholder="请输入SuperSocketID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getData">获取概要信息</el-button>
            </el-form-item>
          </el-form>
          <SummaryView :tablesData="tablesData" :optionsData="optionsData" :zoomData="zoomData"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import SummaryView from './SummaryView';
  import { Loading } from 'element-ui';
  export default {
    name: "DataAnalyses",
    components: {
      "SummaryView": SummaryView
    },
    data() {
      return {
        fullScreenLoading: false,
        reason: null,
        form: {
          StartTime: new Date(2018, 7, 16, 9, 45, 37, 0),
          // EndTime: new Date(2018, 6, 26, 19, 19, 59, 0),
          EndTime: new Date(2018, 7, 16, 9, 47, 37, 0),
          SuperSocketID: '2797919220570180263',
          TransTime: 300,
          Limit: 500,
          Pagination: {
            CurrentPage: 0,
            Total: 0
          }
        },
        tablesData: null,
        optionsData: null,
        zoomData: null,
      }
    },
    watch: {
      reason: 'notifyWarn'
    },
    methods: {
      getData() {
        let loading = Loading.service({fullscreen: true, text: "拼命的加载数据中..."});
        this.$http.post('/summary', {
          data: this.form,
        }).then(({data: {time, status, total, tables, options, zoom}}) => {
          if (tables != null && tables.length > 0) {
            this.tablesData = tables;
            this.optionsData = options;
            this.zoomData = zoom;
          }
          loading.close();
        }).catch(error => {
          loading.close();
          if (error.response) {
            if (error.response.status != 200) {
              this.reason = error.response.status
            }
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            if (error.request.status != 200) {
              this.reason = '访问服务端异常'
            }
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
        });
      },
    notifyWarn() {
      this.$notify({
        title: '温馨提示',
        message: this.reason,
        type: 'error',
        duration: 4500
      });
    }
    }
  }
</script>

<style lang="scss">
  .form__input--normal {
    width: 80px;
  }
</style>
