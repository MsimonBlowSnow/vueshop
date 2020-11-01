<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 数据报表 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
//导入echarts
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      echartsOption: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  async mounted() {
    let { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message({
        message: "获取数据失败",
        duration: 1000,
        type: "error",
      });
    }
    const result = _.merge(res.data, this.echartsOption);
    //初始化echarts
    let myChart = echarts.init(document.getElementById("main"));
    myChart.setOption(result);
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>