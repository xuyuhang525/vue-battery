<template>
  <!-- 电芯数据分析 -->
  <div class="echarts-info">
    <div class="content">
      <!-- 充放电测试 -->
      <charge-put-com></charge-put-com>
    </div>
    <div class="content">
      <!--  同一放电深度下-->
      <depth-com></depth-com>
    </div>
    <div class="content">
      <!-- 同一温度不同电池参数比较 -->
      <temperature-com></temperature-com>
    </div>
    <div class="content">
      <!-- 同一电池，不同温度 -->
      <capacitor-com></capacitor-com>
    </div>
  </div>
</template>

<script>
import chargePutCom from "@/components/Echarts/chargePutCom.vue";
import depthCom from "@/components/Echarts/depthCom.vue";
import temperatureCom from "@/components/Echarts/temperatureCom.vue";
import capacitorCom from "@/components/Echarts/capacitorCom.vue";
export default {
  components: {
    chargePutCom,
    depthCom,
    temperatureCom,
    capacitorCom,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped lang="scss">
.echarts-info {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100vh - 50px);
  flex-wrap: wrap;
  overflow-y: auto;
  padding: 25px;
  .content {
    width: 50%;
    height: 50%;
  }
}
</style>
