<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      ></el-alert>

      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- table区域 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="80px"
        :inline="false"
        size="normal"
        label-position="top"
      >
        <el-tabs
          @tab-click="tabClicked"
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="addForm.goods_name"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addForm.goods_price"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
                type="number"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item type="number" label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
                type="number"
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                size="mini"
                @change="handleChange"
                expand-trigger="hover"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品的静态属性 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 action 图片上传的api地址-->
            <el-upload
              :action="upLoadUrl"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisable"
      width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
    
  </div>
</template>
<script>
import store from "@/store"
import _ from "lodash"
export default {
  data() {
    return {
      //文件上传的地址路径
      upLoadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      
      //图片上传的对象
      headerObj:{
        Authorization: store.getters["loginModule/getToken"],
      },
      //保存预览图片的位置
      previewPath: '',
      //保存预览图片对话款是否展示
      previewVisable: false,
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 1,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //保存图片的空数组
        pics:[],
        //商品的详细描述
        goods_introduce: '',
        attrs: [],
      },
      //当前激活的步骤
      activeIndex: "0",

      //验证添加表单的规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品的数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      //商品分类数据
      catelist: [],

      //商品的属性
      manyTableData: [],
      //静态属性列表
      onlyTableData: [],
      //配置级联选择器
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
    };
  },
  methods: {
    //获取登入的token,
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取分类失败",
          duration: 1000,
        });
      }
      console.log(res.data);
      this.catelist = res.data;
    },
    //监听级联选择框的值
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
        this.$message({
          type: "error",
          message: "只能选中3级分类",
          duration: 1000,
        });
      }
    },
    //监控tab的标签页切换
    beforeTabLeave(activeName, oldActive) {
      // console.log("即将离开的标签页"+oldActive);
      // console.log("即将进入的标签页"+activeName);
      console.log(`goods_cat ${this.addForm.goods_cat.length}`);
      if (oldActive == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message({
          type: "info",
          message: "请先选择商品分类",
          duration: 1000,
        });
        return false;
      }
    },

    //当点击tab触发
    async tabClicked() {
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取参数失败",
            duration: 1000,
          });
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message({
            type: "error",
            message: "获取参数失败",
            duration: 1000,
          });
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },

    //处理上传图片预览的操作
    handlePreview(file){
      //获取文件在服务器中的相对位置
      this.previewPath = file.response.data.url;
      this.previewVisable = true;
    },

    //处理图片移除的操作
    handleRemove(file){
      //获取移除图片的路径
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(item=>item.pic==filePath);
      this.addForm.pics.splice(index,1);
      console.log(this.addForm)
    },

    //文件上传成功
    handleSuccess(res){
      //1.拼接得到图片数组对象
      const picInfo = {
        pic: res.data.tmp_path,
      }
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },

    //添加商品
    add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
            return this.$message({
              message:"请填写完整的表单内容",
              type: "error",
              duration: 1000,
            })
        }
        //添加的业务逻辑
       const form = _.cloneDeep(this.addForm);
       form.goods_cat = form.goods_cat.join(",");

          //处理 attrs
          this.manyTableData.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value: item.attr_vals.join(' ')};
            this.addForm.attrs.push(newInfo);
          })

          this.onlyTableData.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value: item.attr_vals};
            this.addForm.attrs.push(newInfo);
          })
          form.attrs = this.addForm.attrs;
          // console.log(form,this.manyTableData,this.onlyTableData);


          //发起请求
          const {data: res} = await this.$http.post("goods",form);
          console.log(res)
          if(res.meta.status !== 201){
            return this.$message({
              message: res.meta.msg,
              duration: 1000,
              type: "error",
            })
          }
          this.$message({
            message: "添加商品成功",
            duration: 1000,
            type: "success"
          })
          this.$router.push('/goods');
      })
    }
  },
  created() {
    this.getCateList();
    console.log(this.headerObj)
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
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
.el-steps {
  margin: 15px 0;
}
.el-cascader {
  width: 200px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>