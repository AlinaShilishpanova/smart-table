import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    // Добавляем шаблоны "до" таблицы в обратном порядке
    before.reverse().forEach(templateId => {
        const template = cloneTemplate(templateId);
        root[templateId] = template; // сохраняем для последующего доступа
        root.container.prepend(template.container);
    });

    // Добавляем шаблоны "после" таблицы
    after.forEach(templateId => {
        const template = cloneTemplate(templateId);
        root[templateId] = template; // сохраняем для последующего доступа
        root.container.append(template.container);
    });

    // @todo: #1.3 — обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction(), 0);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            // Заполняем данные в соответствующие элементы
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            
            return row.container;
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}