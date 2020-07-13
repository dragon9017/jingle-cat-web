<!--
   系统角色表
   author： chensiqi
   date： 2019-08-05 18:05:38
-->
<template>
    <div>
        <div class="i-layout-page-header">
            <PageHeader title="角色管理" content="" hidden-breadcrumb />
        </div>
        <Card :bordered="false" dis-hover class="list-table-list-card ivu-mt" ref="card">
            <table-form ref="form" @on-add="edit(null)" @on-submit="search" @on-reset="search" />
            <table-list ref="table" @on-fullscreen="handleFullscreen" />
        </Card>
    </div>
</template>
<script>
    import screenfull from 'screenfull';
    import tableForm from './table-form';
    import tableList from './table-list';

    export default {
        name: 'auth-role',
        components: { tableForm,tableList },
        data() {
            return {

            }
        },
        methods: {
            search (data) {
                this.$refs.table.search(data);
            },
            getData () {
                this.$refs.table.getData();
            },
            handleFullscreen (state) {
                if (state) {
                    screenfull.request(this.$refs.card.$el);
                } else {
                    screenfull.exit();
                }
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>
