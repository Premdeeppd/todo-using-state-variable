let globalId = 1;
    let todoState = [];
    let oldTodoState = [];

    function createChild(title, description, id) {
      const div = document.createElement("div");
      div.id = id;
      div.setAttribute('class', 'todo-item');
      const titleElement = document.createElement("h3");
      titleElement.innerHTML = title;
      const descriptionElement = document.createElement("p");
      descriptionElement.innerHTML = description;
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.onclick = function() {
        const parent = document.getElementById("todo-list");
        const child = document.getElementById(id);
        parent.removeChild(child);
        todoState = todoState.filter(todo => todo.id !== id);
      }
      deleteButton.setAttribute('class', 'done-btn');
      div.appendChild(titleElement);
      div.appendChild(descriptionElement);
      div.appendChild(deleteButton);
      return div;
    }

    function DToDom(todo) {
      const title = todo.title;
      const description = todo.description;
      const id = todo.id;
      const parent = document.getElementById("todo-list");
      parent.appendChild(createChild(title, description, id));
      
    }

    function removeTodoFromDom(todo) {
      const parent = document.getElementById("todo-list");
      const child = document.getElementById(todo.id);
      parent.removeChild(child);
    }

    function updateTodoInDom(oldTodo, newTodo) {
      const parent = document.getElementById("todo-list");
      const child = document.getElementById(oldTodo.id);
      parent.removeChild(child);
      parent.appendChild(createChild(newTodo.title, newTodo.description, newTodo.id));
      todoState = todoState.map(todo => {
        if (todo.id === oldTodo.id) {
          return newTodo;
        }
        return todo;
      }); 
    }

    function updateState(newTodos) {
      // calculate the diff b/w newTodos and oldTodos.
      // More specifically, find out what todo-list are - 
      // 1. added
      // 2. deleted
      // 3. updated
      const added = [];
      const deleted = [];
      const updated = [];
      // calculate these 3 arrays
      // call D, removeTodo, updateTodo functions on each of the
      // elements
      //console.log(oldTodoState.length);
      for (let i = 0; i < newTodos.length; i++) {
        
        const newTodo = newTodos[i];
        console.log(oldTodoState,newTodo);
        const oldTodo = oldTodoState.find(todo => todo.id === newTodo.id);
        //console.log(newTodo, oldTodo);
        if (!oldTodo) {
          added.push(newTodo);
        } 
        else {
          if (oldTodo.title !== newTodo.title || oldTodo.description !== newTodo.description) {
            updated.push({ oldTodo, newTodo });
          }
        }
      }
      for (let i = 0; i < oldTodoState.length; i++) {
        const oldTodo = oldTodoState[i];
        const newTodo = newTodos.find(todo => todo.id === oldTodo.id);
        if (!newTodo) {
          deleted.push(oldTodo);
        }
      }
      for (let i = 0; i < added.length; i++) {
        DToDom(added[i]);
      }
      for (let i = 0; i < deleted.length; i++) {
        removeTodoFromDom(deleted[i]);
      }
      for (let i = 0; i < updated.length; i++) {
        updateTodoInDom(updated[i].oldTodo, updated[i].newTodo);
      }

      
      oldTodoState = newTodos.slice();
    }

    function addToDo() {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      todoState.push({
        title: title,
        description: description,
        id: globalId++,
      });
      updateState(todoState);
    }