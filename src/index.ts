import {v4 as uuidV4} from 'uuid';

type Task = {
  id:string,
  title:string,
  completed:boolean,
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>('#new-task-form');
// const form = document.getElementById("#new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const completedList = document.querySelector<HTMLUListElement>("#completedList");

let tasks:Task[] = loadTasks()
tasks.forEach(addListItem)

let completedTasks: Task[] = loadCompletedTasks()
completedTasks.forEach(displayCompletedTasks);

form?.addEventListener("submit", e=>{
  e.preventDefault();
  if(input?.value == '' || input?.value == null) return
  const task:Task = {
    id: uuidV4(),
    title:input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(task);
  addListItem(task);
  input.value = "";

})

function addListItem(task:Task){
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.addEventListener("change", ()=>{
    task.completed = checkbox.checked;
    completedTasks.push(task);
    displayCompletedTasks(task);
    moveToCompleted();
    tasks = tasks.filter(item => item.id !== task.id)
    saveTasks();
    item.remove();
  })
  saveTasks();
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

function saveTasks(){
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks():Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if(taskJSON == null) return []
  return JSON.parse(taskJSON)
}

function moveToCompleted() {
  localStorage.setItem("COMPLETED_TASKS", JSON.stringify(completedTasks))
}

function loadCompletedTasks():Task[] {
  const completedTasksJSON = localStorage.getItem("COMPLETED_TASKS");
  if(completedTasksJSON == null) return []
  return JSON.parse(completedTasksJSON)
}

function displayCompletedTasks(task:Task){
  const item = document.createElement("li");
  item.className = "completed-task-item";
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const button = document.createElement("button");
  const secondButton = document.createElement("button");
  button.textContent = "Delete";
  secondButton.textContent = "Move it back";
  button.addEventListener("click", ()=>{
    deleteCheckedItem(task);
    item.remove();
  })
  secondButton.addEventListener("click", ()=>{
    moveItBackToMain(task);
    item.remove();
  })
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.disabled = true;
  label.append(checkbox, task.title);
  item.append(label, button, secondButton);
  completedList?.append(item);
}

function deleteCheckedItem(task:Task){
  completedTasks = completedTasks.filter(item => item.id !== task.id)
  moveToCompleted()
}

function moveItBackToMain(task:Task){
  deleteCheckedItem(task);
  task = {...task, completed:false}
  tasks.push(task);
  addListItem(task);
  saveTasks();
}
