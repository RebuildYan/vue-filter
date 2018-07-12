import Filter from './filter';
import { StrategyOption } from './strategy';

export default {
    install: function(vue: any, options: StrategyOption) {
        vue.directive('input-filter', {
            bind(el: any, binding: any, vnode: any) {
                const defaultType = binding.arg || false;
                const options = binding.value;
                const filter = new Filter(el, defaultType, options);
            },
        });
    },
};
