<template>
	<el-form 
		ref="form" 
		label-width="90px"
		:label-position="labelPosition">
		
		<el-form-item>
			<span 
				style="font-weight: normal;"
				slot="label">{{ label1 }}</span>
			
			<!-- 富文本 -->
			<edit-form 
				v-if="loadStatus"
				ref="editor"
				v-model="fulltext"
				:disabled="disabled"
				:height="500"/>
			
		</el-form-item>
		
	</el-form>
</template>

<script>
import EditForm from '@/components/Tinymce'
export default {
	name: 'fbr-ff-bdf-edit-reason-form',
	components: { EditForm },
	props: {
		parentFulltext: String,  // 富文本
	},
	data() {
		return {
			// attr
			labelPosition: 'left',
			label1: "分配说明：",
			disabled: false,
			loadStatus: false,
			// data
			fulltext: ""
		}
	},
	created() {
		this.fulltext = this.parentFulltext === undefined ? "" : this.parentFulltext
		this.loadStatus = true
	},
	methods: {
		wordcount() {
		  let wordcount = this.$refs.editor.wordcount()
		  return wordcount
		},
		
		getContent() {
		  return this.fulltext === undefined ? "" : this.fulltext
		}
		
	}
	
}
</script>

<style>
</style>
