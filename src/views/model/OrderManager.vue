<template>
  <div class="order-manager">
    <!-- 操控区 -->
    <div class="handler-box">
      <el-input class="input" v-model="numValue" size="small" placeholder="请输入订单号" clearable @change="searchNum">
      </el-input>

      <el-select class="input" v-model="value" size="small" @change="selectChange">
        <el-option v-for="item in orderValue" :key="item.value" :label="item.label" :value="item.value">{{ item.label }}
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-s-home" size="small" @click="OrderSucc()">
        配货完成
      </el-button>
      <el-button type="primary" icon="el-icon-s-home" size="small" @click="Issue()">
        出库
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="handleUpdate()">
        关闭订单
      </el-button>
    </div>

    <!-- 表格区 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="16%"></el-table-column>
      <el-table-column prop="totalPrice" label="订单总价" min-width="14%"></el-table-column>

      <el-table-column prop="orderStatus" label="订单状态" min-width="14%" :formatter="formmatterOrderState">
      </el-table-column>

      <el-table-column prop="payStatus" label="支付方式" min-width="14%" :formatter="formmatterState"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="16%"></el-table-column>
      <el-table-column prop="address" label="操作" min-width="25%">
        <template v-slot="{ row }">
          <el-popconfirm title="确定配货完成吗？" @confirm="OrderSucc(row.orderId)" v-if="row.orderStatus === 1 ? true : false">
            <el-link type="primary" slot="reference">
              配货完成</el-link>
          </el-popconfirm>
          <el-popconfirm title="确定出库吗？" @confirm="Issue(row.orderId)" v-if="row.orderStatus === 2 ? true : false">
            <el-link type="primary" slot="reference">
              出库</el-link>
          </el-popconfirm>
          <el-popconfirm title="确定关闭订单吗？" @confirm="handleUpdate(row.orderId)">
            <el-link type="primary" slot="reference" v-if="!([-1, -2, -3, 4].includes(+row.orderStatus))">关闭订单</el-link>
          </el-popconfirm>
          <el-link type="primary" @click="orderInfo(row.orderId)">订单详情</el-link>
        </template>
      </el-table-column>
    </el-table>
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
      value: 0,
      parentId: 0,
      selection: [],
      categoryId: null,
      // orderStatus: null,
      numValue: null,
      orderValue: [{
        value: null,
        label: '全部'
      }, {
        value: -3,
        label: '商家关闭'
      }, {
        value: -2,
        label: '超时关闭'
      }, {
        value: -1,
        label: '手动关闭'
      }, {
        value: 0,
        label: '待支付'
      }, {
        value: 1,
        label: '已支付'
      }, {
        value: 2,
        label: '配货完成'
      }, {
        value: 3,
        label: '出库成功'
      }, {
        value: 4,
        label: '交易成功'
      }],
      value: null,
    }
  },
  created() {
    this.init();
  },
  methods: {
    /* 关于table表格的 */
    //获取数据
    async init(currentPage, pageSize, orderNo, orderStatus) {
      this.tableLoading = true;
      currentPage = this.currentPage;
      try {
        let { resultCode, data } = await this.$api.model.queryOrderList(currentPage, pageSize, orderNo, orderStatus);
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
    //支付方式状态
    formmatterState(row) {

      return row.payStatus === 0 ? '未支付' : '微信支付';
    },
    //订单状态  
    formmatterOrderState(row) {
      switch (row.orderStatus) {
        case -3:
          return '商家关闭';

        case -2:
          return '超时关闭';
        case -1:
          return '手动关闭';

        case 0:
          return '待支付';

        case 1:
          return '已支付';

        case 2:
          return '配货完成';
        case 3:
          return '出库成功';
        case 4:
          return '交易成功';
        default:
          break;
      }
    },
    //关闭订单
    async handleUpdate(id) {
      let ids = [];
      if (id) {
        //单独
        ids.push(id)
      } else {
        //批量
        ids = this.selection.map(item => item.orderId)
      }
      if (ids.length === 0) {
        this.$message.warning('请选择项！');
        return;
      }
      try {
        let { resultCode, message } = await this.$api.model.colseOrder(ids);
        if (+resultCode === 200) {
          this.$message.success('操作成功');
          this.init();
        } else {
          this.$message.error(message);
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    //通过订单状态搜索
    selectChange() {
      this.init(this.currentPage, this.pageSize, this.numValue, this.value)
    },
    //通过订单号搜索
    searchNum() {
      this.init(this.currentPage, this.pageSize, this.numValue)
    },
    //出库
    async Issue(id) {
      let ids = [];
      if (id) {
        //单独
        ids.push(id)
      } else {
        //批量
        ids = this.selection.map(item => item.orderId)
      }
      if (ids.length === 0) {
        this.$message.warning('请选择项！');
        return;
      }
      try {
        let { resultCode, message } = await this.$api.model.checkOut(ids);
        if (+resultCode === 200) {
          this.$message.success('出库成功');
          this.init();
        } else {
          this.$message.error(message);
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    //配货完成
    async OrderSucc(id) {
      let ids = [];
      if (id) {
        //单独
        ids.push(id)
      } else {
        //批量
        ids = this.selection.map(item => item.orderId)
      }
      if (ids.length === 0) {
        this.$message.warning('请选择项！');
        return;
      }
      try {
        let { resultCode, message } = await this.$api.model.OrderSuccess(ids);
        if (+resultCode === 200) {
          this.$message.success('出库成功');
          this.init();
        } else {
          this.$message.error(message);
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    //订单详情
    orderInfo(id) {
      this.$router.push({
        path: '/home/order_detail',
        name: '/home/order_detail',
        query: {
          ids: id
        }
      });
    },
    // 选中
    selectionChange(val) {
      this.selection = val;
    },
  }
};
</script>

<style lang="less" scoped>
.order-manager {
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

    .input {
      margin-right: 10px;
      width: 208px;
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

/deep/.el-input__inner {
  border-radius: 4px !important;
}

:deep(.el-input-number) {
  width: 100%;
}
</style>