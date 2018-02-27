import { Filter } from './filter';
export default {
    bind(el, binding, vnode) {
        const defaultType = binding.arg || false;
        const options = binding.value;
        const filter = new Filter(el, defaultType, options);
        filter.init();
    }
};
