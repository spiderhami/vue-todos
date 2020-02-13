'use strict';

// 修改既有todo时autofocus
Vue.directive('focus', {
    inserted: function(el) {
        el.focus();
    }
})

const componentContainer = {
    template: '#container',
    data: function() {
        return {
            // Array -> [{ 'id': number, 'name': string }, ...]
            todos: JSON.parse(localStorage.getItem('todo-all')) || [],
            // Array -> [ todo.id, ...]
            todosCompleted: JSON.parse(localStorage.getItem('todo-completed')) || [],
            // 为每个todo分配的唯一id值
            // Number
            nextID: JSON.parse(localStorage.getItem('todo-tally')) || 0,
            userInput: '',
            todoCurrent: {}, // 鼠标当前停留的todo项
            todoEdit: {}, // 正被编辑的todo项
            isAllTick: false, // 所有todo事项是否都已完成
            // todos分类名
            // String -> 'all', 'active', 'completed'
            group: 'all'
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
        // 全选按钮的动态类
        tickClass: function() {
            return {
                black: this.isAllTick,
                vh: this.todos.length === 0
            }
        }
    },
    methods: {
        addTodo() {
            if (this.userInput === '') {
                return;
            }
            this.todos.push({ id: this.nextID, name: this.userInput });
            this.nextID++;
            this.userInput = '';
        },
        deleteTodo(todo, index) {
            // 找到当前todo在complete list中的位置
            const i = this.todosCompleted.indexOf(todo.id);
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
        // 将当前todo设为正在编辑项（以触发输入框组件的出现）
        turnEdit(todo, e) {
            // 双击checkbox不会进入编辑状态
            if (e.target.type === 'checkbox') {
                return;
            }
            this.todoEdit = todo;
        },
        // 将所有todo勾为complete（全选），或将所有todo取消complete状态（全不选）
        tickTodo() {
            if (!this.isAllTick) {
                this.todosCompleted = this.todos.reduce((arr, todo) => {
                    arr.push(todo.id);
                    return arr;
                }, []);
            } else {
                this.todosCompleted = [];
            }
        },
        // 动态类（display: none)是否加载
        displayOrNot(todo) {
            if (this.group === 'completed') {
                // 不在complete list里即是active的，就屏蔽之(return true => display none)
                return this.todosCompleted.indexOf(todo.id) === -1 ? true : false;
            } else if (this.group === 'active') {
                // active和completed互斥
                return this.todosCompleted.indexOf(todo.id) !== -1 ? true : false;
            }
        }
    },
    updated() {
        localStorage.setItem('todo-tally', JSON.stringify(this.nextID));
        localStorage.setItem('todo-all', JSON.stringify(this.todos));
        localStorage.setItem('todo-completed', JSON.stringify(this.todosCompleted));
    }
};

const app = new Vue({
    el: '#app',
    components: {
        'todo-component': componentContainer
    }
});
