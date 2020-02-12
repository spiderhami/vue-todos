'use strict';

Vue.directive('focus', {
    inserted: function(el) {
        el.focus();
    }
})

const componentContainer = {
    template: '#container',
    data: function() {
        return {
            todos: [],
            todosCompleted: [],
            userInput: '',
            todoCurrent: {}, // 鼠标当前停留的todo项
            nextID: 0,
            todoEdit: {}, // 正被编辑的todo项
            isAllTick: false // 所有todo事项是否都已完成
        }
    },
    computed: {
        // 未完成todo数量
        leftCount: function() {
            const num = this.todos.length - this.todosCompleted.length;
            if (num === 0 && this.todos.length > 0) {
                this.isAllTick = true;
            } else {
                this.isAllTick = false;
            }
            return num;
        },
        tickClass: function() {
            return {
                black: this.isAllTick,
                vh: this.todos.length === 0
            }
        }
    },
    methods: {
        addTodo() {
            this.todos.push({ id: this.nextID, name: this.userInput });
            this.nextID++;
            this.userInput = '';
        },
        deleteTodo(todo, index) {
            const i = this.todosCompleted.indexOf(todo.id); // 完成列表中的index
            if (i !== -1) {
                this.todosCompleted.splice(i, 1);
            }
            this.todos.splice(index, 1);
        },
        removeCompleted() {
            this.todos = this.todos.filter(todo => {
                return this.todosCompleted.indexOf(todo.id) === -1;
            });
            this.todosCompleted = [];
        },
        turnEdit(todo, e) {
            if (e.target.type === 'checkbox') {
                return;
            }
            this.todoEdit = todo;
        },
        tickTodo() {
            if (!this.isAllTick) {
                this.todosCompleted = this.todos.reduce((arr, todo) => {
                    arr.push(todo.id);
                    return arr;
                }, []);
            } else {
                this.todosCompleted = [];
            }
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
