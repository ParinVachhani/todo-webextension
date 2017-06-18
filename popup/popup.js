/* initialise variables */

var inputTitle = document.querySelector('.new-task input');

var taskContainer = document.querySelector('.task-container');


var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');

/*  add event listeners to buttons */

addBtn.addEventListener('click', addTask);
clearBtn.addEventListener('click', clearAll);

/* generic error handler */
function onError(error) {
  console.log(error);
}

/* display previously-saved stored tasks on startup */

initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var taskKeys = Object.keys(results);
    for(taskKey of taskKeys) {
      var curValue = results[taskKey];
      displayTask(taskKey,curValue);
    }
  }, onError);
}

/* Add a task to the display, and storage */

function addTask() {
  var taskTitle = inputTitle.value;
  var gettingItem = browser.storage.local.get(taskTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && taskTitle !== '') {
      inputTitle.value = '';
      storeTask(taskTitle);
    }
  }, onError);
}

/* function to store a new task in storage */

function storeTask(title) {
  var storingTask = browser.storage.local.set({title});
  storingTask.then(() => {
    displayTask(title);
  }, onError);
}

/* function to display a task in the task box */

function displayTask(title) {

  /* create task display box */
  var task = document.createElement('div');
  var taskDisplay = document.createElement('div');
  var taskH = document.createElement('h3');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  task.setAttribute('class','task panel panel-default');
  taskH.setAttribute('class', 'panel-body');

  taskH.textContent = title;
  deleteBtn.setAttribute('class','delete btn btn-danger');
  deleteBtn.textContent = 'Delete task';
  clearFix.setAttribute('class','clearfix');

  taskDisplay.appendChild(taskH);
  taskDisplay.appendChild(deleteBtn);
  taskDisplay.appendChild(clearFix);

  task.appendChild(taskDisplay);

  /* set up listener for the delete functionality */

  deleteBtn.addEventListener('click',function(e){
    evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(title);
  })

  /* create task edit box */
  var taskEdit = document.createElement('div');
  var taskTitleEdit = document.createElement('input');
  taskTitleEdit.setAttribute('class', 'taskHH');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class','update btn btn-success');
  updateBtn.textContent = 'Update task';
  cancelBtn.setAttribute('class','cancel btn btn-warning');
  cancelBtn.textContent = 'Cancel update';

  taskEdit.appendChild(taskTitleEdit);
  taskTitleEdit.value = title;
  taskEdit.appendChild(updateBtn);
  taskEdit.appendChild(cancelBtn);

  taskEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');

  task.appendChild(taskEdit);

  taskContainer.appendChild(task);
  taskEdit.style.display = 'none';

  /* set up listeners for the update functionality */

  taskH.addEventListener('click',function(){
    taskDisplay.style.display = 'none';
    taskEdit.style.display = 'block';
  })

  cancelBtn.addEventListener('click',function(){
    taskDisplay.style.display = 'block';
    taskEdit.style.display = 'none';
    taskTitleEdit.value = title;
  })

  updateBtn.addEventListener('click',function(){
    if(taskTitleEdit.value !== title) {
      updateTask(title,taskTitleEdit.value);
      task.parentNode.removeChild(task);
    } 
  });
}


/* function to update tasks */

function updateTask(delTask,newTitle) {
  var storingTask = browser.storage.local.set({newTitle});
  storingTask.then(() => {
    if(delTask !== newTitle) {
      var removingTask = browser.storage.local.remove(delTask);
      removingTask.then(() => {
        displayTask(newTitle);
      }, onError);
    } else {
      displayTask(newTitle);
    }
  }, onError);
}

/* Clear all tasks from the display/storage */

function clearAll() {
  while (taskContainer.firstChild) {
      taskContainer.removeChild(taskContainer.firstChild);
  }
  browser.storage.local.clear();
}

document.getElementById("text_input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("add_task").click();
    }
});