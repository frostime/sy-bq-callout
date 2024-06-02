<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 18:50:36
 FilePath     : /src/libs/settings.svelte
 LastEditTime : 2024-06-02 11:39:43
 Description  : 
-->
<script lang="ts">
    import SettingItemWrap from "./setting-item-wrap.svelte";
    import CalloutList from "./callout-list.svelte";
    import { DefaultCallouts } from "@/callout";

    import type BqCalloutPlugin from "..";

    export let plugin: BqCalloutPlugin;

    let i18n = plugin.i18n;

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
        CustomCallout: {
            title: "Custom Callout",
            description: "Custom Callout Description",
            value: plugin.configs.CustomCallout as ICallout[],
        },
    };

    $: plugin.configs.CustomCSS = configs.CustomCSS.value;
    $: plugin.configs.EmojiFont = configs.EmojiFont.value;
    $: plugin.configs.CustomCallout = configs.CustomCallout.value;

    const onClickResetDefaultCallout = (e: MouseEvent) => {
        console.debug(e);
        let ele = e.target as HTMLElement;
        let div = ele.closest('.callout-list-item') as HTMLDivElement;
        let cid = div.dataset.cid;
        let calloutIdx = plugin.configs.DefaultCallout.findIndex((item) => item.id === cid);
        if (calloutIdx === -1) return;
        let defaultCallout = DefaultCallouts.find((item) => item.id === cid);
        if (!defaultCallout) return;
        plugin.configs.DefaultCallout[calloutIdx] = JSON.parse(JSON.stringify(defaultCallout)); //深拷贝
    };

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
        title="默认 Callout"
        description="默认 Callout 描述"
        direction="row"
    >
        <CalloutList callouts={plugin.configs.DefaultCallout} allowAdd={false}>
            <div
                class="toolbar__item ariaLabel"
                aria-label="重置"
                on:click={onClickResetDefaultCallout}
            >
                <svg><use xlink:href="#iconUndo"></use></svg>
            </div>
        </CalloutList>
    </SettingItemWrap>

    <SettingItemWrap
        title={configs.CustomCallout.title}
        description={configs.CustomCallout.title}
        direction="row"
    >
        <CalloutList bind:callouts={configs.CustomCallout.value} allowAdd={true}/>
    </SettingItemWrap>
</div>

