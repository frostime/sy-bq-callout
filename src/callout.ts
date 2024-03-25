/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2023-12-30 22:53:34
 * @FilePath     : /src/callout.ts
 * @LastEditTime : 2024-03-25 20:43:22
 * @Description  : 
 */

import * as I18n from "./i18n/zh_CN.json";
let i18n: typeof I18n;


const DefaultCallouts: ICallout[] = [
    {
        id: 'info',
        icon: 'ℹ',
        title: '',
        order: 0
    },
    {
        id: 'light',
        icon: '💡',
        title: '',
        order: 0
    },
    {
        id: 'bell',
        icon: '🔔',
        title: '',
        order: 0
    },
    {
        id: 'check',
        icon: '✅',
        title: '',
        order: 0
    },
    {
        id: 'question',
        icon: '❓',
        title: '',
        order: 0
    },
    {
        id: 'warn',
        icon: '⚠',
        title: '',
        order: 0
    },
    {
        id: 'wrong',
        icon: '❌',
        title: '',
        order: 0
    },
    {
        id: 'error',
        icon: '🚫',
        title: '', //等 initDefaultCallouts() 中初始化
        order: 0  //默认都为 0
    },
    {
        id: 'bug',
        icon: '🐛',
        title: '',
        order: 0
    },
    {
        id: 'note',
        icon: '📓',
        title: '',
        order: 0
    },
    {
        id: 'pen',
        icon: '🖋',
        title: '',
        order: 0
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


export function createCalloutButton(selectid: BlockId, callout: ICallout): HTMLButtonElement{
    let button = document.createElement("button")
    let title = callout.title;
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    button.setAttribute("custom-attr-name", "b")
    button.setAttribute("custom-attr-value", callout.id);
    button.innerHTML = `<span class="b3-menu__label">${callout.icon}${title}</span>`
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
