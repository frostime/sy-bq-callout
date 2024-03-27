搬运自 Savor 主题，实现简单的 callout 样式

- 点击引述块，将引述块转换成一个 callout
- 引用块的第一个子块内容会作为标题显示在 callout 中
- 支持使用 `/` 命令新建一个 callout 块
  - `/bq-{callout id}`
  - `/callout-{callout id}`


## Callout 图标

本插件使用 emoji 图标作为 callout 的图标显示，思源默认内置的 emoji 显示效果并不佳。

推荐在集市中下载 Emoji 插件（twitter 或 google emoji 均可）来获取更好的显示效果。

## 自定义样式

用户可以在设置面板中插入自定义的 CSS 样式，默认样式为:

```css
.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-bq-callout]::after {
  font-family: 'Twitter Emoji', 'Noto Color Emoji', sans-serif !important;
}
```

该样式会让 Callout 优先使用 Twitter Emoji，如果用户更喜欢 google emoji，可以将 `font-family` 样式设置为 `'Noto Color Emoji', 'Twitter Emoji', sans-serif`。

附注: 如果用户将 Icon 字体设置为 Google Emoji, 建议同时设置样式 `top: 0.25em`。
