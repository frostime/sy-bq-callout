/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2023-12-30 22:53:34
 * @FilePath     : /src/callout.ts
 * @LastEditTime : 2024-04-03 22:40:56
 * @Description  : 
 */

import * as I18n from "./i18n/zh_CN.json";
let i18n: typeof I18n;


const DefaultCallouts: ICallout[] = [
    {
        id: 'info',
        icon: 'ℹ',
        title: '',
    },
    {
        id: 'light',
        icon: '💡',
        title: '',
    },
    {
        id: 'bell',
        icon: '🔔',
        title: '',
    },
    {
        id: 'check',
        icon: '✅',
        title: '',
    },
    {
        id: 'question',
        icon: '❓',
        title: '',
    },
    {
        id: 'warn',
        icon: '⚠',
        title: '',
    },
    {
        id: 'wrong',
        icon: '❌',
        title: '',
    },
    {
        id: 'error',
        icon: '🚫',
        title: '',
    },
    {
        id: 'bug',
        icon: '🐛',
        title: '',
    },
    {
        id: 'note',
        icon: '📓',
        title: '',
    },
    {
        id: 'pen',
        icon: '🖋',
        title: '',
    }
]

export function initDefault(i18nObj: typeof I18n) {
    i18n = i18nObj;
    for (let i = 0; i < DefaultCallouts.length; i++) {
        let callout = DefaultCallouts[i]
        if (i18n.button[callout.id]) {
            callout.title = i18n.button[callout.id] || callout.id;
        }
    }
    return DefaultCallouts;
}

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function createCalloutButton(selectid: BlockId, callout: ICallout): HTMLButtonElement{
    let button = document.createElement("button")
    // let title = callout.title;
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", callout.id);
    button.innerHTML = `<span class="b3-menu__label">${callout.icon}${capitalize(callout.id)}</span>`
    return button
}

export function createRestoreButton(selectid: BlockId) {
    let button = document.createElement("button")
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", "")
    button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconRefresh"></use></svg><span class="b3-menu__label">${i18n.button.default}</span>`

    return button
}
