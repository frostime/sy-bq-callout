/**
 * CopyRight (C) 2023 Roy, All Right Reserved
 * Copy from https://github.com/royc01/notion-theme/blob/main/theme.js
 */


export function quoteError(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "error")
    button.innerHTML = `<span class="b3-menu__label">🚫禁止</span>`
    return button
}

export function Warn(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "warn")
    button.innerHTML = `<span class="b3-menu__label">⚠警告</span>`

    return button
}

export function Bug(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "bug")
    button.innerHTML = `<span class="b3-menu__label">🐛bug</span>`

    return button
}

export function Check(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "check")
    button.innerHTML = `<span class="b3-menu__label">✅正确</span>`

    return button
}

export function Light(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "light")
    button.innerHTML = `<span class="b3-menu__label">💡灵感</span>`

    return button
}

export function Question(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "question")
    button.innerHTML = `<span class="b3-menu__label">❓问题</span>`

    return button
}

export function Wrong(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "wrong")
    button.innerHTML = `<span class="b3-menu__label">❌错误</span>`

    return button
}

export function Info(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "info")
    button.innerHTML = `<span class="b3-menu__label">ℹ信息</span>`

    return button
}

export function Pen(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "pen")
    button.innerHTML = `<span class="b3-menu__label">🖋记录</span>`

    return button
}

export function Note(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "note")
    button.innerHTML = `<span class="b3-menu__label">📓汇总</span>`

    return button
}

export function Bell(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "bell")
    button.innerHTML = `<span class="b3-menu__label">🔔提醒</span>`

    return button
}

export function Defaultbq(selectid) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "")
    button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconRefresh"></use></svg><span class="b3-menu__label">恢复默认样式</span>`

    return button
}