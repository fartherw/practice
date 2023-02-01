<template>
  <div class="banner-setting">
    <!-- 操控区 -->
    <div class="handler-box">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogVisible = true">
        新增
      </el-button>

      <el-popconfirm title="确定要删除这些选中的数据吗？" @confirm="handleRemove">
        <el-button type="danger" icon="el-icon-delete" size="small" slot="reference">
          批量删除
        </el-button>
      </el-popconfirm>
    </div>

    <!-- 表格区 -->
    <el-table :data="tableData" v-loading="false" height="100%" stripe @selection-change="selectionChange">
      <el-table-column type="selection" min-width="5%" align="center"></el-table-column>
      <el-table-column label="轮播图" min-width="15%">
        <template v-slot="{ row }">
          <el-image :src="row.carouselUrl" :preview-src-list="[
            row.carouselUrl,
          ]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="跳转连接" min-width="30%" show-overflow-tooltip prop="redirectUrl"></el-table-column>
      <el-table-column label="排序值" min-width="10%" align="center" prop="carouselRank"></el-table-column>
      <el-table-column label="添加时间" min-width="20%" :formatter="formatterTime"></el-table-column>
      <el-table-column label="操作" min-width="20%">
        <template v-slot="{ row }">
          <el-link type="success" @click="handleUpdate(row)">修改</el-link>
          <el-popconfirm title="确定要删除本条数据吗？" @confirm="handleRemove(row.carouselId)">
            <el-link type="primary" slot="reference">删除</el-link>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区 -->
    <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :page-size="pageSize"
      :total="total" :current-page="currentPage" @current-change="paginationChange"></el-pagination>

    <!-- 新增/修改 -->
    <el-dialog width="30%" :title="`${carouselId ? '修改' : '添加'}轮播图`" :visible="dialogVisible"
      :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialog">

      <el-form label-width="100px" :rules="rules" :model="ruleFrom" ref="fromIns">
        <el-form-item label="轮播图图片" prop="carouselUrl">
          <el-upload class="avatar-uploader" action="" accept=".jpg,.jpeg,.png,.gif" :show-file-list="false"
            :multiple="false" :http-request="uploadImg">

            <img v-if="ruleFrom.carouselUrl" :src="ruleFrom.carouselUrl" class="avatar-uploader-img" alt="" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转连接" prop="redirectUrl">
          <el-input v-model.trim="ruleFrom.redirectUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="carouselRank">
          <el-input-number v-model.trim="ruleFrom.carouselRank" :min="0" :max="200"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <my-button type="primary" @click="submit">确认提交信息</my-button>
        <el-button @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import _ from "@/assets/utils"
export default {
  name: "banner-setting",
  data() {
    const validateRedirect = (_, value, callback) => {
      if (!value) return callback(new Error('地址不能为空'));
      let reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;
      if (!reg.test(value)) return callback(new Error('地址格式不正确！'));
      callback();
    };
    const validateRank = (_, value, callback) => {
      if (!value) return callback(new Error('排序值不能为空'));
      let reg = /^\d+$/;
      if (!reg.test(value) || value < 1 || value > 200) return callback(new Error('排序值是1~200之间的整数'));
      callback();
    }
    return {
      //关于表格区域的
      tableData: [],
      tableLoading: false,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      selection: [],
      //Dialog表单相关的
      dialogVisible: false,
      carouselId: null,
      ruleFrom: {
        carouselUrl: '',
        redirectUrl: 'https://www.baidu.com',
        carouselRank: 1
      },
      rules: {
        carouselUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        redirectUrl: [{ required: true, validator: validateRedirect, trigger: 'blur' }],
        carouselRank: [{ required: true, validator: validateRank, trigger: 'blur' }],
      },

    }
  },
  created() {
    this.init();
  },
  methods: {
    /* 表格相关的方法 */
    //根据分页信息，获取轮播图列表
    async init() {
      this.tableLoading = true;
      try {
        let { resultCode, data } = await this.$api.carousels.queryList(this.currentPage, this.pageSize);
        if (+resultCode === 200) {
          let { totalCount, list } = data;
          this.total = +totalCount;
          this.tableData = list;
          this.tableLoading = false;
          return;
        }
      } catch (_) {
        console.log('错误:', _);
      }
      this.tableData = [];
      this.total = 0;
      this.tableLoading = false;
    },
    //分页器改变
    paginationChange(num) {
      this.currentPage = num;
      this.init()
    },
    //时间格式化
    formatterTime(row) {
      return _.formatTime(row.createTime, '{0}-{1}-{2}');
    },

    /* 表单相关的 */
    //关闭弹出层
    closeDialog() {
      this.$refs.fromIns.resetFields();
      this.ruleFrom = {
        carouselUrl: "",
        redirectUrl: "http://www.baidu.com",
        carouselRank: 1,
      }
      this.carouselId = null;
      this.dialogVisible = false;

    },
    //新增/修改轮播图信息
    async submit() {
      try {
        await this.$refs.fromIns.validate();

        let func = this.$api.carousels.insert,
          data = { ...this.ruleFrom };

        if (this.carouselId) {
          func = this.$api.carousels.update;
          data.carouselId = this.carouselId;
        }
        let { resultCode } = await func(data)
        if (+resultCode === 200) {
          this.closeDialog();
          this.$message.success('恭喜您，操作成功');
          this.init();
          return;
        } else {
          this.$message.error('操作失败，请稍后再试！');
        }

      } catch (_) {
        console.log('错误：', _);
      }

    },
    //自定义上传图片
    async uploadImg({ file }) {
      try {

        let { resultCode, data } = await this.$api.upload(file);
        if (+resultCode === 200) {
          this.ruleFrom.carouselUrl = data;
          return;
        }
      } catch (_) {
        console.log('错误：', _);
      }
      this.$message.error('图片上传失败，请稍后再试！');
    },
    //点击修改
    async handleUpdate(row) {
      this.dialogVisible = true;
      this.carouselId = row.carouselId;
      console.log(row);
      this.ruleFrom = {
        carouselUrl: row.carouselUrl,
        redirectUrl: row.redirectUrl,
        carouselRank: row.carouselRank,
      }
    },
    //删除操作
    async handleRemove(id) {
      let ids = [];
      if (id) {
        //单一删除
        ids.push(id)
      } else {
        //批量删除
        ids = this.selection.map(item => item.carouselId);
      }
      if (ids.length === 0) {
        this.$message.warning('请至少选中一项删除！');
        return;
      }

      try {
        let { resultCode } = await this.$api.carousels.remove(ids);
        if (+resultCode === 200) {
          this.$message.success('恭喜您，删除成功！');
          this.init();
        } else {
          this.$message.error('删除失败，请稍后再试！')
        }
      } catch (_) {
        console.log('错误：', _);
      }

    },
    selectionChange(val) {
      this.selection = val;
    }
  },
};
</script>

<style lang="less" scoped>
.banner-setting {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 40px 0;

  .handler-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;

    .el-button {
      margin-right: 10px;
    }
  }

  .el-pagination {
    z-index: 999;
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 20px;
    justify-content: center;
    padding-bottom: 60px;
  }

  .el-table {
    box-sizing: border-box;
    width: 100%;
  }

  .el-image {
    display: block;
    width: 50px;
    height: 50px;
  }

  .el-link {
    margin-right: 10px;
  }

  /deep/.el-dialog__body {
    padding: 10px 20px;
  }

  /deep/.el-upload {
    display: block;
  }

  .avatar-uploader-icon,
  .avatar-uploader-img {
    display: block;
    box-sizing: border-box;
    width: 120px;
    height: 120px;
    line-height: 120px;
    font-size: 24px;
    color: #8c939d;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
}
</style>