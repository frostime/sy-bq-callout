<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:16
 FilePath     : /src/libs/callout-item.svelte
 LastEditTime : 2024-06-04 16:50:31
 Description  : 
-->
<script lang="ts">
    import { getContext } from "svelte";
    import { draggingSource } from "./store";
    import { calloutName } from "@/callout";

    export let callout: ICallout;
    export let mode: 'auto' | 'light' | 'dark' = 'auto';
    export let type = 'Default';

    let emojiFont = getContext('EmojiFont');

    let name = calloutName(callout);

    const onDragStart = (e: DragEvent) => {
        e.dataTransfer.setData('json/callout', JSON.stringify(callout));
        draggingSource.set(type);
    };

    const onDragEnd = () => {
        draggingSource.set(null);
    };

</script>

<div
    class="callout-item fn__flex-1 {mode}"
    data-id={callout.id}
    draggable="true"
    on:dragstart={onDragStart}
    on:dragend={onDragEnd}
    style="--bg-light: {callout.bg.light}; --bg-dark: {callout.bg.dark}; --box-light: {callout.box.light}; --box-dark: {callout.box
        .dark}; --emoji-font: {emojiFont};"
>
    <div class="icon">{callout.icon}</div>
    <span class="fn__space"/>
    <div class="p">
        <div>{name}</div>
    </div>
</div>

<style lang="scss">
    :global(html[data-theme-mode="dark"]) .callout-item.auto,
    .callout-item.dark {
        background-color: var(--bg-dark);
        box-shadow: 0 0 0 2px var(--box-dark) inset;
    }
    :global(html[data-theme-mode="light"]) .callout-item.auto,
    .callout-item.light {
        background-color: var(--bg-light);
        box-shadow: 0 0 0 2px var(--box-light) inset;
    }

    .callout-item {
        height: 40px;
        padding: 4px;
        padding-left: 8px;
        // color: var(--b3-theme-on-background);
        border: none;
        border-radius: 5px;

        display: flex;
        align-items: center;

        &.auto {
            color: var(--b3-theme-on-background);
        }
        &.light {
            color: black;
        }
        &.dark {
            color: white;
        }

        .p {
            flex: 1;
        }
    }

    .callout-item > .p {
        font-weight: 700;
        font-size: 1.3em;
    }

    .callout-item > .icon {
        font-family: var(--emoji-font) !important;
        margin-left: 10px;
        font-size: 1.4em;
        border: none;
    }
</style>
