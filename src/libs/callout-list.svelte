<script lang="ts">
    import CalloutItem from "./callout-item.svelte";
    import CalloutEditor from "./callout-editor.svelte";

    import { draggingSource } from "./store";
    import { i18n } from "@/callout";
    import { svelteDialog } from "./dialog";

    export let callouts: ICallout[];
    export let type: string;
    let allowAdd: boolean = type === "Custom";

    const editCallout = (callout: ICallout) => {
        if (!callout) return;

        const { dialog, component } = svelteDialog({
            title: i18n.editcallout,
            constructor: (container) => new CalloutEditor({
                target: container,
                props: {
                    CreatedCallouts: callouts.map(
                        (callout) => callout.id,
                    ).filter((id) => id !== callout.id),
                    callout: callout,
                },
            }),
            width: "42rem",
            height: "40rem",
        });

        component.$on("cancel", (e: CustomEvent<ICallout>) => {
            let index = callouts.findIndex(
                (item) => item.id === e.detail.id,
            );
            callouts[index] = e.detail;
            dialog.destroy();
        });
        component.$on("save", (e: CustomEvent<ICallout>) => {
            let index = callouts.findIndex(
                (item) => item.id === e.detail.id,
            );
            callouts[index] = e.detail;
            dialog.destroy();
        });
    };

    const newCallout = () => {
        const { dialog, component } = svelteDialog({
            title: i18n.newcallout,
            constructor: (container) => new CalloutEditor({
            target: container,
            props: {
                CreatedCallouts: callouts.map((callout) => callout.id),
                mode: "new"
            },
        }),
            width: "42rem",
            height: "40rem",
        });
        component.$on("cancel", () => dialog.destroy());
        component.$on("save", (e: CustomEvent<ICallout>) => {
            callouts = [...callouts, e.detail];
            dialog.destroy();
        });
    };

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        let type = e.dataTransfer.types[0];
        if (type !== 'json/callout') return;
        if ($draggingSource !== type) return;
        e.dataTransfer.dropEffect = "move";
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types[0] !== 'json/callout') return;
        if ($draggingSource !== type) {
            return;
        }
        let jsonstr = e.dataTransfer.getData("json/callout");
        e.dataTransfer.clearData();

        let src: ICallout = JSON.parse(jsonstr);
        let target = e.target as HTMLElement;
        let ele = target.closest('.callout-list-item') as HTMLElement;
        if (!ele) return;
        let cid = ele.dataset.cid;
        if (src.id === cid) return;
        // console.log('Move');
        let srcIndex = callouts.findIndex((item) => item.id === src.id);
        let targetIndex = callouts.findIndex((item) => item.id === cid);
        let newCallout = callouts;
        newCallout.splice(srcIndex, 1);
        newCallout.splice(targetIndex, 0, src);
        callouts = newCallout;
    };

</script>

<section class="fn__flex fn__flex-column callouts-list">
    {#each callouts as callout, i (callout.id)}
        <div
            class="callout-list-item"
            data-index={i}
            data-cid={callout.id}
            on:dragover={onDragOver}
            on:drop={onDrop}
        >
            <CalloutItem {callout} {type}/>
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
                        callouts[i].hide = !target.checked;
                    }}
                />
                <span class="fn__space" />
                <div
                    class="toolbar__item ariaLabel"
                    aria-label={i18n.edit}
                    on:click={() => {
                        editCallout(callout);
                    }}
                >
                    <svg><use xlink:href="#iconEdit"></use></svg>
                </div>
            </div>
            <span class="fn__space" />
            <slot />
        </div>
    {/each}
    {#if allowAdd}
    <section class="action-add fn__flex-center">
        <button
            class="b3-button b3-button--outline fn__flex-center fn__size200"
            on:click={newCallout}
        >
            <svg><use xlink:href="#iconAdd"></use></svg>
            {i18n.CalloutList.Add}
        </button>
    </section>
    {/if}
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
