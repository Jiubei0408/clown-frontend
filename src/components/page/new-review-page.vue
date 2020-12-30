<template>
  <div class="main-wrap">
    <h1>发表评测</h1>
    <div style="display: flex; justify-content: space-around; align-items: center; height: fit-content">
      <div style="width: 500px; height: fit-content">
        <el-form ref="form" label-width="130px" label-position="left"
                 :model="form" :rules="rules">
          <el-form-item label="测评标题" prop="review_title">
            <el-input v-model="form.review_title"/>
          </el-form-item>
          <el-form-item label="游戏名称" prop="game_id">
            <el-select v-model="form.game_id" filterable>
              <el-option v-for="game in games" :key="game.game_id" :label="game.game_name" :value="game.game_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="评分" prop="review_score">
            <div style="display: flex; align-items: center; height: 40px">
              <el-rate v-model="form.review_score"/>
            </div>
          </el-form-item>
          <el-form-item label="游戏时长（分钟）" prop="review_length">
            <el-input-number v-model="form.review_length"/>
          </el-form-item>
          <el-form-item label="评测简介" prop="review_brief">
            <el-input v-model="form.review_brief" type="textarea"/>
          </el-form-item>
        </el-form>
      </div>
      <el-upload
          class="uploader"
          :action="this.$store.state.fileHost + '/upload'"
          :show-file-list="false"
          accept="image/*"
          :on-success="handleUploadSuccess"
          :before-upload="handleBeforeUpload">
        <img v-if="form.review_src" :src="form.review_src" class="image">
        <i v-else class="el-icon-plus"></i>
      </el-upload>
    </div>
    <mavon-editor ref="editor" v-model="form.review_content" :autofocus="false" class="editor"
                  :tabSize="2" placeholder="评测内容" :toolbars="editorToolbar"
                  @imgAdd="uploadImage"/>
    <el-button style="width: 500px" type="primary" round @click="submitForm">提交</el-button>
  </div>
</template>

<script>
export default {
  name: "new-review-page",
  data() {
    return {
      form: {
        game_id: '',
        review_title: '',
        review_src: '',
        review_score: 1,
        review_content: '',
        review_brief: '',
        review_length: 0,
        user_id: this.$store.state.user.id
      },
      rules: {
        review_title: [{
          required: true,
          message: '请输入评测标题',
          trigger: 'blur'
        }],
        review_brief: [{
          required: true,
          message: '请填写评测简介',
          trigger: 'blur'
        }],
        game_id: [{
          required: true,
          message: '请选择游戏',
          trigger: 'blur'
        }]
      },
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
      },
      games: []
    }
  },
  methods: {
    getAllGames() {
      this.$http.post(this.$store.state.api + '/review/getAllGame')
          .then(resp => {
            this.games = resp.data.data
          })
    },
    delEditorImage(pos) {
      this.$refs.editor.$refs.toolbar_left.$imgDel(pos)
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
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('请完善信息')
          return false
        }
        if (this.form.review_src === '') {
          this.$message.error('请上传评测图片')
          return false
        }
        if(this.form.review_content === ''){
          this.$message.error('请填写评测内容')
          return false
        }
        this.$http.post(this.$store.state.api + '/review/postReview', this.form)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('发表成功')
                this.$router.push('/review')
              } else this.$message.error(resp.data.message)
            })
      })
    },
    handleUploadSuccess(response) {
      this.form.review_src = this.$store.state.fileHost + response.url
    },
    handleBeforeUpload(file) {
      if (file.size > 1024 * 1024) {
        this.$message.error('图片大小不能超过1M')
        return false
      }
    }
  },
  created() {
    if (!this.$store.state.user.id) {
      this.$message.error('请先登录')
      this.$router.push('/login')
      return
    }
    this.getAllGames()
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}

.main-wrap {
  width: fit-content;
  min-width: 1200px;
  margin: auto;
  padding: 50px;
  box-sizing: border-box;
}

.main-wrap > *:not(:first-child) {
  margin-top: 30px;
}

.editor {
  width: 1200px;
  height: 500px;
}

.editor.fullscreen {
  width: unset;
  height: unset;
}

.uploader {
  width: 600px;
  height: 300px;
  background-color: #f5f5f5;
  border: 1px dashed black;
}

.uploader:hover {
  color: #409EFF;
  background-color: #fcfcfc;
}

.image {
  width: 100%;
  height: 100%;
}

/deep/ .el-upload {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/deep/ .el-textarea__inner {
  max-height: 200px;
}

/deep/ .el-form-item__label:before {
  display: none;
}
</style>