import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        ['skipEmptyTargetValues'], // используем только правило пропуска пустых значений
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)] // добавляем правило поиска по нескольким полям
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}