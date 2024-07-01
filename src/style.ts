/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 22:15:03
 * @FilePath     : /src/style.ts
 * @LastEditTime : 2024-07-01 14:12:56
 * @Description  : 
 */
import type BqCalloutPlugin from ".";

export const StyleDOMId = 'snippetCSS-BqCallout';
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


/**
 * #TODO 未来加入单个设置
 * 指定特定类别的 Callout 的模式；通过插入特定规则的 css 实现
 * 优先级大于全局默认；但是小于设定特殊 callout-type 属性
 * @param calloutId 
 * @param mode 
 * @returns 
 */
const specificCalloutDefaultMode = (calloutId: string, mode: 'big' | 'small') => `
.bq[custom-b="${calloutId}"]:not([custom-callout-mode]),
.bq[custom-callout="${calloutId}"]:not([custom-callout-mode]) {

    & >.p:first-child,
    & >[data-type="NodeHeading"]:first-child {
        font-weight: var(--callout-${mode}-fc-font-weight) !important;
        font-size: var(--callout-${mode}-fc-font-size) !important;
        padding: 0 0 0 var(--callout-${mode}-fc-padding) !important;
    }
}
.protyle-wysiwyg {
    & .bq[custom-b="${calloutId}"]:not([custom-callout-mode])::after,
    & .bq[custom-callout="${calloutId}"]:not([custom-callout-mode])::after {
        top: var(--callout-${mode}-icon-top);
        left: var(--callout-${mode}-icon-left);
        font-size: var(--callout-${mode}-icon-font-size);
    }
}
`;

/**
 * 设置全局默认的 Callout 显示模式；通过更改 default css 变量来实现
 * @param mode big 模式或者 small 模式
 * @returns 返回 root 变量定义
 */
const toggleVarsByMode = (mode: 'big' | 'small') => {
    const StyleVars = [
        'icon-top',
        'icon-left',
        'icon-font-size',
        'fc-font-size',
        'fc-padding',
        "fc-font-weight"
    ];
    let css = '';
    for (let v of StyleVars) {
        css += `\t--callout-default-${v}: var(--callout-${mode}-${v});\n`
    }

    return `
    :root {
    ${css}
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

        //设置全局 callout 模式
        this.css += toggleVarsByMode(this.plugin.configs.DefaultMode);

        //设置动态 css 变量
        document.documentElement.style.setProperty('--callout-big-icon-top', this.configs.VarIconTop.Big);
        document.documentElement.style.setProperty('--callout-small-icon-top', this.configs.VarIconTop.Small);
    }

}

