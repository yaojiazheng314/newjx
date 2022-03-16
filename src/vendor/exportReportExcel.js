export function handleDownloadExcel(dataList, filename, headers, filterVals) {
	import('@/vendor/Export2Excel').then(excel => {
		const tHeader = headers
		const filterVal = filterVals
		const list = dataList
		// console.log(dataList)
		const data = formatJson(filterVal, list)
		excel.export_json_to_excel({
		  header: tHeader,
		  data,
		  filename,
		  autoWidth: true,
		  bookType: 'xlsx'
		})
	})
}
function formatJson(filterVal, jsonData) {
	return jsonData.map(v => filterVal.map(j => {
		if (j === 'timestamp') {
			return parseTime(v[j])
		} else {
			return v[j]
		}
	}))
}		