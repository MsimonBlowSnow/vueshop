//导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import Vue from 'vue'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//全局注册
Vue.use(VueQuillEditor, /* { default global options } */)

