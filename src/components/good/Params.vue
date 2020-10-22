<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- card body -->
      <el-alert
        show-icon
        :closable="false"
        title="注意:只能选中三级分类"
        type="warning"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col
          ><span>选择商品的数据</span>
          <el-cascader
            v-model="selectedCateKey"
            :options="cateList"
            :props="cateProps"
            @change="changeCate"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 动态参数和静态属性的 -->
      <el-tabs v-model="activeTagName" @tab-click="handleTabClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="addAtrrDialogVisable = true"
            >添加动态参数</el-button
          >
          <!-- 添加动态参数的面板 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 索引列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加标签的输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="default"
                  icon="el-icon-edit"
                  @click="showAttrParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="default"
                  icon="el-icon-delete"
                  @click="delparams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="addAtrrDialogVisable = true"
            >添加静态属性</el-button
          >
          <!-- 添加静态属性 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 索引列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加标签的输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="default"
                  icon="el-icon-edit"
                  @click="showAttrParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="default"
                  icon="el-icon-delete"
                  @click="delparams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话宽 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addAtrrDialogVisable"
      width="50%"
    >
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addAtrrDialog = false">取消</el-button>
        <el-button type="primary" @click="addAtrrParams">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editAttrDialogVisable"
      @close="editDialogClosed"
      width="50%"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editAttrDialogVisable = false">取消</el-button>
        <el-button type="primary" @click="editAttrParams">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      //cateProps 级联选择框的配置属性
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      //级联选中宽双向绑定的数组
      selectedCateKey: [],

      //激活tag页签的名字
      activeTagName: "only",

      //保存参数属性动态
      manyTableDate: [],
      //静态属性的数据
      onlyTableDate: [],

      //控制添加属性对话框的显示与隐藏
      addAtrrDialogVisable: false,

      //添加参数表单的数据对象
      addForm: {},

      //验证添加表单的name
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      /* 编辑对话框属性*/

      //控制修改的对话框
      editAttrDialogVisable: false,

      //编辑参数表单的数据对象
      editForm: {},

      //对话款编辑规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      /* 添加标签相关的内容 */
    };
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          duration: 1000,
          message: "获取数据失败",
        });
      }
      this.cateList = res.data;
      console.log(this.cateList);
    },

    //点击添加按钮添加表单元素
    addAtrrParams() {
      // console.log(this.addForm.attr_name, this.cateId, this.activeName);
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeTagName,
            }
          );
          if (res.meta.status == 201) {
            this.$message({
              type: "success",
              message: "添加成功",
              duration: 1000,
            });
            this.getParams();
          } else {
            this.$message({
              type: "error",
              message: "添加失败",
              duration: 1000,
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "数据格式错误",
            duration: 1000,
          });
        }
        this.addAtrrDialogVisable = false;
      });
    },

    //级联选择框选中会触发
    changeCate() {
      //   console.log(this.selectedCateKey);
      if (this.selectedCateKey.length != 3) {
        this.selectedCateKey = [];
        this.manyTableDate = [];
        this.onlyTableDate = [];
        return this.$message({
          type: "error",
          message: "只能选中三级分类",
          duration: 1000,
        });
      }
      this.getParams();
    },

    //向后端发送请求，获取三级标签的参数
    async getParams() {
      const { data: res } = await this.$http.get(
        `/categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeTagName },
        }
      );
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          message: "获取参数信息失败",
          duration: 1000,
        });
      }
      //将tag标签变为数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //添加一个布尔值控制自己的输入和影藏
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeTagName == "many") {
        this.manyTableDate = res.data;
        console.log(this.manyTableDate);
      } else {
        this.onlyTableDate = res.data;
        console.log(this.onlyTableDate);
      }
      let attrArr = res.data.map((item) => item.attr_vals);
      console.log(attrArr);

      // res.data.attr_vals = res.data.attr_vals.split(" ");
      // console.log(res.data.attr_vals)
    },
    //监听tab页签的该变
    handleTabClick() {
      // console.log(this.activeTagName);
      if (this.selectedCateKey.length == 3) {
        this.getParams();
        return;
      }
      this.$message({
        type: "error",
        message: "请选择参数",
        duration: 1000,
      });
    },

    //删除
    async delparams(id) {
      const res = await this.$confirm(
        "此操作将永久删除用户，是否继续",
        "提示",
        {
          type: "warning",
          cancelButtonText: "取消",
          confirmButtonText: "确定",
        }
      ).catch((err) => err);
      if (res == "confirm") {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${id}`
        );
        if (res.meta.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 1000,
          });
          this.getParams();
        } else {
          this.$message({
            type: "info",
            message: "删除失败",
            duration: 1000,
          });
        }
      } else {
        this.$message({
          type: "info",
          message: "取消成功",
          duration: 1000,
        });
      }
    },

    /* 修改对话款 */
    //点击修改修改按钮修改元素
    async showAttrParamsDialog(attr_id) {
      this.editAttrDialogVisable = true;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTagName,
          },
        }
      );
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          message: "获取失败",
          duration: 1000,
        });
      } else {
        this.editForm = res.data;
      }
    },

    //重置修改表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    //提交修改报表的数据
    editAttrParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeTagName,
          }
        );
        if (res.meta.status != 200) {
          this.$message({
            type: "error",
            message: "更新失败",
            duration: 1000,
          });
        } else {
          this.$message({
            type: "success",
            message: "更新成功",
            duration: 1000,
          });
        }
        this.editAttrDialogVisable = false;
        this.getParams();
      });
    },

    /*添加宽展标签 */
    //将tag对应的attr_vals保存到数据库中
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_sel: row.attr_sel,
          attr_name: row.attr_name,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          duration: 1000,
          message: "添加失败",
        });
      } else {
        this.$message({
          type: "success",
          duration: 1000,
          message: "添加成功",
        });
      }
    },
    //文本框失去焦点或者,按下的enter会自动触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //若果没有return则需要做后续处理

      //保存这次操作
      row.attr_vals.push(row.inputValue.trim());
      this.saveAttrVals(row);
      row.inputValue = "";
      row.inputVisible = false;
    },

    showInput(row) {
      row.inputVisible = true;
      // console.log(1)
      //$nextTick 单页面上重新渲染之后才可以重新渲染代码，
      //rowinputVisible改变要重新渲染代码
      this.$nextTick(() => {
        //获取输入宽
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //删除索引对应的标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
  created() {
    this.getCateList();
  },

  computed: {
    isBtnDisable() {
      return this.selectedCateKey.length === 0;
    },
    //当前选中的三级的id
    cateId() {
      if (this.selectedCateKey.length === 3) return this.selectedCateKey[2];
      return null;
    },
    //计算标题的文本
    titleText() {
      if (this.activeTagName === "many") return "动态参数";
      else return "静态属性";
    },
  },
};
</script>

<style>
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
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>