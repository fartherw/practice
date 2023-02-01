

<template>
  <div class="goods-manager">
    <!-- 操控区 -->
    <div class="handler-box">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handelAdd">
        新增商品
      </el-button>
    </div>

    <!-- 表格区 -->
    <el-table :data="tableData" stripe style="width: 100%" :cell-style="cellStyle" @selection-change="selectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="goodsId" label="商品编号" min-width="12%" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名" min-width="12%" align="center"></el-table-column>

      <el-table-column prop="goodsIntro" label="商品简介" min-width="12%"></el-table-column>

      <el-table-column label="商品图片" min-width="12%">
        <template v-slot="{ row }">
          <el-image :src="row.goodsCoverImg" :preview-src-list="[
            row.goodsCoverImg,
          ]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="stockNum" label="商品库存" min-width="12%"></el-table-column>
      <el-table-column prop="sellingPrice" label="商品售价" min-width="12%"></el-table-column>
      <el-table-column prop="goodsSellStatus" label="上架状态" min-width="12%" :formatter="formmatterState">
      </el-table-column>
      <el-table-column prop="address" label="操作" min-width="16%">
        <!-- //:color=" '#32768' : '#5374207'" -->
        <template v-slot="{ row }">
          <el-link type="primary" @click="handleUpdate(row)">修改</el-link>
          <el-link type="primary" slot="reference" @click="upDown(row)">{{ row.goodsSellStatus === 0 ? '下架' : '上架' }}
          </el-link>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区 -->
    <el-pagination background layout="prev, pager, next" :hide-on-single-page="false" :page-size="pageSize"
      :total="total" :current-page="currentPage" @current-change="changePage"></el-pagination>
  </div>
</template>

<script>

export default {

  data() {
    return {
      //关于表格区域的
      tableData: [],
      tableLoading: false,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      categoryLevel: 1,
      parentId: 0,
      selection: [],
      categoryId: null,
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
        let { resultCode, data } = await this.$api.model.queryGoodsList(currentPage, pageSize);
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
    //上架状态
    formmatterState(row) {

      return row.goodsSellStatus === 0 ? '销售中' : '已下架';
    },
    //上下架状态颜色
    cellStyle(row) {
      if (row.columnIndex !== 7) {
        return 'color:#000'
      }
      if (row.row.goodsSellStatus === 0) {
        return 'color:#008000'
      }
      if (row.row.goodsSellStatus === 1) {
        return "color:#FF0000";
      }

    },
    //点击修改
    handleUpdate(row) {
      this.dialogVisible = true;
      this.$router.push({
        path: '/home/add',
        query: {
          id: row.goodsId,
        }
      })
      this.dialogVisible = false;

    },
    //点击新增
    handelAdd() {
      this.$router.push('/home/add');
    },

    //点击上下架
    async upDown(row) {
      let ids = [];
      if (row.goodsSellStatus === 0 || row.goodsSellStatus === 1) {
        row.goodsSellStatus = row.goodsSellStatus === 0 ? 1 : 0;
        ids.push(row.goodsId);
      }
      try {
        let { resultCode, message } = await this.$api.model.upDown(row.goodsSellStatus, ids);
        if (+resultCode === 200) {
          this.$message.success('修改成功');
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