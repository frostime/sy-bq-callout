<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:16
 FilePath     : /src/libs/callout-item.svelte
 LastEditTime : 2024-05-25 21:24:45
 Description  : 
-->
<script lang="ts">
    export let callout: ICallout;
</script>

<div
    class="callout-item"
    data-id={callout.id}
    style="--bg-light: {callout.bg.light}; --bg-dark: {callout.bg
        .dark}; --box-light: {callout.box.light}; --box-dark: {callout.box
        .dark};"
>
    <div class="icon">{callout.icon}</div>
    <span class="fn__space"/>
    <div class="p">
        <div>{callout.id}</div>
    </div>

    <div class="toolbar__item ariaLabel" aria-label="编辑">
        <svg><use xlink:href="#iconEdit"></use></svg>
    </div>
    <span class="fn__space"/>
    <input
        class="b3-switch fn__flex-center"
        data-id={callout.id}
        type="checkbox"
        checked={callout.hide ? true : !callout.hide}
    />
    <span class="fn__space"/>
</div>

<style lang="scss">
    :global(html[data-theme-mode="dark"]) .callout-item {
        background-color: var(--bg-dark) !important;
        box-shadow: 0 0 0 2px var(--box-dark) inset;
    }
    :global(html[data-theme-mode="light"]) .callout-item {
        background-color: var(--bg-light) !important;
        box-shadow: 0 0 0 2px var(--box-light) inset;
    }

    .callout-item {
        height: 40px;
        padding: 4px;
        padding-left: 8px;
        color: var(--b3-theme-on-background);
        border: none;
        border-radius: 5px;

        margin-bottom: 10px;

        display: flex;
        align-items: center;

        .p {
            color: var(--b3-theme-on-background);
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
