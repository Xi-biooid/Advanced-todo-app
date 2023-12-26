window.addEventListener("load", () => {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.getElementById('name');
    const newTodoForm = document.getElementById('new-todo-form');

    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime(),
        };

        // Use unshift to add the new todo at the beginning of the array
        todos.unshift(todo);

        localStorage.setItem('todos', JSON.stringify(todos));
        e.target.reset();

        // Start updating the time every minute
        const updateTimeInterval = setInterval(() => {
            displayTodos();
        }, 60000); // 60000 milliseconds = 1 minute

        // Display todos immediately after creation
        displayTodos();
    });

    function displayTodos() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');
            const dateInfo = document.createElement('div');

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');

            if (todo.category === 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }

            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');
            dateInfo.classList.add('date-info');

            content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
            edit.innerHTML = 'Edit';
            deleteButton.innerHTML = 'Delete';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(dateInfo); // Insert dateInfo before actions
            todoItem.appendChild(actions);

            todoList.appendChild(todoItem);

            if (todo.done) {
                todoItem.classList.add('done');
            }

            input.addEventListener('click', (e) => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');
                } else {
                    todoItem.classList.remove('done');
                }

                displayTodos();
            });

            edit.addEventListener('click', () => {
                const input = content.querySelector('input');
                input.removeAttribute('readonly');
                input.focus();

                input.addEventListener('blur', (e) => {
                    input.setAttribute('readonly', true);
                    todo.content = e.target.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    displayTodos();
                });
            });

            deleteButton.addEventListener('click', () => {
                todos = todos.filter(t => t !== todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                displayTodos();
            });

            // Format and display creation date and time
            const createdDate = new Date(todo.createdAt);
            const createdDateTime = createdDate.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
            dateInfo.innerHTML = `<em>Created on ${createdDateTime}</em>`;
        });
    }

    // Initial display
    displayTodos();
});
