# Readme

Ported from the Savor theme, this plugin implements simple callout styles.

## Basic Usage

- Click on a quote block to convert it into a callout.
  - The content of the first child block of the quote block will be displayed as the title in the callout.
- Support for creating a new callout block using the `/` command.
  - `/bq-{callout id}`
  - `/callout-{callout id}`

## 🎨 Callout Icons

This plugin uses emoji icons as the callout icon.

Since the default emoji display in SiYuan is not satisfactory, it is recommended to download the Emoji plugin from the marketplace for better display.

You can manually configure the "Callout Icon Font Style" field in the plugin settings to set the priority of the icon style. The default value is:

```
'Twitter Emoji', 'Noto Color Emoji', 'OpenMoji', sans-serif
```

![](asset/emoji-font.png)

## ✨ Custom Callout

There are two types of callouts in this plugin:

1. **Default Callout**: Inherits the callout styles from the Savor theme, with the identifier attribute `custom-b`.
2. **Custom Callout**: Custom callout styles, with the identifier attribute `custom-callout`.

The plugin provides a good GUI interaction, allowing users to customize the styles of Callouts.

### Default Callout

![](asset/default-callout.png)

- Enable/Disable
  - Callouts can be enabled or disabled using checkboxes.
  - Note: Disabled callouts will not appear in the block menu or `/` command, but their styles will still be effective.
- Drag and Drop Sorting
  - By dragging and dropping in the settings, the display order of Callouts in the menu can be adjusted.
- Edit Style
  - Callout styles can be edited in a separate settings panel.
  - This includes:
    - Callout icon
    - Callout background color
    - Callout border color
- Reset Style
  - Reset Callout styles to default values.

### Custom Callout

![](asset/custom-callout.png)

The configuration of custom icons is similar to Default Callout, with the following differences:

- Allows adding custom Callout styles.
- Allows modifying the Callout ID.
  - ⚠️ **Note**: Modifying the Callout ID will cause previous Callout blocks with the same ID to become invalid! Please proceed with caution!
- Allows deleting Callout styles.
  - ⚠️ **Note**: Deleting Callout styles will cause previous Callout blocks with the same ID to become invalid! Please proceed with caution!

## Callout Editor

![](asset/editor.png)

1. Configure Callout ID (Default callouts cannot be configured)
2. Click and modify the Callout icon
3. Configure Callout color scheme
   1. Light mode and dark mode
   2. Internal background color and external border color
4. Copy & Paste Callout style


## 🎨 Custom CSS Snippets

If you have advanced customization needs for Callout styles, you can add custom CSS snippets to the plugin settings.
Essentially, this is no different from using code snippets in SiYuan.