<template>
  <!-- 电容制式 -->
  <div class="content">
    <div class="select">
      <el-select
        v-model="titleValue"
        style="width: 150px; margin-right: 10px"
        placeholder="请选择"
        @change="selectChangeTitle"
      >
        <el-option
          v-for="item in optionsTitle"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <i class="el-icon-search" style="cursor: pointer" @click="search"></i>
    </div>
    <div id="capacitor" class="content"></div>
    <yh-dialog
      ref="details"
      :showForm.sync="show"
      :title="title + '查询'"
      @search="searchDialog"
    >
      <template v-slot:content="{ data }">
        <el-form ref="postForm" :model="data" label-width="120px">
          <el-form-item label="Y轴信息：">
            <el-select
              v-model="value"
              style="width: 300px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正极材料：">
            <el-input
              v-model="data.positiveElectrodeMaterial"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="电解液：">
            <el-input
              v-model="data.electrolyte"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="负极材料：">
            <el-input
              v-model="data.negativeElectrodeMaterial"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="电压上限：">
            <el-input
              v-model="data.upperVoltageLimit"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="隔膜：">
            <el-input
              v-model="data.diaphragm"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目名称：">
            <el-input
              v-model="data.projectName"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="电压下限：">
            <el-input
              v-model="data.lowerVoltageLimit"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="电化学类型：">
            <el-input
              v-model="data.electrochemicalType"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </yh-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
import YhDialog from "./components/dialog";
import { getInfosPage, getBatteryTitle } from "@/api/Cell/cell";
export default {
  components: {
    YhDialog,
  },
  computed: {
    ...mapGetters(["sidebar"]),
    opened() {
      return this.sidebar.opened;
    },
  },
  data() {
    return {
      myChart: null, // echarts实例
      show: false, // 弹框控制
      unit: "Ah",
      title: "放电容量",
      queryParams: {
        pageCurrent: 1,
        pageSize: 5,
        type: 4,
        title: "",
      },
      // 头部筛选
      optionsTitle: [],

      // 筛选数据
      options: [
        {
          value: "1",
          label: "放电容量",
          unit: "Ah",
          src: "dischargeCapacity",
        },
        {
          value: "2",
          label: "放电能量",
          unit: "Wh",
          src: "dischargeEnergy",
        },
        {
          value: "3",
          label: "放电平台电压",
          unit: "V",
          src: "dischargePlatformVoltage",
        },
        {
          value: "4",
          label: "放电能量效率",
          unit: "%",
          src: "dischargeEnergyEfficiency",
        },
        {
          value: "5",
          label: "温升-正极",
          unit: "℃",
          src: "temperatureRisePositive",
        },
        {
          value: "6",
          label: "温升-负极",
          unit: "℃",
          src: "riseNegativeTerminal",
        },
        {
          value: "7",
          label: "温升-大面",
          unit: "℃",
          src: "temperatureRiseLargeNoodles",
        },
      ],
      value: "1",
      titleValue: "",
      src: "dischargeCapacity",
    };
  },
  watch: {
    opened(val) {
      // 缩起侧边栏 echarts自适应
      setTimeout(() => {
        this.myChart.resize();
      }, 300);
    },
  },
  mounted() {
    getBatteryTitle({ type: "4" }).then((res) => {
      let arr = [];
      res.data.map((item) => {
        arr.push({ value: item, label: item });
      });
      this.optionsTitle = arr;
      this.queryParams.title = res.data[0];
      this.titleValue = res.data[0];
      this.getList(this.src);
    });
  },
  methods: {
    getList(src) {
      this.loading = true;
      getInfosPage(this.queryParams).then((res) => {
        let data = {};
        if (res.data.records.length == 0) {
          data = {
            xInfo: ["暂无", "暂无", "暂无", "暂无", "暂无"],
            yInfo: ["0", "0", "0", "0", "0"],
          };
        } else {
          data = this.funcEchartsData(res.data.records, src);
        }
        this.init(data);
        this.loading = false;
        this.show = false;
      });
    },
    // 数据处理
    funcEchartsData(data, src) {
      let xInfo = [];
      let yInfo = [];
      data.map((res) => {
        xInfo.push(res.code);
        yInfo.push(res[src]);
      });
      let obj = {
        xInfo,
        yInfo,
      };
      return obj;
    },
    // 折线图
    init(data) {
      var that = this;
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById("capacitor"));
      let option = {
        title: {
          text: "电容制式信息",
          padding: [5, 0, 0, 40],
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            return `<div class=chartLabel>
              <div class=label>倍率：${that.titleValue}</div>
              <div class=title>${that.title + "：" + params[0].value}</div>
              <div class=label>电芯编号：${params[0].axisValue}</div>
            </div>`;
          },
        },
        //柱形图和折线图相互切换
        toolbox: {
          show: true,
          feature: {
            /* line是折线图，bar是柱形图*/
            magicType: { show: true, type: ["line", "bar"] },
          },
        },
        calculable: false, //图形固定不能移动
        xAxis: [
          {
            type: "category",
            data: data.xInfo,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: this.unit,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            // type: "line",
            symbol: "circle", //将小圆点改成实心 不写symbol默认空心
            symbolSize: 8, //小圆点的大小
            itemStyle: {
              color: "#3480FE", //小圆点和线的颜色
            },
            lineStyle: {
              width: 2.5,
              type: "solid",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 82, 217,0.6)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 82, 217, 0.03)",
                  },
                ],
                global: false,
              },
              origin: "start",
            },
            shadowColor: "rgba(0, 82, 217)",
            shadowBlur: 0,
            shadowOffsetX: 0,
            type: "bar",
            barWidth: 40, //宽度
            data: data.yInfo,
            //显示数值
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "top",
                  color: "#333",
                },
              },
            },
          },
        ],
      };
      // 绘制图表
      this.myChart.setOption(option);
      var that = this;
      var that = this;
      window.addEventListener("resize", function () {
        that.myChart.resize();
      });
    },
    // 导入
    importData() {
      this.$refs.exportTable.show();
    },
    // 搜索
    search() {
      this.show = true;
    },
    //查询回调
    searchDialog(data) {
      let info = {
        ...this.queryParams,
        ...data,
      };
      this.selectChange(this.value);
      this.queryParams = info;
      this.getList(this.src);
    },
    // 下拉回调
    selectChange(e) {
      let data = this.options.filter((item) => {
        return item.value == e;
      })[0];
      this.unit = data.unit;
      this.title = data.label;
      this.src = data.src;
    },
    // 头部下拉回调
    selectChangeTitle(e) {
      this.queryParams.title = e;
      this.getList(this.src);
    },
  },
};
</script>
<style scoped lang="scss">
.content {
  width: 100% !important;
  height: 100% !important;
  position: relative;
}
.select {
  position: absolute;
  top: -2px;
  right: 60px;
  // left: 50%;
  // margin-left: -100px;
  z-index: 1;
}
</style>
