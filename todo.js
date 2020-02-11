'use strict';

const componentTodo = {
    template: '#todo',
    props: ['isEditing', 'item']
}

const componentContainer = {
    template: '#container',
    components: {
        'todo-list': componentTodo
    },
    data: function() {
        return {
            todoList: ['aa', 'bb'],
            isEditing: false
        }
    },
    methods: {
        toggle: function() {
            this.isEditing = true;
        }
    }
};

const app = new Vue({
    el: '#app',
    components: {
        'todo-component': componentContainer
    }
});

/* */

// 为对象数组排序
function sortByKey(array, key) {
    return array.sort((a, b) => (a[key] < b[key]) ? -1 : 1);
}
