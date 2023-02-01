<template>
  <div class="goods-manager">
    <!-- 操控区 -->
    <div class=" handler-box">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="unDisable">
        解除禁用
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="disableAccount">
        禁用账户
      </el-button>
    </div>

    <!-- 表格区 -->
    <el-table :data="tableData" stripe style="width: 100%" :cell-style="cellStyle" @selection-change="selectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="nickName" label="昵称" min-width="20%"></el-table-column>
      <el-table-column prop="loginName" label="登录名" min-width="20%"></el-table-column>

      <el-table-column prop="lockedFlag" label="身份状态" min-width="15%" :formatter="formmatterState"></el-table-column>

      <el-table-column prop="isDeleted" label="是否注销" min-width="15%" :formatter="formmatterSta"></el-table-column>
      <el-table-column prop="createTime" label="注册时间" min-width="30%"></el-table-column>
    </el-table>

    <!-- 分页区 -->
    <el-pagination background layout="prev, pager, next" :hide-on-single-page="false" :page-size="pageSize"
      :total="total" :current-page="currentPage" @current-change="changePage"></el-pagination>
  </div>
</template>

<script>

export default {
  name: "classi-fication",
  data() {
    return {
      //关于表格区域的
      tableData: [],
      tableLoading: false,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      lockedFlag: 0,
      selection: [],
      updateTime: null,
    }
  },
  created() {
    this.init();
  },
  methods: {
    /* 关于table表格的 */
    //获取数据
    async init(currentPage, pageSize) {
      this.tableLoading = true;
      currentPage = this.currentPage;
      try {
        let { resultCode, data } = await this.$api.model.queryVipList(currentPage, pageSize);
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
      console.log();

      this.init();
    },
    //身份状态
    formmatterState(row) {
      return row.lockedFlag === 0 ? '正常' : '已禁用';
    },
    //是否注销
    formmatterSta(row) {
      return row.isDeleted === 0 ? '正常' : '已注销';
    },
    //身份状态颜色
    cellStyle(row) {
      if (row.columnIndex !== 3 && row.columnIndex !== 4) {
        return 'color:#000'
      }
      if (row.row.lockedFlag === 0) {
        return 'color:#008000'
      }
      if (row.row.lockedFlag === 1) {
        return "color:#FF0000";
      }

    },
    //解除禁用
    async unDisable() {
      let ids = this.selection.map(item => item.userId);
      let num = this.lockedFlag;
      try {
        let { resultCode, message } = await this.$api.model.disableAccount(num, ids);
        if (+resultCode === 200) {
          this.$message.success('解除成功');
          this.init();
        } else {
          this.$message.error(message);
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    //禁用账户
    async disableAccount() {
      let ids = this.selection.map(item => item.userId);
      console.log(ids);
      this.lockedFlag = 1;
      try {
        let { resultCode, message } = await this.$api.model.disableAccount(this.lockedFlag, ids);
        if (+resultCode === 200) {
          this.$message.success('禁用成功');
          this.init();
        } else {
          this.$message.error(message);
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    selectionChange(val) {
      this.selection = val;
    },
  }
};
</script>

<style lang="less" scoped>
.goods-manager {
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  padding-bottom: 20px;
  margin-bottom: 50px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

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

:deep(.el-input-number) {
  width: auto;
  position: static;
}

:deep(.el-input-number) {
  width: 100%;
}
</style>