import {
    Form,
    FormItem,
    Input,
    Button,
    Container,
    Aside,
    Header,
    Main,
    Avatar,
    Menu,
    MenuItem,
    Submenu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Row,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    Checkbox,
    CheckboxGroup,
    Upload
} from 'element-ui';
import Vue from "vue";
//对elementui 进行重新封装，防止elementui多次谈宽
import Message from "@/util/resetMessage";
Vue.config.productionTip = false
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Aside);
Vue.use(Container);
Vue.use(Main);
Vue.use(Header);
Vue.use(Avatar);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Col);
Vue.use(Row);
Vue.use(TableColumn);
Vue.use(Table)
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;