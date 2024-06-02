<!--
 Copyright (c) 2023 by Yp Z (frostime). All Rights Reserved.
 Author       : Yp Z
 Date         : 2023-08-22 19:43:15
 FilePath     : /src/libs/icon-chooser.svelte
 LastEditTime : 2024-05-25 22:34:38
 Description  : 
-->
<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let types = [
        "objects",
        "nature",
        "activity",
        "food",
        "travel",
        "symbols",
        "people",
    ];

    const init = () => {
        let emojis: {
            [key: string]: {
                items: any[];
                title: string;
            };
        } = {};
        for (let type of types) {
            emojis[type] = {
                items: [],
                title: "",
            };
        }
        //@ts-ignore
        for (let emoji of window.siyuan.emojis) {
            let id = emoji.id;
            if (id in emojis) {
                emojis[id].items = emoji.items;
                emojis[id].title = emoji.title;
            }
        }
        return emojis;
    };

    let emojis = init();

    function parseEmoji(code: string) {
        try {
            let emoji = String.fromCodePoint(parseInt(code, 16));
            return emoji;
        } catch (error) {
            return "";
        }
    }

    const onclick = (unicode) => {
        // console.log(type, unicode);
        dispatch("choose", parseEmoji(unicode));
    };
</script>

<div class="emojis">
    <div class="emojis__panel">
        {#each types as type, i}
            <div class="emojis__title" data-type={i}>{emojis[type].title}</div>
            <div style="min-height:336px" class="emojis__content">
                {#each emojis[type].items as emoji}
                    <button
                        data-unicode={emoji.unicode}
                        class="emojis__item ariaLabel"
                        aria-label={emoji.description}
                        on:click={() => onclick(emoji.unicode)}
                    >
                        {parseEmoji(emoji.unicode)}
                    </button>
                {/each}
            </div>
        {/each}
    </div>
</div>
