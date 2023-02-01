<template>
    <div class="Account">
        <div class="info">
            <el-form :model="ruleForm" :rules="rules" ref="formIns">
                <el-form-item label="登录名：" label-width="80px" prop="loginUserName">
                    <el-input v-model="ruleForm.loginUserName" style="width: 32%"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" label-width="80px" prop="nickName">
                    <el-input v-model="ruleForm.nickName" style="width: 32%"></el-input>
                </el-form-item>
                <el-form-item>
                    <my-button type="danger" @click="submitName">确认修改</my-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="updataPassword">
            <el-form :model="ruleForm" :rules="rules" ref="formIns2">
                <el-form-item label="原密码：" label-width="80px" prop="originalPassword">
                    <el-input v-model="ruleForm.originalPassword" style="width: 32%"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" label-width="80px" prop="newPassword">
                    <el-input v-model="ruleForm.newPassword" style="width: 32%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitPassword">确认修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
  
<script>

export default {
    name: "Account",
    data() {
        return {
            tableLoading: false,
            ruleForm: {
                loginUserName: "",
                nickName: "",
                originalPassword: "",
                newPassword: ""
            },
            rules: {
                loginUserName: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
                nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
                originalPassword: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
                newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        //获取当前登录者信息
        async init() {
            this.tableLoading = true;
            try {
                let { resultCode, data } = await this.$api.system.queryData();
                if (+resultCode === 200) {
                    this.ruleForm.loginUserName = data.loginUserName;
                    this.ruleForm.nickName = data.nickName;
                } else {
                    this.$message.error('获取数据失败！')
                }
            } catch (_) {
                console.log('错误：', _);
            }
            this.tableLoading = false;
        },

        //修改登录名和密码
        async submitName() {
            try {
                await this.$refs.formIns.validate();
                let { resultCode, message } = await this.$api.system.updateName(this.ruleForm.loginUserName, this.ruleForm.nickName);
                if (+resultCode === 200) {
                    this.$message.success('恭喜您，修改成功！');
                    this.init();
                    return;
                }
                this.$message.error(message);
            } catch (_) {
                console.log('错误：', _);
            }
        },

        //修改密码
        async submitPassword() {
            try {
                await this.$refs.formIns2.validate();
                let { resultCode, message } = await this.$api.system.updataPassword(this.ruleForm.newPassword, this.ruleForm.originalPassword);
                if (+resultCode === 200) {
                    this.$message.success('恭喜您，修改成功！');
                    this.init();
                    return;
                }
                this.$message.error(message);
            } catch (_) {
                console.log('错误：', _);
            }
        }
    }

};
</script>
  
<style lang="less" scoped>
.Account {
    .info {
        position: relative;
        box-sizing: border-box;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }

    .updataPassword {
        position: relative;
        box-sizing: border-box;
        padding: 20px;
        margin-bottom: 50px;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }

    .el-button {
        margin-left: 80px;
    }

    /deep/.el-input__inner {
        border-radius: 4px !important;
    }

}
</style>