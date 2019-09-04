<template>
    <div>
        {{text}}
        <el-button :loading="loading" type="primary" @click.native.prevent="aaa()">自己的api</el-button>
    </div>
</template>

<script>
import api from '@/utils/api.js';
import { setTimeout } from 'timers';

export default {
    data(){
        return {
            text:"自己",
            loading:false
        }
    },
    created(){
        // console.log(this.$router)
    },
    methods:{
        aaa(){
            var self=this;
            self.loading=true;
            api.get('/qiantai/userinfo/getById',{id:'c03600c8-8e5b-43c8-806d-c65f1cbc06f1'},res=>{
                console.log(res);
                self.loading=false;
            },err=>{
                console.log(err);
            })
        },
    }

}
</script>
