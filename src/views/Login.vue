<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form ref="loginForm" :model="loginForm" class="login_form" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" show-password>
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login_button">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapMutations} from "vuex"
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入登入账户", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("loginModule",["setToken","setUser"]),
    //点击重置按钮，重置表单
    resetLoginForm() {
      this.$refs.loginForm.resetFields();
    },

    //表单登入
    login() {
      // console.log(1)
      this.$refs.loginForm.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return;
        }
        let user = {};
        let {data:res} = await this.$http.post("login", this.loginForm);
        // console.log(res.data);
        user.email = res.data.email;
        user.mobile = res.data.mobile;
        user.rid = res.data.rid;
        user.username = res.data.username;

        this.setToken(res.data.token);
        this.setUser(user);

        localStorage.setItem("vueTestToken",res.data.token);
        localStorage.setItem("vueTestUser", JSON.stringify(user));

        if (res.meta.status !== 200) return this.$message({
          type: "warning",
          message: "登录失败",
          duration: 1000
        });
        this.$message({
          type: "success",
          message: "登入成功",
          duration: 1000,
        });
        this.$router.push({name:"home"});
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avater_box {
    height: 130px;
    width: 130px;
    padding: 10px;
    position: absolute;
    left: 50%;
    top: 0px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    img {
      border-radius: 50%;
      height: 100%;
      width: 100%;
      background: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    .login_button {
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>