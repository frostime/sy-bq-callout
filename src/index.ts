/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2024-06-01 21:09:16
 * @Description  : 
 */
import {
    Plugin,
    Menu,
    Protyle,
    Dialog
} from "siyuan";
import "@/index.scss";

// import { changelog } from "sy-plugin-changelog";

import { setBlockAttrs } from "./api"
import * as I18n from "./i18n/zh_CN.json";
import * as callout from "./callout";
import { DynamicStyle } from "./style";

import Settings from './libs/settings.svelte';

async function setUpAttr(blockId: BlockId, value: string) {
    let payload = {
        'custom-b': value
        // 'custom-bq-callout': value
    }
    setBlockAttrs(blockId, payload);
}

const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


const SettingName = 'setting.json';
const IconStyle = ``;

export default class BqCalloutPlugin extends Plugin {

    declare i18n: typeof I18n;

    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private dynamicStyle: DynamicStyle = new DynamicStyle();

    CalloutHub: Map<string, ICallout> = new Map();

    configs = {
        EmojiFont: `'Twitter Emoji', 'Noto Color Emoji', 'OpenMoji', sans-serif`,
        CustomCSS: IconStyle as string,
        CalloutOrder: '',
        CustomCallout: [] as ICallout[]
    };

    async onload() {
        let DefaultCallouts = callout.initDefault(I18n);
        for (let ct of DefaultCallouts) {
            this.CalloutHub.set(ct.id, ct);
        }
        this.configs.CalloutOrder = Array.from(this.CalloutHub.keys()).join(', ');

        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);

        let configs = await this.loadData(SettingName);
        for (let key in configs) {
            if (key in this.configs) {
                this.configs[key] = configs[key];
            }
        }

        this.dynamicStyle.init({
            CustomCSS: this.configs.CustomCSS,
            EmojiFont: this.configs.EmojiFont
        });
        this.resetSlash();

        // changelog(this, 'i18n/CHANGELOG.md').then(ans => {
        //     if (ans.Dialog) {
        //         ans.Dialog.setFont('20px');
        //     }
        // })
    }

    async onunload() {
        this.dynamicStyle.removeStyleDom();
        this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
    }

    openSetting(): void {
        let dialog = new Dialog({
            title: this.i18n.name,
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: '45rem',
            height: '40rem',
            destroyCallback: () => {
                this.onSettingUpdated();
                pannel.$destroy();
            }
        });
        let pannel = new Settings({
            target: dialog.element.querySelector("#SettingPanel"),
            props: {
                plugin: this
            }
        });
    }

    private onSettingUpdated() {
        this.dynamicStyle.update({
            CustomCSS: this.configs.CustomCSS,
            EmojiFont: this.configs.EmojiFont
        });
        this.dynamicStyle.updateStyleDom();
        this.resetSlash();
        this.saveData(SettingName, this.configs);
        console.log('Setting Updated');
        console.log(this.configs);
    }

    private getCalloutList(): ICallout[] {
        let CalloutOrder = this.configs.CalloutOrder.trim();
        let orderList = [];
        if (CalloutOrder === '') {
            orderList = Array.from(this.CalloutHub.keys());
        } else {
            orderList = CalloutOrder.split(/\s*[,;，；]\s*/).map((v) => v.trim());
        }
        let callouts = [];
        for (let id of orderList) {
            let callout = this.CalloutHub.get(id);
            if (callout) {
                callouts.push(callout);
            }
        }
        return callouts;
    }

    private resetSlash() {
        this.protyleSlash = [];
        for (let ct of this.getCalloutList()) {
            this.protyleSlash.push({
                filter: [`callout-${ct.id}`, `bq-${ct.id}`],
                html: `<span class="b3-menu__label">${ct.icon}${capitalize(ct.id)}</span>`,
                id: ct.id,
                callback: (protyle: Protyle) => {
                    protyle.insert(`>\n{: custom-b="${ct.id}"}`);
                }
            });
        }
    }

    private blockIconEvent({ detail }: any) {
        // console.log(detail);
        if (detail.blockElements.length > 1) {
            return;
        }
        let ele: HTMLDivElement = detail.blockElements[0];
        if (!ele.classList.contains("bq")) {
            return;
        }

        let menu: Menu = detail.menu;
        let submenus = [];

        for (let icallout of this.getCalloutList()) {
            let btn = callout.createCalloutButton(ele.getAttribute("data-node-id"), icallout);
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

        let btn = callout.createRestoreButton(ele.getAttribute("data-node-id"));
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
