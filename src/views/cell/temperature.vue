<template>
  <!-- 同一温度管理 -->
  <div class="app-container">
    <div class="rowBC" style="margin-bottom: 20px">
      <div class="text-info">备注：同一温度不同电池参数比较</div>
      <div>
        <el-button
          type="primary"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="importData"
          >导入</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      v-loading="loading"
      border
    >
      <el-table-column prop="code" label="电芯编号"> </el-table-column>
      <el-table-column prop="title" label="温度"> </el-table-column>
      <el-table-column prop="dischargeCapacity" label="放电容量/Ah">
      </el-table-column>
      <el-table-column prop="dischargeEnergy" label="放电能量/Wh">
      </el-table-column>
      <el-table-column prop="capacityRetentionRate" label="容量保持率/%">
      </el-table-column>
      <el-table-column prop="energyRetentionEfficiency" label="能量保持效率/%">
      </el-table-column>
      <el-table-column prop="temperatureRisePositive" label="温升-正极/℃">
      </el-table-column>
      <el-table-column prop="riseNegativeTerminal" label="温升-负极/℃">
      </el-table-column>
      <el-table-column prop="temperatureRiseLargeNoodles" label="温升-大面/℃">
      </el-table-column>
      <el-table-column prop="positiveElectrodeMaterial" label="正极材料">
      </el-table-column>
      <el-table-column prop="electrolyte" label="电解液"> </el-table-column>
      <el-table-column prop="negativeElectrodeMaterial" label="负极材料">
      </el-table-column>
      <el-table-column prop="upperVoltageLimit" label="电压上限">
      </el-table-column>
      <el-table-column prop="diaphragm" label="隔膜"> </el-table-column>
      <el-table-column prop="projectName" label="项目名称"> </el-table-column>
      <el-table-column prop="lowerVoltageLimit" label="电压下限">
      </el-table-column>
      <el-table-column prop="electrochemicalType" label="电化学类型">
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageCurrent"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <upload
      @over="over"
      title="同一温度不同电池参数比较信息导入"
      uploadUrl="/tywd/import"
      ref="exportTable"
    ></upload>
  </div>
</template>

<script>
import { getInfosPage } from "@/api/Cell/cell";
import upload from "@/components/Upload";
export default {
  components: { upload },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      queryParams: {
        pageCurrent: 1,
        pageSize: 9,
        type: 3,
      },
      tableData: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getInfosPage(this.queryParams).then((response) => {
        this.tableData = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    // 导入
    importData() {},
    // 成功回调
    over() {
      this.getList();
    },
    // 导入
    importData() {
      this.$refs.exportTable.show();
    },
  },
};
</script>
<style scoped lang="scss"></style>
