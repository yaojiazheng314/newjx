<template>
	<el-popover
		placement="right"
		width="400"
		trigger="click">
		<el-tabs tab-position="left" style="height: 260px;">
			<el-tab-pane label="因子">
				<el-input
					v-model="searchItem"
					size="mini"
					placeholder="输入因子关键字搜索"
					style="width: 200px;"/>
				<el-table
					:data="itemParams.filter(item => !searchItem || item.bnsDataItemName.toLowerCase().includes(searchItem.toLowerCase()))"
					style="width: 100%"
					height="230">
					<el-table-column
						prop="bnsDataItemName"
						label="因子"
						width="180">
						<template slot-scope="scope">
							<el-tooltip 
								effect="dark" 
								:content="'共' + scope.row.personCount + '人员'" 
								placement="right">
								<span>{{ scope.row.bnsDataItemName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column label="操作" >
						<template slot-scope="scope">
							<el-button
								v-waves
								type="success" size="mini" 
								icon="el-icon-share" 
								@click="copyPeople(scope.row, itemFlag)"
								round>
								复制</el-button>	
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权重">
				<el-input
					v-model="searchCoef"
					size="mini"
					placeholder="输入权重关键字搜索"
					style="width: 200px;"/>
				<el-table
					:data="coefParams.filter(coef => !searchCoef || coef.bnsCoefName.toLowerCase().includes(searchCoef.toLowerCase()))"
					style="width: 100%"
					height="230">
					<el-table-column
						prop="bnsCoefName"
						label="权重"
						width="180">
						<template slot-scope="scope">
							<el-tooltip 
								effect="dark" 
								:content="'共' + scope.row.personCount + '人员'" 
								placement="right">
								<span>{{ scope.row.bnsCoefName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column label="操作" >
						<template slot-scope="scope">
							<el-button
								v-waves
								type="success" size="mini" 
								icon="el-icon-share" 
								@click="copyPeople(scope.row, coefFlag)"
								round>
								复制</el-button>	
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="公式">
				<el-input
					v-model="searchFormula"
					size="mini"
					placeholder="输入公式关键字搜索"
					style="width: 200px;"/>
				<el-table
					:data="formulaParams.filter(formula => !searchFormula || formula.formulaName.toLowerCase().includes(searchFormula.toLowerCase()))"
					style="width: 100%"
					height="230">
					<el-table-column
						prop="formulaName"
						label="公式"
						width="180">
						<template slot-scope="scope">
							<el-tooltip 
								effect="dark" 
								:content="'共' + scope.row.personCount + '人员'" 
								placement="right">
								<span>{{ scope.row.formulaName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column label="操作" >
						<template slot-scope="scope">
							<el-button
								v-waves
								type="success" size="mini" 
								icon="el-icon-share" 
								@click="copyPeople(scope.row, formulaFlag)"
								round>
								复制</el-button>	
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<el-button 
			slot="reference"
			class="guo-btn blue-btn"
			style="float: left;">
			复 制
		</el-button>
	</el-popover>	
</template>

<script>
import { getItemPerCopyParam } from '@/api/bnsDataItem'
import { getCoefPerCopyParam } from '@/api/bnsCoef'
import { getFormulaPerCopyParam } from '@/api/bnsFormula'
import waves from '@/directive/waves'
export default {
	directives: { waves },
	props: {
		objectData: {
			type: Object
		}
	},
	name: 'CopyPeople',
	data() {
		return {
			objectID: null,
			searchItem: '',
			searchCoef: '',
			searchFormula: '',
			itemParams: [],
			coefParams: [],
			formulaParams: [],
			itemFlag: 'item',
			coefFlag: 'coef',
			formulaFlag: 'formula'
		}
	},
	mounted() {
		const id = this.objectData.id
		if (id !== null && id !== '') {
			this.objectID = id
		}
		this.getItemPers()
		this.getCoefPers()
		this.getFormulaPers()
	},
	methods: {
		getItemPers() {
			var self = this
			getItemPerCopyParam().then(response => {
				self.itemParams = response.data
			})
		},
		getCoefPers() {
			var self = this
			getCoefPerCopyParam().then(response => {
				self.coefParams = response.data
			})
		},
		getFormulaPers() {
			var self = this
			getFormulaPerCopyParam().then(response => {
				self.formulaParams = response.data
			})
		},
		copyPeople(data, flag) {
			var self = this
			const copyData = {
				copyID: null,
				objectID: self.objectID,
				flag: flag
			}
			if (flag === self.itemFlag) {
				copyData.copyID = data.bnsDataItem
			}else if (flag === self.coefFlag) {
				copyData.copyID = data.bnsCoef
			}else if (flag === self.formulaFlag) {
				copyData.copyID = data.formula
			}
			self.$emit('copyPers', copyData)
		},
		refreshCopyParams(flag) {
			var self = this
			if (flag === self.itemFlag) {
				self.getItemPers()
			}else if (flag === self.coefFlag) {
				self.getCoefPers()
			}else if (flag === self.formulaFlag) {
				self.getFormulaPers()
			}
		}
	}
}
</script>

<style>
</style>
