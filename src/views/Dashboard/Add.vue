<template>
    <div class="Add">
        <el-form ref="fromIns" :rules="rules" :model="ruleFrom" label-width="80px">
            <el-form-item label="商品分类">
                <div class="block">
                    <el-cascader :props="props" v-model="tabVal"></el-cascader>
                </div>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsName">
                <el-input placeholder="请输入商品名称" v-model.trim="ruleFrom.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="商品简介" prop="goodsIntro">
                <el-input type="textarea" placeholder="请输入商品简介（100字）" v-model.trim="ruleFrom.goodsIntro"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="originalPrice">
                <el-input-number controls-position="right" :min="0" v-model="num" placeholder="请输入商品价格"
                    v-model.trim="ruleFrom.originalPrice">
                </el-input-number>
            </el-form-item>
            <el-form-item label="商品售卖价" prop="sellingPrice">
                <el-input-number controls-position="right" placeholder="请输入商品售价" :min="0" v-model="num2"
                    v-model.trim="ruleFrom.sellingPrice">
                </el-input-number>
            </el-form-item>
            <el-form-item label="商品库存" prop="stockNum">
                <el-input-number controls-position="right" :min="0" placeholder="请输入商品库存" v-model="num3"
                    v-model.trim="ruleFrom.stockNum">
                </el-input-number>
            </el-form-item>
            <el-form-item label="商品标签" prop="tag">
                <el-input placeholder="请输入商品小标签" v-model.trim="ruleFrom.tag"></el-input>
            </el-form-item>
            <el-form-item label="上架状态" prop="goodsSellStatus">
                <template>
                    <el-radio-group v-model.trim="ruleFrom.goodsSellStatus">
                        <el-radio :label="0">上架</el-radio>
                        <el-radio :label="1">下架</el-radio>
                    </el-radio-group>
                </template>
            </el-form-item>

            <el-form-item label="商品主图" prop="goodsCoverImg">
                <el-upload class="avatar-uploader" action="" accept=".jpg,.jpeg,.png,.gif" :show-file-list="false"
                    :multiple="false" :http-request="uploadImg">

                    <img v-if="ruleFrom.goodsCoverImg" :src="ruleFrom.goodsCoverImg" class="avatar-uploader-img"
                        alt="" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="详情内容" prop="goodsDetailContent">
                <div class="editor-container">

                    <vue-editor id="editor" useCustomImageHandler @imageAdded="handleImageAdded"
                        v-model.trim="ruleFrom.goodsDetailContent">
                        <!-- <img v-if="file.url" :src="file.url" class="avatar-uploader-img" alt="" /> -->
                    </vue-editor>
                </div>
            </el-form-item>
            <el-button type="primary" @click="submit">立即创建</el-button>
        </el-form>
    </div>
</template>
   
<script>
import { VueEditor } from "vue2-editor/dist/vue2-editor.core.js";

export default {
    name: "Add",
    data() {
        let that = this;
        return {
            radio: 0,
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            content: '请输入正文',
            flag: true,
            //计数器
            num: 0,
            num2: 0,
            num3: 0,
            ruleFrom: {
                goodsIntro: "",
                goodsName: "",
                originalPrice: "",
                sellingPrice: "",
                stockNum: "",
                tag: "",
                goodsSellStatus: "",
                goodsCoverImg: "",
                goodsDetailContent: "",
            },
            goodsCategoryId: null,
            goodsId: null,
            tabVal: [],
            rules: {
                goodsName: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
                originalPrice: [{ required: true, message: '请填写商品价格', trigger: 'blur' }],
                sellingPrice: [{ required: true, message: '请填写商品售价', trigger: 'blur' }],
                stockNum: [{ required: true, message: '请填写商品库存', trigger: 'blur' }],
                goodsCoverImg: [{ required: true, message: '请上传主图', trigger: 'blur' }],
            },
            options: [],
            props: {
                lazy: true,
                async lazyLoad(node, resolve) {
                    const { level } = node;
                    try {
                        let { resultCode, data } = await that.$api.dashboard.queryGoodsClassify(1, 1000, node.level + 1, node.value);

                        if (+resultCode === 200) {
                            that.options = data.list;
                        } else {
                            that.$message.error('null')
                        }
                    } catch (_) {
                        console.log('错误：', _);
                    }
                    const nodes = that.options.map(item => ({
                        value: item.categoryId,
                        label: item.categoryName,
                        leaf: level >= 2
                    }));
                    // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                    resolve(nodes);
                }
            },

        };
    },
    props: {
        id: {
            type: Number,
            default: 0,
        }
    },
    async created() {
        let ids = this.$route.query.id
        if (ids) {
            this.init(ids);
        }

    },
    methods: {
        async init(ids) {
            try {
                let { resultCode, data } = await this.$api.model.queryGoodsInfo(ids);
                if (+resultCode === 200) {
                    let { goods } = data;
                    this.goodsCategoryId = goods.goodsCategoryId;
                    this.goodsId = goods.goodsId;
                    this.ruleFrom = goods;
                    this.tabVal.push(data.firstCategory.categoryId)
                    this.tabVal.push(data.secondCategory.categoryId)
                    this.tabVal.push(data.thirdCategory.categoryId)
                } else {
                    this.$message.error('获取失败！')
                }
            } catch (_) {
                console.log('错误：', _);
            }
        },
        /* 上传图片相关的 */
        handleRemove(file) {
            this.dialogImageUrl = '';
        },
        async uploadImg({ file }) {
            try {

                let { resultCode, data } = await this.$api.upload(file);
                if (+resultCode === 200) {
                    this.ruleFrom.goodsCoverImg = data;
                    return;
                }
            } catch (_) {
                console.log('错误：', _);
            }
            this.$message.error('图片上传失败，请稍后再试！');
        },
        handleImageAdded() {
            this.uploadImg();
        },
        async submit() {
            await this.$refs.fromIns.validate();
            try {
                //添加商品
                let fun = await this.$api.dashboard.addGoods;

                let data = { ...this.ruleFrom },
                    arr = this.tabVal;

                data.goodsCategoryId = arr[arr.length - 1];
                console.log(data.goodsCategoryId);
                //修改商品
                if (this.goodsId) {
                    fun = await this.$api.dashboard.upGoods;
                    data.goodsCategoryId = this.goodsCategoryId;
                    data.goodsId = this.goodsId;
                }

                let { resultCode, message } = await fun(data)
                if (+resultCode === 200) {
                    this.$message.success('恭喜您，操作成功！');
                    this.$router.push('/home/goodsmanager');
                    return;
                } else {
                    this.$message.error(message);
                }

            } catch (_) {
                console.log('错误：', _);
            }
        }
    },
    components: {
        VueEditor
    },


};
</script> 
  
<style lang="less" scoped>
@import "~vue2-editor/dist/vue2-editor.css";
/* Import the Quill styles you want */
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.bubble.css";
@import "~quill/dist/quill.snow.css";

.Add {
    position: relative;
    box-sizing: border-box;
    padding: 20px;
    margin-bottom: 50px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);


    :deep(#editor) {
        height: 300px;
    }

    :deep(.el-form-item__label) {
        width: 82px !important;
    }

    :deep(.el-form-item__content) {
        margin-left: 82px !important;
    }

    /deep/input {
        width: 298px;
        height: 38px;
        padding: 0 15px;
    }

    /deep/.el-textarea {
        width: 298px;
        height: 38px;
        box-sizing: border-box;
    }

    /deep/.el-input-number {
        width: 298px;
    }

    /deep/.el-button {
        margin-left: 80px;
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