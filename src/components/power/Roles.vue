<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>

      <!-- 权限列表展示 -->
      <el-table label-position="left" border :data="roleList">
        <el-table-column type="expand">
          <!-- 权限列表展开列-->
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['vcenter', 'bdbottom', i1 == 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delTag(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['vcenter', i2 == 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delTag(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="delTag(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            {{ scope.row.mg_status }}

            <!-- 操作内容 -->

            <el-row>
              <el-button type="primary" icon="el-icon-edit" size=" mini"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size=" mini"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size=" mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话款 -->
    <el-dialog :visible.sync="rightDialogFormVisible" @close="closeRightDialog">
      <!-- 主题内容 -->

      <el-tree
        ref="rightTree"
        :data="rightTree"
        :props="rightTreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendRightRequest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      roleList: [],
      rightTree: {},
      //控制修改权限对话框
      rightDialogFormVisible: false,

      //默认选中的节点id
      defKeys: [],
      //控制树型控件的属性绑定对象
      rightTreeProps: {
        label: "authName",
        children: "children",
      },
      roleId: "",
    };
  },
  methods: {
    async getRoles() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message({
          type: "error",
          message: "角色数据获取失败",
          duration: 1000,
        });
      }
      this.roleList = res.data;
    },
    async delTag(role, rightId) {
      let mes = await this.$confirm(
        "此操作将会永久三处改权限,是否继续",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning",
        }
      ).catch((err) => err);
      if (mes == "cancel") {
        return this.$message({
          type: "info",
          message: "取消操作",
          duration: 1000,
        });
      }
      //发送请求删除该权限
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          duration: 1000,
          message: "删除失败",
        });
      }
      this.$message({
        type: "success",
        duration: 1000,
        message: "删除成功",
      });

      role.children = res.data;
    },

    //获取分配权限树
    async showSetRightDialog(row) {
      //清空绑定的权限
      this.roleId = row.id;
      const { data: res } = await this.$http("rights/tree");
      if (res.meta.status != 200) {
        return this.$message({
          type: "error",
          message: "获取权限树失败",
          duration: 1000,
        });
      }
      this.getLeafKey(row, 0);
      // console.log(row);
      this.rightTree = res.data;
      this.rightDialogFormVisible = true;
    },

    //通过递归的形式获取三级节点的id
    getLeafKey(role, deep) {
      if (role.children) {
        let item = role.children;
        deep++;
        for (let i = 0; i < item.length; i++) {
          this.getLeafKey(item[i], deep);
        }
      } else {
        if (deep == 3) {
          this.defKeys.push(role.id);
        }
      }
    },

    //关闭对话款，重置选定的属性
    closeRightDialog() {
      this.defKeys = [];
    },

    //发送选择权限的请求
    async sendRightRequest() {
      console.log(this.defKeys);
      let key = [
        ...this.$refs.rightTree.getCheckedKeys(true),
        ...this.$refs.rightTree.getHalfCheckedKeys(),
      ];
      let keystr = key.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keystr }
      );
      if (res.meta.status != 200) {
        return this.$messga({
          type: "error",
          message: "授权失败",
          duration: 1000,
        });
      }
      this.$message({
        type: "success",
        message: "授权成功",
        duration: 1000,
      });
      this.rightDialogFormVisible = false;
      this.getRoles();
    },
  },

  created() {
    this.getRoles();
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

.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
