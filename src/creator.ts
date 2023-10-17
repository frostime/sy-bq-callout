/**
 * CopyRight (C) 2023 Roy, All Right Reserved
 * Copy from https://github.com/royc01/notion-theme/blob/main/theme.js
 */
import * as I18n from "./i18n/zh_CN.json";
let i18n: typeof I18n;

export const setI18n = (i18nObj: typeof I18n) => {
    i18n = i18nObj;
}


export function quoteError(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "error")
    button.innerHTML = `<span class="b3-menu__label">🚫${i18n.button.abandon}</span>`
    return button
}

export function Warn(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "warn")
    button.innerHTML = `<span class="b3-menu__label">⚠${i18n.button.warn}</span>`

    return button
}

export function Bug(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "bug")
    button.innerHTML = `<span class="b3-menu__label">🐛${i18n.button.bug}</span>`

    return button
}

export function Check(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "check")
    button.innerHTML = `<span class="b3-menu__label">✅${i18n.button.yes}</span>`

    return button
}

export function Light(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "light")
    button.innerHTML = `<span class="b3-menu__label">💡${i18n.button.intuition}</span>`

    return button
}

export function Question(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "question")
    button.innerHTML = `<span class="b3-menu__label">❓${i18n.button.question}</span>`

    return button
}

export function Wrong(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "wrong")
    button.innerHTML = `<span class="b3-menu__label">❌${i18n.button.wrong}</span>`

    return button
}

export function Info(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "info")
    button.innerHTML = `<span class="b3-menu__label">ℹ${i18n.button.info}</span>`

    return button
}

export function Pen(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "pen")
    button.innerHTML = `<span class="b3-menu__label">🖋${i18n.button.record}</span>`

    return button
}

export function Note(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "note")
    button.innerHTML = `<span class="b3-menu__label">📓${i18n.button.note}</span>`

    return button
}

export function Bell(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "bell")
    button.innerHTML = `<span class="b3-menu__label">🔔${i18n.button.notify}</span>`

    return button
}

export function Defaultbq(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "")
    button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconRefresh"></use></svg><span class="b3-menu__label">${i18n.button.default}</span>`

    return button
}