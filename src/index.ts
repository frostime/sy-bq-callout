/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2023-10-17 17:19:49
 * @Description  : 
 */
import {
    Plugin,
    Menu
} from "siyuan";
import "@/index.scss";

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
        this.eventBus.on("loaded-protyle", () => this.addFoldButton());
    }

    async onunload() {
        // removeCSSScript(this.CSSRoot);
        this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
        this.eventBus.off("loaded-protyle", () => this.removeFoldButton());
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
                this.addButtonItem(ele);
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
            const foldButton = ele.querySelector("[fold-button]");
            foldButton.remove();
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

    private addFoldButton() {
        const calloutBlocks = document.querySelectorAll("[custom-b]");
        calloutBlocks.forEach(ele => this.addButtonItem(ele));
    }

    private removeFoldButton() {
        const calloutBlocks = document.querySelectorAll("[fold-button]");
        calloutBlocks.forEach(ele => ele.remove);
    }

    private addButtonItem(element: Element) {
        const firstChild = element.firstElementChild;
        let foldButton = firstChild.querySelector("[fold-button]");
        if (!foldButton) {
            foldButton = firstChild.appendChild(document.createElement("div"));
            foldButton.setAttribute("fold-button", "1");
        }
        foldButton.addEventListener("click", this.listern);
    }

    listern(event: CustomEvent) {
        const element = event.target as Element;
        const parentElement = element.parentElement;
        const grandparentElement = parentElement.parentElement;

        const isFlod = grandparentElement.getAttribute("fold");
        if (isFlod === "1") {
            grandparentElement.setAttribute("fold", "0");
        } else {
            grandparentElement.setAttribute("fold", "1");
        }
    }
}
