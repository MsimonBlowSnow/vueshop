<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 输入框 -->
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input placeholder="请输入内容" @keyup.enter.native="getGoodsList" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button icon="el-icon-search" slot="append"  @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="0">
          <el-button type="primary" size="default" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="70px"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!--slot-scope="scope" {{scope.row}} -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeGoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      //商品列表
      goodsList: [],
      total: 0,
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          duration: 1000,
          message: "获取数据失败",
        });
      }
      //   console.log(res.data);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    /* 分页功能 */
    // 分页的页面大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // 分页的页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    /* 操作功能 删除和编辑 */
    // 删除
    async removeGoodById(id){
        const result = await this.$confirm("此操作将永久删除该商品,是否继续?",'提示',{
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            type: 'warning'
        }).catch(err=>err);
        if(result !== "confirm"){
            return this.$message({
                type: "info",
                message: "取消这次操作",
                duration: 1000,
            });
        }
        //进行删除操作
        const {data: res} = await this.$http.delete(`goods/${id}`);
        if(res.meta.status !== 200){
            return this.$message({
                type: "error",
                message: "删除失败",
                duration: 1000,
            })
        }
        this.$message({
            type: "success",
            message: "删除成功",
            duration: 1000
        });
        this.getGoodsList();
    },

    //编辑商品的页面


    /*跳转到添加商品的页面*/
    goAddPage(){
        this.$router.push("/goods/add");
    }
  },
  created() {
    this.getGoodsList();
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