<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 18:50:36
 FilePath     : /src/libs/settings.svelte
 LastEditTime : 2024-06-02 11:14:21
 Description  : 
-->
<script lang="ts">
    // import { getContext } from "svelte";
    import SettingItemWrap from "./setting-item-wrap.svelte";
    import CalloutList from "./callout-list.svelte";

    import type BqCalloutPlugin from "..";

    export let plugin: BqCalloutPlugin;

    let i18n = plugin.i18n;
    // let DefaultCallouts: ICallout[] = getContext("DefaultCallouts");

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
        CustomCallout: {
            title: "Custom Callout",
            description: "Custom Callout Description",
            value: plugin.configs.CustomCallout as ICallout[],
        },
    };

    $: plugin.configs.CustomCSS = configs.CustomCSS.value;
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
        title="默认 Callout"
        description="默认 Callout 描述"
        direction="row"
    >
        <CalloutList callouts={plugin.DefaultCallouts} allowAdd={false}>
            <div
                class="toolbar__item ariaLabel"
                aria-label="重置"
                on:click={(e) => {
                    console.debug(e);
                    // let ele = e.target; //HTMLElement
                    // //@ts-ignore
                    // let div = ele.closet('.callout-list-item');
                    // let cid = div.dataset.cid;
                    // let calloutIdx = plugin.DefaultCallouts.findIndex((item) => item.id === cid);
                    // plugin.DefaultCallouts[calloutIdx] = DefaultCallouts.find((item) => item.id === cid);
                }}
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

