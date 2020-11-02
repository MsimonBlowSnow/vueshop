module.exports = {
    chainWebpack: config =>{
        //生产模式
        config.when(process.env.NODE_ENV === 'production',when =>{
            config.entry('app').clear().add('./src/main-prod.js');
            config.set('externals',{
                vue:"Vue",
                vuex: "Vuex",
                'vue-router': "VueRouter",
                axios: "axios",
                lodash: "_",
                echarts: "echarts",
                nprogress: "NProgress",
                'vue-quill-editor': 'VueQuillEditor'
            })
        })
        config.when(process.env.NODE_ENV === 'development',when =>{
            config.entry('app').clear().add('./src/main-dev.js');
            config.set('externals',{
                vue:"Vue",
                vuex: "Vuex",
                'vue-router': "VueRouter",
                axios: "axios",
                lodash: "_",
                echarts: "echarts",
                nprogress: "NProgress",
                'vue-quill-editor': 'VueQuillEditor'
            })
        })
    }
}