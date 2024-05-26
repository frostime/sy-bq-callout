<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:16
 FilePath     : /src/libs/callout-item.svelte
 LastEditTime : 2024-05-26 14:41:47
 Description  : 
-->
<script lang="ts">
    export let callout: ICallout;
    export let mode: 'auto' | 'light' | 'dark' = 'auto';
</script>

<div
    class="callout-item fn__flex-1 {mode}"
    data-id={callout.id}
    style="--bg-light: {callout.bg.light}; --bg-dark: {callout.bg.dark}; --box-light: {callout.box.light}; --box-dark: {callout.box
        .dark};"
>
    <div class="icon">{callout.icon}</div>
    <span class="fn__space"/>
    <div class="p">
        <div>{callout.id}</div>
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
        font-family: "Twitter Emoji", "Noto Color Emoji", sans-serif !important;
        margin-left: 10px;
        font-size: 1.4em;
        border: none;
    }
</style>
