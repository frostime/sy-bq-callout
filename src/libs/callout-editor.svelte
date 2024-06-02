<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:24
 FilePath     : /src/libs/callout-editor.svelte
 LastEditTime : 2024-06-02 13:43:33
 Description  : 
-->
<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { Dialog, showMessage, confirm } from "siyuan";
    import CalloutItem from "./callout-item.svelte";
    import IconChooser from "./icon-chooser.svelte";
    import "vanilla-colorful/rgba-string-color-picker.js";

    export let CreatedCallouts: string[];

    export let callout: ICallout = {
        id: "Input ID Here",
        icon: "📌",
        title: "新建 Callout",
        bg: {
            light: "rgba(238, 245, 248, 1)",
            dark: "rgba(53, 76, 75, .5)",
        },
        box: {
            light: "rgba(238, 245, 248, .3)",
            dark: "rgbaa(53, 76, 75, 1)",
        },
        hide: false,
        custom: true,
    };

    const DefaulCallout = JSON.parse(JSON.stringify(callout));

    let emojiFont = getContext("EmojiFont");

    const chooseIcon = () => {
        let dialog = new Dialog({
            title: "选择图标",
            content: `<div id="IconChooser" style="height: 100%;"></div>`,
            width: "30rem",
            height: "30rem",
            destroyCallback: () => {
                pannel.$destroy();
            },
        });
        dialog.element.style.left = "30rem";
        let pannel = new IconChooser({
            target: dialog.element.querySelector("#IconChooser"),
        });
        pannel.$on("choose", (e) => {
            callout.icon = e.detail;
            dialog.destroy();
        });
    };

    let PickColor = false;
    let picker = {
        type: "",
        mode: "",
        color: "",
        x: "",
        y: "",
    };

    const changeColor = (
        e: MouseEvent,
        type: "bg" | "box",
        mode: "light" | "dark",
    ) => {
        if (PickColor && picker.type === type && picker.mode === mode) {
            PickColor = false;
            return;
        }
        let ele = e.target as HTMLElement;
        let rect = ele.getBoundingClientRect();
        picker.x = rect.right + 5 + "px";
        picker.y = rect.top + "px";
        picker.color = callout[type][mode];
        picker.type = type;
        picker.mode = mode;
        PickColor = true;
    };

    const handleColorChange = (e: CustomEvent) => {
        picker.color = e.detail.value;
        callout[picker.type][picker.mode] = picker.color;
    };

    const dispatch = createEventDispatcher();
    const onCancel = () => {
        dispatch("cancel", DefaulCallout);
    };

    const onSave = () => {
        if (CreatedCallouts.includes(callout.id)) {
            showMessage("Callout ID 已存在，请重新更改 ID", 4000, "error");
            return;
        }
        if (callout.id === "") {
            showMessage("Callout ID 不能为空", 4000, "error");
            return;
        }
        if (callout.id !== DefaulCallout.id) {
            confirm("Callout ID 发生变更",
            `⚠️ Callout ID 从${DefaulCallout.id}变更为${callout.id}，这可能导致之前的callout失效。<br/>❓ 确认要修改吗？`,
            () => {
                dispatch("save", callout);
            });
        } else {
            dispatch("save", callout);
        }
    };
</script>

<sectioin class="callout-editor">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fn__flex" style="font-size: 1.2rem;">
        <div>ID:</div>
        <div class="fn__space" />
        {#if callout.custom}
            <input
                class="b3-text-field fn__flex-center fn__size200"
                bind:value={callout.id}
            />
        {:else}
            <div
                class="callout-id"
                style="font-family: ${emojiFont} !important;"
            >
                {callout.id}
            </div>
        {/if}
        <div class="fn__flex-1" />
        <div class="callout-icon" on:click={chooseIcon}>{callout.icon}</div>
    </div>
    <div class="color-editor bordered">
        <div>亮色模式</div>
        <div>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.bg.light}; color: black;"
                on:click={(e) => changeColor(e, "bg", "light")}
            >
                设置背景色
            </button>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.box.light}; color: black;"
                on:click={(e) => changeColor(e, "box", "light")}
            >
                设置边框色
            </button>
        </div>
    </div>
    <div class="color-editor bordered">
        <div>暗色模式</div>
        <div>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.bg.dark}; color: white;"
                on:click={(e) => changeColor(e, "bg", "dark")}
            >
                设置背景色
            </button>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.box.dark}; color: white;"
                on:click={(e) => changeColor(e, "box", "dark")}
            >
                设置边框色
            </button>
        </div>
    </div>

    <div class="fn__flex fn__flex-column bordered" style="gap: 10px;">
        <CalloutItem {callout} mode="light" />
        <CalloutItem {callout} mode="dark" />
    </div>
    <div class="fn__flex-1" />
    <div class="action-btns fn__flex" style="gap: 10px;">
        <button
            class="b3-button b3-button--text"
            on:click={() => {
                navigator.clipboard
                    .writeText(JSON.stringify(callout))
                    .then(() => {
                        showMessage("样式已复制到剪贴板", 3000);
                    });
            }}
        >
            复制样式
        </button>
        <button
            class="b3-button b3-button--text"
            on:click={() => {
                navigator.clipboard.readText().then((text) => {
                    let data = JSON.parse(text);
                    if (
                        !data ||
                        !data.id ||
                        !data.icon ||
                        !data.bg ||
                        !data.box
                    ) {
                        showMessage("剪贴板中没有样式数据", 3000, "error");
                        return;
                    }
                    let { icon, bg, box } = data;
                    if (icon) callout.icon = icon;
                    if (bg.light && bg.dark && box.light && box.dark) {
                        callout.bg = bg;
                        callout.box = box;
                    }
                    showMessage("样式已粘贴", 3000);
                });
            }}
        >
            粘贴样式
        </button>
        <div class="fn__flex-1" />
        <button class="b3-button b3-button--text" on:click={onCancel}>
            取消
        </button>
        <button class="b3-button b3-button--text" on:click={onSave}>
            保存
        </button>
    </div>
</sectioin>

{#if PickColor}
    <rgba-string-color-picker
        color={picker.color}
        on:color-changed={handleColorChange}
        style="position: fixed; left: {picker.x}; top: {picker.y}; z-index: 99;"
    >
    </rgba-string-color-picker>
{/if}

<style lang="scss">
    .callout-editor {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    div.bordered {
        border: 2px solid var(--b3-theme-primary-light);
        border-radius: 10px;
        padding: 10px;
    }

    .callout-icon {
        // font-size: 2rem;
        cursor: pointer;
    }

    .color-editor {
        display: flex;
        & > div:first-child {
            display: flex;
            flex: 1;
            font-size: 1.5em;
            font-weight: bold;
            justify-content: center;
            align-items: flex-start;
        }
        & > div {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            justify-content: end;
        }
    }
</style>
