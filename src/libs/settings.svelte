<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 18:50:36
 FilePath     : /src/libs/settings.svelte
 LastEditTime : 2024-06-01 20:51:18
 Description  : 
-->
<script lang="ts">
    // import { createEventDispatcher } from "svelte";
    // import SettingItem from "./setting-item.svelte";
    // import * as callout from "@/callout";
    import SettingItemWrap from "./setting-item-wrap.svelte";
    import { Dialog } from "siyuan";

    import type BqCalloutPlugin from "..";
    import CalloutItem from "./callout-item.svelte";
    import CalloutEditor from "./callout-editor.svelte";

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
        CalloutOrder: {
            title: i18n.setting.CalloutOrder.title,
            description: i18n.setting.CalloutOrder.description,
            value: plugin.configs.CalloutOrder,
        },
        CustomCallout: {
            title: "Custom Callout",
            description: "Custom Callout Description",
            value: [] as ICallout[],
        }
    };

    const editCallout = (callout: ICallout) => {
        if (!callout) return;
        let dialog = new Dialog({
            title: "更改 Callout",
            content: `<div id="CalloutEditor" style="height: 100%;"></div>`,
            width: "30rem",
            height: "32rem",
            destroyCallback: () => {
                pannel.$destroy();
            },
        });
        let pannel = new CalloutEditor({
            target: dialog.element.querySelector("#CalloutEditor"),
            props: {
                CreatedCallouts: configs.CustomCallout.value
                    .map((callout) => callout.id)
                    .filter((id) => id !== callout.id),
                callout: callout
            },
        });
        pannel.$on("cancel", () => dialog.destroy());
        pannel.$on("save", (e: CustomEvent<ICallout>) => {
            let index = configs.CustomCallout.value.findIndex(
                (item) => item.id === e.detail.id,
            );
            configs.CustomCallout.value[index] = e.detail;
            dialog.destroy();
        });
    };

    const newCallout = () => {
        let dialog = new Dialog({
            title: "新建 Callout",
            content: `<div id="CalloutEditor" style="height: 100%;"></div>`,
            width: "30rem",
            height: "32rem",
            destroyCallback: () => {
                pannel.$destroy();
            },
        });
        let pannel = new CalloutEditor({
            target: dialog.element.querySelector("#CalloutEditor"),
            props: {
                CreatedCallouts: configs.CustomCallout.value.map(
                    (callout) => callout.id,
                ),
            },
        });
        pannel.$on("cancel", () => dialog.destroy());
        pannel.$on("save", (e: CustomEvent<ICallout>) => {
            configs.CustomCallout.value = [
                ...configs.CustomCallout.value,
                e.detail,
            ];
            dialog.destroy();
        });
    }


    $: plugin.configs.CustomCSS = configs.CustomCSS.value;
    $: plugin.configs.CalloutOrder = configs.CalloutOrder.value;
    $: plugin.configs.EmojiFont = configs.EmojiFont.value;
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
        title={configs.CalloutOrder.title}
        description={configs.CalloutOrder.description}
        direction="row"
    >
        <div class="fn__flex" style="gap: 10px;">
            <input
                class="b3-text-field fn__flex-center fn__flex-1"
                bind:value={configs.CalloutOrder.value}
            />
            <button
                class="b3-button b3-button--text"
                on:click={() => {
                    configs.CalloutOrder.value = Array.from(
                        plugin.CalloutHub.keys(),
                    ).join(", ");
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

    <div class="b3-label" data-key="CustomCallout">
        <div class="fn__block">
            {configs.CustomCallout.title}
            <div class="b3-label__text">
                {@html configs.CustomCallout.description}
            </div>
            <div class="fn__hr"></div>
            <div class="fn__flex fn__flex-column callouts-list">
                {#each configs.CustomCallout.value as callout (callout.id)}
                    <div class="callout-list-item">
                        <CalloutItem {callout} />
                        <span class="fn__space" />
                        <div
                            class="callout-item-action fn__flex fn__flex-center"
                        >
                            <div
                                class="toolbar__item ariaLabel"
                                aria-label="编辑"
                                on:click={() => {
                                    editCallout(callout);
                                }}
                            >
                                <svg><use xlink:href="#iconEdit"></use></svg>
                            </div>
                            <span class="fn__space" />
                            <!-- <input
                                class="b3-switch fn__flex-center"
                                data-id={callout.id}
                                type="checkbox"
                                checked={callout.hide ? true : !callout.hide}
                            />
                            <span class="fn__space"/> -->
                            <div
                                class="toolbar__item ariaLabel"
                                aria-label="调整顺序"
                            >
                                <svg><use xlink:href="#iconDrag"></use></svg>
                            </div>
                        </div>
                        <span class="fn__space" />
                    </div>
                {/each}
                <section class="action-add fn__flex-center">
                    <button
                        class="b3-button b3-button--outline fn__flex-center fn__size200"
                        on:click={newCallout}
                    >
                        <svg><use xlink:href="#iconAdd"></use></svg>
                        添加 Callout
                    </button>
                </section>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .config__tab-container {
        padding: 16px 32px;
        .b3-label {
            box-shadow: none !important;
            padding-bottom: 16px;
            margin-bottom: 16px;
        }

        .b3-label:not(:last-child) {
            border-bottom: 1px solid var(--b3-border-color);
        }
    }

    .callouts-list {
        border: 2px solid var(--b3-border-color);
        border-radius: 10px;
        padding: 10px;

        .callout-list-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            // border: 1px solid var(--b3-theme-primary-lighter);
            // border-radius: 4px;
            padding: 5px;

            .callout-item-action {
                height: 40px;
                // padding: 4px;
            }
        }
    }
</style>
