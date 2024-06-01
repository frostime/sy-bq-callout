搬运自 Savor 主题，实现简单的 callout 样式

- 点击引述块，将引述块转换成一个 callout
- 引用块的第一个子块内容会作为标题显示在 callout 中
- 支持使用 `/` 命令新建一个 callout 块
  - `/bq-{callout id}`
  - `/callout-{callout id}`


## Callout 图标

本插件使用 emoji 图标作为 callout 的图标显示。

由于思源默认内置的 emoji 显示效果并不佳，推荐在集市中下载 Emoji 插件来获取更好的显示效果。

你可以在插件的设置选项中手动配置「Callout图标字体样式」字段来设置图标样式的优先级。默认值为：

```
'Twitter Emoji', 'Noto Color Emoji', 'OpenMoji', sans-serif
```

