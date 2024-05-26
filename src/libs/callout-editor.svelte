<!--
 Copyright (c) 2024 by frostime. All Rights Reserved.
 Author       : frostime
 Date         : 2024-05-25 20:27:24
 FilePath     : /src/libs/callout-editor.svelte
 LastEditTime : 2024-05-25 22:41:09
 Description  : 
-->
<script lang="ts">
    import { Dialog } from "siyuan";
    import CalloutItem from "./callout-item.svelte";
    import IconChooser from "./icon-chooser.svelte";

    let callout: ICallout = {
        id: "Test",
        icon: "📌",
        title: "新建 Callout",
        bg: {
            light: "rgb(221, 235, 241, .5)",
            dark: "rgb(54, 73, 84, .3)",
        },
        box: {
            light: "rgb(221, 235, 241)",
            dark: "rgb(54, 73, 84)",
        },
        hide: false,
        custom: true,
    };

    const chooseIcon = () => {
        let dialog = new Dialog({
            title: '选择图标',
            content: `<div id="IconChooser" style="height: 100%;"></div>`,
            width: '30rem',
            height: '30rem',
            destroyCallback: () => {
                pannel.$destroy();
            }
        });
        dialog.element.style.left = '30rem';
        let pannel = new IconChooser({
            target: dialog.element.querySelector("#IconChooser"),
        });
        pannel.$on("choose", (e) => {
            callout.icon = e.detail;
        });
    };

</script>

<sectioin class="callout-editor fn__flex fn__flex-column">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fn__flex">
        <div class="callout-id" contenteditable="true" bind:textContent={callout.id} />
        <div class="fn__flex-1" />
        <div class="callout-icon" on:click={chooseIcon}>{callout.icon}</div>
    </div>
    <div class="color-editor">
        <div>亮色模式</div>
        <div>
            <div>
                <input type="color" id="bg-light" name="bg-light" bind:value={callout.bg.light} />
                <label for="bg-light">背景色</label>
            </div>
            <div>
                <input type="color" id="box-light" name="box-light" bind:value={callout.box.light} />
                <label for="box-light">边框色</label>
            </div>
        </div>
    </div>
    <div class="color-editor">
        <div>暗色模式</div>
        <div>
            <div>
                <input type="color" id="bg-dark" name="bg-dark" bind:value={callout.bg.dark} />
                <label for="bg-dark">背景色</label>
            </div>
            <div>
                <input type="color" id="box-dark" name="box-dark" bind:value={callout.box.dark} />
                <label for="box-dark">边框色</label>
            </div>
        </div>
    </div>
    
    <div>
        <CalloutItem {callout} />
    </div>
</sectioin>

<style lang="scss">
    .callout-editor {
        padding: 30px;
        gap: 15px;
        >div {
            border: 2px solid var(--b3-theme-primary-light);
            border-radius: 10px;
            padding: 10px;
        }
    }

    .callout-id {
        font-size: 1.5rem;
    }

    .callout-icon {
        font-size: 2rem;
        font-family: "Twitter Emoji", "Noto Color Emoji", sans-serif !important;
        cursor: pointer;
    }

    .color-editor {
        display: flex;
        &>div:first-child {
            display: flex;
            flex: 1;
            font-size: 1.5em;
            font-weight: bold;
            justify-content: center;
            align-items: flex-start;
        }
        &>div {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            justify-content: end;
        }
    }

</style>
