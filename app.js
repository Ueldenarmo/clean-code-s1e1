// Document is the DOM can be accessed in the console with document.window.
// Tree is from the top, html, body, p etc.

// Problem: User interaction does not provide the correct results.
// Solution: Add interactivity so the user can manage daily tasks.
// Break things down into smaller steps and take each step at a time.


// Event handling, user interaction is what starts the code execution.
const taskForm = document.querySelector('.add-task__form');
const taskInput = document.getElementById('add-task-input');
const incompleteTaskHolder = document.querySelector('.todo__list--incomplete');
const completedTasksHolder = document.querySelector('.completed__list');

//New task list item
const createNewTaskElement = function (taskString) {
  const listItem = document.createElement('li');
  listItem.className = 'todo__item';

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.className = 'todo__checkbox';

  const label = document.createElement('label');
  label.innerText = taskString;
  label.className = 'todo__label';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo__input todo__input--hidden';

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit';
  editButton.className = 'todo__button todo__button--edit';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'todo__button todo__button--delete';

  const deleteButtonImg = document.createElement('img');
  deleteButtonImg.src = './remove.svg';
  deleteButtonImg.alt = 'Label with cross for deleting';
  deleteButtonImg.className = 'todo__icon';

  deleteButton.appendChild(deleteButtonImg);

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

    return listItem;
};

const convertToCompletedTask = function (listItem) {
  listItem.classList.remove('todo__item', 'todo__item--edit-mode');
  listItem.classList.add('completed__item');
  listItem.classList.remove('completed__item--edit-mode');

  const checkBox = listItem.querySelector('input[type=checkbox]');
  const label = listItem.querySelector('label');
  const editInput = listItem.querySelector('input[type=text]');
  const editButton = listItem.querySelector(
    '.todo__button:not(.todo__button--delete), .completed__button:not(.completed__button--delete)'
  );
  const deleteButton = listItem.querySelector(
    '.todo__button--delete, .completed__button--delete'
  );
  const icon = listItem.querySelector('img');

  checkBox.classList.remove('todo__checkbox');
  checkBox.classList.add('completed__checkbox');
  checkBox.checked = true;

  label.classList.remove('todo__label');
  label.classList.add('completed__label');

  editInput.classList.remove('todo__input', 'todo__input--hidden');
  editInput.classList.add('completed__input');
  editInput.value = label.innerText;

  editButton.classList.remove('todo__button', 'todo__button--edit', 'todo__button--save');
  editButton.classList.add('completed__button', 'completed__button--edit');
  editButton.innerText = 'Edit';

  deleteButton.classList.remove('todo__button', 'todo__button--delete');
  deleteButton.classList.add('completed__button', 'completed__button--delete');

  icon.classList.remove('todo__icon');
  icon.classList.add('completed__icon');
};

const convertToTodoTask = function (listItem) {
  listItem.classList.remove('completed__item', 'completed__item--edit-mode');
  listItem.classList.add('todo__item');
  listItem.classList.remove('todo__item--edit-mode');

  const checkBox = listItem.querySelector('input[type=checkbox]');
  const label = listItem.querySelector('label');
  const editInput = listItem.querySelector('input[type=text]');
  const editButton = listItem.querySelector(
    '.todo__button:not(.todo__button--delete), .completed__button:not(.completed__button--delete)'
  );
  const deleteButton = listItem.querySelector(
    '.todo__button--delete, .completed__button--delete'
  );
  const icon = listItem.querySelector('img');

  checkBox.classList.remove('completed__checkbox');
  checkBox.classList.add('todo__checkbox');
  checkBox.checked = false;

  label.classList.remove('completed__label');
  label.classList.add('todo__label');

  editInput.classList.remove('completed__input');
  editInput.classList.add('todo__input', 'todo__input--hidden');
  editInput.value = label.innerText;

  editButton.classList.remove('completed__button', 'completed__button--edit', 'completed__button--save');
  editButton.classList.add('todo__button', 'todo__button--edit');
  editButton.innerText = 'Edit';

  deleteButton.classList.remove('completed__button', 'completed__button--delete');
  deleteButton.classList.add('todo__button', 'todo__button--delete');

  icon.classList.remove('completed__icon');
  icon.classList.add('todo__icon');
};

const addTask = function (event) {
  console.log('Add Task...');
  if (event) {
    event.preventDefault();
  }

  ajaxRequest();

   if (!taskInput.value) {
    return;
  }

  const listItem = createNewTaskElement(taskInput.value);
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = '';
};

// Edit an existing task.
const editTask = function () {
  console.log('Edit Task...');
  console.log("Change 'edit' to 'save'");

  const listItem = this.closest('li');

  const isTodoItem = listItem.classList.contains('todo__item');
  const editModeClass = isTodoItem
    ? 'todo__item--edit-mode'
    : 'completed__item--edit-mode';
  const label = listItem.querySelector(isTodoItem ? '.todo__label' : '.completed__label');
  const editInput = listItem.querySelector(isTodoItem ? '.todo__input' : '.completed__input');
  const editButton = listItem.querySelector(
    '.todo__button:not(.todo__button--delete), .completed__button:not(.completed__button--delete)'
  );
  const containsClass = listItem.classList.contains(editModeClass);

  if (containsClass) {
    label.innerText = editInput.value;
    editButton.innerText = 'Edit';
    if (isTodoItem) {
      editInput.classList.add('todo__input--hidden');
    }
  } else {
    editInput.value = label.innerText;
    editButton.innerText = 'Save';
    if (isTodoItem) {
      editInput.classList.remove('todo__input--hidden');
    }
  }

  listItem.classList.toggle(editModeClass);
};

// Delete task.
const deleteTask = function () {
  console.log('Delete Task...');
  const listItem = this.closest('li');
  if (!listItem) {
    return;
  }
  const ul = listItem.parentNode;
  if (ul) {
    ul.removeChild(listItem);
  }
};

// Mark task completed
const taskCompleted = function () {
  console.log('Complete Task...');
  const listItem = this.closest('li');
  convertToCompletedTask(listItem);
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
};

const taskIncomplete = function () {
  console.log('Incomplete Task...');
  const listItem = this.closest('li');
  convertToTodoTask(listItem);
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
};

const ajaxRequest = function () {
  console.log('AJAX Request');
};

const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  console.log('bind list item events');
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector(
    '.todo__button:not(.todo__button--delete), .completed__button:not(.completed__button--delete)'
  );
  const deleteButton = taskListItem.querySelector(
    '.todo__button--delete, .completed__button--delete'
  );

  if (editButton) {
    editButton.onclick = editTask;
  }

  if (deleteButton) {
    deleteButton.onclick = deleteTask;
  }

  if (checkBox) {
    checkBox.onchange = checkBoxEventHandler;
  }
};

taskForm.addEventListener('submit', addTask);

// cycle over incompleteTaskHolder ul list items
for (let i = 0; i < incompleteTaskHolder.children.length; i += 1) {
  const listItem = incompleteTaskHolder.children[i];
  if (listItem.classList.contains('todo__item--edit-mode')) {
    const input = listItem.querySelector('.todo__input');
    if (input) {
      input.classList.remove('todo__input--hidden');
    }
  }
  bindTaskEvents(listItem, taskCompleted);
}

// cycle over completedTasksHolder ul list items
for (let i = 0; i < completedTasksHolder.children.length; i += 1) {
  const listItem = completedTasksHolder.children[i];
  bindTaskEvents(listItem, taskIncomplete);
}


// Issues with usability don't get seen until they are in front of a human tester.

//prevent creation of empty tasks.

//Change edit to save when you are in edit mode.