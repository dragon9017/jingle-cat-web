<template>
    <div>
        <Button type="primary" icon="md-add" @click="edit(null)" v-permission="{'value':'sys_role_add'}">新建</Button>
        <div class="ivu-inline-block ivu-fr">
            <Tooltip class="ivu-ml" :content="tableFullscreen ? '退出全屏' : '全屏'" placement="top">
                <i-link @click.native="handleFullscreen">
                    <Icon :custom="tableFullscreen ? 'i-icon i-icon-exit-full-screen' : 'i-icon i-icon-full-screen'" />
                </i-link>
            </Tooltip>
            <Tooltip class="ivu-ml" content="刷新" placement="top">
                <i-link @click.native="search">
                    <Icon custom="i-icon i-icon-refresh" />
                </i-link>
            </Tooltip>
        </div>

        <el-table
                v-if="count>0"
                :data="dataList"
                size="small"
                border
                style="width: 100%;margin-top: 10px">
            <el-table-column prop="roleName"

                             label="角色名称"></el-table-column>
            <el-table-column prop="roleCode"

                             label="角色标识"></el-table-column>
            <el-table-column prop="createTime"
                             align="center"

                             label="创建时间"></el-table-column>
            <el-table-column prop="roleDesc"

                             label="角色描述"></el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="200">
                <template slot-scope="scope">
                    <el-button v-permission="{'value':'sys_role_edit'}"
                               type="text"
                               size="mini"
                               icon="el-icon-edit"
                               @click="edit(scope.row)">编辑
                    </el-button>
                    <Poptip style="margin-left: 10px" transfer confirm title="确认删除?" @on-ok="del(scope.row)">
                        <el-button v-permission="{'value':'sys_role_del'}"
                                   type="text"
                                   size="mini"
                                   icon="el-icon-delete">删除
                        </el-button>
                    </Poptip>
                    <el-button style="margin-left: 10px" v-permission="{'value':'sys_role_perm'}"
                               type="text"
                               size="mini"
                               icon="el-icon-s-custom"
                               @click="handlePermission(scope.row,scope.index)">权限
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




        <!-- 编辑系统角色表 start -->
        <Modal
                v-model="showEdit"
                title="编辑系统角色表"
                width="400">
            <Form ref="sysRoleModel" :model="sysRoleModel"
                  :rules="sysRoleValidate" :label-width="100">
                <FormItem label="角色名称：" prop="roleName">
                    <Input v-model="sysRoleModel.roleName"/>
                </FormItem>
                <FormItem label="角色标识：" prop="roleCode">
                    <Input v-model="sysRoleModel.roleCode"/>
                </FormItem>
                <FormItem label="角色描述：" prop="roleDesc">
                    <Input type="textarea" v-model="sysRoleModel.roleDesc"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="save_loading" @click="save">保存</Button>
            </div>
        </Modal>
        <!-- 编辑系统角色表 end -->


        <!-- 角色权限 start -->
        <Modal
                v-model="dialogPermissionVisible"
                title="角色权限"
                width="400">
            <el-tree class="filter-tree"
                     :data="treeData"
                     :default-checked-keys="checkedKeys"
                     :check-strictly="false"
                     node-key="id"
                     highlight-current
                     :props="defaultProps"
                     show-checkbox
                     ref="menuTree"
                     :filter-node-method="filterNode"
                     default-expand-all>
            </el-tree>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="save_loading" @click="updatePermession(roleId)">
                    保存
                </Button>
            </div>
        </Modal>
        <!-- 角色权限 end -->
    </div>
</template>
<script>
    import {addSysRole, delSysRole, editSysRole, fetchRoleTree, pageSysRole, permissionUpd} from '@/api/system/role'
    import {fetchMenuTree} from '@/api/system/menu'
    import appUtils from '@/utils/appUtils'
    import {rule} from '@/utils/validateRules';
    export default {
        data () {
            return {
                dataList: [], // 数据列表
                query: {// 查询条件
                    size: 10,
                    current: 1
                },
                loginTypeList: [],
                systemTypeList: [],
                count: 0, // 总数
                showEdit: false, // 是否显示编辑
                sysRoleModel: {// 系统角色表
                    roleId: '',
                    roleName: '',
                    roleCode: '',
                    roleDesc: '',
                    dsType: 0
                },
                save_loading: false, // 是否显示保存加载
                sysRoleValidate: {
                    roleName: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'},
                        {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}
                    ],
                    roleCode: [
                        {required: true, message: '角色标识不能为空', trigger: 'blur'},
                        {validator: rule.validatorKey, trigger: 'blur'},
                        {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {max: 255, message: '长度不能大于 255 个字符', trigger: 'blur'}
                    ]
                },
                dialogPermissionVisible: false,
                treeData: [],
                defaultProps: {
                    label: "title",
                    value: 'id'
                },
                checkedKeys: [],
                pageLoading: null,
                tableFullscreen: false
            }
        },
        computed: {

        },
        methods: {
            search(data){
                this.query.current = 1
                this.query.name = data.name
                this.getData()
            },
            // 获取数据
            getData() {
                this.pageLoading = appUtils.showLoading();
                pageSysRole(this.query).then(res => {
                    appUtils.hideLoading(this.pageLoading)
                    this.pageLoading = null
                    this.dataList = res.data.records
                    this.count = res.data.total
                }).catch(error => {
                    appUtils.hideLoading(this.pageLoading)
                    this.pageLoading = null
                })
            },
            // 删除
            del(row) {
                delSysRole(row.roleId).then(res => {
                    this.$Modal.remove()
                    if (res.code === 0) {
                        this.getData()
                        appUtils.showSuccess("删除角色成功！")
                    } else {
                        appUtils.showError("删除角色失败！")
                    }
                })
            },
            // 页数发生改变
            pageChange(val) {
                this.query.current = val
                this.getData()
            },
            // 每页显示条数发生改变
            sizeChange(val) {
                this.query.size = val
                this.query.current = 1
                this.getData()
            },
            // 编辑
            edit(row) {
                this.$refs['sysRoleModel'].resetFields();
                this.showEdit = true
                if (row != null) {
                    let model = JSON.parse(JSON.stringify(row))
                    this.sysRoleModel.roleId = model.roleId
                    this.sysRoleModel.roleName = model.roleName
                    this.sysRoleModel.roleCode = model.roleCode
                    this.sysRoleModel.roleDesc = model.roleDesc
                    this.sysRoleModel.dsType = model.dsType
                } else {
                    this.sysRoleModel = {
                        roleName: '',
                        roleCode: '',
                        roleDesc: '',
                        dsType: 0,
                    }
                }
            },
            // 保存
            save() {
                this.$refs['sysRoleModel'].validate((valid) => {
                    if (valid) {
                        this.save_loading = true
                        if (this.sysRoleModel.roleId == null) {
                            addSysRole(this.sysRoleModel).then(res => {
                                if (res.code === 0) {
                                    this.showEdit = false
                                    this.getData()
                                    appUtils.showSuccess("添加角色成功！")
                                } else {
                                    appUtils.showError("添加角色失败！")
                                }
                                this.save_loading = false
                            }).catch(error => {
                                this.save_loading = false
                            })
                        } else {
                            editSysRole(this.sysRoleModel).then(res => {
                                if (res.code === 0) {
                                    this.showEdit = false
                                    this.getData()
                                    appUtils.showSuccess("修改角色成功！")
                                } else {
                                    appUtils.showError("修改角色失败！")
                                }
                                this.save_loading = false
                            }).catch(error => {
                                this.save_loading = false
                            })
                        }
                    }
                })
            },
            updatePermession(roleId) {
                this.menuIds = ''
                this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
                this.save_loading = true
                permissionUpd(roleId, this.menuIds).then(() => {
                    this.dialogPermissionVisible = false
                    fetchMenuTree()
                        .then(res => {
                            return fetchRoleTree(roleId)
                        }).then(response => {
                        this.checkedKeys = response.data
                        appUtils.showSuccess("修改角色权限成功！")
                        this.save_loading = false
                    }).catch((err) => {
                        this.save_loading = false
                    })
                }).catch(error => {
                    alert(1)
                    this.save_loading = false
                })
            },
            handlePermission(row) {
                this.pageLoading = appUtils.showLoading()
                fetchRoleTree(row.roleId)
                    .then(res => {
                        this.checkedKeys = res.data
                        return fetchMenuTree().catch((err) => {
                            appUtils.hideLoading(this.pageLoading)
                        })
                    })
                    .then(res => {
                        this.treeData = res.data
                        // 解析出所有的太监节点
                        this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
                        this.dialogPermissionVisible = true
                        this.roleId = row.roleId
                        this.roleCode = row.roleCode
                        appUtils.hideLoading(this.pageLoading)
                        this.pageLoading = null
                    })
            },
            filterNode(value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },
            /**
             * 解析出所有的太监节点id
             * @param json 待解析的json串
             * @param idArr 原始节点数组
             * @param temp 临时存放节点id的数组
             * @return 太监节点id数组
             */
            resolveAllEunuchNodeId(json, idArr, temp) {
                for (let i = 0; i < json.length; i++) {
                    const item = json[i]
                    // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
                    if (item.children && item.children.length !== 0) {
                        this.resolveAllEunuchNodeId(item.children, idArr, temp)
                    } else {
                        temp.push(idArr.filter(id => id === item.id))
                    }
                }
                return temp
            },
            // 表格全屏
            handleFullscreen () {
                this.tableFullscreen = !this.tableFullscreen;
                this.$emit('on-fullscreen', this.tableFullscreen);
            },
        },

    }
</script>
