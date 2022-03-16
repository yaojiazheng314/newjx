<template>
	<div id="incomeAdjustEditDialog">
		<el-dialog 
			:title="dialogStatus" 
			:show-close="showClose"
			:close-on-click-modal="false"
			:visible.sync="dialogFormVisible">
			<el-form 
				ref="personForm"
				:rules="rules"
				:model="personForm" 
				:inline="true"
				label-position="right" 
				label-width="80px" 
				style="height: 450px; width: 600px; margin-left:50px;">
				<el-form-item label="年月" prop="yearMonth">
					<el-date-picker
						v-model="personForm.yearMonth"
						type="month"
						placeholder="选择年月"
						format="yyyy 年 M 月"
						value-format="yyyy-MM"
						:clearable="false"
						:editable="false"
					
						class="searchClass" :disabled="type">
					</el-date-picker>
				</el-form-item>
				
				<el-form-item label="收入类别" prop="incomeType">
					<el-select 
						v-model="personForm.incomeType" 
						filterable clearable 
						placeholder="选择成本项目"
						style="width: 150px;"
						:disabled="type">
						<el-option 
							v-for="f in sflbParams" 
							:key="f.id" 
							:label="f.name" 
							:value="f.id">
						</el-option>
					</el-select>
				</el-form-item>	
				<!-- 调增 -->
				<el-form-item label="调增科室" prop="biDeptLinkId1">
					<el-select 
						v-model="personForm.biDeptLinkId1" 
						filterable clearable
						remote 
						:remote-method="remoteMethodAdd"
						placeholder="选择或输入科室"
						style="width: 230px;"
						:loading="loading"
						:disabled="type">
						<el-option 
							v-for="item in departmentParamsAdd" 
							:key="item.id" 
							:label="item.itfDepartmentName + '_' + item.mzbs+ '_' + item.hospName" 
							:value="item.id">
							<span style="float: left">{{ item.itfDepartmentName }}</span>
					    <span style="float: right; color: #8492a6; font-size: 13px">
							{{ item.mzbs }}
						</span>
						<span style="float: right; color: #8492a6; font-size: 13px">
							{{ item.hospName }}
									</span>
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item label="原金额" prop="originalValue1">
					<el-input type = 'number'
						v-model.trim="personForm.originalValue1" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
				<el-form-item label="调增比例" prop="ratio1">
					<el-input type = 'number'
						v-model.trim="personForm.ratio1" 
						style="width: 80px;"
						:disabled="type">
					</el-input>%
				</el-form-item>
				<el-form-item label="调增金额" prop="modifyValue1">
					<el-input 
						v-model.trim="personForm.modifyValue1" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
				<!-- 调减 -->
				<el-form-item label="调减科室" prop="biDeptLinkId2">
					<el-select 
						v-model="personForm.biDeptLinkId2" 
						filterable clearable 
						remote 
						:remote-method="remoteMethodSub"
						placeholder="选择或输入科室"
						style="width: 230px;"
						:loading="loading"
						:disabled="type">
						<el-option 
							v-for="item in departmentParamsSub" 
							:key="item.id" 
							:label="item.itfDepartmentName + '_' + item.mzbs+ '_' + item.hospName" 
							:value="item.id">
							<span style="float: left">{{ item.itfDepartmentName }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">
							{{ item.mzbs }}
						</span>
						<span style="float: right; color: #8492a6; font-size: 13px">
							{{ item.hospName }}
									</span>
						</el-option>
					</el-select>
				</el-form-item>	
				<el-form-item label="原金额" prop="originalValue2">
					<el-input type = 'number'
						v-model.trim="personForm.originalValue2" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
				<el-form-item label="调减比例" prop="ratio2">
					<el-input type = 'number'
						v-model.trim="personForm.ratio2" 
						style="width: 80px;"
						:disabled="type">
					</el-input>%
				</el-form-item>
				<el-form-item label="调减金额" prop="modifyValue2">
					<el-input  type = 'number'
						v-model.trim="personForm.modifyValue2" 
						style="width: 200px;"
						:disabled="type">
					</el-input>
				</el-form-item>
				<el-form-item label="调整原因" prop="modifyreason">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3}" v-model.trim="personForm.modifyreason" style="width:400px;" :disabled="type">
          			</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">返 回</el-button>
				<el-button 
					type="primary"
					@click="saveDataInfo" v-if="!type">
					确 定
					</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { saveIncomeAdjustData } from "@/api/incomAdjust";
import { fuzzyQueryDeptLinkParam } from "@/api/hisDepartment";

export default {
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    personData: {
      type: Object
    },
    dialogStatus: {
      type: String
    },
    departmentParams: {
      type: Array
    },
    sflbParams: {
      type: Array
    }
  },
  name: "PersonEditDialog",
  data() {
    return {
      showClose: false,

      personForm: {
        id: null,
        yearMonth: null,
        incomeType: null,
        biDeptLinkId1: null,
        originalValue1: 0.0,
        ratio1: 0.0,
        modifyValue1: 0.0,
        biDeptLinkId2: null,
        originalValue2: 0.0,
        ratio2: 0.0,
        modifyValue2: 0.0,
        modifyreason: "",
        modifyType1: 1,
        modifyType2: 0,
        subId1: null,
        subId2: null
      },
      rules: {
        yearMonth: [
          { required: true, message: "请输入调整年月", trigger: "blur" }
        ],
        incomeType: [
          { required: true, message: "请选择收入类别", trigger: "blur" }
        ]
      },
      type: false, //查看
      departmentParamsAdd: [],
      departmentParamsSub: [],
      loading: false
    };
  },
  mounted() {
    if (this.dialogStatus == "查看收入调整信息") {
      this.type = true; //查看
    }
    // this.getProfessTitleParams()
    const data = this.personData;
    if (data.id !== null && data.id !== "") {
      this.personForm = Object.assign({}, data);
	}
	this.remoteMethodAdd(this.personData.departmentCode1)
	this.remoteMethodSub(this.personData.departmentCode2)

  },
  watch: {
    personForm: {
      handler(val, oldVal) {
        val.modifyValue1 =
          parseFloat(val.originalValue1) * parseFloat(val.ratio1) / 100.0;
        val.modifyValue2 =
          0 - parseFloat(val.originalValue2) * parseFloat(val.ratio2) / 100.0;
      },
      deep: true
    }
  },

  methods: {
    /* 获取收费类别参数列表 */
    getSflbParams() {
      getChargeTypeParam().then(res => {
        this.sflbParams = res.data;
      });
    },
    // getCostTypeParams() {
    // 	var self = this
    // 	getCostTypeList().then(response => {
    // 	  self.costTypeParams = response.data
    // 	})
    // },
    saveDataInfo() {
      var self = this;
      // console.log(self.personForm);
      self.$refs["personForm"].validate(valid => {
        if (valid) {
          saveIncomeAdjustData(self.personForm).then(response => {
            self.$notify({
              title: "成功",
              message: response.msg,
              type: "success",
              duration: 6000
            });
            if (self.personForm.id === null || self.personForm.id === "") {
              //连续创建
              self.resetForm();
              self.$refs["personForm"].clearValidate();
            }
            self.$emit("getList");
            self.$emit("closedialog");
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      (this.personForm.id = null),
        (this.personForm.yearMonth = null),
        (this.personForm.incomeType = null),
        (this.personForm.biDeptLinkId1 = null),
        (this.personForm.originalValue1 = 0.0),
        (this.personForm.ratio1 = 0.0),
        (this.personForm.modifyValue1 = 0.0),
        (this.personForm.biDeptLinkId2 = null),
        (this.personForm.originalValue2 = 0.0),
        (this.personForm.ratio2 = 0.0),
        (this.personForm.modifyValue2 = 0.0),
        (this.personForm.modifyreason = ""),
        (this.personForm.modifyType1 = 1),
        (this.personForm.modifyType2 = 0),
        (this.personForm.subId1 = null),
        (this.personForm.subId2 = null);
    },
    closeDialog() {
      // this.$refs['personForm'].clearValidate()
      // this.resetForm()
      this.$emit("closedialog");
    },
    remoteMethodAdd(query) {
			// console.log(query);
      if (query !== null) {
		this.loading = true;
		// console.log(query)
		fuzzyQueryDeptLinkParam({keyword:query}).then((res) => {
			if(res)
			{
				this.loading = false;
				this.departmentParamsAdd = res.data
			}
		})
        
      } else {
        this.departmentParamsAdd = [];
      }
    },
    remoteMethodSub(query) {
		if (query !== null) {
			// console.log(query);
		this.loading = true;
		fuzzyQueryDeptLinkParam({keyword:query}).then((res) => {
			if(res)
			{
				this.loading = false;
				this.departmentParamsSub = res.data
			}
		})
        
      } else {
        this.departmentParamsSub = [];
      }
	}
  }
};
</script>

<style>
</style>
