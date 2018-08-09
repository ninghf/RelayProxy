<template>
  <el-carousel ref="carousel"
               :autoplay="false"
               trigger="click"
               indicator-position="outside"
               :height="carouselHeight"
               @change="changeCarousel"
               class="indicator__button--style">

    <el-carousel-item label="数据包丢包统计">
      <el-row>
        <el-col :span="24">
          <el-table v-if="tablesData" :data="tablesData[0].items" stripe style="width: 100%">
            <el-table-column
              label="目标"
              align="left"
              width="120">
              <!--Table-column Scoped Slot 自定义列的内容，参数为 { row, column, $index }-->
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="bottom">
                  <span>pathId: {{ scope.row.tooltips }}</span>
                  <!--reference	触发 Popover 显示的 HTML 元素-->
                  <div slot="reference">
                    <el-tag size="medium">{{ scope.row.stat }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="实际发/收包"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="lossRate"
              label="原始丢包率"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="sendRate"
              label="发包丢包率"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="nonRepeatTotal"
              label="业务发/收包"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="fecLossRate"
              label="纠错丢包率"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="fecRate"
              label="纠错效率"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="repeatSpendRate"
              label="重传成本率"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
            <el-table-column
              prop="repeatWasteRate"
              label="重传浪费率"
              align="left" :render-header="renderTableHeader">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-carousel-item>
    <el-carousel-item label="数据包延时分布">
      <el-row>
        <el-col :span="8">
          <div id="1" style="width: auto;height: 200px;"></div>
          <div id="2" style="width: auto;height: 200px;"></div>
          <div id="3" style="width: auto;height: 200px;"></div>
        </el-col>
        <el-col :span="8">
          <div id="4" style="width: auto;height: 200px;"></div>
          <div id="5" style="width: auto;height: 200px;"></div>
          <div id="6" style="width: auto;height: 200px;"></div>
          <div id="7" style="width: auto;height: 200px;"></div>
        </el-col>
        <el-col :span="8">
          <div id="8" style="width: auto;height: 200px;"></div>
          <div id="9" style="width: auto;height: 200px;"></div>
          <div id="10" style="width: auto;height: 200px;"></div>
          <div id="11" style="width: auto;height: 200px;"></div>
          <div id="12" style="width: auto;height: 200px;"></div>
          <div id="13" style="width: auto;height: 200px;"></div>
        </el-col>
      </el-row>
    </el-carousel-item>
    <el-carousel-item label="数据包落点追踪">
      <el-row>
        <el-button type="info">数据包范围 1-1000</el-button>
        <el-button type="info">下面数据包没有展示失败数据包</el-button>
      </el-row>
      <el-row>
        <el-table v-if="zoomTable" :data="zoomTable" stripe style="width: 100%">
          <el-table-column
            prop="transTime"
            label="端到端传输耗时（ms）"
            align="left" width="180px">
          </el-table-column>
          <el-table-column
            prop="slices"
            label="数据包序号片段详情"
            align="left">
            <template slot-scope="scope">
              <div slot="reference">
                <el-button-group v-if="scope.row.slices.length <= 100">
                  <el-button size="mini" type="info" @click="createLines(slice)" v-for="slice in scope.row.slices" :key="slice">{{slice}}</el-button>
                </el-button-group>
                <el-button v-else size="mini" type="info">数据内容太多无法显示</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </el-row>
      <el-row>
        <el-col :span="24">
          <div id="dropPointTracking" style="width: auto;height: 600px;"></div>
        </el-col>
      </el-row>
    </el-carousel-item>
  </el-carousel>

</template>

<script>
  export default {
    name: "SummaryView",
    data() {
      return {
        carouselHeight: '1200px',
        zoomTable: null,
      }
    },
    props:[
      "tablesData", "optionsData", "zoomData"
    ],
    watch: {
      // optionsData: function () {
      //   this.createEcharts();
      // }
    },
    mounted() {

    },
    methods: {
      changeCarousel(activeName, index) {
        if (this.optionsData) {
          // console.log(this.$refs.carousel.$children[index]);
          // this.carouselHeight = this.$refs.carousel.$children[index].$el.offsetHeight + 'px';
          if ('0' == activeName) {

          } else if ('1' == activeName) {
            for (let i = 1; i <= this.optionsData.length; i++) {
              let option = this.optionsData[i];
              // console.log(option);
              if (option) {
                let title = option.title;
                let data = option.series[0].data;
                let subtext = option.subtext;
                this.$high.chart(i.toString(), this.createPieChart(title, subtext, data));
              }
            }
          } else if ('2' == activeName) {
            // console.log(this.optionsData[0].series);
            if (this.zoomTable) {
              this.zoomTable = null;
            }
            this.zoomTable = new Array();
            for (let key in this.zoomData) {
              let slices = this.zoomData[key];
              let item = {"transTime":key, "slices":slices};
              this.zoomTable.push(item);
            }
          }
        }
      },
      createLines(slice) {
        let idx = slice.indexOf("-");
        if (idx > 0) {
          this.seriesSlice(slice.slice(0, idx), slice.slice(idx + 1));
        } else {
          this.seriesSlice(slice);
        }
      },
      seriesSlice(start, end) {
        let series = new Array();
        for (let line of this.optionsData[0].series) {
          let packetId = parseInt(line.data[0].extras.packetId);
          if (end) {
            if (packetId > end) {
              break;
            }
            if (packetId >= start && packetId <= end) {
              series.push(line);
            }
          } else {
            if (packetId > start) {
              break;
            }
            if (packetId == start) {
              series.push(line);
            }
          }

        }
        // console.log(series);
        // let lineCharts = this.$refs.dropPointTracking;
        // lineCharts.removeSeries();
        // lineCharts.delegateMethod('showLoading', 'Loading...');
        // setTimeout(() => {
        //   lineCharts.getChart().subtitle.update({text: '下图展示数据包序号【' + start + '】-【' + end + '】'});
        //   for (let line of series) {
        //     lineCharts.addSeries(line);
        //   }
        //   lineCharts.hideLoading();
        // }, 2000)
        // this.optionDropPoint = this.createLineChart(series, start, end);

        // 原生highcharts
        let lineCharts = this.$high.chart('dropPointTracking', this.createLineChart(series, start, end));

      },
      createPieChart(title, subtext, data) {
        let chart = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: title
          },
          subtitle: {
            text: subtext
          },
          credits: {
            href: "http://www.butel.com/",
            text: "红云融通"
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          noData: {
            // style: {"fontSize": "12px", "fontWeight": "bold", "color": "blue"},
            // useHTML: true
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (this.$high.theme && this.$high.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            name: '详细信息',
            colorByPoint: true,
            data: data
          }]
        };
        return chart;
      },
      createLineChart(series, start, end) {
        let chart = {
          chart: {
            zoomType: 'x'
          },
          title: {
            text: '数据包落点追踪'
          },
          subtitle: {
            text: '下图展示数据包序号【' + start + '】-【' + end + '】'
          },
          credits: {
            href: "http://www.butel.com/",
            text: "红云融通"
          },
          tooltip: {
            formatter() {
              let extras = this.point.extras;
              let message = '<span>数据包ID：'+extras.packetId+'</span><br>' +
                '    <span>AgentID：'+extras.pathId+'</span><br>' +
                '    <span>重复包：'+extras.repeat+'</span>';
              return message;
            }
          },
          legend: {
            labelFormatter() {
              return  this.options.data[0].extras.packetId;
            }
          },
          plotOptions: {
            series: {
              marker: {
                enabled: true
              },
              stickyTracking: false,
              enableMouseTracking: true,
              allowPointSelect: true,
              findNearestPointBy: 'xy',
            }
          },
          xAxis: {
            title: {
              text: '时间轴'
            },
            type: 'linear'
          },
          yAxis: {
            title: {
              text: '数据包经过的节点轴【Client、Agent、Relay】'
            },
            lineColor: '#4240FF',
            lineWidth: 1,
            tickInterval: 5,
            // tickLength: 5,
          },
          series: series
        };
        return chart;
      },
      renderTableHeader(h, {column, $index}) {
        // return (<el-tooltip class="item" effect="dark" placement="top">
        //   <div slot="content"><p>实际发包: 实际发包总数</p>
        // <p>实际发包: 实际发包总数</p></div>
        //   <span>{column.label}</span> </el-tooltip>);
        let content;
        switch (column.property) {
          case 'total':
            content = [h('p', "实际发包: 实际发包总数"), h('p', "实际收包: 实际收包总数")];
            break;
          case 'nonRepeatTotal':
            content = [h('p', "业务发包: 业务发包总数（即不重复数据包发送总数）"), h('p', "业务收包: 业务收包总数（即不重复数据包接收总数）")];
            break;
          case 'lossRate':
            content = [h('p', "原始丢包率=（1 – 实际收包/实际发包）*100")];
            break;
          case 'sendRate':
            content = [h('p', "发包丢包率=（1 – 实际包序号/应发包序号）*100")];
            break;
          case 'fecLossRate':
            content = [h('p', "纠错后丢包率=（1 - 业务收包（在超时时间范围内）/业务发包）*100")];
            break;
          case 'fecRate':
            content = [h('p', "纠错效率=修复的数据包/问题数据包*100")];
            break;
          case 'repeatSpendRate':
            content = [h('p', "重传成本率=重发个数/修复包个数*100")];
            break;
          case 'repeatWasteRate':
            content = [h('p', "重传浪费率=收到的重复包/修复包个数*100")];
            break;
        }
        return h('el-tooltip', {
          'class': "item",
          attrs: {
            effect: "dark",
            placement: "top",
            // content: "实际发包: 实际发包总数"
          }
        }, [
          h('div', {
            slot: "content",
          }, content),
          h('span', column.label)
        ]);
      }
    }
  }
</script>

<style lang="scss">
  .el-carousel {
    overflow-x: hidden;
    padding-top: 60px;
    position: relative;
  }

  .el-carousel__indicators {
    list-style: none;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    z-index: 1;
  }

  .el-carousel__indicators--outside {
    top: 10px;
    text-align: center;
    position: absolute;
    -webkit-transform: none;
    transform: none;
  }

  .indicator__button--style .el-carousel__indicators button{
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    border-radius: 20px;
    padding: 12px 23px;
  }

</style>
