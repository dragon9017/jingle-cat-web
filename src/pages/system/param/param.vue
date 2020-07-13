<template>
    <div class="layui-card">
        <div class="layui-card-header">
            <div style="line-height: 50px">参数管理</div></div>
        <div class="layui-card-body">
            <Button v-permission="{'value':'admin_syspublicparam_add'}" style="margin-bottom: 10px"
                    type="primary" icon="md-add"
                    class="layui-btn layui-btn-normal layui-btn-sm" @click="edit(null)"
            >添加
            </Button>
            <el-table
                    v-if="count>0"
                    :data="tableData"
                    size="small"
                    border
                    style="width: 100%">
                <el-table-column prop="publicName"
                                 :show-overflow-tooltip="true"
                                 label="名称">

                </el-table-column>
                <el-table-column prop="publicKey"
                                 :show-overflow-tooltip="true"
                                 label="键">

                </el-table-column>
                <el-table-column prop="publicValue"
                                 :show-overflow-tooltip="true"
                                 label="值">

                </el-table-column>
                <el-table-column prop="validateCode"
                                 :show-overflow-tooltip="true"
                                 label="编码">

                </el-table-column>
                <el-table-column prop="system"
                                 width="100"

                                 label="类型">
                    <template slot-scope="scope">
                        <span v-text="handleType(scope.row)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                 width="100"

                                 label="状态">
                    <template slot-scope="scope">
                        <span v-text="handleStatus(scope.row)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="publicType"
                                 width="100"

                                 label="业务类型">
                    <template slot-scope="scope">
                        <span v-text="handleParam(scope.row)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="150">
                    <template slot-scope="scope">
                        <el-button
                                v-permission="{'value':'admin_syspublicparam_edit'}"
                                type="text"
                                size="mini"
                                icon="el-icon-edit"
                                @click="edit(scope.row)">编辑
                        </el-button>
                        <Poptip style="margin-left: 10px" transfer confirm title="确认删除?" @on-ok="rowDel(scope.row)">
                            <el-button
                                    v-permission="{'value':'admin_syspublicparam_del'}"
                                    type="text"
                                    size="mini"
                                    icon="el-icon-delete"
                            >删除
                            </el-button>
                        </Poptip>
                    </template>
                </el-table-column>
            </el-table>
            <avue-empty v-else></avue-empty>
            <div style="display: flex;justify-content: flex-end;">
            <Page v-if="count>0" style="margin-top: 10px;margin-bottom: 10px" transfer @on-change="pageChange"
                  @on-page-size-change="sizeChange"
                  prev-text="上一页"
                  next-text="下一页" :total="count" show-elevator show-total show-sizer/>
            </div>
        </div>

        <!-- 编辑参数 start -->
        <Modal
                v-model="showEdit"
                title="编辑参数"
                width="500">
            <Form ref="paramForm" :model="paramForm" :rules="paramValidate" :label-width="100">
                <FormItem label="名称：" prop="publicName">
                    <Input v-model="paramForm.publicName" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="键：" prop="publicKey">
                    <Input v-model="paramForm.publicKey" placeholder="请输入键"></Input>
                </FormItem>
                <FormItem label="值：" prop="publicValue">
                    <Input v-model="paramForm.publicValue" placeholder="请输入值"></Input>
                </FormItem>
                <FormItem label="编码：" prop="validateCode">
                    <Input v-model="paramForm.validateCode" placeholder="请输入编码"></Input>
                </FormItem>
                <FormItem label="类型：" prop="system">
                    <Select v-model="paramForm.system" placeholder="请选择类型">
                        <Option v-for="item in dictTypeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="状态：" prop="status">
                    <Select v-model="paramForm.status" placeholder="请选择状态">
                        <Option v-for="item in statusTypeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="业务类型：" prop="publicType">
                    <Select v-model="paramForm.publicType" placeholder="请选择业务类型">
                        <Option v-for="item in paramTypeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="saveLoading" @click="saveEdit">保存</Button>
            </div>
        </Modal>
        <!-- 编辑参数 end -->
    </div>
</template>

<script>
    import { addObj, delObj, fetchList, putObj } from '@/api/system/param'
    import { remote } from '@/api/system/dict'
    import appUtils from '@/utils/appUtils';
    import { rule } from '@/utils/validateRules';

    export default {
        name: 'system-param',
        data () {
            return {
                searchForm: {},
                tableData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                query: {// 查询条件
                    size: 10,
                    current: 1,
                    descs: 'create_time'
                },
                tableLoading: false
                , count: 0
                , showEdit: false//是否显示编辑
                , dictTypeList: []//字典类型列表
                , statusTypeList: []//状态列表
                , paramTypeList: []//参数类型列表
                , paramForm: {}//表单
                , saveLoading: false//保存密等
                , paramValidate: {
                    publicName: [
                        { required: true, message: '请输名称', trigger: 'blur' },
                        { max: 30, message: '长度在 30 个字符', trigger: 'blur' },
                        { validator: rule.validatorNameCn, trigger: 'blur' }
                    ],
                    publicKey: [
                        { required: true, message: '请输入键', trigger: 'blur' },
                        { validator: rule.validatorKey, trigger: 'blur' }
                    ],
                    publicValue: [
                        { required: true, message: '请输入值', trigger: 'blur' }
                    ],
                    system: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    publicType: [
                        { required: true, message: '请选择业务类型', trigger: 'blur' }
                    ]
                }
            }
        },
        created () {
        },
        mounted () {
            this.getType()
        },
        computed: {},
        methods: {
            getType () {
                remote('dict_type').then(res => {
                    this.dictTypeList = res.data
                    this.getStatus()
                })
            },
            handleType (row) {
                let type = this.dictTypeList.filter(item => item.value == row.system);
                if (type != null && type.length > 0) {
                    return type[0].label
                }
                return ''
            },
            getStatus () {
                remote('status_type').then(res => {
                    this.statusTypeList = res.data
                    this.getParam()
                })
            },
            handleStatus (row) {
                let type = this.statusTypeList.filter(item => item.value == row.status);
                if (type != null && type.length > 0) {
                    return type[0].label
                }
                return ''
            },
            getParam () {
                remote('param_type').then(res => {
                    this.paramTypeList = res.data
                    this.getList()
                })
            },
            handleParam (row) {
                let type = this.paramTypeList.filter(item => item.value == row.status);
                if (type != null && type.length > 0) {
                    return type[0].label
                }
                return ''
            },
            getList () {
                let loading = appUtils.showLoading()
                fetchList(this.query).then(response => {
                    this.tableData = response.data.records
                    this.count = response.data.total
                    appUtils.hideLoading(loading)
                })
            },
            // 页数发生改变
            pageChange (val) {
                this.query.current = val
                this.getList()
            },
            // 每页显示条数发生改变
            sizeChange (val) {
                this.query.size = val
                this.query.current = 1
                this.getList()
            },
            rowDel: function (row, index) {
                var _this = this
                let loading = appUtils.showLoading('正在删除...')
                delObj(row.publicId).then((res) => {
                    appUtils.hideLoading(loading)
                    if(res.state){
                        this.getList(this.page)
                        appUtils.showSuccess(res.msg)
                    }else {
                        appUtils.showError(res.msg)
                    }
                }).catch(function () {
                    appUtils.hideLoading(loading)
                })
            },
            /**
             * @title 数据更新
             * @param row 为当前的数据
             * @param index 为当前更新数据的行数
             * @param done 为表单关闭函数
             *
             **/
            handleUpdate: function () {
                putObj(this.paramForm).then(res => {
                    appUtils.showSuccess(res.msg)
                    this.getList()
                    this.showEdit = false
                    this.saveLoading = false
                }).catch(() => {
                    this.showEdit = false
                    this.saveLoading = false
                })
            },
            /**
             * @title 数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            handleSave: function () {
                addObj(this.paramForm).then(res => {
                    this.saveLoading = false
                    if(res.state){
                        this.getList()
                        appUtils.showSuccess(res.msg)
                        this.showEdit = false
                    }else {
                        appUtils.showError(res.msg)
                    }
                }).catch(() => {
                    this.showEdit = false
                    this.saveLoading = false
                })
            },
            edit (row) {
                if (this.$refs['paramForm'] != null) {
                    this.$refs['paramForm'].resetFields();
                }
                if (row != null) {
                    this.paramForm = JSON.parse(JSON.stringify(row))
                } else {
                    this.paramForm = {
                        system: ''
                    }
                }
                this.showEdit = true
            },
            //保存字典
            saveEdit () {
                this.$refs['paramForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.saveLoading = true
                    if (this.paramForm.publicId != null) {
                        this.handleUpdate()
                    } else {
                        this.handleSave()
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
