<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="460px"
      :footer="null"
      top="-30vh"
    >
      <div v-loading="loading" class="uploadClass">
        <el-upload
          :class="filtTypeShow ? 'upload-demo' : 'upload-demoDel'"
          drag
          ref="upload"
          name="multipartFile"
          :accept="accept"
          :on-success="onSuccess"
          :on-error="onError"
          :before-upload="before"
          :action="httpUrl"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <div class="el-upload__text columnCC" style="height: 100%">
            <i class="el-icon-upload"></i>
            <em>点击上传文件</em>
          </div> -->
        </el-upload>
        <div class="upload-size rowCC">
          <span v-if="filtTypeShow">请上传.xls,.xlsx格式文件</span>
          <span v-else>文件格式不符合规则，请确认后重新上传</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
function isJSON(str) {
  if (typeof str == "string") {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

export default {
  name: "exportTablePin",
  props: {
    uploadUrl: {
      type: String,
      default: "/battery/import",
    },
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      dialogVisible: false,
      loading: false,
      msg: [1],
      accept: ".xls,.xlsx",
      filtTypeShow: true,
      httpUrl: process.env.VUE_APP_BASE_API + this.uploadUrl,
    };
  },
  created() {
    this.httpUrl = process.env.VUE_APP_BASE_API + this.uploadUrl;
  },
  methods: {
    show() {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      this.msg = [1];
      this.dialogVisible = true;
    },
    // 文件上传前的格式校验
    before(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (this.accept != "" && !this.accept.includes(fileSuffix)) {
        this.$message.warning(`请上传格式为 ${this.accept} 的文件`);
        this.filtTypeShow = false;
        return false;
      }

      this.loading = true;
      this.filtTypeShow = true;
      return true;
    },
    onSuccess(response) {
      if (response.code != 200) {
        if (isJSON(response.msg)) {
          this.msg = JSON.parse(response.msg).message;
        } else {
          this.msg = [response.msg];
        }

        this.$message.info(response.msg);
        this.$refs.upload.clearFiles();
      } else if (response.code == 200) {
        this.msg = [];
        this.$message.success("导入成功");
        this.dialogVisible = false;
        this.$emit("over");
      }

      this.loading = false;
    },
    onError() {
      this.loading = false;
      this.$message.error("导入格式有误，请检查后上传");
      this.$refs.upload.clearFiles();
    },
    // 重新上传
    reUpload() {
      console.log("重新上传");
    },
    // 删除
    delUpload() {
      console.log("删除");
    },
  },
};
</script>

<style scoped lang="scss">
.upload-demo,
.upload-demoDel {
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 140px;
      //   padding: 15px;
    }
  }
}
.upload-demoDel {
  ::v-deep .el-upload-dragger {
    border: 1px dashed #e34d59;
  }
}
.uploadClass {
  padding-bottom: 20px;
}
.upload-size {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  margin: 10px 0 22px 0;
}
</style>
