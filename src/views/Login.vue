<template>
  <div class="login-box">
    <div class="content">
      <div class="header">
        <img class="logo" src="../assets/images/mlogo.png" alt="" />
        <h2 class="title">新蜂商城</h2>
      </div>

      <el-form :model="ruleFrom" :rules="rules" ref="formIns">
        <el-form-item label="账号" prop="account">
          <el-input autofocus placeholder="请输入手机号/用户名" v-model.trim="ruleFrom.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model.trim="ruleFrom.password" @keydown.native.enter="submit"></el-input>
        </el-form-item>
        <p class="tip">
          登录表示您已同意
          <a href="javascript:;">《服务条款》</a>
        </p>
        <el-form-item>

          <my-button @click="submit">立即登录</my-button>

        </el-form-item>
        <div class="remember">
          <el-checkbox v-model="remember">记住账号和密码</el-checkbox>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "blueimp-md5";
import _ from "@/assets/utils"
const sign = "******";

export default {
  name: "xf-login",
  data() {
    const checkAccount = (_, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('帐号不能为空哈~'));
      }
      let reg1 = /^(?:(?:\+|00)86)?1\d{10}$/,
        reg2 = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!reg1.test(value) && !reg2.test(value)) {
        return callback(new Error('帐号格式不符哦~'));
      }
      callback();

    };
    const checkPassword = (_, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('密码不能为空哈~'));
      }
      if (value === sign) {//让占位符一定能通过表单校验
        return callback();
      }
      let reg = /^.{6,16}$/;
      if (!reg.test(value)) {
        return callback(new Error('密码格式不对哦~'));
      }
      callback();
    };
    return {
      ruleFrom: {
        account: "",
        password: ""
      },
      rules: {
        account: [{ validator: checkAccount, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }]
      },
      remember: true,
    };
  },
  created() {
    //把记住的帐号密码，放在对应的框中
    let remdata = _.storage.get('remember');
    if (remdata) {
      let { account, password } = remdata;
      this.ruleFrom.account = account;
      this.ruleFrom.password = sign;
      this.passwordMd5Remember = password;
    }
  },
  methods: {
    async submit() {
      try {
        await this.$refs.formIns.validate();

        //表单校验通过，向服务器发送请求
        let { account, password } = this.ruleFrom;

        //如果是占位符，就用记住的密码，如果不是，就用当前密码加密
        password = password === sign ? this.passwordMd5Remember : md5(password);//md5加密
        let { resultCode, data } = await this.$api.adminLogin(account, password);
        if (+resultCode === 200) {
          //登录成功  1.存储Token 2.获取登录者信息  3.提示、跳转

          _.storage.set('tk', data);
          await this.$store.dispatch('setProfileAsync');

          this.$message.success('恭喜您，登录成功~');

          //存储帐号密码
          if (this.remember) {
            _.storage.set('remember', {
              account, password
            })
          } else {
            _.storage.remove('remember')
          }

          //跳转的细节
          let { to } = this.$route.query;
          to ? this.$router.replace(to) : this.$router.push('/home');

        } else {
          //登录失败
          this.$message.error('登录失败，请重新登录！');
        }

      } catch (_) {
        console.log('错误: ', _);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login-box {
  position: relative;
  height: 100%;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    width: 420px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.2);
  }
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  .logo {
    margin-right: 20px;
    width: 100px;
    height: 100px;
  }

  .title {
    font-size: 28px;
    color: #1baeae;
    font-weight: 700;
  }
}

.el-form {
  box-sizing: border-box;
  margin: 0 auto;
  padding-bottom: 40px;
  width: 300px;

  /deep/.el-form-item__label {
    display: block;
  }

  .tip {
    line-height: 40px;
    font-size: 14px;

    a {
      color: #409eff;
    }
  }

  .el-button {
    width: 100%;
  }
}
</style>