<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 18:50:36
 FilePath     : /src/libs/settings.svelte
 LastEditTime : 2024-06-01 22:05:21
 Description  : 
-->
<script lang="ts">
    // import SettingItem from "./setting-item.svelte";
    // import * as callout from "@/callout";
    import SettingItemWrap from "./setting-item-wrap.svelte";
    import CalloutList from "./callout-list.svelte";

    import type BqCalloutPlugin from "..";

    export let plugin: BqCalloutPlugin;

    let i18n = plugin.i18n;

    // const dispatch = createEventDispatcher();

    let configs = {
        EmojiFont: {
            title: i18n.setting.EmojiFont.title,
            description: i18n.setting.EmojiFont.description,
            value: plugin.configs.EmojiFont,
        },
        CustomCSS: {
            title: i18n.setting.CustomCSS.title,
            description: i18n.setting.CustomCSS.description,
            value: plugin.configs.CustomCSS,
        },
        // CalloutOrder: {
        //     title: i18n.setting.CalloutOrder.title,
        //     description: i18n.setting.CalloutOrder.description,
        //     value: plugin.configs.CalloutOrder,
        // },
        CustomCallout: {
            title: "Custom Callout",
            description: "Custom Callout Description",
            value: plugin.configs.CustomCallout as ICallout[],
        },
    };

    $: plugin.configs.CustomCSS = configs.CustomCSS.value;
    // $: plugin.configs.CalloutOrder = configs.CalloutOrder.value;
    $: plugin.configs.EmojiFont = configs.EmojiFont.value;
    $: plugin.configs.CustomCallout = configs.CustomCallout.value;

</script>

<div class="config__tab-container">
    <SettingItemWrap
        title={configs.EmojiFont.title}
        description={configs.EmojiFont.description}
        direction="row"
    >
        <div class="fn__flex">
            <input
                class="b3-text-field fn__flex-center fn__flex-1"
                bind:value={configs.EmojiFont.value}
            />
            <button
                class="b3-button b3-button--text"
                on:click={() => {
                    configs.EmojiFont.value = `'Twitter Emoji', 'Noto Color Emoji', 'OpenMoji', sans-serif`;
                }}>Reset</button
            >
        </div>
    </SettingItemWrap>

    <SettingItemWrap
        title={configs.CustomCSS.title}
        description={configs.CustomCSS.description}
        direction="row"
    >
        <textarea
            class="b3-text-field fn__block"
            rows="4"
            spellcheck="false"
            bind:value={configs.CustomCSS.value}
        ></textarea>
    </SettingItemWrap>

    <SettingItemWrap
        title={configs.CustomCallout.title}
        description={configs.CustomCallout.title}
        direction="row"
    >
        <CalloutList bind:CalloutList={configs.CustomCallout.value}/>
    </SettingItemWrap>
</div>

