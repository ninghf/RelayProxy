// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '../static/scss/element-variables.scss';
import axios from 'axios';
import echarts from 'echarts';
import highCharts from 'highcharts';
import highchartsNoData from 'highcharts/modules/no-data-to-display';


// axios.defaults.baseURL = 'http://192.168.10.61:8090';
axios.defaults.baseURL = 'http://10.160.71.48:8090';
axios.defaults.headers.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
highchartsNoData(highCharts);
highCharts.setOptions({
  lang: {
    noData: '暂无数据提供'
  }
});

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$high = highCharts;
Vue.prototype.$http = axios;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
