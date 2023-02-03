require("../scss/style.scss");
import { apiGetTasks, apiAddTask, apiDeleteTask, apiSearchTasks, apiEditTask } from "./_api";
import { renderTaskList, renderSingleTask, getTaskHTML } from './_render';
import { debounced } from "./_utility.js";
import toast from "toast-me";


apiGetTasks()
    .then(res => {
        console.log(res);
        renderTaskList(res);
    })
    .catch(err => {
        toast(err, "error");
        console.log(err);
    });

const form = document.querySelector('#todoForm');

form.addEventListener('submit', async event => {
    event.preventDefault();
    
    const obForm = {
        title: form.querySelector('#todoTitle').value,
        date: form.querySelector('#todoDate').value,
        body: form.querySelector('#todoMessage').value
    };
    // const title = form.querySelector('#todoTitle').value;
    // const date = form.querySelector('#todoDate').value;
    // const body = form.querySelector('#todoMessage').value;
    
    if (obForm.title && obForm.date && obForm.body) {
        try {
            const dataElement = await apiAddTask(obForm);
            renderSingleTask(dataElement);
            form.reset();
        } catch(err) {
            toast(err,"error");
            console.log(err);
        }
    } else {
        inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.placeholder = "To pole należy wypełnić";
        });
        toast(
            "Wypełnij wszystkie pola",
            {
                duration:1500,
                containerClass: "toast-error",
                toastClass: "toast-error",
            },{},
        );
    }

});

//const ul = document.querySelector('.task-list');

document.addEventListener("click", async e => {
    if (e.target.classList.contains("task-delete")) {
        const task = e.target.closest(".task");
        const id = +task.dataset.id;

        try {
            const request = await apiDeleteTask(id);

            const anim = task.animate([
                // {transform: 'scaleY(1)'},
                // {transform: 'scaleY(0)'}
                {height: `${task.offsetHeight}px`},
                {height: '0px'}
            ], {
                duration: 300,
                iteration: 1
            });
            anim.onfinish = () => {
                task.remove();
            }
        } catch(err) {
            toast(err, "error");
        }
    }

    if (e.target.classList.contains("task-edit")) {
        const el = e.target.closest(".task");
        const id = +el.dataset.id;
        const date = el.querySelector(".task-date").innerText;
        const title = el.querySelector(".task-title").innerText;
        const body = el.querySelector(".task-body").innerText;
        const dataElement = {
            id, date, title, body
        }

        el.classList.add('task-edit-mode');
    
        el.innerHTML = getTaskHTML(dataElement, true);
        //el.innerHTML = renderSingleTask(dataElement, true);
    }

    if (e.target.classList.contains("task-edit-save")) {
        const el = e.target.closest(".task");
        const id = +el.dataset.id;
        const title = el.querySelector(".task-title").value;
        const body = el.querySelector(".task-body").value;
        const date = el.querySelector(".task-date").value;
        const dataElement = {
            id, date, title, body
        }

        try {
            const request = await apiEditTask(dataElement);
            el.classList.remove("task-edit-mode");
            el.innerHTML = getTaskHTML(dataElement, false);
        } catch(err) {
            toast(err, "error");
        }
    }

    if (e.target.classList.contains("task-edit-cancel")) {
        const el = e.target.closest(".task");
        const id = +el.dataset.id;
        const title = el.querySelector(".task-title").value;
        const body = el.querySelector(".task-body").value;
        const date = el.querySelector(".task-date").value;
        const dataElement = {
            id, date, title, body
        }
        el.classList.remove("task-edit-mode");
        el.innerHTML = getTaskHTML(dataElement, false);
    }

});

const search = document.querySelector('#todoSearch');

// search.addEventListener('input', async () => {
//     const tasks = await apiSearchTasks(search.value);
//     renderTaskList(tasks);
//})

const tHandler = debounced(300, async () => {
    try {
        console.log(search.value);
        const tasks = await apiSearchTasks(search.value);
        renderTaskList(tasks);
    } catch(err) {
        toast(err, "error");
    }
});

search.addEventListener('input', tHandler);