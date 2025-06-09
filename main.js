export default function log_table(data, columns, type_key, truncate_rules, link) {
	log_table_all(get_truncated_data(data, columns, truncate_rules), columns, link)
	console.table(create_summary(data, type_key))
}
function get_truncated_data(data, columns, truncate_rules) {
	const truncate_string = (str, num) => typeof str === 'string' && str.length > num ? `${str.slice(0, num)}...` : str
	return data.map(item => {
		const row = {}
		for (const col of columns) {
			const value = item[col]
			row[col] = truncate_rules[col] ? truncate_string(value, truncate_rules[col]) : value
		}
		return row
	})
}
function create_summary(data, type_key) {
	const data_classified = data.reduce((acc, item) => {
		const key = item[type_key]?.trim().toLowerCase() || 'unknown'
		if (!acc[key]) acc[key] = []
		    acc[key].push(item)
		    return acc
	}, {})

	const summary = Object.entries(data_classified).map(([key, items]) => ({
		Tipo: key.charAt(0).toUpperCase() + key.slice(1),
		Cantidad: items.length
	}))

	summary.unshift({ Tipo: 'Total captured', Cantidad: data.length }) // beginning

	return summary
}
function log_table_all(data, columns, link) {
	// Get maximum lengths for each column
	const max_lengths = columns.map(col => get_max_column_length(data, col))

	const header = columns.map((col, i) => col.padEnd(max_lengths[i])).join(' | ')
	console.log(`| ${header} |`)

	const separator = columns.map((col, i) => '-'.repeat(Math.max(col.length, max_lengths[i]))).join(' | ')
	console.log(`| ${separator} |`)

	// Rows
	data.forEach(row => {
		const row_values = columns.map((col, i) => String(row[col]).padEnd(max_lengths[i]))
		let row_log = `| ${row_values.join(' | ')} |`

		// Add link if necessary
		if (link) {
            const hyperlink = `\x1b]8;;${link}\x1b\\🔗 Link\x1b]8;;\x1b\\`
            row_log += ` ${hyperlink}`
		}
		console.log(row_log)
	})
}
function get_max_column_length(truncated_data, column) {
	// Calculate the max length of each column for dynamic padding
	const get_max_length = (arr, key) => Math.max(...arr.map(item => String(item[key]).length))
	return size_length(column, get_max_length(truncated_data, column))
}
function size_length(column_name, largest_data) {
	const column_name_length = column_name.length
	const largest_length = column_name_length > largest_data ? column_name_length : largest_data
	return largest_length
}