<template>
  <div class="contain">
    <div class="order">
      <div class="order-item"
        v-for="(item, index) in [{ name: '今日订单数', num: 1888 }, { name: '今日日活', num: 36271 }, { name: '转化率', num: '20%' }]"
        :key="index">
        <p>{{ item.name }}</p>
        <p>{{ item.num }}</p>
      </div>
    </div>
    <div class="control-panel">
      <div class="canvas-box" ref="boxOne">
      </div>
    </div>
  </div>

</template>
<!-- 新增注册 付费用户 活跃用户 -->
<script>
import * as echarts from 'echarts';
export default {
  name: "control-panel",
  data() {
    return {
      sentry_version: 7,
      sentry_key: "f866b695d21d467ba523f1adf14e0a24"
    }
  },
  mounted() {
    this.line();
  },
  // created() {
  //   this.init()
  // },
  methods: {
    line() {
      let mychar = echarts.init(this.$refs.boxOne);
      mychar.setOption({
        title: {
          text: '系统折线图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['新增注册', '付费用户', '活跃用户', '订单数', '当日总收入']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '新增注册',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '付费用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '订单数',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '当日总收入',
            type: 'line',
            stack: 'Total',
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });
    },
    // async init() {
    //   try {
    //     console.log(2222222);
    //     let { Code } = await this.$api.dashboard.queryData(this.sentry_version, this.sentry_key);
    //     if (+Code === 200) {
    //       console.log(1111111111);
    //       return;
    //     }
    //   } catch (_) {
    //     console.log('错误:', _);
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
.contain {
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

  .order {
    width: 100%;
    display: flex;
    margin-bottom: 50px;
    justify-content: space-around;

    .order-item {
      margin-right: 20px;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      flex: 1;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

      p {
        padding: 18px 20px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
        color: #303133;
        font-size: 16px;
      }
    }
  }
}

/* 必须给指定的容器（画布）设置宽高 */
.canvas-box {
  box-sizing: border-box;
  width: 810px;
  height: 300px;
  margin-bottom: 20px;
}
</style>