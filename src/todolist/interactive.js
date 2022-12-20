export default class Interactive {
  constructor() {
    this.toDoList = JSON.parse(localStorage.getItem('todo')) || [];
  }

  // update status
  updateStatus(checkbox, index) {
    checkbox.addEventListener('click', (event) => {
      if (event.currentTarget.checked) {
        checkbox.nextElementSibling.classList.add('text-decoration-line-through');
        this.toDoList[index].completed = true;
        localStorage.setItem('todo', JSON.stringify(this.toDoList));
      } else {
        if (checkbox.nextElementSibling.classList.contains('text-decoration-line-through')) {
          checkbox.nextElementSibling.classList.remove('text-decoration-line-through');
        }
        this.toDoList[index].completed = false;
        localStorage.setItem('todo', JSON.stringify(this.toDoList));
      }
    });
  }

  // remove all completed tasks
  removeCompleted(removeCompleted) {
    removeCompleted.addEventListener('click', () => {
      this.toDoList = this.toDoList.filter((task) => task.completed !== true);
      localStorage.setItem('todo', JSON.stringify(this.toDoList));
      this.toDoList.forEach((task, index) => {
        if (task.index !== index) {
          task.index = index;
        }
      });
      localStorage.setItem('todo', JSON.stringify(this.toDoList));
      window.location.reload();
    });
  }

  // add event listener on reload icon
  static reload(refresh) {
    refresh.addEventListener('click', () => {
      window.location.reload();
    });
  }
}