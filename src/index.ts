/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2024-06-02 12:10:52
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
        'custom-b': value,
        'custom-callout': value
    }
    setBlockAttrs(blockId, payload);
}

const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


const SettingName = 'setting.json';

export default class BqCalloutPlugin extends Plugin {

    declare i18n: typeof I18n;

    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private dynamicStyle: DynamicStyle;

    configs: IConfigs = {
        EmojiFont: `'Twitter Emoji', 'Noto Color Emoji', 'OpenMoji', sans-serif`,
        CustomCSS: '',
        CalloutOrder: '',
        DefaultCallout: [],
        CustomCallout: []
    };

    async onload() {
        this.dynamicStyle = new DynamicStyle(this);

        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);

        let configs = await this.loadData(SettingName);
        for (let key in configs) {
            if (key in this.configs) {
                this.configs[key] = configs[key];
            }
        }
        if (this.configs.DefaultCallout.length === 0) {
            //deep copy
            this.configs.DefaultCallout = JSON.parse(JSON.stringify(callout.DefaultCallouts));
        }

        this.dynamicStyle.update();
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
        this.dynamicStyle.update();
        this.resetSlash();
        this.saveData(SettingName, this.configs);
        console.log('Setting Updated');
        console.log(this.configs);
    }

    private resetSlash() {
        this.protyleSlash = [];
        for (let ct of this.configs.DefaultCallout) {
            if (ct?.hide) continue;
            this.protyleSlash.push({
                filter: [`callout-${ct.id}`, `bq-${ct.id}`],
                html: `<span class="b3-menu__label">${ct.icon}${capitalize(ct.id)}</span>`,
                id: ct.id,
                callback: (protyle: Protyle) => {
                    protyle.insert(`>\n{: custom-b="${ct.id}"}`);
                }
            });
        }
        for (let ct of this.configs.CustomCallout) {
            if (ct?.hide) continue;
            this.protyleSlash.push({
                filter: [`callout-${ct.id}`, `bq-${ct.id}`],
                html: `<span class="b3-menu__label">${ct.icon}${capitalize(ct.id)}</span>`,
                id: ct.id,
                callback: (protyle: Protyle) => {
                    protyle.insert(`>\n{: custom-callout="${ct.id}"}`);
                }
            });
        }
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

        let menu: Menu = detail.menu;
        let submenus = [];

        for (let icallout of this.configs.DefaultCallout.concat(this.configs.CustomCallout)) {
            if (icallout.hide) continue;
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
