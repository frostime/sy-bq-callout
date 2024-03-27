搬运自 Savor 主题，实现简单的 callout 样式

- 点击引述块，将引述块转换成一个 callout
- 引用块的第一个子块内容会作为标题显示在 callout 中
- 支持使用 `/` 命令新建一个 callout 块
  - `/bq-{callout id}`
  - `/callout-{callout id}`


## Callout 图标

本插件使用 emoji 图标作为 callout 的图标显示，思源默认内置的 emoji 显示效果并不佳。

推荐在集市中下载 Emoji 插件（twitter 或 google emoji 均可）来获取更好的显示效果。

图标字体的优先级可以在设置中配置，对应的配置字段的值将会被设置为 emoji icon 的 `font-family` 样式。默认为 `'Twitter Emoji', 'Noto Color Emoji', sans-serif`。
