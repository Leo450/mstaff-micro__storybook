export default {
	_formInputAssert(value, asserts)
	{
		if (typeof asserts === 'function') return asserts(value)
		if (Array.isArray(asserts)) {
			let errors = []
			for (let i = 0; i < asserts.length; i++) {
				const assertElement = asserts[i]
				if (typeof assertElement === 'string') {
					// String asserts
					switch (assertElement) {
						case 'required':
							if (
								value === undefined
								|| value === null
								|| value === ''
								|| (Array.isArray(value) && !value.length)
							) errors.push('Champ requis')
							break
						case 'email':
							if (value && !RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,7}))$').test(value)) errors.push('Email non valide')
							break
						case 'password':
							if (value && !RegExp('^(?=.{12,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\\W).*$').test(value)) errors.push('Mot de passe non valide')
							break
					}
				} else if (Array.isArray(assertElement)) {
					// Array asserts
					if (!assertElement[0] || !assertElement[1]) continue
					switch (assertElement[0]) {
						case 'max':
							if (!value || !value.length <= assertElement[1]) errors.push('Longueur maximale de ' + assertElement[1] + ' caractères')
							break
						case 'min':
							if (!value || !value.length >= assertElement[1]) errors.push('Longueur minimale de ' + assertElement[1] + ' caractères')
							break
					}
				} else if (typeof assertElement === 'function') {
					// Function asserts
					const result = assertElement(value)
					if (typeof result === 'string') errors.push(result)
				}
			}
			return errors
		}
		return []
	},
	_formAssert(values, asserts)
	{
		const errors = {}

		for (const key in values) {
			if (asserts[key]) {
				const fieldErrors = this._formInputAssert(values[key], asserts[key])
				if (fieldErrors.length) {
					errors[key] = fieldErrors
				}
			}
		}

		return errors
	}
}