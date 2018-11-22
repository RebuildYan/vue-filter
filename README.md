# vue-input-filter
a vue directive to filter input

> 轻量级限制用户输入自定义指令，可对中文输入法生效。
>
> 预设 number(纯数字)、letter(纯字母)两种输入类型。

## How to use ?

### step 1. Install vue-input-filter
安装依赖包
```shell
npm install vue-input-filter --save
```

指令注册
```javascript
import inputFilter from 'vue-input-filter';
Vue.use(inputFilter);
```



### step 2. Use it

#### 使用预设类型

```html
<input v-input-filter:number>
<input v-input-filter:letter>
```

#### 使用自定义类型

```html
<input v-input-filter="options">
```

```javascript
export default {
    data () {
        return {
        	options: {
				legalReg: [],
                illegalReg: [],
                legalKeyCode: [8, 32, 37, 38, 39, 40, 46], // 默认允许的keycode
                legalKeyCodeRange: [],
                illegalKeyCode: [],
                illegalKeyCodeRange: [],
                oninput: null,
                onkeydown: null
            }  
        };
    }
};
```



#### options字段说明

##### legalReg

字段名：`legalReg`

类型：**Array**

含义：合法字符正则表达式数组，主要针对中文输入法输入内容（包括复制粘贴内容），当任一正则匹配通过时，允许输入。

示例：

```javascript
legalReg = [/^[0-9]{1,}$/, /^[a-zA-Z]{1,}$/]; // 输入内容为字母或者数字时允许输入
```

##### illegalReg

字段名：`illegalReg`

类型：**Array**

含义：非法字符正则表达式数组，主要针对中文输入法输入内容（包括复制粘贴内容），当任一正则匹配通过时，不允许输入。

示例：

```javascript
illegalReg = [/^[0-9]{1,}$/, /^[a-zA-Z]{1,}$/]; // 输入内容为字母或者数字时不允许输入
```

##### legalKeyCode

字段名：`legalKeyCode`

类型：**Array**

含义：合法的按键keycode，针对英文输入法，当keycode存在于数组中时，允许输入，否则屏蔽按键事件。

示例：

```javascript
legalKeyCode = [32, 8]; // 按键为spacebar或者backspace时，允许输入
```

##### legalKeyCodeRange

字段名：`legalKeyCodeRange`

类型：**Array**

含义：合法的按键keycode范围，针对英文输入法，当keycode在任一范围内时，允许输入，否则屏蔽按键事件。

示例：

```javascript
legalKeyCodeRange = [
    {
        min: 1,
      	max: 20
    },
  	{
        min: 25,
      	max: 60
    }
]; // 按键keycode在1~20或者25~60时，允许输入
```

##### illegalKeyCode

字段名：`illegalKeyCode`

类型：**Array**

含义：非法的按键keycode，针对英文输入法，当keycode存在于数组中时，屏蔽按键事件。

示例：

```javascript
illegalKeyCode = [32, 8]; // 按键为spacebar或者backspace时，不允许输入
```

##### illegalKeyCodeRange

字段名：`illegalKeyCodeRange`

类型：**Array**

含义：非法的按键keycode范围，针对英文输入法，当keycode在任一范围内时，屏蔽按键事件。

示例：

```javascript
illegalKeyCodeRange = [
    {
        min: 1,
      	max: 20
    },
  	{
        min: 25,
      	max: 60
    }
]; // 按键keycode在1~20或者25~60时，不允许输入
```

##### oninput

字段名：`oninput`

类型：**Function**

含义：绑定指令的dom `oninput`事件回调函数，处理输入的内容。默认为null，采用指令默认处理方式（使用`legalReg illegalReg`进行正则判断）。

示例:

```javascript
oninput = function (input) { // input 为每次输入的内容
	return input === 'y'; // 返回 true 或者 false, true 则允许输入， false则不允许
};
```

##### onkeydown

字段名：`onkeydown`

类型：**Function**

含义：绑定指令的dom `onkeydown`事件回调函数，处理按键keycode。默认为null，采用指令默认处理方式（使用`legalKeyCode legalKeyCodeRange illegalKeyCode illegalKeyCodeRange`进行判断）。

示例:

```javascript
onkeydown = function (keycode) { // keycode 为按键keyCode
	return keycode === 32; // 返回 true 或者 false, true 则允许输入， false则不允许,阻止按键事件
};
```

##### 注意

指令分为两个处理阶段：按键阶段、输入内容阶段，其中按键阶段主要针对英文输入法，输入内容阶段针对中文输入法。

配置对象中各个属性在两阶段中的优先级如下：

- 按键阶段: `onkeydown` > `legalKeyCode` = `legalKeyCodeRange` > `illegalKeyCode` = `illegalKeyCodeRange`
- 输入内容阶段：`oninput` > `legalReg` > `illegalReg`

优先级靠前的任意属性判断通过之后，都不会针对后面的属性进行判断。



#### 完整示例

```vue
<template>
	<input v-input-filter:number>
	<input v-input-filter:letter>
	<input v-input-filter="options">
</template>
<script>
 	export default {
    	data () {
            return {
            	options: { // 仅允许输入数字、大小写字母、小数点
                    legalReg: [/^[0-9]{1,}$/, /^[a-zA-Z]{1,}$/],
                  	legalKeyCode: [8, 32, 37, 38, 39, 40, 46, 190],
                  	legalKeyCodeRange: [
                        {
                            min: 65,
                            max: 90
                        },
                      	{
                            min: 48,
                            max: 57
                        },
                        {
                            min: 96,
                            max: 105
                        }
                    ]
                }  
            };
        }  
    };
</script>
```

