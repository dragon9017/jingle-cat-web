<template>
    <Form ref="form" :model="data" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
        <Row :gutter="24" type="flex" justify="end">
            <Col v-bind="grid">
                <FormItem label="角色名称：" prop="name" label-for="name">
                    <Input v-model="data.name" placeholder="请输入角色名称" element-id="name" />
                </FormItem>
            </Col>
            <Col v-bind="grid" class="ivu-text-right">
                <FormItem>
                    <Button  type="primary" @click="handleSubmit">查询</Button>
                    <Button class="ivu-ml-8" @click="handleReset">重置</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        data () {
            return {
                grid: {
                    md: 12
                },
                collapse: false,
                data: {
                    name: null
                },
                rules: {

                }
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'isMobile'
            ]),
            labelWidth () {
                return this.isMobile ? undefined : 100;
            },
            labelPosition () {
                return this.isMobile ? 'top' : 'right';
            }
        },
        methods: {
            handleSubmit () {
                this.$emit('on-submit', this.data);
            },
            handleReset () {
                this.$refs.form.resetFields();
                this.$emit('on-reset',this.data);
            },
            handleAdd () {
                this.$emit('on-add');
            }
        }
    }
</script>
