/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2023-12-31 11:13:08
 * @Description  : 
 */
import {
    Plugin,
    Menu
} from "siyuan";
import "@/index.scss";

import { changelog } from "sy-plugin-changelog";

import { setBlockAttrs } from "./api"
import * as create from "./creator";
import * as I18n from "./i18n/zh_CN.json";
// import { LightCSSVar, DarkCSSVar } from "./var";

const NewButton = [
    create.Info,
    create.Light,
    create.Bell,
    create.Check,
    create.Wrong,
    create.Warn,
    create.Question,
    create.quoteError,
    create.Bug,
    create.Note,
    create.Pen
]

async function setUpAttr(blockId: BlockId, value: string) {
    setBlockAttrs(blockId, {
        'custom-b': value
    });
}

// const insertCSSScript = (id: string, css: string) => {
//     const style = document.createElement("style");
//     style.id = id;
//     style.innerHTML = css;
//     document.head.appendChild(style);
// }

// const removeCSSScript = (id: string) => {
//     const style = document.getElementById(id);
//     style?.remove();
// }

export default class BqCalloutPlugin extends Plugin {

    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    CSSRoot = 'BqCalloutPlugin';
    declare i18n: typeof I18n;

    async onload() {
        //@ts-ignore
        // let css = window.siyuan.config.appearance.mode === 0? LightCSSVar : DarkCSSVar;
        // insertCSSScript(this.CSSRoot, css);
        create.setI18n(this.i18n);
        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
        changelog(this, 'i18n/CHANGELOG.md').then(ans => {
            if (ans.Dialog) {
                ans.Dialog.setFont('20px');
            }
        })
    }

    async onunload() {
        // removeCSSScript(this.CSSRoot);
        this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
    }

    private blockIconEvent({ detail }: any) {
        console.log(detail);
        if (detail.blockElements.length > 1) {
            return;
        }
        let ele: HTMLDivElement = detail.blockElements[0];
        if (!ele.classList.contains("bq")) {
            return;
        }
        console.log(ele);
        let menu: Menu = detail.menu;
        let submenus = [];
        for (let newbtn of NewButton) {
            let btn = newbtn(ele.getAttribute("data-node-id"));
            btn.onclick = () => {
                setUpAttr(ele.getAttribute("data-node-id"), btn.getAttribute("custom-attr-value"));
            }
            submenus.push({
                element: btn,
            })
        }
        submenus.push({
            type: 'separator'
        });
        let btn = create.Defaultbq(ele.getAttribute("data-node-id"));
        btn.onclick = () => {
            setUpAttr(ele.getAttribute("data-node-id"), btn.getAttribute("custom-attr-value"));
        }
        submenus.push({
            element: btn
        });
        menu.addItem({
            icon: "iconInfo",
            label: this.i18n.name,
            type: "submenu",
            submenu: submenus
        });
    }
}
