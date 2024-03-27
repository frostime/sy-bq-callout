Migrated from Savor theme, implementing a simple callout style.

- Providing a button in a quote block's icon menu, click it to convert the quote block into a callout.
- The content of the first child block of the quote block will be displayed as the title in the callout.
- - A new callout block can also be created with the `/` command.
  - `/bq-{callout id}`
  - `/callout-{callout id}`

## Callout Icon

This plugin uses emoji icon as callout icon, SiYuan default built-in emoji display effect is not good.

We recommend downloading the Emoji plugin from the marketplace (twitter or google emoji can be used) to get a better display effect.

The font style of the icon can be configured in the settings, and the value of the corresponding configuration field will be set to the `font-family` style of the emoji icon. Default as `'Twitter Emoji', 'Noto Color Emoji', sans-serif`.
