<template>
  <!-- 电芯管理 -->
  <div class="app-container">
    <el-row>
      <!--用户数据-->
      <el-col>
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="85px"
        >
          <div class="rowBC">
            <div style="width: 90%">
              <el-form-item label="项目名称">
                <el-input
                  v-model="queryParams.projectName"
                  placeholder="请输入项目名称"
                  clearable
                  style="width: 137px"
                />
              </el-form-item>
              <el-form-item label="电化学类型">
                <el-input
                  v-model="queryParams.electrochemicalType"
                  placeholder="请输入电化学类型"
                  clearable
                  style="width: 137px"
                />
              </el-form-item>
              <el-form-item label="电芯编码">
                <el-input
                  v-model="queryParams.cellCode"
                  placeholder="请输入电芯编码"
                  clearable
                  style="width: 137px"
                />
              </el-form-item>
              <el-form-item label="正极">
                <el-input
                  v-model="queryParams.positiveElectrode"
                  placeholder="请输入正极"
                  clearable
                  style="width: 137px"
                />
              </el-form-item>
              <el-form-item label="负极">
                <el-input
                  v-model="queryParams.negativeElectrode"
                  placeholder="请输入负极"
                  clearable
                  style="width: 137px"
                />
              </el-form-item>
              <el-form-item label="电解液">
                <el-input
                  v-model="queryParams.electrolyte"
                  placeholder="请输入电解液"
                  clearable
                  style="width: 137px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
                <el-button
                  type="primary"
                  plain
                  icon="el-icon-upload2"
                  size="mini"
                  @click="importData"
                  >导入</el-button
                >
              </el-form-item>
            </div>
            <!-- <div>

            </div> -->
          </div>
        </el-form>

        <el-table border v-loading="loading" :data="cellList">
          <el-table-column label="项目编号" align="projectNo" prop="cellCode" />
          <el-table-column
            label="项目名称"
            align="center"
            prop="projectName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="电化学类型"
            align="center"
            prop="electrochemicalType"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="壳体类型"
            align="center"
            prop="shellType"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="单体电池额定容量（Ah）"
            align="center"
            prop="singleCellRatedCapacity"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="电芯编码"
            align="center"
            prop="cellCode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="测试编码"
            align="center"
            prop="testCode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="正极"
            align="center"
            prop="positiveElectrode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="负极"
            align="center"
            prop="negativeElectrode"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="电解液"
            align="center"
            prop="electrolyte"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隔膜"
            align="center"
            prop="diaphragm"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="铜箔（um）"
            align="center"
            prop="copperFoil"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="铝箔（um）"
            align="center"
            prop="aluminumFoil"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="电压上线"
            align="center"
            prop="upperVoltageLimit"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="电压下限"
            align="center"
            prop="lowerVoltageLimit"
            :show-overflow-tooltip="true"
          />
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageCurrent"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <upload @over="over" uploadUrl="/battery/import" ref="exportTable"></upload>
  </div>
</template>

<script>
import { getBatteryPage } from "@/api/Cell/cell";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import upload from "@/components/Upload";
export default {
  name: "User",
  components: { Treeselect, upload },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      cellList: null,
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageCurrent: 1,
        pageSize: 10,
        positiveElectrode: "",
        negativeElectrode: "",
        electrolyte: "",
        electrochemicalType: "",
        cellCode: "",
        projectName: "",
      },
    };
  },

  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getBatteryPage(this.queryParams).then((response) => {
        this.cellList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageCurrent = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageCurrent: 1,
        pageSize: 10,
        positiveElectrode: "",
        negativeElectrode: "",
        electrolyte: "",
        electrochemicalType: "",
        cellCode: "",
        projectName: "",
      };
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // getUser().then((response) => {
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加用户";
      //   this.form.password = "123456";
      // });
    },
    // 成功回调
    over() {
      this.handleQuery();
    },
    // 导入
    importData() {
      this.$refs.exportTable.show();
    },
  },
};
</script>
