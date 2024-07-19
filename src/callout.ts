/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2023-12-30 22:53:34
 * @FilePath     : /src/callout.ts
 * @LastEditTime : 2024-07-19 13:50:10
 * @Description  : 
 */
import { sql } from "./api";
import * as I18n from "./i18n/zh_CN.json";
import  type BqCalloutPlugin from "./index";

export let i18n: typeof I18n;
export let plugin: BqCalloutPlugin;

export const setUp = (plugin_: BqCalloutPlugin) => {
    i18n = plugin_.i18n;
    plugin = plugin_;
}

export const calloutName = (callout: ICallout) => {
    let name = callout.id;
    if (callout.custom !== true && i18n.button?.[callout.id]) {
        name = i18n.button[callout.id];
    }
    return capitalize(name);
}

export const queryCalloutBlock = async (id: string, custom: boolean): Promise<Block[]> => {
    let name = custom ? 'custom-callout' : 'custom-b';
    return sql(`
    SELECT B.*
    FROM blocks AS B
    WHERE B.id IN (
        SELECT A.block_id
        FROM attributes AS A
        WHERE A.name = '${name}'
        AND A.value = '${id}'
    ) limit 999;
    `);
}


export const DefaultCallouts: ICallout[] = [
    {
        id: 'info',
        icon: 'ℹ',
        title: '',
        bg: {
            light: 'rgba(221, 235, 241, .5)',
            dark: 'rgba(54, 73, 84, .3)'
        },
        box: {
            light: 'rgba(221, 235, 241, 1)',
            dark: 'rgba(54, 73, 84, 1)'
        }
    },
    {
        id: 'light',
        icon: '💡',
        title: '',
        bg: {
            light: 'rgba(250, 235, 221, .5)',
            dark: 'rgba(89, 79, 59, .3)'
        },
        box: {
            light: 'rgba(250, 235, 221, 1)',
            dark: 'rgba(89, 79, 59, 1)'
        }
    },
    {
        id: 'bell',
        icon: '🔔',
        title: '',
        bg: {
            light: 'rgba(246, 225, 205, .5)',
            dark: 'rgba(89, 74, 58, .3)'
        },
        box: {
            light: 'rgba(246, 225, 205, 1)',
            dark: 'rgba(89, 74, 58, 1)'
        }
    },
    {
        id: 'check',
        icon: '✅',
        title: '',
        bg: {
            light: 'rgba(221, 237, 226, .5)',
            dark: 'rgba(53, 76, 75, .3)'
        },
        box: {
            light: 'rgba(221, 237, 226, 1)',
            dark: 'rgba(53, 76, 75, 1)'
        }
    },
    {
        id: 'question',
        icon: '❓',
        title: '',
        bg: {
            light: 'rgba(244, 223, 235, .5)',
            dark: 'rgba(83, 59, 76, .3)'
        },
        box: {
            light: 'rgba(244, 223, 235, 1)',
            dark: 'rgba(83, 59, 76, 1)'
        }
    },
    {
        id: 'warn',
        icon: '⚠',
        title: '',
        bg: {
            light: 'rgba(251, 243, 219, .5)',
            dark: 'rgba(89, 86, 59, .3)'
        },
        box: {
            light: 'rgba(251, 243, 219, 1)',
            dark: 'rgba(89, 86, 59, 1)'
        }
    },
    {
        id: 'wrong',
        icon: '❌',
        title: '',
        bg: {
            light: 'rgba(251, 228, 228, .5)',
            dark: 'rgba(89, 65, 65, .3)'
        },
        box: {
            light: 'rgba(251, 228, 228, 1)',
            dark: 'rgba(89, 65, 65, 1)'
        }
    },
    {
        id: 'error',
        icon: '🚫',
        title: '',
        bg: {
            light: 'rgba(251, 228, 228, .5)',
            dark: 'rgba(89, 65, 65, .3)'
        },
        box: {
            light: 'rgba(251, 228, 228, 1)',
            dark: 'rgba(89, 65, 65, 1)'
        }
    },
    {
        id: 'bug',
        icon: '🐛',
        title: '',
        bg: {
            light: 'rgba(234, 228, 242, .5)',
            dark: 'rgba(68, 63, 87, .3)'
        },
        box: {
            light: 'rgba(234, 228, 242, 1)',
            dark: 'rgba(68, 63, 87, 1)'
        }
    },
    {
        id: 'note',
        icon: '📓',
        title: '',
        bg: {
            light: 'rgba(198, 203, 208, .5)',
            dark: 'rgba(35, 38, 40, .3)'
        },
        box: {
            light: 'rgba(198, 203, 208, 1)',
            dark: 'rgba(35, 38, 40, 1)'
        }
    },
    {
        id: 'pen',
        icon: '🖋',
        title: '',
        bg: {
            light: 'rgba(235, 236, 237, .5)',
            dark: 'rgba(69, 75, 78, .3)'
        },
        box: {
            light: 'rgba(235, 236, 237, 1)',
            dark: 'rgba(69, 75, 78, 1)'
        }
    }
]


const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function createCalloutButton(selectid: BlockId, callout: ICallout): HTMLButtonElement{
    let button = document.createElement("button")
    // let title = callout.title;
    button.className = "b3-menu__item"
    button.setAttribute("data-node-id", selectid)
    let name = callout.custom ? 'callout' : 'b';
    button.setAttribute("custom-attr-name", name)
    button.setAttribute("custom-attr-value", callout.id);
    button.innerHTML = `<span class="b3-menu__label">${callout.icon}${calloutName(callout)}</span>`
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
