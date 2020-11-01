<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-col :span="8" :offset="0">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>

        <el-table-column label="订单编号" prop="order_number" width="300px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.order_pay !== '0' ? 'success' : 'danger'"
              size="normal"
              >{{ scope.row.order_pay !== "0" ? "已付款" : "未付款" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="是否发货" prop="is_send"> </el-table-column>

        <el-table-column label="下单时间" prop="">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6,8,10]"
        :page-size="queryInfo.pagesize"
        :total="total"
      >
      </el-pagination>
    </el-card>

      <!-- 修改地址对话款 -->
  <el-dialog
    title="修改地址"
    :visible.sync="addressVisible"
    width="50%"
    @close="addressDialogClose"
   >
    <el-form :model="addressForm" ref="addressFormRef" :rules="addressFormRules" label-width="100px" >
      <el-form-item label="省市区/县" prop="address1">
       <el-cascader :options="cityData" v-model="addressForm.address1">
       </el-cascader>
      </el-form-item>
          <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
    </el-form>
    
    <span slot="footer">
      <el-button @click="addressVisible = false">取消</el-button>
      <el-button type="primary" @click="addressVisible = false">确定</el-button>
    </span>
  </el-dialog>

  <!-- 查询物流 -->
  <el-dialog
    title="物流进度"
    :visible.sync="progessVisible"
    width="50%"
    >
   
  </el-dialog>
  
  </div>

  
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],

      addressForm:{
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [{
          required: true,
          message: "请选择省市区/县",
          trigger: 'blur'
        }],
         address2: [{
          required: true,
          message: "请填写详细地址",
          trigger: 'blur'
        }]
      },
      //地址对话框展示
      addressVisible: false,
      cityData,
      
      //物流进度
      progessVisible: false,

    };
  },

  methods: {
    async getOrderList() {
      let { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          message: "获取失败",
          duration: 1000,
        });
      }
      console.log(res.data);
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },

    //当页面大小改变时
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
    },
    handleCurrentChange(newpage){
        this.queryInfo.pagenum = newpage;
        this.getOrderList();
    },

    //省级联动
    showBox(){
      this.addressVisible = true;
    },

    //关闭对话框
    addressDialogClose(){
      this.$refs.addressFormRef.resetFields();
    },

  },
  created() {
    this.getOrderList();
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
.el-cascader{
  width: 100%;
}
</style>