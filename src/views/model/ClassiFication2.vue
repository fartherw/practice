<template>
  <div class="classi-fication">
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
      <el-table-column prop="categoryName" label="分类名称" min-width="10%" align="center"></el-table-column>
      <el-table-column prop="categoryRank" label="排序值" min-width="25%" align="center"></el-table-column>
      <el-table-column prop="createTime" label="添加时间" min-width="25%" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="address" label="操作" min-width="30%">

        <template v-slot="{ row }">
          <el-link type="primary" @click="handleUpdate(row)">修改</el-link>
          <el-link type="primary" @click="nextClassify(row)">下级分类</el-link>

          <el-popconfirm title="确定删除吗？" @confirm="handleRemove(row.categoryId)">
            <el-link type="danger" slot="reference">删除</el-link>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区 -->
    <el-pagination background layout="prev, pager, next" :hide-on-single-page="false" :page-size="pageSize"
      :total="total" :current-page="currentPage" @current-change="changePage"></el-pagination>


    <!-- 修改弹框 -->
    <el-dialog :title="`${ruleFrom.goodsId ? '修改' : '添加'}商品`" :visible.sync="dialogVisible" width="30%"
      :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose">

      <el-form label-width="100px" :model="ruleFrom" :rules="rules" ref="fromIns">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model.trim="ruleFrom.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="categoryRank">
          <el-input-number v-model.trim="ruleFrom.categoryRank" controls-position="right" :min="0" :max="200"
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
      categoryLevel: 1,
      parentId: 0,
      selection: [],
      categoryId: null,
      updateTime: null,
      //Dialog表单相关的
      dialogVisible: false,
      carouselId: null,
      ruleFrom: {
        categoryName: "",
        categoryRank: ""
      },
      rules: {
        categoryName: [{ required: true, message: '分类名不能为空', trigger: 'blur' }],
        categoryRank: [{ required: true, message: '排序值不能为空', trigger: 'blur' }],
      }
    }
  },
  props: {
    parentsId: {
      type: Number,
      default: 0,
    },
    categoryLevels: {
      type: Number,
      default: 1,
    }
  },
  created() {
    this.parentId = this.$route.query.parentsId;
    this.categoryLevel = this.$route.query.categoryLevels;
    this.init(this.currentPage, this.pageSize, this.categoryLevel, this.parentId);
  },
  methods: {
    /* 关于table表格的 */
    //获取数据
    async init(currentPage, pageSize, categoryLevel, parentId) {

      this.tableLoading = true;
      currentPage = this.currentPage;
      try {
        let { resultCode, data } = await this.$api.model.queryList(currentPage, pageSize, 2, parentId);
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

      this.init(this.currentPage, this.pageSize, this.categoryLevel, this.parentId);
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
        ids = this.selection.map(item => item.categoryId)

      }
      console.log(ids);
      if (ids.length === 0) {
        this.$message.warning('请至少选择一项删除！');
        return;
      }
      try {
        let { resultCode } = await this.$api.model.removeClassify(ids);
        console.log(resultCode);
        if (+resultCode === 200) {
          this.$message.success('恭喜您，删除成功！');
          this.init(this.currentPage, this.pageSize, this.categoryLevel, this.parentId);
        } else {
          this.$message.error('删除失败，请稍后再试！');
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },
    //下级分类
    nextClassify(row) {
      if (row.categoryLevel >= 3) {
        this.$message.error('没有下一级！');
        return;
      }
      this.$router.push({
        path: '/home/classification/level3',
        name: '/home/classification/level3',
        query: {
          parentsId: row.categoryId,
          categoryLevels: row.categoryLevel + 1
        }
      })
    },
    //点击修改
    async handleUpdate(row) {
      this.dialogVisible = true;
      try {
        let { resultCode, data } = await this.$api.model.classifyInfo(row.categoryId);
        if (+resultCode === 200) {
          this.ruleFrom = data;
          this.categoryId = data.categoryId;
          this.categoryLevel = data.categoryLevel;
          this.parentId = data.parentId;
          this.createTime = data.updateTime;
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
        categoryName: "",
        categoryRank: 0,

      }
      this.dialogVisible = false;
    },
    //添加
    async Submit() {
      try {
        await this.$refs.fromIns.validate();
        //添加
        let fun = this.$api.model.addClassify,
        data = { ...this.ruleFrom };

        //修改
        if (this.categoryId) {
          fun = this.$api.model.updataClassify;
          data.categoryId = this.categoryId;
          data.createTime = this.updateTime;
        }
        data.categoryLevel = this.categoryLevel;
        data.parentId = this.parentId;

        let { resultCode } = await fun(data)
        if (+resultCode === 200) {
          this.handleClose();
          this.$message.success('恭喜您，操作成功！');
          this.init(this.currentPage, this.pageSize, this.categoryLevel, this.parentId);
          return;
        } else {
          this.$message.error('操作失败，请稍后再试！');
        }
      } catch (_) {
        console.log('错误：', _);
      }
    },

    move() {
      // this.flag = true;
    }
  }
};
</script>

<style lang="less" scoped>
.classi-fication {
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