$(document).ready(function () {
    $("#task-dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Save Task": function () {
                saveTask();
                $(this).dialog("close");
            }
        }
    });

    $("#new-task-btn").on("click", function () {
        $("#task-dialog").dialog("open");
    });

    $(".date-picker").datepicker();

    $(".task-container").sortable({
        connectWith: ".task-container",
        update: function (event, ui) {
            updateTaskStatus(ui.item);
        }
    }).disableSelection();

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToBoard(task);
        });
    }

    function saveTask() {
        const title = $("#task-title").val();
        const description = $("#task-desc").val();
        const deadline = $("#task-deadline").val();
        const task = {
            id: Date.now(),
            title,
            description,
            deadline,
            status: 'not-started'
        };

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        addTaskToBoard(task);
    }

    function addTaskToBoard(task) {
        const taskCard = $(`
        <div class="task-card" data-id="${task.id}">
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Deadline: ${task.deadline}</p>
          <button class="delete-task-btn">Delete</button>
        </div>
      `);

        if (dayjs(task.deadline).isBefore(dayjs())) {
            taskCard.addClass('overdue');
        } else if (dayjs(task.deadline).isBefore(dayjs().add(2, 'day'))) {
            taskCard.addClass('nearing-deadline');
        }

        $(`#${task.status} .task-container`).append(taskCard);

        taskCard.find('.delete-task-btn').on('click', function () {
            deleteTask(task.id);
            taskCard.remove();
        });
    }

    function updateTaskStatus(taskElement) {
        const taskId = $(taskElement).data('id');
        const newStatus = $(taskElement).parent().parent().attr('id');

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function deleteTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasks();
});
