<template>
  <el-dialog
    :title="title"
    :visible.sync="showForm"
    :before-close="handleCancel"
    @open="handleOpen"
    width="500px"
    destroy-on-close
    top="0"
  >
    <div v-loading="loading">
      <slot name="content" :data="dataInfo"></slot>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" class="cancel-btn">取消</el-button>
      <el-button type="primary" @click="handleCommit">{{
        buttonText
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "YhDialog",
  components: {},
  props: {
    // 是否显示新增或者编辑弹窗
    title: {
      type: String,
      default: "",
    },
    // 是否显示弹框
    showForm: {
      type: Boolean,
      default: false,
    },
    // 按钮名称
    buttonText: {
      type: String,
      default: "查询",
    },
  },

  data() {
    return {
      dataInfo: {},
      loading: false,
    };
  },

  methods: {
    // 监听弹窗打开
    handleOpen() {
      // this.dataInfo = {};
    },
    // 清除
    cancel() {
      this.dataInfo = {};
    },
    // 取消
    handleCancel() {
      this.$emit("update:showForm", false);
    },
    // 确认
    handleCommit() {
      this.$emit("search", this.dataInfo);
    },
  },
};
</script>

<style lang="scss" scoped></style>
