/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 20:30:13
 * @FilePath     : /src/index.ts
 * @LastEditTime : 2025-08-23 16:53:41
 * @Description  : 
 */
import {
    Plugin,
    Menu,
    Protyle,
    showMessage,
    Dialog,
    Lute
} from "siyuan";
import "@/index.scss";

// import { changelog } from "sy-plugin-changelog";

import { setBlockAttrs, getFile, insertBlock, updateBlock } from "./api"
import * as I18n from "./i18n/zh_CN.json";
import * as callout from "./callout";
import { DynamicStyle, StyleDOMId } from "./style";

import Settings from './libs/settings.svelte';
import { siyuanVersion } from "./libs/utils";


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

    // @ts-ignore
    declare i18n: typeof I18n;

    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private dynamicStyle: DynamicStyle;
    private incompatible: boolean;  // 3.3.0 有问题需要特殊处理

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

        this.incompatible = false
        if (siyuanVersion().compare('3.3.0') >= 0) {
            this.incompatible = true;
        }

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

            // Default filters
            const defaultFilters = [
                `callout-${ct.id}${filterSuffix}`,
                `bq-${ct.id}${filterSuffix}`,
                callout.calloutName(ct) + filterSuffix
            ];

            // Add custom slash filters if available
            let filters = [...defaultFilters];
            if (ct.customSlash) {
                const customFilters = ct.customSlash.split(',')
                    .map(filter => filter.trim())
                    .filter(filter => filter.length > 0)
                    .map(filter => filter + filterSuffix);
                filters = [...customFilters, ...defaultFilters];
            }

            this.protyleSlash.push({
                filter: filters,
                html: `<span class="b3-menu__label">${ct.icon}${callout.calloutName(ct)}${modenameSuffix}</span>`,
                id: ct.id + filterSuffix,
                callback: (protyle: Protyle, nodeElement: HTMLElement) => {
                    // console.log('Insert', ct.id, mode);
                    let toInsert = "";
                    const attrs = {
                        [`custom-${calloutAttr}`]: ct.id
                    }
                    if (mode === undefined) {
                        toInsert = `>\n{: custom-${calloutAttr}="${ct.id}" }`;
                    } else {
                        toInsert = `>\n{: custom-${calloutAttr}="${ct.id}" custom-callout-mode="${mode}" }`;
                        attrs[`custom-callout-mode`] = mode;
                    }

                    // https://github.com/frostime/sy-bq-callout/issues/24#issuecomment-3197505513
                    if (this.incompatible) {
                        protyle.insert(window.Lute.Caret);
                        const nid = nodeElement.getAttribute('data-node-id');
                        // 在下方插入块
                        insertBlock('markdown', toInsert, null, nid).then(operation => {
                            const id = operation[0].doOperations[0].id;
                            const ele = document.querySelector(`[data-node-id="${id}"]`) as HTMLElement;
                            // 鼠标
                            protyle.focusBlock(ele, true);
                        });
                        // const text = (nodeElement.querySelector('[contenteditable]') as HTMLElement).innerText;
                        // console.debug(text)
                        // if (text && text !== window.Lute.Caret) {
                        //     // 在下方插入块
                        //     insertBlock('markdown', toInsert, null, nid).then(operation => {
                        //         const id = operation[0].doOperations[0].id;
                        //         const ele = document.querySelector(`[data-node-id="${id}"]`) as HTMLElement;
                        //         // 鼠标
                        //         protyle.focusBlock(ele, true);
                        //     })
                        // } else {
                        //     setTimeout(async () => {
                        //         await updateBlock('markdown', '> ', nid);
                        //         await setBlockAttrs(nid, attrs);
                        //     }, 10);
                        // }
                    } else {
                        protyle.insert(toInsert);
                    }
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
            element: callout.createCalloutButton("", { id: this.i18n.mode.big, icon: '🇹' }),
            click: () => {
                setBlockAttrs(ele.getAttribute("data-node-id"), {
                    'custom-callout-mode': 'big',
                });
            }
        });
        submenus.push({
            element: callout.createCalloutButton("", { id: this.i18n.mode.small, icon: '🇵' }),
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
