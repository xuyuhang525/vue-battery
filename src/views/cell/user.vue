<template>
  <!-- 充放电管理-->
  <div class="app-container">
    <div class="rowBC" style="margin-bottom: 20px">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="用户名称：">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
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
            type="primary"
            icon="el-icon-plus"
            size="mini"
            v-if="userId == 1"
            @click="add"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      v-loading="loading"
      border
    >
      <el-table-column prop="nickName" label="用户昵称"> </el-table-column>
      <el-table-column prop="name" label="用户名称"> </el-table-column>
      <el-table-column prop="password" label="用户密码"> </el-table-column>
      <el-table-column prop="job" label="备注"> </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
        v-if="userId == 1"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageCurrent"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <yh-dialog
      ref="details"
      :showForm.sync="show"
      :title="title"
      buttonText="确定"
      @search="searchDialog"
    >
      <template v-slot:content="{ data }">
        <el-form
          ref="postForm"
          :rules="rules"
          :model="data"
          label-width="120px"
        >
          <el-form-item label="用户昵称：">
            <el-input
              v-model="data.nickName"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名称：" prop="name">
            <el-input
              v-model="data.name"
              style="width: 300px"
              placeholder="请输入"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码：" prop="password">
            <el-input
              v-model="data.password"
              style="width: 300px"
              placeholder="请输入"
              type="password"
              maxlength="20"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="data.job"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </yh-dialog>
  </div>
</template>

<script>
import { getUserPage, addUser, delUser, updateUser } from "@/api/Cell/user";
import YhDialog from "@/components/Echarts/components/dialog";
export default {
  components: { YhDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      queryParams: {
        pageCurrent: 1,
        pageSize: 10,
        userName: "",
      },
      tableData: [],
      show: false,
      title: "新增人员管理",
      rules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      userId: "",
    };
  },
  mounted() {
    this.userId = localStorage.getItem("ID");
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getUserPage(this.queryParams).then((response) => {
        this.tableData = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 弹框回调
    searchDialog(form) {
      this.$refs["postForm"].validate((valid) => {
        if (valid) {
          if (form.id != undefined) {
            updateUser(form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.$refs.details.cancel();
              this.show = false;
              this.getList();
            });
          } else {
            addUser(form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$refs.details.cancel();
              this.show = false;
              this.getList();
            });
          }
        } else {
          return false;
        }
      });
    },
    // 新增
    add() {
      this.$refs.details.cancel();
      this.show = true;
    },
    // 修改
    handleUpdate(item) {
      this.$refs.details.cancel();
      this.show = true;
      let data = JSON.stringify(item);

      this.$refs.details.dataInfo = JSON.parse(data);
      console.log(item, "-------");
    },
    // 搜索
    handleQuery() {
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除用户" + row.nickName)
        .then(function () {
          return delUser(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped lang="scss"></style>
