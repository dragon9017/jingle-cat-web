<template>
    <div>
        <div class="layui-card">
            <div class="layui-card-header">
                <div>字典管理</div>
            </div>
            <div class="layui-card-body">
                <div>
                    <Input v-model="query.type" style="width: 150px;margin-right: 40px;margin-bottom: 10px" placeholder="请输入类型"></Input>
                    <Select v-model="query.system" clearable style="width:200px;margin-right: 40px;margin-bottom: 10px">
                        <Option v-for="item in dictTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Button type="primary" icon="ios-search" style="margin-left: 10px;margin-bottom: 10px" @click="getList">查询</Button>
                </div>
                <Button v-permission="{'value':'sys_dict_add'}" style="margin-bottom: 10px"
                        icon="md-add" type="primary"
                        class="layui-btn layui-btn-normal layui-btn-sm" @click="edit(null)">
                    添加
                </Button>
                <el-table
                        v-if="count>0"
                        :data="tableData"
                        size="small"
                        border
                        style="width: 100%">
                    <el-table-column prop="type"

                                     :show-overflow-tooltip="true"
                                     label="类型">
                    </el-table-column>
                    <el-table-column prop="description"

                                     :show-overflow-tooltip="true"
                                     label="描述">

                    </el-table-column>
                    <el-table-column prop="system"

                                     label="字典类型">
                        <template slot-scope="scope">
                            <span v-text="handleType(scope.row)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks"

                                     :show-overflow-tooltip="true"
                                     label="备注信息">

                    </el-table-column>
                    <el-table-column prop="createTime"
                                     width="180"
                                     align="center"
                                     label="创建时间">

                    </el-table-column>
                    <el-table-column
                            label="操作"
                            align="center"
                            width="220">
                        <template slot-scope="scope">
                            <el-button
                                    v-permission="{'value':'sys_dict_add'}"
                                    type="text"
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="edit(scope.row)">编辑
                            </el-button>
                            <Poptip style="margin-left: 10px" transfer confirm title="确认删除?" @on-ok="rowDel(scope.row)">
                                <el-button
                                        v-permission="{'value':'sys_dict_add'}"
                                        type="text"
                                        size="mini"
                                        icon="el-icon-delete"
                                >删除
                                </el-button>
                            </Poptip>

                            <el-button
                                    style="margin-left: 10px"
                                    v-permission="{'value':'sys_dict_add'}"
                                    type="text"
                                    size="mini"
                                    icon="el-icon-menu"
                                    @click="handleItem(scope.row,scope.index)">字典项
                            </el-button>
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
        </div>

        <!-- 编辑字典 start -->
        <Modal
                v-model="showEdit"
                title="编辑字典"
                width="500">
            <Form ref="dictForm" :model="dictForm" :rules="dictValidate" :label-width="100">
                <FormItem label="类型：" prop="type">
                    <Input v-model="dictForm.type" placeholder="请输入类型"></Input>
                </FormItem>
                <FormItem label="描述：" prop="description">
                    <Input v-model="dictForm.description" placeholder="请输入描述"></Input>
                </FormItem>
                <FormItem label="字典类型：" prop="system">
                    <Select v-model="dictForm.system" placeholder="请选择字典类型">
                        <Option v-for="item in dictTypeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="备注信息：" prop="remarks">
                    <Input v-model="dictForm.remarks" type="textarea" placeholder="请输入备注信息"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="saveLoading" @click="saveEdit">保存</Button>
            </div>
        </Modal>
        <!-- 编辑字典 end -->


        <!-- 字典项管理 start -->
        <Modal
                v-model="dialogFormVisible"
                title="字典项管理"
                width="1000"
                footer-hide>
            <avue-crud
                    ref="crudItem"
                    :data="tableDictItemData"
                    v-model="form"
                    :before-open="handleBeforeOpen"
                    :option="tableDictItemOption"
                    :table-loading="tableLoading"
                    @row-update="handleItemUpdate"
                    @row-save="handleItemSave"
                    @row-del="rowItemDel"/>
        </Modal>
        <!-- 字典项管理 end -->
    </div>
</template>

<script>
    import {
        addItemObj,
        addObj,
        delItemObj,
        delObj,
        fetchItemList,
        fetchList,
        putItemObj,
        putObj,
        remote
    } from '@/api/system/dict'
    import {tableDictItemOption} from './curd'
    import appUtils from "@/utils/appUtils";

    export default {
        name: 'Dict',
        data() {
            return {
                form: {
                    type: undefined,
                    dictId: undefined
                },
                dictType: undefined,
                dictId: undefined,
                dialogFormVisible: false,
                tableData: [],
                tableDictItemData: [],
                tableLoading: false,
                tableDictItemOption: tableDictItemOption
                , page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                }
                , count: 0
                , query: {// 查询条件
                    size: 10,
                    current: 1,
                }
                , dictTypeList: []//字典类型列表
                , showEdit: false//是否显示编辑字典
                , dictForm: {
                    system: ''
                }
                , saveLoading: false//保存密等
                , dictValidate: {
                    type: [
                        {required: true, message: '请输入类型', trigger: 'blur'},
                        { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' }
                    ],
                    description: [
                        {required: true, message: '请输入描述', trigger: 'blur'},
                        { type: 'string', max: 20, message: '不能超过20个字符', trigger: 'blur' }
                    ],
                    system: [
                        {required: true, message: '请选择字典类型', trigger: 'blur'}
                    ],
                    remarks: [
                        { type: 'string', max: 50, message: '不能超过50个字符', trigger: 'blur' }
                    ],

                }
            }
        },
        created() {
        },
        mounted() {
            this.getDict()
        },
        computed: {},
        methods: {
            //获取字典类型字典列表
            getDict() {
                remote('dict_type').then(res => {
                    this.dictTypeList = res.data
                    this.getList()
                })
            },
            //处理类型
            handleType(row) {
                let type = this.dictTypeList.filter(item => item.value == row.system);
                if (type != null && type.length > 0) {
                    return type[0].label
                }
                return ''
            },
            getList() {
                let loading = appUtils.showLoading()
                if(this.query.type==''){
                    this.query.type = null
                }
                fetchList(this.query).then(response => {
                    this.tableData = response.data.records
                    this.count = response.data.total
                    appUtils.hideLoading(loading)
                })
            },
            // 页数发生改变
            pageChange(val) {
                this.query.current = val
                this.getList()
            },
            // 每页显示条数发生改变
            sizeChange(val) {
                this.query.size = val
                this.query.current = 1
                this.getList()
            },
            getDictItemList(dictId, type) {
                this.dictType = type
                this.dictId = dictId
                this.dialogFormVisible = true
                this.tableLoading = true
                fetchItemList(Object.assign({
                    current: this.page.currentPage,
                    size: this.page.pageSize
                }, {dictId: dictId})).then(response => {
                    this.tableDictItemData = response.data.records
                    this.tableLoading = false
                })
            },
            handleBeforeOpen(done) {
                this.form.type = this.dictType
                this.form.dictId = this.dictId
                done()
            },
            rowDel: function (row) {
                let loading = appUtils.showLoading('正在删除...')
                delObj(row).then((res) => {
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
            handleUpdate: function () {
                putObj(this.dictForm).then(() => {
                    appUtils.showSuccess('修改成功')
                    this.showEdit = false
                    this.saveLoading = false
                    this.getList()
                })
            },
            handleSave: function () {
                addObj(this.dictForm).then(() => {
                    appUtils.showSuccess('添加成功')
                    this.showEdit = false
                    this.saveLoading = false
                    this.getList()
                })
            },
            handleItemSave: function (row, done) {
                addItemObj(row).then(() => {
                    appUtils.showSuccess('添加成功')
                    this.getDictItemList(row.dictId, row.type)
                    done()
                })
            },
            handleItemUpdate: function (row, index, done) {
                putItemObj(row).then(() => {
                    appUtils.showSuccess('修改成功')
                    this.getDictItemList(row.dictId, row.type)
                    done()
                })
            },
            handleItem: function (row) {
                this.getDictItemList(row.id, row.type)
            },
            rowItemDel: function (row) {
                var _this = this
                this.$confirm('是否确认删除数据为"' + row.label + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delItemObj(row.id)
                }).then(() => {
                    this.getDictItemList(row.dictId, row.type)
                    appUtils.showSuccess('删除成功')
                }).catch(function () {
                })
            },
            //编辑
            edit(row) {
                if (this.$refs['dictForm'] != null) {
                    this.$refs['dictForm'].resetFields();
                }
                if (row != null) {
                    this.dictForm = JSON.parse(JSON.stringify(row))
                } else {
                    this.dictForm = {
                        system: ''
                    }
                }
                this.showEdit = true
            },
            //保存字典
            saveEdit() {
                this.$refs['dictForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.saveLoading = true
                    if (this.dictForm.id != null) {
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
    .ivu-select{
        width: 100px !important;
    }
</style>

