import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import DataAnalyses from '@/components/DataAnalyses'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/analyses',
      name: 'DataAnalyses',
      component: DataAnalyses
    }
  ]
})
