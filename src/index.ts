import {
    Plugin,
    Menu
} from "siyuan";
import "@/index.css";

import { setBlockAttrs } from "./api"
import  * as create from "./creator";

const NewButton = [
    create.Info, create.Check, create.Question, create.Warn, create.Light, create.quoteError, create.Bug, create.Wrong, create.Bell, create.Note, create.Pen
]

async function setUpAttr(blockId: BlockId, value: string) {
    setBlockAttrs(blockId, {
        'custom-b': value
    });
}

export default class BqCalloutPlugin extends Plugin {

    private blockIconEventBindThis = this.blockIconEvent.bind(this);

    async onload() {
        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
    }

    async onunload() {
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
