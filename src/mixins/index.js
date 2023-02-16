import FormMixin from '@/mixins/form.mixin'
import UtilsMixin from '@/mixins/utils.mixin'

export default {
	methods: {
		...FormMixin,
		...UtilsMixin
	}
}