<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:24
 FilePath     : /src/libs/callout-editor.svelte
 LastEditTime : 2025-01-19 19:09:55
 Description  : 
-->
<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { Dialog, showMessage, confirm } from "siyuan";
    import CalloutItem from "./callout-item.svelte";
    import IconChooser from "./icon-chooser.svelte";
    import ColorPicker from "svelte-awesome-color-picker";
    import { i18n, queryCalloutBlock } from "@/callout";
    import { writable } from "svelte/store";
    import { debounce } from "./utils";

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
            small: false,
        },
    };
    export let mode: "new" | "edit" = "edit";

    let count = writable("?");
    const queryCount = async (id: string, custom: boolean) => {
        let blocks = await queryCalloutBlock(id, custom);
        return blocks.length;
    };
    const queryCountDebounce = debounce(async (id: string, custom: boolean) => {
        let cnt = await queryCount(id, custom);
        if (cnt >= 999) {
            count.set("999+");
        } else {
            count.set(`${cnt}`);
        }

        if (id === DefaulCallout.id) {
            DefaultCalloutRefCnt = cnt;
        }
    }, 1000);
    $: queryCountDebounce(callout.id, callout.custom);

    const DefaulCallout = JSON.parse(JSON.stringify(callout));
    let DefaultCalloutRefCnt = 0;

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
        colors: {
            bg: {
                light: { r: 0, g: 0, b: 0, a: 1 },
                dark: { r: 0, g: 0, b: 0, a: 1 },
            },
            box: {
                light: { r: 0, g: 0, b: 0, a: 1 },
                dark: { r: 0, g: 0, b: 0, a: 1 },
            },
        },
        x: "",
        y: "",
    };

    function initializePickerColors() {
        ["bg", "box"].forEach((type) => {
            ["light", "dark"].forEach((mode) => {
                let colorStr = callout[type][mode]
                    .replace("rgba(", "")
                    .replace(")", "");
                let [r, g, b, a] = colorStr.split(",").map(Number);
                picker.colors[type][mode] = { r, g, b, a };
            });
        });
    }

    initializePickerColors();

    const changeColor = (
        e: MouseEvent,
        type: "bg" | "box",
        mode: "light" | "dark",
    ) => {
        e.stopPropagation();
        if (PickColor && picker.type === type && picker.mode === mode) {
            PickColor = false;
            return;
        }
        let ele = e.target as HTMLElement;
        let rect = ele.parentElement.getBoundingClientRect();
        picker.x = rect.right + 5 + "px";
        picker.y = rect.top + "px";
        picker.type = type;
        picker.mode = mode;
        PickColor = true;
    };

    const handleColorChange = () => {
        const { type, mode } = picker;
        const color = picker.colors[type][mode];
        let rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        callout[type][mode] = rgba;
    };

    const dispatch = createEventDispatcher();
    const onCancel = () => {
        callout.id = DefaulCallout.id;
        dispatch("cancel", DefaulCallout);
    };

    const slash = {
        big: callout.slash?.big ?? false,
        small: callout.slash?.small ?? false,
    };

    const onSave = () => {
        if (CreatedCallouts.includes(callout.id)) {
            showMessage(I18n.exists, 4000, "error");
            return;
        }
        if (callout.id === "") {
            showMessage(I18n.empty, 4000, "error");
            return;
        }

        callout.slash = slash;

        if (mode === "edit" && callout.id !== DefaulCallout.id) {
            let text = I18n.changed
                .replace("{0}", DefaulCallout.id)
                .replace("{1}", callout.id)
                .replace("{2}", `${DefaultCalloutRefCnt}`);
            confirm(
                "Callout ID Changed!",
                text,
                () => {
                    dispatch("save", callout);
                },
                () => {
                    callout.id = DefaulCallout.id;
                    return;
                },
            );
        } else {
            dispatch("save", callout);
        }
    };

    // Update the color conversion utilities
    function rgbaToHex({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string {
        const toHex = (n: number) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        // Convert alpha from 0-1 to 0-255 range
        const alpha = Math.round(a * 255);
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
    }

    function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
        // Remove the hash if present
        hex = hex.replace("#", "");

        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Parse alpha value if present, otherwise default to 255 (fully opaque)
        const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) : 255;

        // Convert alpha back to 0-1 range
        return { r, g, b, a: a / 255 };
    }

    function isValidHex(hex: string): boolean {
        return /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex);
    }

    function handleHexInput(
        e: Event,
        type: "bg" | "box",
        mode: "light" | "dark",
    ) {
        const input = e.target as HTMLInputElement;
        let hex = input.value;

        // Add # if missing
        if (hex.charAt(0) !== "#") {
            hex = "#" + hex;
        }

        if (isValidHex(hex)) {
            // Convert hex to rgba
            const rgba = hexToRgba(hex);
            // Update picker color
            picker.colors[type][mode] = rgba;
            // Update callout color
            callout[type][mode] = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
        }
    }

    // Add reactive hex color stores
    $: hexColors = {
        bg: {
            light: rgbaToHex(picker.colors.bg.light),
            dark: rgbaToHex(picker.colors.bg.dark),
        },
        box: {
            light: rgbaToHex(picker.colors.box.light),
            dark: rgbaToHex(picker.colors.box.dark),
        },
    };
</script>

<sectioin class="callout-editor" on:click={(e) => {
    const targetElement = e.target;
    // 如果不是按钮
    if (PickColor && targetElement.tagName !== "BUTTON") {
        PickColor = false;
    }
}}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fn__flex" style="font-size: 1.2rem; align-items: center; gap: 5px;">
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
        <span class="counter">{$count}</span>
        <div class="fn__flex-1" />
        <span class="b3-label__text">{I18n.chooseIcon}</span>
        <div class="callout-icon" on:click={chooseIcon}>{callout.icon}</div>
    </div>

    <div class="item-wrap fn__flex b3-label config__item" style="padding: 0px;">
        <div class="fn__flex-1">
            <span style="font-weight: bold;">{I18n.slashCommand.title}</span>
            <div class="b3-label__text">
                {I18n.slashCommand.desc}
            </div>
        </div>
        <span class="fn__space" />
        <div class="fn__flex fn__flex-column" style="gap: 5px;">
            <div class="fn__flex" style="gap: 5px;">
                <span style="flex: 1;">{i18n.mode.big}</span>
                <input
                    class="b3-switch fn__flex-center"
                    data-id={callout.id}
                    type="checkbox"
                    bind:checked={slash.big}
                />
            </div>
            <div class="fn__flex" style="gap: 5px;">
                <span style="flex: 1;">{i18n.mode.small}</span>
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
            <div class="color-input-group">
                <button
                    class="b3-button b3-button--outline fn__flex-center"
                    style="background-color: {callout.bg.light}; color: black;"
                    on:click={(e) => changeColor(e, "bg", "light")}
                >
                    {I18n.bgColor}
                </button>
                <input
                    type="text"
                    class="b3-text-field hex-input"
                    value={hexColors.bg.light}
                    style="box-shadow: 0 0 2px 3px {callout.bg.light};"
                    on:input={(e) => handleHexInput(e, "bg", "light")}
                />
            </div>
            <div class="color-input-group">
                <button
                    class="b3-button b3-button--outline fn__flex-center"
                    style="background-color: {callout.box.light}; color: black;"
                    on:click={(e) => changeColor(e, "box", "light")}
                >
                    {I18n.boxShadow}
                </button>
                <input
                    type="text"
                    class="b3-text-field hex-input"
                    value={hexColors.box.light}
                    style="box-shadow: 0 0 2px 3px {callout.box.light};"
                    on:input={(e) => handleHexInput(e, "box", "light")}
                />
            </div>
        </div>
    </div>
    <div class="color-editor bordered">
        <div>{I18n.darkMode}</div>
        <div>
            <div class="color-input-group">
                <button
                    class="b3-button b3-button--outline fn__flex-center"
                    style="background-color: {callout.bg.dark}; color: white;"
                    on:click={(e) => changeColor(e, "bg", "dark")}
                >
                    {I18n.bgColor}
                </button>
                <input
                    type="text"
                    class="b3-text-field hex-input"
                    value={hexColors.bg.dark}
                    style="box-shadow: 0 0 2px 3px {callout.bg.dark};"
                    on:input={(e) => handleHexInput(e, "bg", "dark")}
                />
            </div>
            <div class="color-input-group">
                <button
                    class="b3-button b3-button--outline fn__flex-center"
                    style="background-color: {callout.box.dark}; color: white;"
                    on:click={(e) => changeColor(e, "box", "dark")}
                >
                    {I18n.boxShadow}
                </button>
                <input
                    type="text"
                    class="b3-text-field hex-input"
                    value={hexColors.box.dark}
                    style="box-shadow: 0 0 2px 3px {callout.box.dark};"
                    on:input={(e) => handleHexInput(e, "box", "dark")}
                />
            </div>
        </div>
    </div>

    <div class="bordered" style="gap: 10px; display: flex; flex-direction: column;">
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
    <div
        class="fn__flex color-picker"
        style="position: fixed; left: {picker.x}; top: {picker.y}; z-index: 99;"
    >
        <ColorPicker
            textInputModes={["rgb"]}
            isAlpha={true}
            isDialog={false}
            bind:rgb={picker.colors[picker.type][picker.mode]}
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
        flex: 1;
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

    .color-input-group {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;

        button {
            text-align: center;
            width: 100px;
        }

        .hex-input {
            width: 100px;
            text-align: center;
        }
    }
</style>
