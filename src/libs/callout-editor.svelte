<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:24
 FilePath     : /src/libs/callout-editor.svelte
 LastEditTime : 2024-07-13 19:02:07
 Description  : 
-->
<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { Dialog, showMessage, confirm } from "siyuan";
    import CalloutItem from "./callout-item.svelte";
    import IconChooser from "./icon-chooser.svelte";
    import ColorPicker from 'svelte-awesome-color-picker';
    import { i18n } from "@/callout";

    export let CreatedCallouts: string[];

    export let callout: ICallout = {
        id: "Input ID Here",
        icon: "📌",
        title: "New Callout",
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
        slash: {
            big: false,
            small: false
        }
    };
    export let mode: 'new' | 'edit' = 'edit';

    const DefaulCallout = JSON.parse(JSON.stringify(callout));

    let emojiFont = getContext("EmojiFont");
    const I18n = i18n.CalloutEditor;

    const chooseIcon = () => {
        let dialog = new Dialog({
            title: "Choose Emoji Icon",
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
        color: {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        },
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
        let colorStr = callout[type][mode].replace('rgba(', '').replace(')', '');
        let [r, g, b, a] = colorStr.split(',').map(Number);
        picker.color = { r, g, b, a };
        picker.type = type;
        picker.mode = mode;
        PickColor = true;
    };

    const handleColorChange = () => {
        // picker.color = e.detail.value;
        let rgba = `rgba(${picker.color.r}, ${picker.color.g}, ${picker.color.b}, ${picker.color.a})`;
        callout[picker.type][picker.mode] = rgba;
    };

    const dispatch = createEventDispatcher();
    const onCancel = () => {
        dispatch("cancel", DefaulCallout);
    };

    const slash = {
        big: callout.slash?.big ?? false,
        small: callout.slash?.small ?? false
    }

    const onSave = () => {
        if (CreatedCallouts.includes(callout.id)) {
            showMessage(I18n.exists, 4000, "error");
            return;
        }
        if (callout.id === "") {
            showMessage(I18n.empty, 4000, "error");
            return;
        }

        if (slash.big || slash.small) {
            callout.slash = slash;
        }

        if (mode === 'edit' && callout.id !== DefaulCallout.id) {
            let text = I18n.changed.replace("{0}", DefaulCallout.id).replace("{1}", callout.id);
            confirm("Callout ID Changed!", text,
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

    <div class="item-wrap fn__flex b3-label config__item" style="padding: 0px;">
        <div class="fn__flex-1">
            <span style="font-weight: bold;">✒️ / 命令</span>
            <div class="b3-label__text">
                如果选中，则可以在 / 命令中插入指定模式的 Callout
            </div>
        </div>
        <span class="fn__space" />
        <div class="fn__flex fn__flex-column" style="gap: 5px;">
            <div class="fn__flex" style="gap: 2px;">
                <span>标题模式</span>
                <input
                    class="b3-switch fn__flex-center"
                    data-id={callout.id}
                    type="checkbox"
                    bind:checked={slash.big}
                />
            </div>
            <div class="fn__flex" style="gap: 2px;">
                <span>段落模式</span>
                <input
                    class="b3-switch fn__flex-center"
                    data-id={callout.id}
                    type="checkbox"
                    bind:checked={slash.small}
                />
            </div>
        </div>
    </div>

    <div class="color-editor bordered">
        <div>{I18n.lightMode}</div>
        <div>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.bg.light}; color: black;"
                on:click={(e) => changeColor(e, "bg", "light")}
            >
                {I18n.bgColor}
            </button>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.box.light}; color: black;"
                on:click={(e) => changeColor(e, "box", "light")}
            >
                {I18n.boxShadow}
            </button>
        </div>
    </div>
    <div class="color-editor bordered">
        <div>{I18n.darkMode}</div>
        <div>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.bg.dark}; color: white;"
                on:click={(e) => changeColor(e, "bg", "dark")}
            >
                {I18n.bgColor}
            </button>
            <button
                class="b3-button b3-button--outline fn__flex-center fn__size200"
                style="background-color: {callout.box.dark}; color: white;"
                on:click={(e) => changeColor(e, "box", "dark")}
            >
                {I18n.boxShadow}
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
                        showMessage(I18n.copied, 3000);
                    });
            }}
        >
            {I18n.copyStyle}
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
                        showMessage(I18n.pasteEmpty, 3000, "error");
                        return;
                    }
                    let { icon, bg, box } = data;
                    if (icon) callout.icon = icon;
                    if (bg.light && bg.dark && box.light && box.dark) {
                        callout.bg = bg;
                        callout.box = box;
                    }
                    showMessage(I18n.pasted, 3000);
                });
            }}
        >
            {I18n.pasteStyle}
        </button>
        <div class="fn__flex-1" />
        <button class="b3-button b3-button--text" on:click={onCancel}>
            {i18n.cancel}
        </button>
        <button class="b3-button b3-button--text" on:click={onSave}>
            {i18n.save}
        </button>
    </div>
</sectioin>

{#if PickColor}
    <!-- <rgba-string-color-picker
        color={picker.color}
        on:color-changed={handleColorChange}
        style="position: fixed; left: {picker.x}; top: {picker.y}; z-index: 99;"
    >
    </rgba-string-color-picker> -->
    <div class="fn__flex color-picker" style="position: fixed; left: {picker.x}; top: {picker.y}; z-index: 99;">
        <ColorPicker
            textInputModes={["rgb"]}
            isAlpha={true}
            isDialog={false}
            bind:rgb={picker.color}
            on:input={handleColorChange}
        />
    </div>
{/if}

<style lang="scss">
    .color-picker {
        --cp-bg-color: var(--b3-theme-surface);
        --cp-border-color: var(--b3-theme-primary-light);
        --cp-text-color: var(--b3-theme-on-surface);
        --cp-input-color: var(--b3-theme-background);
        --cp-button-hover-color: var(--b3-theme-primary-light);
    }

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
