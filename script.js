let tasks = JSON.parse(localStorage.getItem('tasks')) || []
let current_tab = 'all'





function renderTasks() {
  document.getElementById('tasks_space').innerHTML = '';

  let tasks_to_show;
  const today = new Date().toISOString().slice(0, 10);

  if (current_tab === 'incoming') {
    tasks_to_show = tasks.filter(task => task.is_completed === false);
  }
  else if (current_tab === 'today') {
    tasks_to_show = tasks.filter(task => task.date === today);
  }
  else if (current_tab === 'ended') {
    tasks_to_show = tasks.filter(task => task.is_completed === true);
  }
  else if (current_tab === 'all') {
    tasks_to_show = tasks;
  }


  // Отрисовка функций
  for (let i = 0; i < tasks_to_show.length; i++) {
    const RT_task_card = document.createElement('article');
    RT_task_card.className = 'task_card';

    const RT_title = document.createElement('h3');
    RT_title.textContent = tasks_to_show[i].title;
    RT_task_card.appendChild(RT_title);

    const RT_card_content = document.createElement('div');
    RT_card_content.className = 'card_content';
    RT_task_card.appendChild(RT_card_content);

    const RT_card_description_date = document.createElement('div');
    RT_card_description_date.className = 'card_description_date';
    RT_card_content.appendChild(RT_card_description_date);

    const RT_card_description = document.createElement('p');
    RT_card_description.textContent = tasks_to_show[i].description;
    RT_card_description_date.appendChild(RT_card_description);

    const RT_card_date = document.createElement('small');
    RT_card_date.textContent = tasks_to_show[i].date;
    RT_card_description_date.appendChild(RT_card_date);

    const RT_card_checkbox = document.createElement('input');
    RT_card_checkbox.type = 'checkbox';
    RT_card_checkbox.checked = tasks_to_show[i].is_completed;
    RT_card_content.appendChild(RT_card_checkbox);

    RT_card_checkbox.addEventListener('change', function () {
      tasks[i].is_completed = RT_card_checkbox.checked;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    const RT_delete_button = document.createElement('button');
    RT_delete_button.textContent = 'x';
    RT_delete_button.className = 'delete_button';
    RT_task_card.appendChild(RT_delete_button);
    RT_delete_button.dataset.taskID = tasks_to_show[i].id; //добавляем датасет taskID, он равен id у задачи

    RT_delete_button.addEventListener('click', function () {
      if (!confirm("Вы уверены что хотите удалить задачу?")) {
        return
      }
      else {
        const taskID = Number(this.dataset.taskID); //ссылаемся на элемент через this, берем из dataset taskID
        tasks = tasks.filter(task => task.id !== taskID);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
      }
    });


    document.getElementById('tasks_space').appendChild(RT_task_card);
  }
}

function newTask() {
  //Название
  const ADDtitle = prompt("Введите название задачи");
  if (ADDtitle === null) { //Если нажал отмена, то передастся null
    return;
  };
  if (ADDtitle.trim() === "") {
    alert("Название не может быть пустым");
    return;
  };

  // Описание 
  const ADDdescription = prompt("Введите описение (необязательно)") || "     ";

  //Дата
  const ADDdate = prompt("Введите дату (по-умолчанию - сегодня)") || new Date().toISOString().slice(0, 10);

  //id'шник
  let ADDid;

  if (tasks.length > 0) {
    const mapped = tasks.map(t => t.id);
    ADDid = Math.max(...mapped) + 1;
  }
  else {
    ADDid = 1;
  }

  const ADDtask = {
    id: ADDid,
    title: ADDtitle,
    description: ADDdescription,
    date: ADDdate,
    is_completed: false,
  };

  tasks.push(ADDtask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}


//вкладки

function incoming_tab_filter(event) {
  event.preventDefault()
  current_tab = 'incoming';
  renderTasks()
}
function today_tab_filter(event) {
  event.preventDefault()
  current_tab = 'today';
  renderTasks()
}
function ended_tab_filter(event) {
  event.preventDefault()
  current_tab = 'ended';
  renderTasks()
}
function all_tab_filter(event) {
  event.preventDefault()
  current_tab = 'all';
  renderTasks()
}
renderTasks();
