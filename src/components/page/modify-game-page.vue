<template>
  <div class="main-wrap">
    <h1>修改游戏</h1>
    <el-form ref="form" label-width="130px" label-position="left"
             :model="form" :rules="rules" v-loading="loading">
      <div style="display: flex; justify-content: space-around; align-items: start; height: fit-content">
        <div style="width: 500px; height: fit-content">
          <el-form-item label="游戏名称" prop="game_name">
            <el-input v-model="form.game_name"/>
          </el-form-item>
          <el-form-item label="游戏类别" prop="type_id">
            <el-select v-model="form.type_id" filterable>
              <el-option v-for="type in types" :key="type.type_id" :label="type.type_name" :value="type.type_id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="游戏标签" prop="game_tag">
            <div style="display: flex; align-items: center; height: 40px">
              <el-input v-model="form.game_tag" placeholder="不同标签请用英文逗号分隔"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="游戏基本信息" prop="game_meta">
            <el-input v-model="form.game_meta" type="textarea"/>
          </el-form-item>
          <el-form-item label="论坛介绍" prop="board_introduction">
            <el-input v-model="form.board_introduction" type="textarea"/>
          </el-form-item>
          <el-form-item label="游戏简介" prop="game_introduction">
            <el-input v-model="form.game_introduction" type="textarea"></el-input>
          </el-form-item>
        </div>
        <div style="display: flex; flex-direction: column">
          <el-form-item label="游戏图标" prop="board_logo">
            <el-upload
                class="uploader"
                style="width: 100px; height: 100px"
                :action="this.$store.state.fileHost + '/upload'"
                :show-file-list="false"
                accept="image/*"
                :on-success="handleBoardLogoUploadSuccess"
                :before-upload="handleBeforeUpload">
              <img v-if="form.board_logo" :src="form.board_logo" class="image">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="论坛侧边图" prop="board_side_image">
            <el-upload
                class="uploader"
                style="width: 200px; height: 100px"
                :action="this.$store.state.fileHost + '/upload'"
                :show-file-list="false"
                accept="image/*"
                :on-success="handleBoardSideImageUploadSuccess"
                :before-upload="handleBeforeUpload">
              <img v-if="form.board_side_image" :src="form.board_side_image" class="image">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="游戏简介图" prop="star_src">
            <el-upload
                class="uploader"
                style="width: 200px; height: 100px"
                :action="this.$store.state.fileHost + '/upload'"
                :show-file-list="false"
                accept="image/*"
                :on-success="handleStarSrcUploadSuccess"
                :before-upload="handleBeforeUpload">
              <img v-if="form.star_src" :src="form.star_src" class="image">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-button style="width: 500px" type="primary" round @click="submitForm">提交</el-button>
  </div>
</template>

<script>
export default {
  name: "new-review-page",
  data() {
    return {
      types: [],
      form: {
        game_name: '',
        game_introduction: '',
        type_id: '',
        game_tag: '',
        game_meta: '',
        star_src: '',
        board_introduction: '',
        board_logo: '',
        board_side_image: ''
      },
      rules: {
        game_name: [{
          required: true,
          message: '请输入游戏名',
          trigger: 'blur'
        }],
        game_introduction: [{
          required: true,
          message: '请输入游戏简介',
          trigger: 'blur'
        }],
        type_id: [{
          required: true,
          message: '请选择游戏类型',
          trigger: 'blur'
        }],
        game_tag: [{
          required: true,
          message: '请输入游戏标签',
          trigger: 'blur'
        }],
        game_meta: [{
          required: true,
          message: '请输入游戏基础信息',
          trigger: 'blur'
        }],
        board_introduction: [{
          required: true,
          message: '请输入论坛介绍',
          trigger: 'blur'
        }],
        board_logo: [{
          required: true,
          message: '请上传游戏图标',
          trigger: 'blur'
        }],
        board_side_image: [{
          required: true,
          message: '请上传论坛侧边图',
          trigger: 'blur'
        }],
        star_src: [{
          required: true,
          message: '请上传游戏简介图',
          trigger: 'blur'
        }]
      },
      loading: false
    }
  },
  methods: {
    getData() {
      this.loading = true
      this.$http.post(this.$store.state.api + '/admin/game/get', {
        game_id: parseInt(this.$route.params.id)
      }).then(resp => {
        if (resp.data.code === 200) {
          this.form = resp.data.data
          this.loading = false
        } else this.$message.error(resp.data.message)
      })
    },
    getAllTypes() {
      this.$http.post(this.$store.state.api + '/admin/game/getAllType')
          .then(resp => {
            if (resp.data.code === 200) {
              this.types = resp.data.data.gametype
            } else this.$message.error(resp.data.message)
          })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('请完善信息')
          return false
        }
        let url = this.$store.state.api + '/admin/game/add'
        if (this.$route.params.id !== '-1') {
          url = this.$store.state.api + '/admin/game/modify'
          this.form.game_id = parseInt(this.$route.params.id)
        }
        this.$http.post(url, this.form)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$message.success('操作成功')
                this.$router.push('/board')
              } else this.$message.error(resp.data.message)
            })
      })
    },
    handleBoardSideImageUploadSuccess(response) {
      this.form.board_side_image = this.$store.state.fileHost + response.url
    },
    handleBoardLogoUploadSuccess(response) {
      this.form.board_logo = this.$store.state.fileHost + response.url
    },
    handleStarSrcUploadSuccess(response) {
      this.form.star_src = this.$store.state.fileHost + response.url
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
    if (this.$store.state.user.permission !== 1) {
      this.$message.error('您不是管理员')
      this.$router.go(-1)
      return
    }
    if (this.$route.params.id !== '-1') {
      this.getData()
    }
    this.getAllTypes()
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
