<template>
  <div class="main-wrap" v-loading="loading">
    <el-row style="height: 100px">
      <el-col class="left-wrap">
        <div class="game-name" style="cursor: pointer" @click="$router.push('/board/' + post.board_id)">
          <p :title="post.board_name">{{ post.board_name }}论坛</p>
        </div>
      </el-col>
      <el-col class="right-wrap">
        <div class="title">
          <p :title="post.post_title">[{{ post.post_type }}] {{ post.post_title }}</p>
          <div class="admin-button" @click="report(1)">举报</div>
          <template v-if="$store.state.user.permission === 1">
            <div class="admin-button" @click="distillatePost">设为精华</div>
            <div class="admin-button" @click="deletePost">删除</div>
          </template>
        </div>
      </el-col>
    </el-row>
    <div class="floors">
      <el-row class="floor owner" v-if="post.release_content">
        <el-col class="left-wrap" style="padding-top: 50px">
          <div style="display: unset">
            <el-image :src="post.release_content.avatar" class="circle user-avatar" @click="goto('/profile')">
              <template slot="error">
                <div class="default-user">
                  <i class="el-icon-user vertical-center"/>
                </div>
              </template>
            </el-image>
            <p class="nickname">{{ post.release_content.nickname }}</p>
          </div>
        </el-col>
        <el-col class="right-wrap">
          <mavon-editor :value="post.release_content.release_content"
                        :boxShadow="false"
                        class="md-view"
                        previewBackground="#ffffff" :toolbarsFlag="false" :subfield="false"
                        defaultOpen="preview"/>
          <div class="floor-meta">
            <p>{{ post.release_content.release_time }}</p>
          </div>
        </el-col>
      </el-row>
      <el-row class="floor" v-for="comment of post.comment" :key="comment.comment_id">
        <el-col class="left-wrap" style="padding-top: 50px">
          <p class="floor-cnt">{{ comment.floor }}</p>
          <div style="display: unset">
            <el-image :src="comment.avatar" class="circle user-avatar">
              <template slot="error">
                <div class="default-user">
                  <i class="el-icon-user vertical-center"/>
                </div>
              </template>
            </el-image>
            <p class="nickname">{{ comment.nickname }}</p>
          </div>
        </el-col>
        <el-col class="right-wrap">
          <mavon-editor :value="comment.comment_content"
                        :boxShadow="false"
                        class="md-view"
                        previewBackground="#ffffff" :toolbarsFlag="false" :subfield="false"
                        defaultOpen="preview"/>
          <div class="floor-meta">
            <el-link :underline="false" @click="report(comment.floor)">举报</el-link>
            <template v-if="$store.state.user.permission === 1">
              <el-link :underline="false" @click="deleteComment(comment)">删除</el-link>
            </template>
            <el-link :underline="false" @click="switchThumb(comment.comment_id)">
              <template v-if="comment.are_you_thumbed">已点赞:</template>
              <template v-else>点赞:</template>
              {{ comment.thumb_count }}
            </el-link>
            <el-link :underline="false" @click="reply(comment.comment_id)">回复</el-link>
            <p>{{ comment.comment_time }}</p>
          </div>
          <div style="display: unset">
            <div class="reply" v-for="id in comment.reply.length" :key="id">
              <span>{{ comment.reply[id - 1].nickname }}</span>:
              <span style="word-break: break-all">{{ comment.reply[id - 1].reply_content }}</span>
              <p style="text-align: right">{{ comment.reply[id - 1].comment_time }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="horizontal-center" style="width: fit-content; padding-bottom: 60px">
      <mavon-editor ref="editor" v-model="comment" :autofocus="false" :boxShadow="false" class="editor"
                    :tabSize="2" placeholder="发表评论" :toolbars="editorToolbar"
                    @imgAdd="uploadImage"/>
      <el-button style="position: absolute; bottom: 0; right: 0" type="primary" @click="submitPost">
        发表评论
      </el-button>
    </div>
    <el-pagination :current-page="parseInt($route.params.page)"
                   :page-count="post.all_page" @current-change="handlePageChange"/>
  </div>
</template>

<script>
export default {
  name: "post-page",
  inject: ['reload'],
  data() {
    return {
      post: {},
      loading: false,
      comment: '',
      editorToolbar: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        // htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        // save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        // navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      }
    }
  },
  methods: {
    getData() {
      this.loading = true
      this.$http.post(this.$store.state.api + '/board/post/open', {
        user_id: this.$store.state.user.id,
        post_id: parseInt(this.$route.params.id),
        page_id: parseInt(this.$route.params.page)
      }).then(resp => {
        if (resp.data.code === 200) {
          this.post = resp.data.data
          this.loading = false
        } else this.$message.error(resp.data.message)
      })
    },
    switchThumb(comment_id) {
      this.$http.post(this.$store.state.api + '/board/post/thumb', {
        user_id: this.$store.state.user.id,
        comment_id: comment_id
      }).then(resp => {
        if (resp.data.code === 200) {
          let id = 0
          for (let i in this.post.comment) {
            if (this.post.comment[i].comment_id === comment_id) {
              id = i
              break
            }
          }
          let cnt = this.post.comment[id].thumb_count
          if (resp.data.data.isThumb) cnt++
          else cnt--
          this.post.comment[id].are_you_thumbed = resp.data.data.isThumb
          this.post.comment[id].thumb_count = cnt
        } else this.$message.error(resp.data.message)
      })
    },
    reply(comment_id) {
      this.$prompt('请输入回复', '回复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator(value) {
          if (value === '' || value === null) return '回复不能为空'
          return true
        }
      }).then(({value}) => {
        this.$http.post(this.$store.state.api + '/board/post/reply', {
          user_id: this.$store.state.user.id,
          post_id: parseInt(this.$route.params.id),
          comment_belong: comment_id,
          comment_content: value
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('回复成功')
            this.reload()
          } else this.$message.error(resp.data.message)
        })
      })
    },
    uploadImage(pos, file) {
      let editor = this.$refs.editor
      if (!file.type.startsWith('image')) {
        this.$message.error('此文件不是图片')
        this.delEditorImage(pos)
      }
      if (file.size > 1024 * 1024) {
        this.$message.error('图片文件不能超过 1M')
        this.delEditorImage(pos)
      }
      let form = new FormData()
      form.append('file', file)
      let request = new XMLHttpRequest()
      request.open('POST', this.$store.state.fileHost + '/upload')
      request.timeout = 10000
      request.ontimeout = () => {
        request.abort()
        this.uploading = false
        this.$message.error('文件传输失败')
      }
      this.uploading = true
      this.uploadProgress = '0%'
      request.upload.onprogress = (e) => {
        this.uploadProgress = Math.floor(100.0 * e.loaded / e.total) + '%'
      }
      request.onload = (e) => {
        this.uploading = false
        if (e.target.status === 200) {
          let resp = JSON.parse(e.target.response)
          editor.$img2Url(pos, this.$store.state.fileHost + resp.url)
        } else {
          this.$message.error('文件传输失败')
          this.delEditorImage(pos)
        }
      }
      request.send(form)
    },
    handlePageChange(page) {
      this.$router.push('/posts/' + this.$route.params.id + '/' + page)
    },
    submitPost() {
      if (this.comment === '') {
        this.$message.error('请填写评论内容')
        return
      }
      this.$http.post(this.$store.state.api + '/board/post/comment', {
        user_id: this.$store.state.user.id,
        post_id: parseInt(this.$route.params.id),
        comment_content: this.comment
      }).then(resp => {
        if (resp.data.code === 200) {
          this.$message.success('评论成功')
          this.reload()
        } else this.$message.error(resp.data.message)
      })
    },
    distillatePost() {
      this.$http.post(this.$store.state.api + '/admin/board/distillatePost', {
        post_id: parseInt(this.$route.params.id)
      }).then(resp => {
        if (resp.data.code === 200) {
          this.$message.success('操作成功')
          this.reload()
        } else this.$message.error(resp.data.message)
      })
    },
    deletePost() {
      this.$confirm('确认删除此贴？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/board/deletePost', {
          post_id: parseInt(this.$route.params.id)
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('操作成功')
            this.$router.push('/')
          } else this.$message.error(resp.data.message)
        })
      })
    },
    deleteComment(comment){
      this.$confirm(`要删除这个楼层吗？`, '确认', {
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/board/deleteComment', {
          post_id: parseInt(this.$route.params.id),
          floor: comment.floor
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('删除成功')
          } else this.$message.error(resp.data.message)
        })
      })
    },
    report(floor){
      this.$prompt('填写举报理由', '举报', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: '',
        inputType: 'textarea',
        inputValidator(value) {
          if (value.length > 50) return '您输入的太长了'
          return true
        },
      }).then(({value}) => {
        this.$http.post(this.$store.state.api + '/admin/board/reportPost', {
          post_id: parseInt(this.$route.params.id),
          floor: floor,
          content: value
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success(resp.data.message)
          } else this.$message.error(resp.data.message)
        })
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.main-wrap {
  padding-bottom: 50px;
}

.main-wrap > *:not(:first-child) {
  margin-bottom: 20px;
}

.left-wrap {
  width: 300px;
  height: 100%;
  overflow: hidden;
}

.right-wrap {
  position: relative;
  width: calc(100% - 300px);
  height: 100%;
  overflow: hidden;
}

.left-wrap > div, .right-wrap > div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.game-name {
  background-color: #1f1d33;
  color: #ecdbbc;
  font-size: 28px;
  font-weight: bold;
  padding: 20px;
}

.title {
  justify-content: left !important;
  align-items: center;
  background-color: #2b2a49;
  color: #ecdbbc;
  font-size: 28px;
  padding: 20px;
}

.admin-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px;
  padding: 10px 10px;
  min-width: 100px;
  font-size: 20px;
  background-color: #8694c9;
  border-radius: 15px;
  cursor: pointer;
}

.game-name p, .title p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.floor {
  min-width: 1200px;
  width: 70%;
  margin-left: 10%;
  margin-right: 20%;
  height: fit-content;
  min-height: 200px;
}

.floor .right-wrap {
  border-bottom: 3px solid #ecdbbc;
}

.floor.owner {
  border-bottom-width: 5px;
}

.floor:last-child {
  border-bottom: none;
}

.nickname {
  color: #f3c573;
  font-size: 20px;
  margin-top: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
}

.owner .left-wrap {
  position: relative;
  overflow: hidden;
}

.owner .left-wrap:before {
  content: '';
  position: absolute;
  top: -40px;
  right: 60px;
  width: 5px;
  height: 200px;
  background-color: #ecdbbc;
  transform: rotate(-45deg);
}

.owner .left-wrap:after {
  content: '楼主';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 25px;
  color: #f3c573;
}

.floor-cnt {
  position: absolute;
  left: 70px;
  font-size: 28px;
  color: #dac296;
}

.floor-meta {
  margin-left: auto;
  margin-right: 60px;
  margin-bottom: 20px;
  width: fit-content !important;
  height: fit-content !important;
  font-size: 18px;
  user-select: none;
}

.floor-meta > *:not(:first-child) {
  margin-left: 20px;
}

.reply {
  padding: 10px 50px;
  margin-right: 50px;
  border-bottom: 1px solid lightgray;
  text-align: left;
}

.reply:first-child {
  border-top: 1px solid lightgray;
}

.md-view {
  max-width: 1200px;
}

.editor {
  width: 1200px;
  height: 500px;
}

.editor.fullscreen {
  width: unset;
  height: unset;
  transform: unset;
  margin: unset;
}

/deep/ .floor-meta .el-link--inner {
  font-size: 18px;
}

/deep/ .default-user {
  width: 100%;
  height: 100%;
  background-color: #aaaaaa;
}

.v-note-wrapper:not(.editor) {
  border: none;
}
</style>
