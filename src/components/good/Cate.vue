

<template>
  <div>
    <!-- 面包屑 -->
 

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加分类 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>

      <!-- 分类的数据展示-->
      <tree-table
        :show-row-hover="false"
        border
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :data="cateList"
        :columns="columns"
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <div>
            <i
              v-if="scope.row.cat_deleted == false"
              style="color: lightgreen"
              class="el-icon-success"
            ></i>
            <i v-else class="el-icon-error" style="color: red"></i>
          </div>
        </template>
        <template slot="order" slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag
              v-else-if="scope.row.cat_level === 1"
              type="success"
              size="mini"
              >二级</el-tag
            >
            <el-tag v-else type="warning" size="mini">三级</el-tag>
          </div>
        </template>
        <template slot="opt">
          <div>
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </div>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateQueryInfo.pagenum"
        :page-sizes="[2, 4, 6]"
        :page-size="cateQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话款 -->

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed"
      width="50%"
    >
      <!-- 添加物品的种类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名字" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- props 用了指定配置对象 options 必须是一个数字，存在多项的id -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      /* 控制添加物品分类对话款 */
      addCateDialogVisible: false,
      //添加物品种类表单
      addCateForm: {
        //简要添加的分类名称
        cat_name: "",
        //父分类
        cat_pid: 0,
        cat_level: 0, //默认添加时一级分类
      },
      //控制添加分类表单的数据格式
      addCateFormRules: {
        cat_name: [
          { required: true, message: "分类名单一定要填", trigger: "blur" },
        ],
      },
      //选中父级分类的数组id
      selectedKeys: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      //父级分类的列表
      parentCateList: [],
      //控制树形表格的列的配置数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //指定对应的插槽列
          type: "template",
          template: "isok",
        },
        {
          //指定对应的插槽列
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //商品列表
      cateList: [],

      //查询条件
      cateQueryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4,
      },

      //数据总条数
      total: 0,
    };
  },
  methods: {
    //发送一个请求
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.cateQueryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          message: "获取数据失败",
          duration: 1000,
        });
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //监听pagesize 改变事件
    handleSizeChange(newsize) {
      this.cateQueryInfo.pagesize = newsize;
      this.getCateList();
    },

    //监听页面改变
    handleCurrentChange(newPage) {
      this.cateQueryInfo.pagenum = newPage;
      this.getCateList();
    },

    //获取父级分类的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          message: "获取数据失败",
          duration: 1000,
        });
      }
      // console.log(res.data);
      this.parentCateList = res.data;
    },
    //监听添加物品对话款的关闭
    handleAddGoodTypeClosed() {},

    //展示添加商品对话款
    showAddCateDialog() {
      //获取父级的分类列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },

    //监听商品分类添加的分类级联选择是否的值是否改变
    parentCateChange() {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    //提交添加分类表单
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message({
            type: "error",
            message: "添加分类失败",
            duration: 1000,
          });
        }
        this.$message({
          type: "success",
          message: "添加分类成功",
          duration: 1000,
        });
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
      this.selectedKeys = [];
    },
  },
  created() {
    this.getCateList();
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
.treeTable {
  margin-top: 15px;
  font-size: 12px;
}
</style>

