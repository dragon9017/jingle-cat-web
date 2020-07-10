<template>
    <div class="login-content">
        <div class="login-center">
            <div class="login-center_left">
                <img src="@/assets/svg/time-rafiki.svg" alt />
            </div>
            <div class="login-center_right">
                <div class="title">
                    <img class="icon" src="@/assets/images/login-icon.png" />
                    <p>欢迎来到叮当猫工作台</p>
                </div>
                <Login @on-submit="handleSubmit">
                    <div>
                        <UserName name="username" enter-to-submit />
                    </div>
                    <div>
                        <Password name="password" enter-to-submit />
                    </div>
                    <div>
                        <Captcha
                                v-model="loginForm.code"
                                :rules="captchaRule"
                                class="demo-login-captcha"
                                name="captcha"
                                :count-down="0"
                                @on-get-captcha="refreshCode"
                                enter-to-submit
                        >
                            <img slot="text" :src="code.src" />
                        </Captcha>
                    </div>
                    <Submit :loading="loading">{{ $t('page.login.submit') }}</Submit>
                </Login>
            </div>
        </div>
    </div>
</template>
<script>
    import iCopyright from "@/components/copyright";
    import { mapActions } from "vuex";
    import mixins from "../mixins";
    import util from "@/libs/util";
    import dataUtils from "@/utils/dataUtils";
    import Setting from "@/setting";
    import appUtils from "../../../utils/appUtils";

    export default {
        mixins: [mixins],
        components: { iCopyright },
        data() {
            return {
                code: {
                    src: "/code",
                    value: "",
                    len: 4,
                    type: "image"
                },
                loginForm: {
                    code: "",
                    redomStr: ""
                },
                captchaRule: [
                    {
                        required: true,
                        message: "请输入验证码！",
                        trigger: "change"
                    }
                ],
                loading: false
            };
        },
        methods: {
            ...mapActions("admin/account", ["login"]),
            refreshCode() {
                this.loginForm.code = "";
                this.loginForm.randomStr = util.randomLenNum(this.code.len, true);
                this.code.type === "text"
                    ? (this.code.value = util.randomLenNum(this.code.len))
                    : (this.code.src = `${Setting.apiBaseURL}/system/login/code/${this.loginForm.randomStr}`);
            },
            /**
             * @description 登录
             * 表单校验已有 iView Pro 自动完成，如有需要修改，请阅读 iView Pro 文档
             */
            handleSubmit(valid, values) {
                if (valid) {
                    const { username, password, captcha } = values;
                    this.loading = true;
                    this.login({
                        username,
                        password,
                        randomStr: this.loginForm.randomStr,
                        captcha
                    })
                        .then((res) => {
                            if(res.state){
                                // 重定向对象不存在则返回顶层路径
                                this.$router.replace(
                                    this.$route.query.redirect || "/"
                                );
                            }else {
                                appUtils.showError(res.msg)
                                this.refreshCode();
                                this.loading = false;
                            }
                        })
                        .catch(err => {
                            this.refreshCode();
                            this.loading = false;
                        })
                }
            }
        },
        created() {
            this.refreshCode();
        }
    };
</script>
<style lang="scss">
    .login-content {
        position: relative;
        width: 100%;
        height: 100%;
        // background: url("../../../assets/images/login-backgroung.png");
        background: #f6f8fb;
        .login-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 992px;
            height: 482px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ffffff;
            box-shadow: 0px 2px 30px 0px hsla(200, 4%, 84%, 0.502);
            border-radius: 38px;
        }
        .login-center_left {
            img {
                width: 400px;
                height: 299px;
                margin-right: 65px;
            }
        }
        .login-center_right {
            height: 309px;
            .title {
                font-size: 24px;
                color: #2d3b4c;
                font-weight: bold;
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                .icon {
                    width: 40px;
                    height: 40px;
                    margin-right: 9px;
                }
            }
            .ivu-login-submit {
                margin-top: 35px;
                button {
                    width: 123px;
                    height: 42px;
                    background: linear-gradient(219deg, #4fb3fa 0%, #277cf2 100%);
                    border-radius: 23px;
                }
            }
            .ivu-input {
                border: none;
                border-bottom: 1px solid #dcdee2;
                border-radius: 0px;
                &:hover,
                &:focus {
                    border: none;
                    border-bottom: 1px solid #4fb3fa;
                    box-shadow: none;
                }
            }
            .demo-login-captcha {
                button {
                    border: none;
                    padding: 0;
                }
            }
        }
    }
    @media (max-width: 1010px) {
        .login-content .login-center {
            width: 90%;
            .login-center_left {
                display: none;
            }
            .login-center_right {
                padding: 0px 20px;
            }
        }
    }
</style>
