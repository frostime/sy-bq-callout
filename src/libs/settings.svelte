<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 18:50:36
 FilePath     : /src/libs/settings.svelte
 LastEditTime : 2024-05-25 19:39:58
 Description  : 
-->
<script lang="ts">
    // import { createEventDispatcher } from "svelte";
    // import SettingItem from "./setting-item.svelte";
    // import * as callout from "@/callout";

    import type BqCalloutPlugin from "..";

    export let plugin: BqCalloutPlugin;

    let i18n = plugin.i18n;

    // const dispatch = createEventDispatcher();

    const IconStyle = `.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-bq-callout]::after {
font-family: 'Twitter Emoji', 'Noto Color Emoji', sans-serif !important; 
}`;

    let configs = {
        CustomCSS: {
            title: i18n.setting.CustomCSS.title,
            description: i18n.setting.CustomCSS.description,
            value: IconStyle
        },
        CalloutOrder: {
            title: i18n.setting.CalloutOrder.title,
            description: i18n.setting.CalloutOrder.description,
            value: ''
        }
    };
</script>

<div class="config__tab-container">

    <div class="b3-label" data-key="CustomCSS">
        <div class="fn__block">
            {configs.CustomCSS.title}
            <div class="b3-label__text">{@html configs.CustomCSS.description}</div>
            <div class="fn__hr"></div>
            <textarea
                class="b3-text-field fn__block"
                rows="10"
                spellcheck="false"
                bind:value={configs.CustomCSS.value}
            ></textarea>
        </div>
    </div>

    <div class="b3-label" data-key="CalloutOrder">
        <div class="fn__block">
            {configs.CalloutOrder.title}
            <div class="b3-label__text">{@html configs.CalloutOrder.description}</div>
            <div class="fn__hr"></div>
            <div class="fn__flex" style="gap: 10px;">
                <input class="b3-text-field fn__flex-center fn__flex-1" value={configs.CalloutOrder.value} />
                <button class="b3-button b3-button--text">Reset</button>
            </div>
        </div>
    </div>

</div>

<style lang="scss">
    .config__tab-container {
        .b3-label {
            box-shadow: none !important;
            padding-bottom: 16px;
            margin-bottom: 16px;
        }

        .b3-label:not(:last-child) {
            border-bottom: 1px solid var(--b3-border-color);
        }
    }
    
</style>
