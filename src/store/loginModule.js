const loginModule = {
    namespaced: true,
    state:{
        user:null,
        token: "",
    },
    getters:{
        getUser:function(state){
            return state.user;
        },
        getToken: function(state){
            return state.token;
        }
    },
    mutations:{
        setUser:function(state,user){
            state.user = user;
        },
        setToken:function(state,token){
            state.token = token;
        }
    },
}
export default loginModule