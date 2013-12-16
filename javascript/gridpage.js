(function ($) {

    $.entwine('ss', function ($) {

        var grideditor;

        $('#grideditorholder').entwine({
            onmatch:function () {

                //lang
                ss.i18n.init();
                GridEditor.lang = ss.i18n.getLocale();

                //width options
                var columnConfig = this.data('css-classes');
			 var widthOptions = [];
			 for (var i in columnConfig) {
				widthOptions.push([i, columnConfig[i].width, columnConfig[i].class]);
			 }
			 GridEditor.widthOptions = widthOptions;

                //column classes
                GridEditor.columnClasses = [
                    ['Omlijning', 'bordered'],
                    ['Achtergrond kleur', 'backgroundcolor'],
                    ['Omlijning en achtergrond kleur', 'bordered backgroundcolor']
                ];

                //content editor
                GridEditor.contenteditor = {
                    editor: '<textarea name="tinyMCEEditor" class="htmleditor" id="tinyMCEEditor" tinymce="true" style="width: 100%;"></textarea>',
                    setContent: function(jElement, content){
                        var intv = setInterval(function(){
                            var editor = tinyMCE.get('tinyMCEEditor');
                            if(editor){
                                editor.setContent(content);
                                jElement.find('iframe').height((jElement.height() - 200) + 'px');
                                clearInterval(intv);
                            }
                        }, 50);
                        return false;
                    },
                    getContent: function(jElement){
                        return tinyMCE.get('tinyMCEEditor').getContent();
                    }
                };

                //content preview
                GridEditor.cleanContentPreview = true;
                GridEditor.maxLengthContentPreview = 350;

                //grid
                grideditor = new GridEditor.BaseGrid(this, 50, 2);
                grideditor.loadJSON( $('#Form_EditForm_GridContent').val() );
			 jQuery(grideditor).change(function() {
				 $('#Form_EditForm_GridContent').val(grideditor.exportJSON());
				 $('#Form_EditForm_GridContent').trigger('change.changetracker');
			 });

            }
        });

        $('.cms-edit-form').entwine({
            onsubmit:function (e, button) {
                $('#Form_EditForm_GridContent').val(grideditor.exportJSON());
                return this._super(e, button);
            }
        });

    });

})(jQuery);

