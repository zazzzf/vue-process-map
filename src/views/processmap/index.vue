<template>
  <div class="dashboard-container">
    <div v-for="item in nodeData" :key="item.stepCode">
      <h1 style="background: #ccc">{{item.stepName}}</h1>
      <processMap 
      :nodeData="item"
      :size="config.size?'small':'large'"
       />
    </div>
    <el-button icon="el-icon-setting" @click="show=!show" type="primary" class="setting-button"></el-button>
    <el-dialog :visible.sync="showmock" title="demo data">
      <!-- or literal code works as well -->
      <highlightjs language='javascript' class="atom-one-dark" :code="demoMockData" />
    </el-dialog>
    <el-drawer :visible.sync="show" >
      <p slot="title">Setting Drawer</p>
      <div style="padding: 0 40px">
      <p>2级色彩设置</p>
       <el-color-picker v-model="config.sColor"></el-color-picker>
      <el-divider />
      <p>3级色彩设置</p>
       <el-color-picker v-model="config.tColor"></el-color-picker>
      <el-divider />
      <p>组件大小 可选 default/small</p>
      <el-switch v-model="config.size" active-text="small" inactive-text="default" />
      <el-divider />
      <p>组件接受参数数据结构</p>
      <el-button type="primary" @click="showmock =!showmock">查看</el-button>
      <el-divider />
      <p>3depth 全部收起</p>
      <el-switch v-model="config.extendAll" @change="closeAll"  active-text="收起" inactive-text="展开" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
const mockD = `[
  {
    'stepCode': 10100101,
    'stepName': '@cname',
    'data': [
      {
        'status': '3',
        'stepCode': 20200101,
        'stepName': '@cname',
        'rankType': 1,
        'data': [
          {
            'stepCode': 30300101,
            'stepName': '@cname',
            'rankType': 1,
          }, ...
        ]
      }, ...
    ]
  }, ...
]`
import { mapGetters } from 'vuex'
import  processMap from '@/components/process-map'
import { getMapData } from '@/api/map'
export default {
  name: 'Dashboard',
  components: {processMap},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {
      show: false,
      demoMockData: mockD,
      nodeData: [],
      config: {
        sColor: '#f7acbc',
        tColor: '#ef5b9c',
        size: false,
        extendAll: false
      },
      showmock: false
    }
  },
  created(){
    this.getData()
  },
  methods:{
    getData(){
      getMapData().then(res => {
        this.initList(res.data)
      })
    },
    initList(data){
        let list = data
        list.forEach((e, _e) => {
          e.extend = false;
          e.data && e.data.forEach((i) => {
          i.extend = true;
          if (i.data && i.data.length > 0) {
            e.extend = true;
          }
          i.data && i.data.forEach((t) => {});
        });
      });
      this.nodeData = list
      console.log(this.nodeData)
    },
    closeAll(type){
      let list = this.nodeData
      if(type) {
        list.forEach(item => {
          item.data.forEach(j => {
            j.extend = false
          });
          item.extend = false
        })
      }else {
        this.initList(list)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.setting-button{
  position: fixed;
  right: 0%;
  top: 50%;
  height: 50px;
  width: 50px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
