<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card class="box-card">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <div>
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 操作的开关插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 操作列的渲染 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{ scope.row.mg_status }}
            <el-row>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteUser(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  circle
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的基本对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话款 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close = "closeRoleDialog"
    >
      <!-- 主题内容 -->
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const regEail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const regEail = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regEail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      //控制对话框的显示与隐藏
      addDialogVisible: false,

      //控制修改用户的对话框
      editDialogVisible: false,

      //保存查询到的编辑用户信息
      editForm: {},

      //获取用户参数列表的对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      addForm: {
        username: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { min: 3, max: 10, message: "用户名在3-10为之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6-15个字符之间",
            trigger: "blur",
          },
        ],

        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trrigger: "blur" },
        ],
      },

      //修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户的手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      userTotal: 0,
      userList: [],

      //控制分配角色对话款的显示和隐藏
      setRoleDialogVisible: false,

      //需要被分配角色的用户信息
      userInfo: {},
      //角色列表
      roleList: [],
      //已选中的角色id
      selectedRoleId :''
    };
  },
  methods: {
    getUserList: async function () {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      // console.log(res)
      if (res.meta.status != 200)
        return this.$message({
          type: "error",
          message: "获取用户信息失败",
          duration: 1000,
        });
      // console.log(res.data.users);
      this.userList = res.data.users;
      this.userTotal = res.data.total;
    },

    //监听pagesize 改变事件
    handleSizeChange(newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },

    //监听switch 开关状态的改变
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message({
          type: "error",
          duration: 1000,
          message: "更新失败",
        });
      }
      this.$message({
        message: "更新成功",
        type: "success",
        duration: 1000,
      });
    },

    //监听 页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    //监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addForm.resetFields();
    },

    //点击按钮添加用户
    addUser() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) {
          return this.$message({
            type: "warning",
            message: "请输入正确的格式信息",
            duration: 1000,
          });
        }
        //发起添加用户请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          return this.$message({
            type: "warning",
            message: "添加用户失败",
            duration: 1000,
          });
        }
        this.$message({
          type: "success",
          message: "添加用户成功",
          duration: 1000,
        });
        this.addDialogVisible = false;
        this.getUserList();
      });
    },

    //展示编辑用户的对话框
    async showEditDialog(userid) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${userid}`);
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          duration: 1000,
          message: "请求用户的信息失败",
        });
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    //重置编辑表单事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    //编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message({
            type: "warning",
            message: "请输入正确的格式",
            duration: 1000,
          });
        }
        //发起用户请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status != 200) {
          return this.$message({
            type: "error",
            messsage: "更新失败",
            duration: 1000,
          });
        }

        //关闭对话框
        this.editDialogVisible = false;
        //跟新数据列表
        this.getUserList();
        //提示成功
        this.$message({
          type: "success",
          message: "更新成功",
          duration: 1000,
        });
      });
    },
    //根据id删除用户
    async deleteUser(userId) {
      //点击确定返回cofirm,取消返回 cancle
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
        //发起删除用户请求
        const { data: res } = await this.$http.delete(`users/${userId}`);
        if (res.meta.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            duration: 1000,
          });

          //跟新前台数据
          this.getUserList();
        }
        this.$message({
          type: "error",
          message: "删除失败",
          duration: 1000,
        });
      } else {
        this.$message({
          type: "info",
          message: "取消删除",
          duration: 1000,
        });
        return;
      }
    },

    //展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //获取角色列表
      const {data: res} =  await this.$http.get("roles");
      if(res.meta.status != 200){
        return this.$message({
          type: "error",
          message: "获取角色列表失败",
          duration: 1000,
        })
      }
      this.roleList = res.data;
      this.setRoleDialogVisible = true;
    },

    //分配角色
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message({
          type: "error",
          message:"请选择用户要分配的角色",
          duration: 1000,
        })
      }
      const {data: res} =await this.$http.put(`users/${this.userInfo.id}/role `,{
        rid: this.selectedRoleId
      });
      if(res.meta.status != 200){
        return this.$message({
          type: "error",
          message: "分配角色失败",
          duration: 1000,
        })
      }
      this.$message({
        type: "success",
        message: "分配角色成功",
        duration: 1000,
      });
      this.setRoleDialogVisible = false;
      this.getUserList();
    },

    // 监听分配角色对话框的关闭
    closeRoleDialog(){
      this.userInfo = {},
      this.selectedRoleId = '';
      
    }
  },
  created() {
    this.getUserList();
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
