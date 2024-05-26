<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:24
 FilePath     : /src/libs/callout-editor.svelte
 LastEditTime : 2024-05-26 14:54:36
 Description  : 
-->
<script lang="ts">
    import { Dialog } from "siyuan";
    import CalloutItem from "./callout-item.svelte";
    import IconChooser from "./icon-chooser.svelte";
    import "vanilla-colorful/rgba-string-color-picker.js";

    let callout: ICallout = {
        id: "Test",
        icon: "📌",
        title: "新建 Callout",
        bg: {
            light: "rgba(238, 245, 248, 1)",
            dark: "rgba(37, 43, 46, 1)",
        },
        box: {
            light: "rgba(238, 245, 248, .3)",
            dark: "rgba(37, 43, 46, .3)",
        },
        hide: false,
        custom: true,
    };

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
</script>

<sectioin class="callout-editor">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fn__flex" style="font-size: 1.2rem;">
        <div>ID:</div>
        <div class="fn__space" />
        <div
            class="callout-id"
            contenteditable="true"
            bind:textContent={callout.id}
        />
        <div class="fn__flex-1" />
        <div class="callout-icon" on:click={chooseIcon}>{callout.icon}</div>
    </div>
    <div class="color-editor">
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
    <div class="color-editor">
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

    <div class="fn__flex fn__flex-column" style="gap: 10px;">
        <CalloutItem {callout} mode="light" />
        <CalloutItem {callout} mode="dark" />
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
        > div {
            border: 2px solid var(--b3-theme-primary-light);
            border-radius: 10px;
            padding: 10px;
        }
    }

    .callout-icon {
        // font-size: 2rem;
        font-family: "Twitter Emoji", "Noto Color Emoji", sans-serif !important;
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
