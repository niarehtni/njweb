<template>
  <div style="width: 100%" v-if="isshow">
    <i-col span="21" offset="1">
      <FormItem :label="itemLabel" :prop="ruleText" :required="required">
      	<Row>
      		<i-col span="3">
        <Upload action="" :before-upload="handleUpload">
          <Button type="ghost" icon="ios-cloud-upload-outline" :disabled="thisDis">浏览</Button>
        </Upload>
        </i-col>
        <span v-if="thisValue && show ">
        	<i-col span="18">
        	<Input v-model="thisValue" readonly="readonly" >
    				<span slot="prepend">
    					<Icon type="folder" size="16"></Icon>
    				</span>
    			</Input>
    			</i-col>
    			<i-col span="3">
        	<Button type="text"  @click="uploadFile1" v-if="loadingStatus">
        		上传
        	</Button>
        	<Button type="text"  @click="uploadFile2" v-if="!loadingStatus">
        		下载
        	</Button>
        	</i-col>
        </span>
        </Row>
      </FormItem>
    </i-col>
    <i-col span="21" offset="1" v-if="message">
      <div class="message">{{message}}</div>
    </i-col>
  </div>
</template>
<script>
	import { getDataLevelUserLoginSenior, getDataLevelUserLogin, uploadFile } from '../../../axios/axios'
//  import pubsources from '../../../lib/pub_source'
  import { isSuccess, deepCopy } from '../../../lib/util'

  export default {
    data() {
      return {
      	file: '',
      	filekey: this.fileKey,
      	loadingStatus: false,
        thisValue: this.value,
        thisId: this.id,
        isshow: this.ruleText in this.show,
        thisDis: this.disabled ? this.disabled : !this.dis[this.ruleText],
      }
    },
    props: {
    	fileKey: String,
      value: String,
      id: String,
      itemLabel: String,
      message: String,
      required: Boolean,
      ruleText: String,
      disabled: Boolean,  // 是否可编辑
      show: Object,  // 是否显示
      dis: Object, // 是否可编辑plus
    },
    methods: {
      formValidate() {
        this.$emit('on-change', this.thisId)
      },
      change111() {
        let t = this
        t.$emit('change', t)
      },
    	handleUpload(file) {
    		this.file = file
    		this.thisValue = file.name
    		this.loadingStatus = true
    	},
    	uploadFile1() {
    		const t = this
        const formData = new FormData()
        formData.append('upfile', t.file)
        uploadFile(formData).then(res => {
          for (const key in res.data) {
          	t.filekey = res.data[key]
          	t.thisValue = key
        		t.thisId = key + ':' + res.data[key]
          }
            t.$Modal.success({
              title: this.$t('reminder.suc'),
              content: '上传成功',
              onOk: () => {
              	t.loadingStatus = false
              },
            })
        }).catch(() => {
          t.$Modal.error({
            title: this.$t('reminder.err'),
            content: this.$t('reminder.errormessage'),
          })
        })
    	},
    	uploadFile2() {
    		const t = this
    		let data = {
          _mt: 'userMgmt.getfiletoken',
          isprivate: true,
          logType: '导出',
          filekey: t.filekey,
          expiresecs: 180,
        }
        getDataLevelUserLogin(data).then((res) => {
          if (isSuccess(res, t)) {
            localStorage.pageOpenedListAll = localStorage.pageOpenedList
            window.location.href = pubsource.pub_prvf_downlink + res.data.content[0].value + '&fname=' + encodeURI(t.filekey)
            this.$store.state.app.pageOpenedList = JSON.parse(localStorage.pageOpenedListAll)
          }
        }).catch(() => {
          t.$Modal.error({
            title: this.$t('reminder.err'),
            content: this.$t('reminder.errormessage'),
          })
        })
    	},
    },
    watch: {
      thisId(val) {
        this.formValidate()
      },
      thisValue(val) {
        this.change111()
      },
      show: {
        handler: function(val) {
          this.isshow = this.ruleText in this.show
        },
        deep:true,
      },
      dis: {
        handler: function(val) {
          this.thisDis = this.disabled ? this.disabled : !this.dis[this.ruleText]
        },
        deep:true,
      },
    },
  }
</script>
<style lang="scss" scoped>
  .message{
    width: 100%;
    border: 2px solid #FEF1DC;
    min-height: 33px;
    padding: 4px 10px;
    line-height: 24px;
    margin-bottom: 24px;
    background-color: #FFF9E3;
  }
</style>
