/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 22:15:03
 * @FilePath     : /src/style.ts
 * @LastEditTime : 2024-06-02 13:23:03
 * @Description  : 
 */
import type BqCalloutPlugin from ".";

const StyleDOMId = 'snippetCSS-BqCallout';
const TemplateEmojiFont = `.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-callout]::after {
  font-family: {{var}} !important; 
}`;
const defaultDbCallout = (callout: ICallout) => {
    const hightlight = `
    html[data-theme-mode="light"] .bq[custom-b="${callout.id}"]>[data-node-id]:first-child {
        background-color: ${callout.box.light};
    }
    
    html[data-theme-mode="dark"] .bq[custom-b="${callout.id}"]>[data-node-id]:first-child {
        background-color: ${callout.box.dark};
    }`;
    return `
.protyle-wysiwyg div[data-node-id].bq[custom-b="${callout.id}"]::after {
    content: "${callout.icon}";
}

html[data-theme-mode="light"] .protyle-wysiwyg [data-node-id].bq[custom-b="${callout.id}"] {
    background-color: ${callout.bg.light} !important;
    box-shadow: 0 0 0 2px ${callout.box.light} inset;
}

html[data-theme-mode="dark"] .protyle-wysiwyg [data-node-id].bq[custom-b="${callout.id}"] {
    background-color: ${callout.bg.dark} !important;
    box-shadow: 0 0 0 2px ${callout.box.dark} inset;
}
`;
}
const customCallout = (callout: ICallout) => {
    const hightlight = `
    html[data-theme-mode="light"] .bq[custom-callout="${callout.id}"]>[data-node-id]:first-child {
        background-color: ${callout.box.light};
    }
    
    html[data-theme-mode="dark"] .bq[custom-callout="${callout.id}"]>[data-node-id]:first-child {
        background-color: ${callout.box.dark};
    }`;
    return `
.protyle-wysiwyg div[data-node-id].bq[custom-callout="${callout.id}"]::after {
    content: "${callout.icon}";
}

html[data-theme-mode="light"] .protyle-wysiwyg [data-node-id].bq[custom-callout="${callout.id}"] {
    background-color: ${callout.bg.light} !important;
    box-shadow: 0 0 0 2px ${callout.box.light} inset;
}

html[data-theme-mode="dark"] .protyle-wysiwyg [data-node-id].bq[custom-callout="${callout.id}"] {
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
        this.plugin.configs.DefaultCallout.forEach(callout => {
            this.css += defaultDbCallout(callout);
        });
    }

}

