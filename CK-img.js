CKEDITOR.plugins.add("base64image", {
    lang: ["en", "zh", "zh-cn"],
    requires: "dialog",
    icons: "base64image",
    hidpi: true,
    init: function (editor) {
        var pluginName = 'base64imageDialog';
        editor.ui.addButton("base64image", {
            label: editor.lang.common.image,
            command: pluginName,
            toolbar: "insert"
        });
        CKEDITOR.dialog.add(pluginName, "https://cdn.jsdelivr.net/gh/nmmf/base64image@master/dialogs/base64image.js");
        var allowed = 'img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}',
            required = 'img[alt,src]';

        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName, {
            allowedContent: allowed,
            requiredContent: required,
            contentTransformations: [
                ['img{width}: sizeToStyle', 'img[width]: sizeToAttribute'],
                ['img{float}: alignmentToStyle', 'img[align]: alignmentToAttribute']
            ]
        }));
        editor.on("doubleclick", function (evt) {
            if (evt.data.element && !evt.data.element.isReadOnly() && evt.data.element.getName() === "img") {
                evt.data.dialog = pluginName;
                editor.getSelection().selectElement(evt.data.element);
            }
        });
        if (editor.addMenuItem) {
            editor.addMenuGroup("base64imageGroup");
            editor.addMenuItem("base64imageItem", {
                label: editor.lang.common.image,
                icon: "https://cdn.jsdelivr.net/gh/nmmf/base64image@master/icons/base64image.png",
                command: pluginName,
                group: "base64imageGroup"
            });
        }
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function (element, selection) {
                if (element && element.getName() === "img") {
                    editor.getSelection().selectElement(element);
                    return {
                        base64imageItem: CKEDITOR.TRISTATE_ON
                    };
                }
                return null;
            });
        }
    }
});
