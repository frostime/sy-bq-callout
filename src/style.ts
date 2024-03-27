/*
 * Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 * @Author       : Yp Z
 * @Date         : 2023-10-02 22:15:03
 * @FilePath     : /src/style.ts
 * @LastEditTime : 2024-03-27 22:40:26
 * @Description  : 
 */

export const LightCSSVar = `
/* Light */
:root {
    --b3-font-background1-callout: rgb(198, 203, 208);
    --b3-font-background2-callout: rgb(225, 225, 225);
    --b3-font-background3-callout: rgb(235, 236, 237);
    --b3-font-background4-callout: rgb(233, 229, 227);
    --b3-font-background5-callout: rgb(246, 225, 205);
    --b3-font-background6-callout: rgb(250, 235, 221);
    --b3-font-background7-callout: rgb(251, 243, 219);
    --b3-font-background8-callout: rgba(221, 237, 226);
    --b3-font-background9-callout: rgb(221, 237, 234);
    --b3-font-background10-callout: rgb(221, 235, 241);
    --b3-font-background11-callout: rgb(234, 228, 242);
    --b3-font-background12-callout: rgb(244, 223, 235);
    --b3-font-background13-callout: rgb(251, 228, 228);
    --b3-bq-background1-callout: rgb(198, 203, 208 , .5);
    --b3-bq-background2-callout: rgb(225, 225, 225 , .5);
    --b3-bq-background3-callout: rgb(235, 236, 237 , .5);
    --b3-bq-background4-callout: rgb(233, 229, 227 , .5);
    --b3-bq-background5-callout: rgb(246, 225, 205 , .5);
    --b3-bq-background6-callout: rgb(250, 235, 221 , .5);
    --b3-bq-background7-callout: rgb(251, 243, 219 , .5);
    --b3-bq-background8-callout: rgba(221, 237, 226 , .5);
    --b3-bq-background9-callout: rgb(221, 237, 234 , .5);
    --b3-bq-background10-callout: rgb(221, 235, 241 , .5);
    --b3-bq-background11-callout: rgb(234, 228, 242 , .5);
    --b3-bq-background12-callout: rgb(244, 223, 235 , .5);
    --b3-bq-background13-callout: rgb(251, 228, 228 , .5);
}
`;

export const DarkCSSVar = `
/* Dark */
:root {
    --b3-font-background1-callout: rgb(35, 38, 40);
    --b3-font-background2-callout: rgb(63, 68, 71);
    --b3-font-background3-callout: rgb(69, 75, 78);
    --b3-font-background4-callout: rgb(67, 64, 64);
    --b3-font-background5-callout: rgb(89, 74, 58);
    --b3-font-background6-callout: rgb(89, 79, 59);
    --b3-font-background7-callout: rgb(89, 86, 59);
    --b3-font-background8-callout: rgba(53, 76, 75);
    --b3-font-background9-callout: rgb(54, 79, 84);
    --b3-font-background10-callout: rgb(54, 73, 84);
    --b3-font-background11-callout: rgb(68, 63, 87);
    --b3-font-background12-callout: rgb(83, 59, 76);
    --b3-font-background13-callout: rgb(89, 65, 65);
    --b3-bq-background1-callout: rgb(35, 38, 40, .3);
    --b3-bq-background2-callout: rgb(63, 68, 71, .3);
    --b3-bq-background3-callout: rgb(69, 75, 78, .3);
    --b3-bq-background4-callout: rgb(67, 64, 64, .3);
    --b3-bq-background5-callout: rgb(89, 74, 58, .3);
    --b3-bq-background6-callout: rgb(89, 79, 59, .3);
    --b3-bq-background7-callout: rgb(89, 86, 59, .3);
    --b3-bq-background8-callout: rgba(53, 76, 75, .3);
    --b3-bq-background9-callout: rgb(54, 79, 84, .3);
    --b3-bq-background10-callout: rgb(54, 73, 84, .3);
    --b3-bq-background11-callout: rgb(68, 63, 87, .3);
    --b3-bq-background12-callout: rgb(83, 59, 76, .3);
    --b3-bq-background13-callout: rgb(89, 65, 65, .3);
}
`;

const StyleDOMId = 'snippetCSS-BqCallout';

const render = (template: string, vars: Record<string, string>) => {
    const re = /{{\s*([\w.]+)\s*}}/g;
    return template.replace(re, (_, key) => vars[key] || '');
}


//cssSnippet 的模板
const StyleTemplate: IStyleFields = {
    IconFont: `
.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-bq-callout]::after {
    font-family: {{IconFont}} !important; 
}
`,
}

export class DynamicStyle {
    //css 样式内容
    private css: string;
    //css 样式片段, 合并后生成 this.css
    private cssSnippets: IStyleFields = {
        CustomCSS: ""
    }

    constructor() {
        this.css = "";
    }

    init(styleVar: IStyleFields) {
        this.rebuild(styleVar);
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
    rebuild(styleVar: IStyleFields) {
        this.css = "";
        for (let key in styleVar) {
            //custom css 不需要模板, 单独处理
            if (key === 'CustomCSS') {
                this.cssSnippets[key] = styleVar[key];
                continue;
            }

            // 需要模板的样式, 从模板中渲染
            // let value = styleVar?.[key];
            // if (value === undefined) {
            //     continue;
            // }
            // //清空样式
            // if (value === "" || value === null) {
            //     this.cssSnippets[key] = "";
            //     continue;
            // }
            // //从模板中渲染样式
            // let template = StyleTemplate[key];
            // if (template) {
            //     let css = render(template, { [key]: value });
            //     this.cssSnippets[key] = css;
            // }
        }
        //合并样式
        this.css = Object.values(this.cssSnippets).join("\n");
    }

}

