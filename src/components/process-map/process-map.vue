<template>
  <div class="process-row-box" :class="{'process-row-box-small': size=='small'}">
    <!-- 上行 :class="{'depth-focus': isFocus}" -->
    <div
      v-for="(i, $i) in secondData"
      :key="$i"
      class="second-box_row"
      :class="[
        {
          'second-box_row_item': $i == 0 && i.extend,
        },
        boxRowClass($i,secondData, '2'),
        !nodeData.extend ? thirdVerifyClass($i,secondData,i) : ''
      ]"
    >
      <div
        v-for="(t,_t) in i"
        :id="'n' + t.stepCode"
        :key="_t"
        :class="{
          'second-box_container': true,
          'third-box_container_line': !nodeData.extend,
          'third-box_once': i.length == 1,
          'depth2-clicked': t.clicked,
          'depth-focus': t.clicked,
        }"
      >
        <div class="map-second_center_line">
          <div
            :class="[
              secondClass(_t,i, $i, t),
              {'depth-selected': t.clicked,'half-line': t.isOnceTwo && !t.extend && !nodeData.extend}
            ]"
            @click="secondClick(t)"
          >
            <div class="circel_text font-NotoSansCJKkr-Bold">
              {{ t.stepName }}
            </div>
          </div>
        </div>
        <template v-for="(n,_n) in formatData(t)">
          <div v-show="t.extend" class="third-box_row"
              :class="[
                {
                  'third-box_row_item': _n == 0,
                  'half-line-third': _n == 0 && n.length == 1
                },
                boxRowClass(_n,formatData(t),'3'),
                thirdVerifyClass(_n,formatData(t),n),
                ]"
            >
            <div v-for="(m,_m) in n" :class="{
                  'third-box_container': true,
                  'third-box_container_line': true,
                  'third-box_once': n.length == 1,
                }"
            >
              <div class="map-third_center_line">
                <div :class="[thirdClass(_m,n,_n, formatData(t)),{'half-line': m.isOnceTwo, 'third-checked': m.checked || m.focus, 'dis-checked': disChecked, 'allow-checked': m.allowClick}]" @click="changeThirdStatus(m)">
                  <div class="third_text">
                    {{ m.stepName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>
<script>
/**
 * 传入一级菜单进行解析
 * 去掉了项目里的一些逻辑代码
 */
import formatData from './formatData'
export default {
  // components:{processMapItem},
  props: {
    nodeData: {},
    size: {
      type: String,
      default: 'large'
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    // 是否禁用三级节点点击 默认不禁用
    disChecked: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      currentData: {},
      statusArr: ['',"완료","결재중",""],
      // 日志参数
      logParam: {
        projectCode: '',
        screenId: 'map',
        uiComponentType: '',
        uiComponentId: '',
        uiComponentSelVal: '',
        accessKindCd: ''
      }
    }
  },
  computed: {
    secondData: function() {
      return formatData(this.nodeData)
    },
    isSmall: function() {
      return this.size === 'small'
    }
  },
  created() {
    // this.showData = formatData(this.data);
    this.currentData = this.nodeData
  },
  methods: {
    secondClass(_t, i, $i, t) {
      let _this = this
      var _i = i.length
      var classStr = `map-circle_box flex_center `
      if (this.fromTree) {
        classStr = `map-circle_box_tree flex_center `
      }
      function onlyOneNode(){
        let classString = ''
        if (!t.extend) {
          if ($i === _this.secondData.length - 1) {
            if (!_this.secondData[$i - 1]) {
              classString += `map-third_box_center map-third_box_center_end  map-third_box_center_first`
            } else {
              classString += `map-third_box_center map-third_box_center_end`
            }
          } else {
            if (_this.secondData[$i - 1] && _this.secondData[$i - 1].length > 0) {
              classString += ` map-third_box_center `
            } else {
              classString += ` map-third_box_center map-third_box_center_first`
            }
          }
        }
        return classString
      }
      function overOneNode(){
        let classStrn = ''
        if (!t.extend) {
          if (_t === 0) {
            classStrn += `map-third_box_first`
          } else if (_t === _i - 1) {
            classStrn += `map-third_box_last`
          } else {
            classStrn += `map-third_box_center`
          }
        }
        return classStrn
      }
      if (!this.nodeData.extend) {
        if (i.length === 1) {
          classStr += onlyOneNode()
        } else {
          classStr += overOneNode()
        }
      }
      return classStr
    },
    thirdClass(_t, i, $i, showData) {
      var _i = i.length
      // `map-third_box flex_center map-third_box_${i.length > 1 ? _t == 0 ? 'first': _t == i.length - 1 ?'last':'cneter' : 'center'}`
      var classStr = `map-third_box flex_center `
      if (i.length === 1) {
        if ($i === showData.length - 1) {
          classStr += `map-third_box_center map-third_box_center_end`
        } else {
          classStr += `map-third_box_center`
        }
      } else {
        if (_t === 0) {
          classStr += `map-third_box_first`
        } else if (_t === _i - 1) {
          classStr += `map-third_box_last`
        } else {
          classStr += `map-third_box_center`
        }
      }
      return classStr
    },
    // selectChange(val) {
    //   this.$emit('change', val)
    // },
    formatData(data) {
      return formatData(data)
    },
    secondClick(t) {
      console.log(t)
      // 可以将二级数据传给父节点
      this.$message.info(`你点击了${t.stepName}...`)
    },

    // 三级点击事件
    changeThirdStatus(m) {
      console.log(m)
      this.$message.success(`你点击了${m.stepName}...`)
    },
    thirdVerifyClass(_t, data, item) {
      let className = ''
      if(item.length > 1 && _t !== data.length -1) {
        if(data[_t+1].length>1) {
          className += 'map-third_box_row_after third-map-bottom'
        }
      }
      return className
    },
    boxRowClass(n, data, type) {
      var rowChildisAll2 = true
      let className = ''
      function setrowChild(){
        data.forEach(item => {
          if (item.rankType === '1') {
            rowChildisAll2 = false
          }
        })
      }
      if (data.length - 1 === n && data[n].length > 1) {
        setrowChild()
        if (rowChildisAll2) {
          className += ' m-bottom20'
        }
      }
      if (type === '2' && n === 0 && data[n].length > 1){
        setrowChild()
        if (rowChildisAll2) {
          className += ' m-top20'
        }
      }
      return className
    }
  }
}
</script>
<style lang="scss" scoped>
    @import './index.scss';
    .m-bottom20{
      margin-bottom: 20px;
    }
    .m-top20{
      margin-top: 20px;
    }
    .third-map-bottom{
      padding-bottom: 20px;
    }
    .map-third_box_row_after{
      &::after{
        display: block!important;
        content: '';
        position: absolute;
        top: 100%;
        transform: translateY(-100%);
        left: 50%;
        width: 50%;
        height: $process-map-third-box_margin_y-large;
        border-left:  $process-map-line-border-size dashed $process-map-border-color;
        border-radius: 0 !important;
        background-color: transparent !important;
      }
    }
</style>
