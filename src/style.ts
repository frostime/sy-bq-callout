/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 22:15:03
 * @FilePath     : /src/style.ts
 * @LastEditTime : 2024-06-02 11:24:48
 * @Description  : 
 */
import type BqCalloutPlugin from ".";

const StyleDOMId = 'snippetCSS-BqCallout';
const TemplateEmojiFont = `.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-callout]::after {
  font-family: {{var}} !important; 
}`;
const defaultDbCallout = (callout: ICallout) => {
    return `
.protyle-wysiwyg div[data-node-id].bq[custom-b~=${callout.id}]::after {
    content: "${callout.icon}";
}

html[data-theme-mode="light"] .protyle-wysiwyg [data-node-id].bq[custom-b~=${callout.id}] {
    background-color: ${callout.bg.light} !important;
    box-shadow: 0 0 0 2px ${callout.box.light} inset;
}

html[data-theme-mode="dark"] .protyle-wysiwyg [data-node-id].bq[custom-b~=${callout.id}] {
    background-color: ${callout.bg.dark} !important;
    box-shadow: 0 0 0 2px ${callout.box.dark} inset;
}
`;
}
const customCallout = (callout: ICallout) => {
    return `
.protyle-wysiwyg div[data-node-id].bq[custom-callout~=${callout.id}]::after {
    content: "${callout.icon}";
}

html[data-theme-mode="light"] .protyle-wysiwyg [data-node-id].bq[custom-callout~=${callout.id}] {
    background-color: ${callout.bg.light} !important;
    box-shadow: 0 0 0 2px ${callout.box.light} inset;
}

html[data-theme-mode="dark"] .protyle-wysiwyg [data-node-id].bq[custom-callout~=${callout.id}] {
    background-color: ${callout.bg.dark} !important;
    box-shadow: 0 0 0 2px ${callout.box.dark} inset;
}
`;
}

export class DynamicStyle {
    //css 样式内容
    private css: string;
    plugin: BqCalloutPlugin;
    private configs: IConfigs;

    constructor(plugin: BqCalloutPlugin) {
        this.css = "";
        this.plugin = plugin;
        this.configs = plugin.configs;
    }

    update() {
        this.buildStyle();
        this.updateStyleDom()
    }

    /**
     * 根据 this.css 更新 style 标签内容, #snippetCSS-BqCallout
     */
    updateStyleDom() {
        let style: HTMLStyleElement = document.getElementById(StyleDOMId) as HTMLStyleElement;
        if (!style) {
            style = document.createElement('style');
            style.id = StyleDOMId;
            document.head.appendChild(style);
        }
        style.innerHTML = this.css;
    }

    /**
     * 移除 style 标签, #snippetCSS-BqCallout
     */
    removeStyleDom() {
        const style = document.getElementById(StyleDOMId);
        style?.remove();
    }

    /**
     * 根据样式变量重建样式
     * - 如果 val[key] 为 undefined, 则不会对样式进行修改
     * - 如果 val[key] 为 null 或者 "", 则会清空样式
     * - 如果 val[key] 有值, 则会根据模板渲染样式
     * @param styleVar 
     */
    private buildStyle() {
        this.css = "";
        let styles = [];
        styles.push(this.configs.CustomCSS);
        styles.push(TemplateEmojiFont.replace("{{var}}", this.configs.EmojiFont));

        //合并样式
        this.css = Object.values(styles).join("\n");
        //合并自定义 callout 样式
        let customCallouts = this.configs.CustomCallout ?? [];
        customCallouts.forEach(callout => {
            this.css += customCallout(callout);
        })
        //修改默认 callout 样式
        this.plugin.DefaultCallouts.forEach(callout => {
            this.css += defaultDbCallout(callout);
        });
    }

}

