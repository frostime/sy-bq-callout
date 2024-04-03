/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2024-04-03 22:15:54
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
const IconStyle = 
`.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-bq-callout]::after {
  font-family: 'Twitter Emoji', 'Noto Color Emoji', sans-serif !important; 
}
`;

export default class BqCalloutPlugin extends Plugin {

    declare i18n: typeof I18n;

    private settingUtils: SettingUtils;
    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private onSettingUpdatedBindThis = this.onSettingUpdated.bind(this);
    private dynamicStyle: DynamicStyle = new DynamicStyle();

    CalloutHub: Map<string, ICallout> = new Map();

    async onload() {
        let DefaultCallouts = callout.initDefault(I18n);
        for (let ct of DefaultCallouts) {
            this.CalloutHub.set(ct.id, ct);
        }

        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);

        this.settingUtils = new SettingUtils(
            this, SettingName, this.onSettingUpdatedBindThis, '45rem', '40rem'
        );
        this.settingUtils.addItem({
            key: 'CustomCSS',
            value: IconStyle,
            type: 'textarea',
            title: this.i18n.setting.CustomCSS.title,
            description: this.i18n.setting.CustomCSS.description,
            placeholder: '任意自定义 CSS 样式代码'
        });
        let ele = this.settingUtils.addItem({
            key: 'CalloutOrder',
            value: DefaultCallouts.map((v) => v.id).join(', '),
            type: 'textarea',
            title: this.i18n.setting.CalloutOrder.title,
            description: this.i18n.setting.CalloutOrder.description
        });
        ele.style.height = '2rem';
        this.settingUtils.load().then(() => {
            let CustomCSS = this.settingUtils.get('CustomCSS');
            this.dynamicStyle.init({
                CustomCSS: CustomCSS
            });
            this.resetSlash();
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

    private onSettingUpdated(data: IStyleFields) {
        this.dynamicStyle.rebuild(data);
        this.dynamicStyle.updateStyleDom();
        this.settingUtils.save();
        this.resetSlash();
    }

    private getCalloutList(): ICallout[] {
        let CalloutOrder = this.settingUtils.get('CalloutOrder').trim();
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
                html: `<span class="b3-menu__label">${ct.icon}${ct.id}</span>`,
                id: ct.id,
                callback: (protyle: Protyle) => {
                    protyle.insert(`> ${ct.id}\n{: custom-b="${ct.id}"}`);
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
