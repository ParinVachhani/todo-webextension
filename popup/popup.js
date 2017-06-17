/* initialise variables */

var inputTitle = document.querySelector('.new-task input');
var inputBody = document.querySelector('.new-task textarea');

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
  var taskBody = inputBody.value;
  var gettingItem = browser.storage.local.get(taskTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && taskTitle !== '' && taskBody !== '') {
      inputTitle.value = '';
      inputBody.value = '';
      storeTask(taskTitle,taskBody);
    }
  }, onError);
}

/* function to store a new task in storage */

function storeTask(title, body) {
  var storingTask = browser.storage.local.set({ [title] : body });
  storingTask.then(() => {
    displayTask(title,body);
  }, onError);
}

/* function to display a task in the task box */

function displayTask(title, body) {

  /* create task display box */
  var task = document.createElement('div');
  var taskDisplay = document.createElement('div');
  var taskH = document.createElement('h2');
  var taskPara = document.createElement('p');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  task.setAttribute('class','task');

  taskH.textContent = title;
  taskPara.textContent = body;
  deleteBtn.setAttribute('class','delete');
  deleteBtn.textContent = 'Delete task';
  clearFix.setAttribute('class','clearfix');

  taskDisplay.appendChild(taskH);
  taskDisplay.appendChild(taskPara);
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
  var taskBodyEdit = document.createElement('textarea');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class','update');
  updateBtn.textContent = 'Update task';
  cancelBtn.setAttribute('class','cancel');
  cancelBtn.textContent = 'Cancel update';

  taskEdit.appendChild(taskTitleEdit);
  taskTitleEdit.value = title;
  taskEdit.appendChild(taskBodyEdit);
  taskBodyEdit.textContent = body;
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

  taskPara.addEventListener('click',function(){
    taskDisplay.style.display = 'none';
    taskEdit.style.display = 'block';
  }) 

  cancelBtn.addEventListener('click',function(){
    taskDisplay.style.display = 'block';
    taskEdit.style.display = 'none';
    taskTitleEdit.value = title;
    taskBodyEdit.value = body;
  })

  updateBtn.addEventListener('click',function(){
    if(taskTitleEdit.value !== title || taskBodyEdit.value !== body) {
      updateTask(title,taskTitleEdit.value,taskBodyEdit.value);
      task.parentNode.removeChild(task);
    } 
  });
}


/* function to update tasks */

function updateTask(delTask,newTitle,newBody) {
  var storingTask = browser.storage.local.set({ [newTitle] : newBody });
  storingTask.then(() => {
    if(delTask !== newTitle) {
      var removingTask = browser.storage.local.remove(delTask);
      removingTask.then(() => {
        displayTask(newTitle, newBody);
      }, onError);
    } else {
      displayTask(newTitle, newBody);
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