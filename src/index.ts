/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2024-03-27 13:17:39
 * @Description  : 
 */
import {
    Plugin,
    Menu,
    Protyle
} from "siyuan";
import "@/index.scss";

import { changelog } from "sy-plugin-changelog";

import { setBlockAttrs } from "./api"
import * as I18n from "./i18n/zh_CN.json";
import * as callout from "./callout";
import { DynamicStyle } from "./style";
import { SettingUtils } from "./libs/setting-utils";

async function setUpAttr(blockId: BlockId, value: string) {
    let payload = {
        'custom-b': value
        // 'custom-bq-callout': value
    }
    setBlockAttrs(blockId, payload);
}


const SettingName = 'setting.json';

export default class BqCalloutPlugin extends Plugin {

    declare i18n: typeof I18n;

    private settingUtils: SettingUtils;
    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private dynamicStyle: DynamicStyle = new DynamicStyle();

    DefaultCallouts: ICallout[];

    async onload() {
        this.DefaultCallouts = callout.initDefault(I18n);
        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
        this.initSlash();

        this.settingUtils = new SettingUtils(this, SettingName);
        this.settingUtils.addItem({
            key: 'iconFontStyle',
            value: `'Twitter Emoji', 'Noto Color Emoji', sans-serif`,
            type: 'textinput',
            title: this.i18n.setting.iconFontStyle.title,
            description: this.i18n.setting.iconFontStyle.description,
            placeholder: 'Value of "font-family" term in CSS'
        });
        this.settingUtils.load().then(() => {
            let iconFontStyle = this.settingUtils.get('iconFontStyle');
            this.dynamicStyle.init({
                IconFont: iconFontStyle
            });
        });

        changelog(this, 'i18n/CHANGELOG.md').then(ans => {
            if (ans.Dialog) {
                ans.Dialog.setFont('20px');
            }
        })
    }

    async onunload() {
        this.dynamicStyle.removeStyleDom();
        this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
    }

    private initSlash() {
        for (let ct of this.DefaultCallouts) {
            this.protyleSlash.push({
                filter: [`callout-${ct.id}`, `bq-${ct.id}`],
                html: `<span class="b3-menu__label">${ct.icon}${ct.id}</span>`,
                id: ct.id,
                callback: (protyle: Protyle) => {
                    protyle.insert(`> ${ct.id}\n{: custom-b="${ct.id}"}`);
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
        console.log(this.DefaultCallouts);
        for (let icallout of this.DefaultCallouts) {
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
