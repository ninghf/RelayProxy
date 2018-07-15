<template>
  <div>
    <el-form :inline=true ref="form" :model="form" label-width="80px">
      <el-form-item label="开始时间">
        <el-col>
          <el-date-picker
            v-model="form.StartTime"
            type="datetime"
            :editable="true"
            format="yyyy-MM-dd HH:mm:ss.SSS"
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
            format="yyyy-MM-dd HH:mm:ss.SSS"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="传输时间">
        <el-input v-model="form.TransTime" placeholder="请输入传输时间"></el-input>
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
        <el-button type="primary" @click="getData">拉取延时数据</el-button>
      </el-form-item>
    </el-form>
    <el-row v-if="form.Pagination.Total > 0">
      <el-col>
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :page-size=form.Limit
          :current-page.sync=form.Pagination.CurrentPage
          :total=form.Pagination.Total>
        </el-pagination>
      </el-col>
    </el-row>
    <el-row v-if="axis">
      <el-col>
        <el-tag v-for="(value, key, index) in axis" :key="value" type="success">
          {{value}} - {{ key }}
        </el-tag>
      </el-col>
    </el-row>
    {{stats}}
    <el-table
      :data="stats"
      style="width: 100%"
      max-height="250">
      <el-table-column
        prop="name"
        label="统计项">
      </el-table-column>
      <el-table-column
        prop="value"
        label="统计值">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, stats)"
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <div id="delayed" style="width: auto;height: 400px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "DelayedView",
    data() {
      return {
        form: {
          StartTime: new Date(2018, 6, 13, 15, 58, 49, 0),
          EndTime: new Date(2018, 6, 13, 16, 0, 49, 0),
          TransTime: 90,
          SuperSocketID: '11811295409737206439',
          IsDetail: false,
          Limit: 500,
          Pagination: {
            CurrentPage: 0,
            Total: 0
          },
        },
        data: null,
        echarts: null,
        series: [],
        axis: null,
        stats: null,
      }
    },
    methods: {
      getData() {
        this.$http.post('/delayed', {
          data: this.form,
        }).then(({data: {time, status, echartsOption, axis, stats, total}}) => {
          this.axis = axis;
          this.stats = stats;
          this.form.Pagination.Total = total;
          if (echartsOption.dataset.length == 0) {
            this.notifyWarn();
            this.form.Pagination.Total = 0;
          } else {
            this.notifySuccess(echartsOption.dataset.length);
            this.data = echartsOption.dataset;
          }
        });
      },
      handleCurrentChange() {
        this.$http.post('/delayed', {
          data: this.form,
        }).then(({data: {time, status, echartsOption, axis, total}}) => {
          // console.log(this.data);
          // console.log(echartsOption.dataset);
          // 这里合并数组失效
          // this.data.concat(echartsOption.dataset);
          this.notifySuccess(echartsOption.dataset.length);
          this.appendData(echartsOption.dataset, this.data);
          let skip = this.form.Limit;
          if (this.form.Pagination.CurrentPage > 1) {
            skip = (this.form.Pagination.CurrentPage - 1) * this.form.Limit;
          }
          let length = echartsOption.dataset.length < this.form.Limit ? echartsOption.dataset.length : this.form.Limit;
          this.createSeries(skip, length, this.form.IsDetail);
          this.echarts.setOption(this.createOption());

          // console.log(this.data);
          // console.log(this.series);
        });
      },
      showAxis(dataset) {
        if (this.echarts != null) {
          this.echarts.clear();
        }
        this.initEcharts('delayed');
        let length = dataset.length < this.form.Limit ? dataset.length : this.form.Limit;
        this.createSeries(0, length, this.form.IsDetail);
        this.echarts.setOption(this.createOption());
      },
      appendData(src, dst) {
        for (let i = 0; i < src.length; i++) {
          // console.log();
          dst.push(src[i]);
        }
      },
      initEcharts(id) {
        // 基于准备好的dom，初始化echarts实例
        this.echarts = this.$echarts.init(document.getElementById(id));
      },
      createOption() {
        var option = {
          title: {
            text: '延时数据包摘要'
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
      createSeries: function (skip, length, detail) {
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
                let tip;
                if(detail) {
                  tip = '数据包：' + params.data[2]
                    + '<br>[Client]发送时间：' + params.data[3]
                    + '<br>[Agent]接收时间：' + params.data[4]
                    + '<br>[Agent]发送时间：' + params.data[6]
                    + '<br>[Relay]接收时间：' + params.data[7]
                    + '<br>[C->A]传输时间：' + params.data[5]
                    + '<br>[A->R]传输时间：' + params.data[8];
                } else {
                  tip = '数据包：' + params.data[2]
                    + '<br>[Client]发送时间：' + params.data[3]
                    + '<br>[Relay]接收时间：' + params.data[4]
                    + '<br>[C->R]传输时间：' + params.data[5];
                }
                return tip;
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
