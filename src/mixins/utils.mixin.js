export default {
	_makeKey(prefix, index)
	{
		return prefix + '__' + index
	},
	_classAttr()
	{
		let classes = []

		for (let i = 0; i < arguments.length; i++) {
			const argument = arguments[i]

			if (Array.isArray(argument)) {
				for (let j = 0; j < argument.length; j++) {
					const item = argument[j]
					if (typeof item === 'string') classes.push(item)
				}
			} else if (typeof argument === 'object') {
				for (const key in argument) {
					if (argument[key]) classes.push(key)
				}
			} else if (typeof argument === 'string') {
				classes.push(argument)
			}
		}
		return classes.filter((value, index, self) => self.indexOf(value) === index)
	},
	_slotHasContent(slot, data)
	{
		if (!slot) return false
		const vnodes = slot(data)
		return vnodes && vnodes.length
	}
}