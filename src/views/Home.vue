<template>
  <!-- 头部 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <el-avatar src="./imgs/logo.png"></el-avatar>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollpse"> <i class="iconfont icon-close"></i></div>
        <!-- 侧边栏菜单区域 -->
        <el-menu :collapse-transition="false" :collapse="isCollapse" unique-opened background-color="#333744" text-color="#fff" :default-active="currentPath" active-text-color="#409EFF" router>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <i :class="pathiconAside[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveCurrentPath(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      headimg: "",
      menusList: [],
      isCollapse: false,
      currentPath: '',
      //下下之策
    pathiconAside: {
        101: "iconfont icon-shangpingouwudai2",
        102: "iconfont icon-danju-tianchong",
        103: "iconfont icon-tijikongjian",
        125: "iconfont icon-users",
        145: "iconfont icon-baobiao",
    },
    };
  },
  methods: {
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200)
        return this.$message({
          type: "warning",
          message: res.meta.msg,
          duration: 1000,
        });
        this.menusList = res.data;
    },

    //点击按钮切换菜单的折叠与展开
    toggleCollpse(){
      this.isCollapse = !this.isCollapse;
    },

    //修改二级菜单的激活属性
    saveCurrentPath(path){
      this.currentPath = '/' + path;
      sessionStorage.setItem("vueTestPath",this.currentPath);
    }
  },
  created() {
    this.getMenuList();
    this.currentPath = sessionStorage.getItem("vueTestPath");
  },

};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff !important;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
 
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaeaf1;
}
.iconfont{
  padding-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: .2rem;
  cursor: pointer;
}
</style>
