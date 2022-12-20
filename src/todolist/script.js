import Interactive from './interactive.js';

const removeCompleted = document.querySelector('.remove-completed');
const refreshIcon = document.querySelector('.reload-icon');
const todo = document.querySelector('.todo-description');
const todoList = document.querySelector('.todo-list');
class ToDoListClass {
  constructor() {
    this.toDoInfo = JSON.parse(localStorage.getItem('todo')) || [];
  }

  // add new task
  addToDo(toDoDescription) {
    const toDoObject = {
      description: toDoDescription,
      completed: false,
      index: this.toDoInfo.length,
    };
    this.toDoInfo.push(toDoObject);
    localStorage.setItem('todo', JSON.stringify(this.toDoInfo));
    return toDoDescription;
  }

  // create and add new task
  createToDo(toDoValue, index) {
    const listItem = document.createElement('li');
    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('d-flex', 'py-1', 'container', 'align-items-center', 'justify-content-between');
    const listDescription = document.createElement('input');
    listDescription.classList.add('container', 'inputvalue', 'border-0', 'my-auto');
    listDescription.value = toDoValue;
    listDescription.readOnly = true;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    if (this.toDoInfo[index].completed === true) {
      listDescription.classList.add('text-decoration-line-through');
      checkbox.checked = true;
    } else {
      listDescription.classList.add('text-decoration-none');
      checkbox.checked = false;
    }
    const threeDots = document.createElement('span');
    threeDots.classList.add('pe-1', 'fs-2', 'threedots');
    const trash = document.createElement('span');
    trash.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 15 15">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>`;
    trash.classList.add('d-none');
    threeDots.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 15 15">1
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>`;
    const horizontalLine = document.createElement('hr');
    toDoDiv.append(checkbox, listDescription, threeDots, trash);
    listItem.append(toDoDiv, horizontalLine);
    todoList.appendChild(listItem);
  }

  // display all existing todo tasks
  displayToDos() {
    this.toDoInfo.forEach((task, index) => {
      this.createToDo(task.description, index);
    });
  }

  // update todo
  updateToDo(inputField, index) {
    inputField.addEventListener('keypress', (e) => {
      if (inputField.value && e.key === 'Enter') {
        this.toDoInfo[index].description = inputField.value;
        localStorage.setItem('todo', JSON.stringify(this.toDoInfo));
        inputField.nextElementSibling.classList.remove('d-none');
        inputField.nextElementSibling.nextElementSibling.classList.add('d-none');
        inputField.readOnly = true;
        inputField.classList.remove('active');
      }
    });
  }

  // remove selected todo
  removeSelectedToDo(trash, index) {
    trash.addEventListener('click', () => {
      todoList.removeChild(trash.parentElement.parentElement);
      this.toDoInfo.splice(index, 1);
      this.toDoInfo.forEach((task) => {
        if (task.index > index) {
          task.index -= 1;
        }
      });
      localStorage.setItem('todo', JSON.stringify(this.toDoInfo));
      window.location.reload();
    });
  }
}

const toDoListCollection = new ToDoListClass();
export function display() {
  toDoListCollection.displayToDos();
  const toDoInteractive = new Interactive();
  const checkbox = document.querySelectorAll('.checkbox');
  checkbox.forEach((chk, index) => {
    toDoInteractive.updateStatus(chk, index);
  });

  const threeDots = document.querySelectorAll('.threedots');
  threeDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dot.classList.add('d-none');
      dot.nextElementSibling.classList.remove('d-none');
      dot.previousElementSibling.classList.toggle('active');
      dot.previousElementSibling.readOnly = false;
      toDoListCollection.removeSelectedToDo(dot.nextElementSibling, index);
    });
  });

  const inputValue = document.querySelectorAll('.inputvalue');
  inputValue.forEach((fld, index) => {
    toDoListCollection.updateToDo(fld, index);
  });

  Interactive.reload(refreshIcon);
  toDoInteractive.removeCompleted(removeCompleted);
}

export default function listener() {
  todo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && todo.value) {
      const result = toDoListCollection.addToDo(todo.value);
      toDoListCollection.createToDo(result);
      todo.value = '';
      e.preventDefault();
    }
  });
}
