import {
    Plugin,
    Menu
} from "siyuan";
import "@/index.css";

import { setBlockAttrs } from "./api"
import  * as create from "./creator";
import { LightCSSVar, DarkCSSVar } from "./var";

const NewButton = [
    create.Info, create.Check, create.Question, create.Warn, create.Light, create.quoteError, create.Bug, create.Wrong, create.Bell, create.Note, create.Pen
]

async function setUpAttr(blockId: BlockId, value: string) {
    setBlockAttrs(blockId, {
        'custom-b': value
    });
}

const insertCSSScript = (id: string, css: string) => {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
}

const removeCSSScript = (id: string) => {
    const style = document.getElementById(id);
    style?.remove();
}

export default class BqCalloutPlugin extends Plugin {

    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    CSSRoot = 'BqCalloutPlugin';

    async onload() {
        //@ts-ignore
        let css = window.siyuan.config.appearance.mode === 0? LightCSSVar : DarkCSSVar;
        insertCSSScript(this.CSSRoot, css);
        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
    }

    async onunload() {
        removeCSSScript(this.CSSRoot);
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
            label: "引用块Callout",
            type: "submenu",
            submenu: submenus
        });
    }
}
