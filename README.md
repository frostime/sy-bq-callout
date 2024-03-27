Migrated from Savor theme, implementing a simple callout style.

- Providing a button in a quote block's icon menu, click it to convert the quote block into a callout.
- The content of the first child block of the quote block will be displayed as the title in the callout.
- - A new callout block can also be created with the `/` command.
  - `/bq-{callout id}`
  - `/callout-{callout id}`

## Callout Icon

This plugin uses emoji icon as callout icon, SiYuan default built-in emoji display effect is not good.

We recommend downloading the Emoji plugin from the marketplace (twitter or google emoji can be used) to get a better display effect.

## Custom Styles

Users can insert custom CSS styles in the settings panel. The default style is:

```css
.protyle-wysiwyg .bq[custom-b]::after,
.protyle-wysiwyg .bq[custom-bq-callout]::after {
  font-family: 'Twitter Emoji', 'Noto Color Emoji', sans-serif !important;
}
```

This style will make Callout prioritize using Twitter Emoji. If users prefer Google Emoji, they can set the `font-family` style to `'Noto Color Emoji', 'Twitter Emoji', sans-serif`.

Note: If users set the Icon font to Google Emoji, it is recommended to also add style `top: 0.25em`.
