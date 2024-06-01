<script lang="ts">
    import { Dialog } from "siyuan";
    import CalloutItem from "./callout-item.svelte";
    import CalloutEditor from "./callout-editor.svelte";

    export let CalloutList: ICallout[];

    const editCallout = (callout: ICallout) => {
        if (!callout) return;
        let dialog = new Dialog({
            title: "Edit Callout",
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
                CreatedCallouts: CalloutList
                    .map((callout) => callout.id)
                    .filter((id) => id !== callout.id),
                callout: callout,
            },
        });
        pannel.$on("cancel", () => dialog.destroy());
        pannel.$on("save", (e: CustomEvent<ICallout>) => {
            let index = CalloutList.findIndex(
                (item) => item.id === e.detail.id,
            );
            CalloutList[index] = e.detail;
            dialog.destroy();
        });
    };

    const newCallout = () => {
        let dialog = new Dialog({
            title: "New Callout",
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
                CreatedCallouts: CalloutList.map(
                    (callout) => callout.id,
                ),
            },
        });
        pannel.$on("cancel", () => dialog.destroy());
        pannel.$on("save", (e: CustomEvent<ICallout>) => {
            CalloutList = [
                ...CalloutList,
                e.detail,
            ];
            dialog.destroy();
        });
    };

</script>

<section class="fn__flex fn__flex-column callouts-list">
    {#each CalloutList as callout, i (callout.id)}
        <div class="callout-list-item">
            <CalloutItem {callout} />
            <span class="fn__space" />
            <div class="callout-item-action fn__flex fn__flex-center">
                <input
                    class="b3-switch fn__flex-center"
                    data-id={callout.id}
                    type="checkbox"
                    checked={!callout.hide}
                    on:change={(e) => {
                        let target = e.target; //HTMLInputElement
                        //@ts-ignore
                        CalloutList[i].hide = !target.checked;
                    }}
                />
                <span class="fn__space" />
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
                <div class="toolbar__item ariaLabel" aria-label="调整顺序">
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
</section>

<style lang="scss">
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
