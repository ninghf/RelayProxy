<template>
  <el-container>
    <el-header height="53px">
      <img src="../../static/Butel.png" height="53" width="120"/>
      <span style="face:Helvetica;font-size:45px;font-weight:bold;">&nbsp;&nbsp;RedSDN分析系统——RelayProxy数据分析</span>
    </el-header>
    <el-main>
      <el-tabs type="card">
        <el-tab-pane label="延时数据分析" name="first">
          <delayed/>
        </el-tab-pane>
        <el-tab-pane label="丢包数据分析" name="second">
          <loss/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>

  import Delayed from "./DelayedView";
  import Loss from "./LossView"

  export default {
    name: "RelayProxyDataAnalyses",
    components: {
      "delayed": Delayed,
      "loss": Loss
    }
  }
</script>

<style scoped >

</style>
