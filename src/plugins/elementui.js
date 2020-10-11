import { Form,FormItem,Input,Button} from 'element-ui';
import Vue from "vue";
//对elementui 进行重新封装，防止elementui多次谈宽
import Message from "@/util/resetMessage";
Vue.config.productionTip = false
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.prototype.$message = Message;