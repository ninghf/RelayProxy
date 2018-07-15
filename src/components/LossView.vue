<template>
  <div>
    <el-form :inline=true ref="form" :model="form" label-width="80px">
      <el-form-item label="开始时间">
        <el-col>
          <el-date-picker
            v-model="form.StartTime"
            type="datetime"
            :editable="true"
            format="yyyy-MM-dd HH-mm-ss.SSS"
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
            format="yyyy-MM-dd HH-mm-ss.SSS"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="PacketIDs">
        <el-input v-model="form.PacketIDs" placeholder="请输入丢失数据包ID"></el-input>
      </el-form-item>
      <el-form-item label="SuperSocketID" label-width="100px;">
        <el-input v-model="form.SuperSocketID" placeholder="请输入SuperSocketID"></el-input>
      </el-form-item>
      <el-form-item label="路径详情">
        <el-switch v-model="form.IsDetail"></el-switch>
      </el-form-item>
      <el-form-item label="拉取数据包限制" label-width="110px;">
        <el-radio-group v-model="form.Limit">
          <el-radio :label="500" border size="medium">500</el-radio>
          <el-radio :label="1000" border size="medium">1000</el-radio>
          <el-radio :label="5000" border size="medium">5000</el-radio>
          <el-radio :label="10000" border size="medium">10000</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">拉取丢失数据</el-button>
      </el-form-item>
    </el-form>
    <el-row v-if="form.Pagination.Total > 0">
      <el-tag type="danger">本次拉取数据包【{{form.Pagination.Total}}】个</el-tag>
    </el-row>
    <el-row v-if="axis">
      <el-col>
        <el-tag v-for="(value, key, index) in axis" :key="value" type="success">
          {{value}} - {{ key }} - {{ index }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="loss" style="width: auto;height: 400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "LossView",
    data() {
      return {
        form: {
          StartTime: new Date(2018, 6, 10, 11, 35, 0, 0),
          EndTime: new Date(2018, 6, 10, 11, 50, 0, 0),
          PacketIDs: '260732,260029',
          SuperSocketID: '15900774943180189865',
          IsDetail: false,
          Limit: 1000,
          Pagination: {
            CurrentPage: 0,
            Total: 0
          }
        },
        data: null,
        echarts: null,
        series: [],
        axis: null,
      }
    },
    methods: {
      getData() {
        this.$http.post('/loss', {
          data: this.form
        }).then(({data: {time, status, echartsOption, axis, total}}) => {
          this.axis = axis;
          this.form.Pagination.Total = total;
          if (this.echarts != null) {
            this.echarts.clear();
          }
          if (echartsOption.dataset.length == 0) {
            this.notifyWarn();
            this.form.Pagination.Total = 0;
          } else {
            this.notifySuccess(echartsOption.dataset.length);
            this.initEcharts('loss');
            this.data = echartsOption.dataset;
            let length = echartsOption.dataset.length < this.form.Limit ? echartsOption.dataset.length : this.form.Limit;
            this.createSeries(0, length, this.form.IsDetail);
            this.echarts.setOption(this.createOption());
          }
        });
      },
      initEcharts(id) {
        // 基于准备好的dom，初始化echarts实例
        this.echarts = this.$echarts.init(document.getElementById(id));
      },
      createOption() {
        var option = {
          title: {
            text: '丢失数据包摘要'
          },
          tooltip: {},
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              dataZoom: {
                show: true,
                yAxisIndex: 'false'
              }
            }
          },
          dataZoom: [
            {
              type: 'slider',
              realtime: true,
              start: 0,
              end: 100
            }
          ],
          legend: {},
          dataset: this.data,
          xAxis: {type: 'value', scale: 'false'},
          yAxis: {type: 'value', scale: 'false', min: 0, minInterval: 5, maxInterval: 5},
          series: this.series
        };
        return option;
      },
      createSeries: function (skip, length) {
        for (let i = skip; i < skip + length; i++) {
          let item = {
            type: 'line',
            datasetIndex: i,
            encode: {
              x: 0,
              y: 1,
            },
            tooltip: {
              formatter: function (params) {
                return '数据包：' + params.data[2] + '<br>发送时间：' + params.data[3] + '<br>接收时间：' + params.data[4] + '<br>传输时间：' + params.data[5];
              }
            }
          };
          this.series.push(item);
        }
      },
      notifySuccess(size) {
        this.$notify({
          title: '成功',
          message: `成功拉取${size}条数据`,
          type: 'success',
          duration: 4500
        });
      },
      notifyWarn() {
        this.$notify({
          title: '温馨提示',
          message: '没有符合条件的数据',
          type: 'warning',
          duration: 4500
        });
      }
    }
  }
</script>

<style scoped>

</style>
