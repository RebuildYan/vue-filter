import { Filter } from './filter';
export default {
    install: function (Vue, options) {
        Vue.directive('input-filter', {
            bind(el, binding, vnode) {
                const defaultType = binding.arg || false;
                const options = binding.value;
                const filter = new Filter(el, defaultType, options);
                filter.init();
            }
        });
    }
};