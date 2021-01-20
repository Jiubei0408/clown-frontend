<template>
  <div>
    <h1 style="margin-top: 20px">论坛管理</h1>
    <div class="horizontal-center table-wrap">
      <el-table stripe border :data="tableData" v-loading="loading" cell-class-name="cells">
        <el-table-column prop="post_title" label="帖子标题" width="200px">
          <template slot-scope="scope">
            <el-link :underline="false" :title="scope.row.post_title"
                     @click="$router.push('/posts/'+scope.row.post_id)">
              {{ scope.row.post_title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="floor" label="楼层" width="100px"/>
        <el-table-column prop="comment" label="发表内容" width="350px">
          <template slot-scope="scope">
            <p :underline="false" :title="scope.row.comment">
              {{ scope.row.comment }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="举报理由" width="300px">
          <template slot-scope="scope">
            <p :underline="false" :title="scope.row.content">
              {{ scope.row.content }}
            </p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="ignoreReport(scope.row)">忽略</el-button>
            <template v-if="scope.row.floor !== 1">
              <el-button size="mini" type="danger" plain @click="deleteComment(scope.row)">
                删楼
              </el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="danger" plain @click="deletePost(scope.row)">
                删贴
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-page",
  inject: ['reload'],
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  methods: {
    getData() {
      this.$http.post(this.$store.state.api + '/admin/board/getAllReport')
          .then(resp => {
            this.tableData = resp.data.data.report
          })
    },
    deleteComment(row) {
      this.$confirm(`要删除这个楼层吗？`, '确认', {
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/board/deleteComment', {
          post_id: row.post_id,
          floor: row.floor
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('删除成功')
          } else this.$message.error(resp.data.message)
        })
      })
    },
    deletePost(row) {
      this.$confirm(`删除帖子将导致该贴所有楼层全部删除，继续吗？`, '确认', {
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/board/deletePost', {
          post_id: row.post_id
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('删除成功')
          } else this.$message.error(resp.data.message)
        })
      })
    },
    ignoreReport(row) {
      this.$confirm(`确定忽略吗？`, '确认', {
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/board/ignoreReport', {
          post_id: row.post_id,
          floor: row.floor
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('已忽略')
            this.reload()
          } else this.$message.error(resp.data.message)
        })
      })
    }
  },
  created() {
    if (this.$store.state.user.permission !== 1) {
      this.$message.error('你没有足够的权限')
      this.$router.push('/')
    }
    this.getData()
  }
}
</script>

<style scoped>
.table-wrap {
  margin-top: 20px;
  padding: 10px;
  width: 1100px;
}

/deep/ .cells p, /deep/ .cells span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
