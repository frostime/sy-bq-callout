/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2024-07-13 19:51:14
 * @Description  : 
 */
import {
    Plugin,
    Menu,
    Protyle,
    showMessage,
    Dialog
} from "siyuan";
import "@/index.scss";

// import { changelog } from "sy-plugin-changelog";

import { setBlockAttrs, getFile } from "./api"
import * as I18n from "./i18n/zh_CN.json";
import * as callout from "./callout";
import { DynamicStyle, StyleDOMId } from "./style";

import Settings from './libs/settings.svelte';


const SettingName = 'setting.json';

async function exportStyle() {
    let indexCss: string = await getFile(`/data/plugins/sy-bq-callout/index.css`);
    if (!indexCss) {
        indexCss = "";
        showMessage('index.css not found', 4000, 'error');
    }
    const startMark = `/* Callout Style Start */`;
    const endMark = `/* Callout Style End */`;
    //获取 start 和 end 之间的内容
    const start = indexCss.indexOf(startMark);
    const end = indexCss.indexOf(endMark);
    indexCss = indexCss.substring(start + startMark.length, end).trim();

    let styleDom = document.getElementById(StyleDOMId);
    const styles = indexCss + '\n\n' + (styleDom ? styleDom.innerHTML : '');
    //download
    const blob = new Blob([styles], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'callout-style.css';
    a.click();
    URL.revokeObjectURL(url);
}

export default class BqCalloutPlugin extends Plugin {

    declare i18n: typeof I18n;

    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private dynamicStyle: DynamicStyle;

    configs: IConfigs = {
        EmojiFont: `'Twitter Emoji', 'Noto Color Emoji', 'OpenMoji', sans-serif`,
        CustomCSS: '',
        CalloutOrder: '',
        DefaultCallout: [],
        CustomCallout: [],
        DefaultMode: 'big',
        VarIconTop: {
            Big: '0.35em',
            Small: '0.45em'
        }
    };

    async onload() {
        callout.setUp(this);
        this.dynamicStyle = new DynamicStyle(this);
        if (process.env.DEV_MODE === 'true') {
            globalThis.exportStyle = exportStyle;
        }

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
        // });
    }

    async onunload() {
        this.dynamicStyle.removeStyleDom();
        this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
    }

    openSetting(): void {
        let dialog = new Dialog({
            title: this.i18n.name,
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: '800px',
            height: '720px',
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
        console.debug('Setting Updated');
        console.debug(this.configs);
    }

    private resetSlash() {

        const addSlash = (
            ct: ICallout, calloutAttr: 'b' | 'callout', mode?: 'big' | 'small'
        ) => {
            let modeName = mode ? this.i18n.mode[mode] : "";
            let filterSuffix = mode ? `-${mode}` : "";
            let modenameSuffix = mode ? ` | ${modeName}` : "";

            this.protyleSlash.push({
                filter: [
                    `callout-${ct.id}${filterSuffix}`,
                    `bq-${ct.id}${filterSuffix}`,
                    callout.calloutName(ct) + filterSuffix
                ],
                html: `<span class="b3-menu__label">${ct.icon}${callout.calloutName(ct)}${modenameSuffix}</span>`,
                id: ct.id + filterSuffix,
                callback: (protyle: Protyle) => {
                    console.log('Insert', ct.id, mode);
                    let toInsert = "";
                    if (mode === undefined) {
                        toInsert = `>\n{: custom-${calloutAttr}="${ct.id}" }`;
                    } else {
                        toInsert = `>\n{: custom-${calloutAttr}="${ct.id}" custom-callout-mode="${mode}" }`;
                    }
                    protyle.insert(toInsert);
                }
            });
        }

        this.protyleSlash = [];
        for (let ct of this.configs.DefaultCallout) {
            if (ct?.hide) continue;
            addSlash(ct, 'b');
            if (ct.slash?.big) addSlash(ct, 'b', 'big');
            if (ct.slash?.small) addSlash(ct, 'b', 'small');
        }
        for (let ct of this.configs.CustomCallout) {
            if (ct?.hide) continue;
            addSlash(ct, 'callout');
            if (ct.slash?.big) addSlash(ct, 'callout', 'big');
            if (ct.slash?.small) addSlash(ct, 'callout', 'small');
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
        const allCallout = this.configs.DefaultCallout.concat(this.configs.CustomCallout).filter((item) => !item.hide);
        for (let icallout of allCallout) {
            if (icallout.hide) continue;
            let btn = callout.createCalloutButton(ele.getAttribute("data-node-id"), icallout);
            btn.onclick = () => {
                let payload = {
                    'custom-callout': '',
                    'custom-b': ''
                };
                let key = icallout.custom ? 'custom-callout' : 'custom-b';
                payload[key] = icallout.id;
                setBlockAttrs(ele.getAttribute("data-node-id"), payload);
            }
            submenus.push({
                element: btn,
            })
        }
        submenus.push({
            type: 'separator'
        });

        submenus.push({
            element: callout.createCalloutButton("", {id: this.i18n.mode.big, icon: '🇹'}),
            click: () => {
                setBlockAttrs(ele.getAttribute("data-node-id"), {
                    'custom-callout-mode': 'big',
                });
            }
        });
        submenus.push({
            element: callout.createCalloutButton("", {id: this.i18n.mode.small, icon: '🇵'}),
            click: () => {
                setBlockAttrs(ele.getAttribute("data-node-id"), {
                    'custom-callout-mode': 'small',
                });
            }
        });

        let btn = callout.createRestoreButton(ele.getAttribute("data-node-id"));
        btn.onclick = () => {
            setBlockAttrs(ele.getAttribute("data-node-id"), {
                'custom-callout': '',
                'custom-b': ''
            });
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
