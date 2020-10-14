<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
        <el-table :data="rightList" border style="width: 100%" stripe>
          <el-table-column type="index" label="#" ></el-table-column>
          <el-table-column prop="authName" label="权限名称" ></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if=" scope.row.level == '0'">一级</el-tag>
                <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
                <el-tag v-else type="danger">三级</el-tag>

            </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "right",
  data() {
    return {
        //保存权限列表
        rightList: [],
        //控制权限列表的type种类
        rightTypeTags: {
          0: {tagType:"",text:"一级"},
          1: {tagType:"success",text:"二级"},
          2: {tagType:"danger",text:"三级"}
        }
    }
  },
  methods: {
    async getrightList(){
      const {data: res} = await this.$http.get("/rights/list");
      if(res.meta.status != 200){
        return this.$message({
          type : "error",
          message: "获取权限列表失败",
          duration: 1000,
        });
      }
      this.rightList = res.data;
    }
  },
  created(){
    this.getrightList();
  }
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