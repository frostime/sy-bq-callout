<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 18:50:36
 FilePath     : /src/libs/settings.svelte
 LastEditTime : 2024-07-19 13:51:22
 Description  : 
-->
<script lang="ts">
    import { setContext } from "svelte";
    import { confirm } from "siyuan";
    import SettingItemWrap from "./setting-item-wrap.svelte";
    import CalloutList from "./callout-list.svelte";
    import { DefaultCallouts, queryCalloutBlock } from "@/callout";

    import type BqCalloutPlugin from "..";

    export let plugin: BqCalloutPlugin;

    let i18n = plugin.i18n;

    setContext('EmojiFont', plugin.configs.EmojiFont);

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
        let ele = e.target as HTMLElement;
        let div = ele.closest(".callout-list-item") as HTMLDivElement;
        let cid = div.dataset.cid;
        let calloutIdx = plugin.configs.DefaultCallout.findIndex(
            (item) => item.id === cid,
        );
        if (calloutIdx === -1) return;
        let defaultCallout = DefaultCallouts.find((item) => item.id === cid);
        if (!defaultCallout) return;
        plugin.configs.DefaultCallout[calloutIdx] = JSON.parse(
            JSON.stringify(defaultCallout),
        ); //深拷贝
    };

    const onClickDeleteCallout = async (e: MouseEvent) => {
        let ele = e.target as HTMLElement;
        let div = ele.closest(".callout-list-item") as HTMLDivElement;
        let cid = div.dataset.cid;
        let calloutIdx = configs.CustomCallout.value.findIndex(
            (item) => item.id === cid,
        );
        if (calloutIdx === -1) return;
        let callout = configs.CustomCallout.value[calloutIdx];
        let blocks = await queryCalloutBlock(callout.id, callout.custom);
        let text = i18n.setting.Delete.description
            .replace("{0}", callout.icon)
            .replace("{1}", callout.id)
            .replace("{2}", blocks.length.toString());
        confirm(
            "确实删除?", text,
            () => {
                configs.CustomCallout.value =
                    configs.CustomCallout.value.filter(
                        (item) => item.id !== cid,
                    );
            },
        );
    };
</script>

<div class="config__tab-container">
    <SettingItemWrap
        title={plugin.i18n.setting.DefaultMode.title}
        description={plugin.i18n.setting.DefaultMode.description}
        direction="column"
    >
        <select
            class="b3-select fn__flex-center fn__size200"
            id="iconPosition"
            bind:value={plugin.configs.DefaultMode}
        >
            <option value="big">{plugin.i18n.mode.big}</option>
            <option value="small">{plugin.i18n.mode.small}</option>
        </select>
    </SettingItemWrap>

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
                }}>{i18n.reset}</button
            >
        </div>
    </SettingItemWrap>

    <SettingItemWrap
        title={i18n.setting.DefaultCallout.title}
        description={i18n.setting.DefaultCallout.description}
        direction="row"
    >
        <CalloutList callouts={plugin.configs.DefaultCallout} type="Default">
            <div
                class="toolbar__item ariaLabel"
                aria-label={i18n.reset}
                on:click={onClickResetDefaultCallout}
            >
                <svg><use xlink:href="#iconUndo"></use></svg>
            </div>
        </CalloutList>
    </SettingItemWrap>

    <SettingItemWrap
        title={i18n.setting.CustomCallout.title}
        description={i18n.setting.CustomCallout.description}
        direction="row"
    >
        <CalloutList
            bind:callouts={configs.CustomCallout.value}
            type="Custom"
        >
            <div
                class="toolbar__item ariaLabel"
                aria-label={i18n.delete}
                on:click={onClickDeleteCallout}
            >
                <svg><use xlink:href="#iconClose"></use></svg>
            </div>
        </CalloutList>
    </SettingItemWrap>

    <SettingItemWrap
        title={i18n.setting.IconTop.title}
        description={i18n.setting.IconTop.description}
        direction="column"
    >
        <div class="fn__flex fn__flex-column" style="gap: 2px;">
            <div class="fn__flex fn__flex-1" style="gap: 2px; align-items: center;">
                <span>{i18n.setting.IconTop.big}</span>
                <input class="b3-text-field" bind:value={plugin.configs.VarIconTop.Big}/>
            </div>
            <div class="fn__flex  fn__flex-1" style="gap: 2px; align-items: center;">
                <span>{i18n.setting.IconTop.small}</span>
                <input class="b3-text-field" bind:value={plugin.configs.VarIconTop.Small}/>
            </div>
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
</div>
