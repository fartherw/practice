<template>
    <div class="order-manager">

        <el-col :span="8" class="card">
            <el-card shadow="hover" class="card-item">
                <p>订单状态</p>
                <p>{{ this.orderStatusString }}</p>
            </el-card>
            <el-card shadow="hover" class="card-item">
                <p>创建时间</p>
                <p>{{ this.createTime }}</p>
            </el-card>
            <el-card shadow="hover" class="card-item">
                <p>订单号</p>
                <p>{{ this.orderNo }}</p>
            </el-card>
        </el-col>
        <!-- 表格区 -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="goodsCoverImg" label="商品图片" min-width="16%">
                <template v-slot="{ row }">
                    <el-image :src="row.goodsCoverImg" :preview-src-list="[
                        row.goodsCoverImg,
                    ]"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="goodsId" label="商品编号" min-width="14%"></el-table-column>

            <el-table-column prop="goodsName" label="商品名" min-width="14%">
            </el-table-column>

            <el-table-column prop="goodsCount" label="商品数量" min-width="14%">
            </el-table-column>
            <el-table-column prop="sellingPrice" label="价格" min-width="16%"></el-table-column>
        </el-table>
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
            orderStatusString: null,//待支付
            createTime: '',//创建时间
            orderNo: '',//订单号
        }
    },
    props: {
        ids: {
            type: Number,
            default: 0,
        },
    },
    created() {
        let id = this.$route.query.ids
        this.init(id);
    },
    methods: {
        /* 关于table表格的 */
        //获取数据
        async init(id) {
            this.tableLoading = true;

            try {
                let { resultCode, data } = await this.$api.model.orderInfo(id);
                if (+resultCode === 200) {
                    let { newBeeMallOrderItemVOS } = data;
                    this.orderStatusString = data.orderStatusString;
                    this.createTime = data.createTime;
                    this.orderNo = data.orderNo;
                    this.tableData = newBeeMallOrderItemVOS;
                    this.tableLoading = false;
                    return;
                }
            } catch (_) {
                console.log('错误：', _);
            }
            this.tableData = [];
            this.tableLoading = false;
        },

    }
};
</script>
  
<style lang="less" scoped>
.order-manager {
    position: relative;
    box-sizing: border-box;
    padding: 20px;
    padding-bottom: 20px;
    margin-bottom: 50px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

    .card {
        width: 100%;
        margin-bottom: 50px;
        display: flex;

        .card-item {
            flex: 1;
            margin: 0 10px;

            /deep/.el-card__body {
                padding: 0;
            }

            p {
                padding: 18px 20px;
                font-size: 16px;
                border-bottom: 1px solid #ebeef5;
            }

        }
    }



    .el-table {
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #ebeef5;
    }

    .el-image {
        display: block;
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