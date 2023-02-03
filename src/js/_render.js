const Handlebars = require("handlebars");

const ul = document.querySelector('.task-list');

// export function getTaskHTML(dataElement, editMode = false) {
//     const html = document.querySelector("#taskTemplate").innerHTML;
//     const template = Handlebars.compile(html);
//     return template({editMode, ...dataElement});
// }

 export function getTaskHTML(dataElement, editMode = false) {
    const {date, title, body} = dataElement;

    if (editMode) {
        return `
            <div class="task-inside">
                <div class="task-header">
                    <label>
                        <span>Podaj datę</span>
                        <input type="date" class="task-date" value="${date}">
                    </label>

                    <div class="task-actions">
                        <button class="task-delete" title="Usuń zadanie">
                            Usuń
                        </button>
                    </div>
                </div>

                <div class="row">
                    <label>
                        <span>Tytuł</span>
                        <input type="text" class="task-title" value="${title}">
                    </label>
                </div>

                <div class="row">
                    <label>
                        <span>Treść</span>
                        <textarea class="task-body">${body}</textarea>
                    </label>
                </div>

                <div class="task-footer">
                    <button class="button task-edit-save">Zapisz</button>
                    <button class="button task-edit-cancel button-secondary">Anuluj</button>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="task-inside">
                <div class="task-header">
                    <h3 class="task-date">${date}</h3>

                    <div class="task-actions">
                        <button class="task-edit" title="Edytuj zadanie">
                            Edytuj
                        </button>
                        <button class="task-delete" title="Usuń zadanie">
                            Usuń
                        </button>
                    </div>
                </div>

                <div class="row">
                    <div class="task-title">${title}</div>
                </div>

                <div class="row">
                    <div class="task-body">
                        ${body}
                    </div>
                </div>
            </div>
        `;
    }
}

export function renderSingleTask(dataElement, editMode) {
    const element = document.createElement('article');
    element.classList.add('task');
    element.dataset.id = dataElement.id;
    
    element.innerHTML = getTaskHTML(dataElement, editMode);
    ul.append(element);
    
    const ulCnt = document.querySelector(".task-list-cnt");
    ulCnt.scrollTop = ulCnt.scrollHeight - ulCnt.clientHeight;
}

export function renderTaskList(tasks) {
    ul.innerHTML = '';
    tasks.forEach(dataElement => {
        renderSingleTask(dataElement, false);
    })
}