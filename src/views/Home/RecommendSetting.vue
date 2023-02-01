<template>
  <div class="recommend-setting">
    <div class="app">
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
      <el-table :data="tableData" stripe style="width: 100%" @selection-change="selectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="configName" label="商品名称" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="redirectUrl" label="跳转连接" min-width="20%" align="center">
          <template v-slot="{ row }">
            <a href="">{{ row.redirectUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="configRank" label="排序值" min-width="10%"></el-table-column>
        <el-table-column prop="goodsId" label="商品编号" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="20%" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="address" label="操作" min-width="20%">
          <template v-slot="{ row }">
            <el-link type="primary" @click="handleUpdate(row)">修改</el-link>
            <el-popconfirm title="确定删除吗？" @confirm="handleRemove(row.goodsId)">
              <el-link type="danger" slot="reference">删除</el-link>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :page-size="pageSize"
        :total="total" :current-page="currentPage" @current-change="changePage"></el-pagination>
    </div>

    <!-- 修改弹框 -->
    <el-dialog :title="`${ruleFrom.goodsId ? '修改' : '添加'}商品`" :visible.sync="dialogVisible" width="30%"
      :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose">

      <el-form label-width="100px" :model="ruleFrom" :rules="rules" ref="fromIns">
        <el-form-item label="商品名称" prop="configName">
          <el-input v-model.trim="ruleFrom.configName"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="redirectUrl">
          <el-input v-model.trim="ruleFrom.redirectUrl"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsId">
          <el-input-number v-model.trim="ruleFrom.goodsId" controls-position="right" :min="0">
          </el-input-number>
        </el-form-item>
        <el-form-item label="排序值" prop="configRank">
          <el-input-number v-model.trim="ruleFrom.configRank" controls-position="right" :min="0" :max="200"
            @click="move">
          </el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="Submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "@/assets/utils"
export default {
  name: "recommend-setting",
  data() {
    return {
      //关于表格区域的
      tableData: [],
      tableLoading: false,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      configType: 1,
      selection: [],
      configId: null,
      updateTime: null,
      //Dialog表单相关的
      dialogVisible: false,
      carouselId: null,
      ruleFrom: {
        configName: "",
        redirectUrl: "",
        goodsId: null,
        configRank: ""
      },
      rules: {
        configName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        redirectUrl: [{ required: true, message: '跳转链接不能为空', trigger: 'blur' }],
        goodsId: [{ required: true, message: '商品编号不能为空', trigger: 'blur' }],
        configRank: [{ required: true, message: '排序值不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    /* 关于table表格的 */
    //获取数据
    async init() {
      this.tableLoading = true;
      try {
        let { resultCode, data } = await this.$api.ProductSetting.queryRecommendList(this.currentPage, this.pageSize);
        if (+resultCode === 200) {
          let { totalCount, list } = data;
          this.total = +totalCount;
          this.tableData = list;
          this.tableLoading = false;
          return;
        }
      } catch (_) {
        console.log('错误：', _);
      }
      this.tableData = [];
      this.total = 0;
      this.tableLoading = false;
    },
    //点击分页
    changePage(num) {
      this.currentPage = num;
      this.init();
    },
    //时间格式化
    formatterTime(row) {
      return _.formatTime(row.createTime, '{1}-{2} {3}:{4}');
    },
    //删除
    async handleRemove(id) {
      let ids = [];
      if (id) {
        //单一删除
        ids.push(id)
      } else {
        //批量删除
        ids = this.selection.map(item => item.goodsId)
      }
      if (ids.length === 0) {
        this.$message.warning('请至少选择一项删除！');
        return;
      }
      try {
        let { resultCode } = await this.$api.ProductSetting.removeRecommend(ids);
        console.log(resultCode);
        console.log(ids);
        if (+resultCode === 200) {
          this.$message.success('恭喜您，删除成功！');
          this.init();
        } else {
          this.$message.error('删除失败，请稍后再试！');
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    //点击修改
    async handleUpdate(row) {
      this.dialogVisible = true;
      try {
        let { resultCode, data } = await this.$api.ProductSetting.infoRecommend(row.configId);
        if (+resultCode === 200) {
          this.ruleFrom = data;
          this.configId = data.configId;
          this.updateTime = data.updateTime;
          return;
        }
        this.$message.error('获取失败！')
      } catch (_) {
        console.log('错误：', _);
      }
    },

    selectionChange(val) {
      this.selection = val;
    },
    /* 关于Dialog的 */
    //关闭弹窗
    handleClose() {
      this.$refs.fromIns.resetFields();
      this.ruleFrom = {
        configName: "",
        redirectUrl: "",
        goodsId: 0,
        configRank: 0,
      }
      this.dialogVisible = false;
    },
    //添加
    async Submit() {
      try {
        await this.$refs.fromIns.validate();
        //添加
        let fun = this.$api.ProductSetting.addRecommend,
          data = { ...this.ruleFrom };

        //修改
        if (data.goodsId) {
          fun = this.$api.ProductSetting.updataRecommend;
          data.configId = this.configId;
          data.createTime = this.updateTime;
        }
        data.configType = 5;
        let { resultCode } = await fun(data)

        if (+resultCode === 200) {
          this.handleClose();
          this.$message.success('恭喜您，操作成功！');
          this.init();
          return;
        } else {
          this.$message.error('操作失败，请稍后再试！');
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    handleChange(value) {
      console.log(value);
    },
    move() {
      // this.flag = true;
    }
  }

};
</script>

<style lang="less" scoped>
.recommend-setting {
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 50px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

  .app {

    .handler-box {
      z-index: 999;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #ebeef5;

      .el-button {
        margin-right: 10px;
      }
    }

    a {
      color: #409EFF;
    }

    .el-pagination {

      z-index: 999;
      display: flex;
      align-items: center;
      height: 40px;
      margin-top: 20px;
      justify-content: center;
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
}

:deep(.el-input-number) {
  width: auto;
  position: static;
}

:deep(.el-input-number) {
  width: 100%;
}
</style>