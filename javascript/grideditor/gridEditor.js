/*TODO:
 -Optie om een content editor op te geven via GridEditor
 -Optie om column stijl aan te geven (column extra classes toe te voegen)
 */

var GridEditor = {};
GridEditor.rowcount = 0;
GridEditor.columncount = 0;
GridEditor.basegridcount = 0;

/**
 * English texts
 * @type {Object}
 */
GridEditor.texts_en_US = {
    'add-row':'Add row',
    'add-row-top':'Add row at the top',
    'add-row-bottom':'Add row at the bottom',
    'add-column':'Add column',
    'remove-row':'Delete row',
    'remove-column':'Delete column',
    'clear-grid':'Clear grid',
    'move':'Drag',
    'edit':'Edit content',
    'width':'Change the width',
    'yes':'Yes',
    'no':'No',
    'cancel':'Cancel',
    'change-width':'Change width',
    'edit-content':'Change content',
    'save-content':'Update',
    'remove-row-question':'Are you sure you want to delete this row with all content?',
    'remove-column-question':'Are you sure you want to delete this column with all content?',
    'clear-grid-question':'Are you sure you want to clear the whole grid',
    'default-content':'Phasellus mauris magna, tempor sit amet tempor sed, fermentum vitae justo. Nulla malesuada nunc nec leo congue accumsan. Nulla feugiat ipsum nec mi auctor fringilla. Phasellus venenatis imperdiet sodales. Praesent mollis quam at augue consequat dictum. Phasellus sit amet ante sed erat ornare malesuada vitae laoreet mauris. Maecenas eu accumsan ligula. Sed egestas velit elit.',
    'preview-notice': 'The texts in the grid do not match the final display, all formatting is removed and only a portion is shown!',
    'image': 'Image',
    'widget': 'Widget',
    'style': 'Style:'
};
/**
 * Dutch texts
 * @type {Object}
 */
GridEditor.texts_nl_NL = {
    'add-row':'Rij toevoegen',
    'add-row-top':'Rij toevoegen aan de bovenkant',
    'add-row-bottom':'Rij toevoegen aan de onderkant',
    'add-column':'Kolom toevoegen',
    'remove-row':'Verwijder rij',
    'remove-column':'Verwijder kolom',
    'clear-grid':'Leeg grid',
    'move':'Slepen',
    'edit':'Wijzig de inhoud',
    'width':'Wijzig de breedte',
    'yes':'Ja',
    'no':'Nee',
    'cancel':'Annuleren',
    'change-width':'Wijzig breedte',
    'edit-content':'Wijzig inhoud',
    'save-content':'Bijwerken',
    'remove-row-question':'Weet je zeker dat je de rij met alle inhoud wilt verwijderen?',
    'remove-column-question':'Weet je zeker dat je de kolom met alle inhoud wilt verwijderen?',
    'clear-grid-question':'Weet je zeker dat je het hele grid wilt legen?',
    'default-content':'Phasellus mauris magna, tempor sit amet tempor sed, fermentum vitae justo. Nulla malesuada nunc nec leo congue accumsan. Nulla feugiat ipsum nec mi auctor fringilla. Phasellus venenatis imperdiet sodales. Praesent mollis quam at augue consequat dictum. Phasellus sit amet ante sed erat ornare malesuada vitae laoreet mauris. Maecenas eu accumsan ligula. Sed egestas velit elit.',
    'preview-notice': 'De teksten in het grid komen niet overeen met de uiteindelijke weergave, alle opmaak is verwijderd en er word slechts een gedeelte getoond!',
    'image': 'Afbeelding',
    'widget': 'Widget',
    'style': 'Stijl:'
};
/**
 * l18n language code
 * @type {String}
 */
GridEditor.lang = 'en_US';
GridEditor.getText = function (key) {
    var localeTexts = GridEditor['texts_'+GridEditor.lang];
    if(!localeTexts){
        localeTexts = GridEditor.texts_en_US;
    }
    if (localeTexts[key]) {
        return localeTexts[key];
    }
    return key;
}

/**
 * Al the width options key, value, class
 * @type {Array}
 */
GridEditor.widthOptions = [
    ['100%', 100, 'col-xs-12'],
    ['91.66%', 91.66, 'col-xs-11'],
    ['83.33%', 83.33, 'col-xs-10'],
    ['75%', 75, 'col-xs-9'],
    ['66.66%', 66.66, 'col-xs-8'],
    ['58.33%', 58.33, 'col-xs-7'],
    ['50%', 50, 'col-xs-6'],
    ['41.66%', 41.66, 'col-xs-5'],
    ['33.33%', 33.33, 'col-xs-4'],
    ['25%', 25, 'col-xs-3'],
    ['16.66%', 16.66, 'col-xs-2'],
    ['8.33%', 8.33, 'col-xs-1']
];

GridEditor.widthToClass = function (width) {
    var cls = '';
    jQuery(GridEditor.widthOptions).each(function(index, element){
        if(element[1] == width){
            cls = element[2];
            return false;
        }
    });
    return cls;
}

GridEditor.widthToKey = function (width) {
    var cls = '';
    jQuery(GridEditor.widthOptions).each(function(index, element){
        if(element[1] == width){
            cls = element[0];
            return false;
        }
    });
    return cls;
}

GridEditor.cssPrefix = 'grideditor_';
GridEditor.prefixedCSS = function (value) {
    return GridEditor.cssPrefix + value;
}

GridEditor.sortArrayByLeft = function (a, b) {
    return (a.domElement.position().left > b.domElement.position().left) ? 1 : -1;
}

GridEditor.sortArrayByTop = function (a, b) {
    return (a.domElement.position().top > b.domElement.position().top) ? 1 : -1;
}

GridEditor.renderGrid = function(grid) {
    var json = JSON.parse(grid.exportJSON());
    var output = '<div class="grid">';
    jQuery(json.rows).each(function (index, element) {
        output += GridEditor.renderRow(element);
    });
    output += '</div>';
    return output;
}

GridEditor.renderRow = function(data) {
    var output = '<div class="row">';
    jQuery(data.columns).each(function (index, element) {
        output += GridEditor.renderColumn(element);
    });
    output += '</div>';
    return output;
}

GridEditor.renderColumn = function(data) {
    var output = '';
    if(data.extraclass == ''){
        output = '<div class="' + data.class + '"><div class="column-inner">';
    }else{
        output = '<div class="' + data.class + ' ' + data.extraclass + '"><div class="column-inner">';
    }
    output += data.content;
    jQuery(data.rows).each(function (index, element) {
        output += GridEditor.renderRow(element);
    });
    output += '</div></div>';
    return output;
}

GridEditor.BaseGrid = function (holder, minWidthForRows, maxDepth) {
    /*CREATE DOM ELEMENT*/
    GridEditor.basegridcount = GridEditor.basegridcount + 1;
    this.id = GridEditor.prefixedCSS('basegrid') + GridEditor.basegridcount;
    var basegrid = jQuery('<div class="' + GridEditor.prefixedCSS('basegrid') + '" id="' + this.id + '"></div>');
    holder.append(basegrid);
    this.domElement = jQuery('#' + this.id);
    this.domElement.data('javascript', this);
    holder.addClass(GridEditor.prefixedCSS('holder'));
    this.holder = holder;

    /*BUTTONS*/
    var addButtonTop = '<a href="#" data-position="top" class="' + GridEditor.prefixedCSS('button') + '"><span class="' + GridEditor.prefixedCSS('add') + '">' + GridEditor.getText('add-row-top') + '</span></a>';
    var clearButton = '<a href="#" class="' + GridEditor.prefixedCSS('button') + '"><span class="' + GridEditor.prefixedCSS('clear') + '">' + GridEditor.getText('clear-grid') + '</span></a>';
    var addButtonBottom = '<a href="#" data-position="bottom" class="' + GridEditor.prefixedCSS('button') + '"><span class="' + GridEditor.prefixedCSS('add') + '">' + GridEditor.getText('add-row-bottom') + '</span></a>';
    var buttonSetTop = '<div class="' + GridEditor.prefixedCSS('buttonset') + ' ' + GridEditor.prefixedCSS('top') + '">' + addButtonTop + clearButton + '</div>';
    var buttonSetBottom = '<div class="' + GridEditor.prefixedCSS('buttonset') + ' ' + GridEditor.prefixedCSS('bottom') + '">' + addButtonBottom + clearButton + '</div>';
    holder.prepend(buttonSetTop);
    holder.append(buttonSetBottom);

    //notice
    holder.append('<div class="'+GridEditor.prefixedCSS('notice')+'">'+GridEditor.getText('preview-notice')+'</div>');

    /*LIGHTBOX*/
    var lightboxContent = '<div class="' + GridEditor.prefixedCSS('lightboxcontent') + '" />';
    var lightboxBackground = '<div class="' + GridEditor.prefixedCSS('lightboxbackground') + '" />';
    var lightbox = '<div class="' + GridEditor.prefixedCSS('lightbox') + '">' + lightboxBackground + lightboxContent + '</div>';
    holder.append(lightbox);
    this.lightbox = holder.find('> .' + GridEditor.prefixedCSS('lightbox'));
    this.lightboxBackground = this.lightbox.find('> .' + GridEditor.prefixedCSS('lightboxbackground'));
    this.lightboxContent = this.lightbox.find('> .' + GridEditor.prefixedCSS('lightboxcontent'));
    this.showLightbox = function (content, modal, width, height) {
        _this.lightboxContent.html(content);
        if (!modal) {
            _this.lightboxBackground.click(_this.hideLightbox);
        }
        _this.lightbox.fadeIn('fast');
        _this.lightboxContent.css('minWidth', width || 0);
        _this.lightboxContent.css('minHeight', height || 0);
        _this.lightboxContent.css('margin-left', (-(_this.lightboxContent.width() / 2)) + 'px');
        return false;
    }
    this.hideLightbox = function () {
        _this.lightboxBackground.unbind('click');
        _this.lightboxContent.empty();
        _this.lightbox.hide();
        return false;
    }

    /*CONFIRMATION*/
    this.askConfirmation = function (question, callback) {
        var content = '<h2>' + question + '</h2>';
        content += '<div><a class="' + GridEditor.prefixedCSS('yes') + ' ' + GridEditor.prefixedCSS('button') + '" href="#"><span class="' + GridEditor.prefixedCSS('yes') + '">' + GridEditor.getText('yes') + '</span></a> <a class="' + GridEditor.prefixedCSS('no') + ' ' + GridEditor.prefixedCSS('button') + '" href="#"><span class="' + GridEditor.prefixedCSS('no') + '">' + GridEditor.getText('no') + '</span></a></div>';
        _this.showLightbox(content);
        _this.lightboxContent.find('.' + GridEditor.prefixedCSS('yes')).click(function () {
            callback.call(this, 'yes');
            _this.hideLightbox();
            return false;
        });
        _this.lightboxContent.find('.' + GridEditor.prefixedCSS('no')).click(function () {
            callback.call(this, 'no');
            _this.hideLightbox();
            return false;
        });
    }

    /*VARS*/
    var _this = this;
    this.minWidthForRows = minWidthForRows || 50;
    this.maxDepth = maxDepth || 2;
    this.depth = 0;
    this.basegrid = this;
    this.rows = [];

    /*CLEAR*/
    this.clearGrid = function () {
        _this.askConfirmation(GridEditor.getText('clear-grid-question'), function (answer) {
            if (answer == 'yes') {
                _this.quickClearGrid();
            }
        });
        return false;
    }
    this.quickClearGrid = function () {
        jQuery(_this.rows).each(function (index, element) {
            element.quickRemove();
        });
        return false;
    }

    /*ADD ROW*/
    this.addRow = function (event) {
        var prepend = false;
        if (event) {
            event.preventDefault();
            var trigger = event.currentTarget;
            var position = jQuery(trigger).data('position');
            if (position && position == 'top') {
                prepend = true;
            }
        }
        var row = new GridEditor.Row(_this, prepend);
        _this.addRowToList(row);
        _this.updateRows();

        return row;
    }

    /*REMOVE/ADD ROW FROM/TO LIST*/
    this.removeRowFromList = function (row) {
        _this.rows.splice(jQuery.inArray(row, _this.rows), 1);
        return false;
    }
    this.addRowToList = function (row) {
        _this.rows.push(row);
        return false;
    }

    /*LOAD JSON*/
    this.loadJSON = function (json) {
        if (toString.call(json) == '[object String]') {
            json = JSON.parse(json);
        }
        _this.quickClearGrid();
        jQuery(json.rows).each(function (index, element) {
            var row = _this.addRow();
            if (element.numcolumns > 0) {
                row.addJsonColumns(element.columns);
            }
        });
    }

    /*SORT ROWS*/
    this.sortRows = function () {
        _this.rows.sort(GridEditor.sortArrayByTop);
        jQuery(_this.rows).each(function (index, element) {
            element.sortColumns();
        });
        return false;
    }

    /*EXPORT JSON*/
    this.exportJSON = function () {
        _this.sortRows();
        var output = {};
        var rows = [];
        jQuery(_this.rows).each(function (index, element) {
            rows.push(element.getExportObject());
        });
        output.numrows = rows.length;
        output.rows = rows;
        output.type = 'grid';
        return JSON.stringify(output);
    }

    /*UPDATE ROW*/
    this.updateRows = function () {
        _this.updateRowSortable();
        _this.updateColumnSortable();
        _this.addToolTips();

	    jQuery(_this).trigger('change');
        return false;
    }

    /*UPDATE COLUMNS*/
    this.updateColumns = function () {
        _this.updateRowSortable();
        _this.updateColumnSortable();
        _this.addToolTips();
        return false;
    }

    /*ADD TOOLTIPS*/
    this.addToolTips = function () {
        jQuery('.' + GridEditor.prefixedCSS('toolbar') + ':not(.hastooltip)').tooltip({
            items:'a',
            tooltipClass:GridEditor.prefixedCSS('tooltip'),
            track:true,
            show:500,
            hide:false,
            content:function () {
                return jQuery(this).find('span').html();
            }
        }).addClass('hastooltip');
        return false;
    }

    /*UPDATE ROW SORTABLE*/
    this.updateRowSortable = function () {
        var elementsWithout = _this.holder.find('.' + GridEditor.prefixedCSS('basegrid') + ':not(:data(uiSortable)), .' + GridEditor.prefixedCSS('column') + ':not(:data(uiSortable))');
        var elementsWith = _this.holder.find('.' + GridEditor.prefixedCSS('basegrid') + ':data(uiSortable), .' + GridEditor.prefixedCSS('column') + ':data(uiSortable)');
        elementsWith.sortable('refresh');
        elementsWithout.sortable({
            connectWith:'#' + _this.id + ', #' + _this.id + ' .' + GridEditor.prefixedCSS('column'),
            items:'.' + GridEditor.prefixedCSS('row'),
            placeholder:GridEditor.prefixedCSS('row') + ' ' + GridEditor.prefixedCSS('highlight'),
            handle:'.' + GridEditor.prefixedCSS('move'),
            opacity: 0.8,
            start:function (event, ui) {
                ui.item.addClass(GridEditor.prefixedCSS('valid'));
                jQuery('.' + GridEditor.prefixedCSS('toolbar')).tooltip('disable');
            },
            stop:function (event, ui) {
                ui.item.removeClass(GridEditor.prefixedCSS('valid'));
                ui.item.removeClass(GridEditor.prefixedCSS('invalid'));
                jQuery('.' + GridEditor.prefixedCSS('toolbar')).tooltip('enable');
            },
            receive:function (event, ui) {
                if (ui.placeholder.hasClass(GridEditor.prefixedCSS('invalid'))) {
                    jQuery(ui.sender).sortable('cancel');
                } else {
                    var row = ui.item.data('javascript');
                    var column = ui.item.parent().data('javascript');
                    row.changeOwner(column);
                }
            },
            change:function (event, ui) {
                var column = ui.placeholder.parent().data('javascript');
                var row = ui.item.data('javascript');
                if (column.depth > 0 && !column.canAddRow(row)) {
                    ui.placeholder.hide();
                    ui.placeholder.addClass(GridEditor.prefixedCSS('invalid'));
                    var p = ui.placeholder.parent();
                    ui.placeholder.remove();
                    p.append(ui.placeholder);
                    ui.item.removeClass(GridEditor.prefixedCSS('valid'));
                    ui.item.addClass(GridEditor.prefixedCSS('invalid'));
                } else {
                    ui.placeholder.show();
                    ui.placeholder.removeClass(GridEditor.prefixedCSS('invalid'));
                    ui.item.removeClass(GridEditor.prefixedCSS('invalid'));
                    ui.item.addClass(GridEditor.prefixedCSS('valid'));
                }
            }
        });
        return false;
    }

    /*UPDATE COLUMN SORTABLE*/
    this.updateColumnSortable = function () {
        var elementsWithout = _this.domElement.find('.row:not(:data(uiSortable))');
        var elementsWith = _this.domElement.find('.row:data(uiSortable)');
        elementsWith.sortable('refresh');
        elementsWithout.sortable({
            connectWith:'#' + _this.id + ' .row',
            placeholder:GridEditor.prefixedCSS('column') + ' ' + GridEditor.prefixedCSS('highlight'),
            handle:'.' + GridEditor.prefixedCSS('move'),
            cursorAt:{ top:20, left:20 },
            cursor:'move',
            opacity: 0.8,
            tolerance:'pointer',
            start:function (event, ui) {
                ui.placeholder.addClass(GridEditor.widthToClass(ui.item.data('javascript').width));
                ui.item.addClass(GridEditor.prefixedCSS('valid'));
                jQuery('.' + GridEditor.prefixedCSS('toolbar')).tooltip('disable');
            },
            stop:function (event, ui) {
                ui.item.removeClass(GridEditor.prefixedCSS('valid'));
                ui.item.removeClass(GridEditor.prefixedCSS('invalid'));
                jQuery('.' + GridEditor.prefixedCSS('toolbar')).tooltip('enable');
            },
            receive:function (event, ui) {
                if (ui.placeholder.hasClass(GridEditor.prefixedCSS('invalid'))) {
                    jQuery(ui.sender).sortable('cancel');
                } else {
                    var column = ui.item.data('javascript');
                    var row = ui.item.parent().parent().data('javascript');
                    column.changeOwner(row);
                }
            },
            change:function (event, ui) {
                var row = ui.placeholder.parent().parent().data('javascript');
                var column = ui.item.data('javascript');
                if (!row.canAddColumn(column)) {
                    ui.placeholder.hide();
                    ui.placeholder.addClass(GridEditor.prefixedCSS('invalid'));
                    var p = ui.placeholder.parent();
                    ui.placeholder.remove();
                    p.append(ui.placeholder);
                    ui.item.removeClass(GridEditor.prefixedCSS('valid'));
                    ui.item.addClass(GridEditor.prefixedCSS('invalid'));
                } else {
                    ui.placeholder.show();
                    ui.placeholder.removeClass(GridEditor.prefixedCSS('invalid'));
                    ui.item.removeClass(GridEditor.prefixedCSS('invalid'));
                    ui.item.addClass(GridEditor.prefixedCSS('valid'));
                }
            }
        });
        return false;
    }

    /*INIT*/
    holder.find('> .' + GridEditor.prefixedCSS('buttonset') + ' a span.' + GridEditor.prefixedCSS('add')).parent().click(this.addRow);
    holder.find('> .' + GridEditor.prefixedCSS('buttonset') + ' a span.' + GridEditor.prefixedCSS('clear')).parent().click(this.clearGrid);
    this.addToolTips();
}

GridEditor.Row = function (owner, prepend) {
    /*CREATE DOM ELEMENT*/
    GridEditor.rowcount = GridEditor.rowcount + 1;
    this.id = GridEditor.prefixedCSS('row') + GridEditor.rowcount;
    var row = jQuery('<div class="' + GridEditor.prefixedCSS('row') + '" id="' + this.id + '"></div>');
    if (prepend) {
        owner.domElement.prepend(row);
    } else {
        owner.domElement.append(row);
    }
    this.domElement = jQuery('#' + this.id);
    this.domElement.append('<div class="row" />');
    this.domElementInner = this.domElement.find('> .row');
    this.domElement.data('javascript', this);
    this.domElement.hide();
    this.domElement.fadeIn();

    /*TOOLBAR*/
    var addColumnButton = '<a href="#" class="' + GridEditor.prefixedCSS('add') + '"><span>' + GridEditor.getText('add-column') + '</span></a>';
    var removeButton = '<a href="#" class="' + GridEditor.prefixedCSS('remove') + '"><span>' + GridEditor.getText('remove-row') + '</span></a>';
    var moveButton = '<a href="#" class="' + GridEditor.prefixedCSS('move') + '"><span>' + GridEditor.getText('move') + '</span></a>';
    var toolbar = '<div class="' + GridEditor.prefixedCSS('toolbar') + '">' + addColumnButton + removeButton + moveButton + '</div>';
    this.domElement.prepend(toolbar);
    this.addColumnButton = this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('add'));
    this.moveButton = this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('move'));
    this.moveButton.click(function(){
        return false;
    });

    /*VARS*/
    var _this = this;
    this.owner = owner;
    this.depth = owner.depth + 1;
    this.basegrid = owner.basegrid;
    this.columns = [];

    /*CHANGE OWNER*/
    this.changeOwner = function (column) {
        _this.owner.removeRowFromList(this);
        _this.owner = column;
        _this.owner.addRowToList(this);
        _this.changeDepth();
        return false;
    }

    /*SORT COLUMS*/
    this.sortColumns = function () {
        _this.columns.sort(GridEditor.sortArrayByLeft);
        jQuery(_this.columns).each(function (index, element) {
            element.sortRows();
        });
        return false;
    }

    /*CHANGE DEPTH*/
    this.changeDepth = function () {
        _this.depth = _this.owner.depth + 1;
        jQuery(_this.columns).each(function (index, element) {
            element.changeDepth();
        });
        return false;
    }

    /*REMOVE*/
    this.remove = function () {
        _this.basegrid.askConfirmation(GridEditor.getText('remove-row-question'), function (answer) {
            if (answer == 'yes') {
                _this.domElement.fadeOut(function () {
                    _this.quickRemove();
                });
            }
        });
        return false;
    }
    this.quickRemove = function () {
        jQuery(_this.columns).each(function (index, element) {
            element.quickRemove();
        });
        _this.owner.removeRowFromList(_this);
        _this.domElement.remove();
        _this.basegrid.updateRows();
        delete _this.owner;
        delete _this.basegrid;
        return false;
    }

    /*ADD COLUMN*/
    this.addColumn = function (event, width, content, extraclass) {
        if (event) {
            event.preventDefault();
        }
        if (Math.ceil(_this.getWidth()) == 100) {
            return false;
        }
        var columnWidth = width;
        if (!columnWidth) {
            var w = _this.getWidth();
            columnWidth = 100;
            jQuery(GridEditor.widthOptions).each(function (index, element) {
                if (element[1] + w <= 100) {
                    columnWidth = element[1];
                    return false;
                }
            });
        }
        var column = new GridEditor.Column(_this, columnWidth, content, extraclass);
        _this.addColumnToList(column);
        _this.checkAddColumnButton();
        _this.basegrid.updateColumns();
        return column;
    }

    /*ADD JSON COLUMNS*/
    this.addJsonColumns = function (columns) {
        jQuery(columns).each(function (index, element) {
            var column = _this.addColumn(null, element.width, element.content, element.extraclass);
            if (element.numrows > 0) {
                column.addJsonRows(element.rows);
            }
        });
        return false;
    }

    /*REMOVE/ADD COLUMN FROM/TO LIST*/
    this.removeColumnFromList = function (column) {
        _this.columns.splice(jQuery.inArray(column, _this.columns), 1);
        _this.checkAddColumnButton();
        return false;
    }
    this.addColumnToList = function (column) {
        _this.columns.push(column);
        _this.checkAddColumnButton();
        return false;
    }

    /*CAN ADD COLUMN*/
    this.canAddColumn = function (column) {
        if (column.owner == _this) {
            return true;
        }
        if (_this.getWidth() + column.width > 100) {
            return false;
        }
        return true;
    }

    /*WIDTH*/
    this.getWidth = function (substract) {
        var width = 0;
        jQuery(this.columns).each(function (index, element) {
            width += element.width;
        });
        if (substract) {
            width -= substract;
        }
        return width;
    }

    /*CHILD DEPTH*/
    this.getChildDepth = function (onlyRows) {
        var child = this;
        var count = 0;
        while(child != null){
            child = child.getFirstChild();
            if(child){
                if(!onlyRows || child.columns != undefined){
                    count++;
                }
            }
        }
        return count;
    }
    this.getFirstChild = function () {
        return _this.columns.length > 0 ? _this.columns[0] : null;
    }

    /*CHECK ADD COLUMN BUTTON*/
    this.checkAddColumnButton = function () {
        if (Math.ceil(_this.getWidth()) == 100) {
            this.addColumnButton.addClass(GridEditor.prefixedCSS('disabled'));
        } else {
            this.addColumnButton.removeClass(GridEditor.prefixedCSS('disabled'));
        }
    }

    /*EXPORT OBJECT*/
    this.getExportObject = function () {
        var output = {};
        var columns = [];
        jQuery(_this.columns).each(function (index, element) {
            columns.push(element.getExportObject());
        });
        output.type = 'row';
        output.numcolumns = columns.length;
        output.columns = columns;
        return output;
    }

    /*INIT*/
    this.addColumnButton.click(this.addColumn);
    this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('remove')).click(this.remove);
}

GridEditor.Column = function (owner, width, content, extraclass) {
    /*CREATE DOM ELEMENT*/
    GridEditor.columncount = GridEditor.columncount + 1;
    this.id = GridEditor.prefixedCSS('column') + GridEditor.columncount;
    var column = jQuery('<div class="' + GridEditor.prefixedCSS('column') + '" style="width:'+width+'%;" id="' + this.id + '"></div>');
    owner.domElementInner.append(column);
    this.domElement = jQuery('#' + this.id);
    this.domElement.append('<div class="' + GridEditor.prefixedCSS('content') + '" />');
    this.domElementContent = this.domElement.find('> .' + GridEditor.prefixedCSS('content'));
    this.domElement.data('javascript', this);
    this.domElement.hide();
    this.domElement.fadeIn();

    /*TOOLBAR*/
    var addRowButton = '<a href="#" class="' + GridEditor.prefixedCSS('add') + '"><span>' + GridEditor.getText('add-row') + '</span></a>';
    var removeButton = '<a href="#" class="' + GridEditor.prefixedCSS('remove') + '"><span>' + GridEditor.getText('remove-column') + '</span></a>';
    var changeContentButton = '<a href="#" class="' + GridEditor.prefixedCSS('edit') + '"><span>' + GridEditor.getText('edit') + '</span></a>';
    var changeWidthButton = '<a href="#" class="' + GridEditor.prefixedCSS('resize') + '"><span>' + GridEditor.getText('width') + ' (<small>' + GridEditor.widthToKey(width) + '</small>)</span></a>';
    var moveButton = '<a href="#" class="' + GridEditor.prefixedCSS('move') + '"><span>' + GridEditor.getText('move') + '</span></a>';
    var toolbar = '<div class="' + GridEditor.prefixedCSS('toolbar') + '">' + addRowButton + removeButton + changeContentButton + changeWidthButton + moveButton + '</div>';
    this.domElement.prepend(toolbar);
    this.widthButton = this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('resize'));
    this.addRowButton = this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('add'));
    this.moveButton = this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('move'));
    this.moveButton.click(function(){
        return false;
    });

    /*VARS*/
    var _this = this;
    this.owner = owner;
    this.depth = owner.depth;
    this.basegrid = owner.basegrid;
    this.rows = [];
    this.content = '';
    this.width = width;
    this.extraClass = '';

    /*SORT ROWS*/
    this.sortRows = function () {
        _this.rows.sort(GridEditor.sortArrayByTop);
        jQuery(_this.rows).each(function (index, element) {
            element.sortColumns();
        });
        return false;
    }

    /*CHANGE OWNER*/
    this.changeOwner = function (row) {
        _this.owner.removeColumnFromList(this);
        _this.owner = row;
        _this.owner.addColumnToList(this);
        _this.changeDepth();
        return false;
    }

    /*CHANGE DEPTH*/
    this.changeDepth = function () {
        _this.depth = _this.owner.depth;
        jQuery(_this.rows).each(function (index, element) {
            element.changeDepth();
        });
        _this.checkAddRowButton();
        return false;
    }

    /*CHECK ADD ROW BUTTON*/
    this.checkAddRowButton = function () {
        if (_this.width < _this.basegrid.minWidthForRows || _this.depth >= _this.basegrid.maxDepth) {
            _this.addRowButton.hide();
        } else {
            _this.addRowButton.show();
        }
        return false;
    }

    /*REMOVE*/
    this.remove = function () {
        _this.basegrid.askConfirmation(GridEditor.getText('remove-column-question'), function (answer) {
            if (answer == 'yes') {
                _this.domElement.fadeOut(function () {
                    _this.quickRemove();
                });
            }
        });
        return false;
    }
    this.quickRemove = function () {
        jQuery(_this.rows).each(function (index, element) {
            element.quickRemove();
        });
        _this.owner.removeColumnFromList(_this);
        _this.domElement.remove();
        _this.basegrid.updateColumns();
        delete _this.owner;
        delete _this.basegrid;
        return false;
    }

    /*ADD ROW*/
    this.addRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        var row = new GridEditor.Row(_this, false);
        _this.addRowToList(row);
        _this.basegrid.updateRows();
        return row;
    }

    /*CHILD DEPTH*/
    this.getChildDepth = function (onlyRows) {
        var child = this;
        var count = 0;
        while(child != null){
            child = child.getFirstChild();
            if(child){
                if(!onlyRows || child.columns != undefined){
                    count++;
                }
            }
        }
        return count;
    }
    this.getFirstChild = function () {
        return _this.rows.length > 0 ? _this.rows[0] : null;
    }

    /*ADD JSON COLUMNS*/
    this.addJsonRows = function (rows) {
        jQuery(rows).each(function (index, element) {
            var row = _this.addRow();
            if (element.numcolumns > 0) {
                row.addJsonColumns(element.columns);
            }
        });
        return false;
    }

    /*REMOVE/ADD ROW FROM/TO LIST*/
    this.removeRowFromList = function (row) {
        _this.rows.splice(jQuery.inArray(row, _this.rows), 1);
        return false;
    }
    this.addRowToList = function (row) {
        _this.rows.push(row);
        return false;
    }

    /*CAN ADD ROW*/
    this.canAddRow = function (row) {
        if (row.owner == _this) {
            return true;
        }
        if(_this.depth >= _this.basegrid.maxDepth - row.getChildDepth(true)){
            return false;
        }
        return true;
    }

    /*WIDTH*/
    this.setWidth = function (width) {
        _this.domElement.css('width',width+'%');
        _this.widthButton.find('small').html(width);
        _this.width = width;
        _this.checkAddRowButton();
        _this.owner.checkAddColumnButton();
        return false;
    }
    this.showWidthOptions = function () {
        var content = '<h2>' + GridEditor.getText('change-width') + '</h2>';
        content += '<ul>';
        var maxWidth = 100 - _this.owner.getWidth(_this.width);
        jQuery(GridEditor.widthOptions).each(function (index, element) {
            if (GridEditor.widthToKey(_this.width) == element[0]) {
                content += '<li class="' + GridEditor.prefixedCSS('active') + '"><a href="#" data-width="' + element[1] + '">' + element[0] + '</a></li>';
            } else if (element[1] > maxWidth) {
                content += '<li class="' + GridEditor.prefixedCSS('disabled') + '"><a href="#">' + element[0] + '</a></li>';
            } else {
                content += '<li><a href="#" data-width="' + element[1] + '">' + element[0] + '</a></li>';
            }
        });
        content += '</ul>';
        content += '<div class="'+GridEditor.prefixedCSS('actions')+'"><a class="' + GridEditor.prefixedCSS('cancel') + ' ' + GridEditor.prefixedCSS('button') + '" href="#"><span class="' + GridEditor.prefixedCSS('cancel') + '">' + GridEditor.getText('cancel') + '</span></a></div>';
        _this.basegrid.showLightbox(content);
        _this.basegrid.lightboxContent.find('ul li a').click(function () {
            var dataWidth = jQuery(this).data('width');
            if (dataWidth) {
                _this.setWidth(dataWidth);
                _this.basegrid.hideLightbox();
            }
            return false;
        });
        _this.basegrid.lightboxContent.find('a.' + GridEditor.prefixedCSS('cancel')).click(function () {
            _this.basegrid.hideLightbox();
            return false;
        });
        return false;
    }

    /*CONTENT*/
    this.setExtraClass = function (cls){
        _this.extraClass = cls;
        return false;
    }
    this.setContent = function (content) {
        if(GridEditor.cleanContentPreview){
		   var imgPlaceholder = 'tmp['+GridEditor.getText('image')+']tmp';
		   var cleanContent = content;
		   cleanContent = cleanContent.replace(/\[widget[^\]]*]/g,'tmp[');
		   cleanContent = cleanContent.replace(/\[\/widget[^\]]*]/g,']tmp');
		   cleanContent = cleanContent.replace(/<img[^>]*>/g, imgPlaceholder);
		   cleanContent = jQuery('<div>'+cleanContent+'</div>').text();
		   cleanContent = cleanContent.replace(/tmp\[/g,'<span class="'+GridEditor.prefixedCSS('highlightplaceholder')+'">');
		   cleanContent = cleanContent.replace(/\]tmp/g,'</span>');
        }
        if(GridEditor.maxLengthContentPreview){
            if(cleanContent.length > GridEditor.maxLengthContentPreview){
                _this.domElementContent.html( cleanContent.substring(0,GridEditor.maxLengthContentPreview) + '...' );
            }else{
                _this.domElementContent.html( cleanContent );
            }
        }else{
            _this.domElementContent.html(content);
        }

        _this.content = content;
	    jQuery(this.basegrid).trigger('change');
        return false;
    }
    this.showContentEditor = function () {
        var content = '<h2>' + GridEditor.getText('edit-content') + '</h2>';
        if(GridEditor.contenteditor){
            content += GridEditor.contenteditor.editor;
        }else{
            content += '<textarea style="width: 100%;" rows=10>' + _this.content + '</textarea>';
        }
        if(GridEditor.columnClasses){
            var select = '<div class="'+GridEditor.prefixedCSS('styleselect-holder')+'"><label for="'+GridEditor.prefixedCSS('styleselect')+'">'+GridEditor.getText('style')+'</label><select id="'+GridEditor.prefixedCSS('styleselect')+'">';
            select += '<option value="none">&nbsp;</option>';
            jQuery(GridEditor.columnClasses).each(function(index, element){
                if(_this.extraClass == element[1]){
                    select += '<option selected value="'+element[1]+'">'+element[0]+'</option>';
                }else{
                    select += '<option value="'+element[1]+'">'+element[0]+'</option>';
                }
            });
            select += '</select></div>';
            content += select;
        }
        content += '<div class="'+GridEditor.prefixedCSS('actions')+'"><a class="' + GridEditor.prefixedCSS('save') + ' ' + GridEditor.prefixedCSS('button') + '" href="#"><span class="' + GridEditor.prefixedCSS('accept') + '">' + GridEditor.getText('save-content') + '</span></a> <a class="' + GridEditor.prefixedCSS('cancel') + ' ' + GridEditor.prefixedCSS('button') + '" href="#"><span class="' + GridEditor.prefixedCSS('cancel') + '">' + GridEditor.getText('cancel') + '</span></a></div>';
        _this.basegrid.showLightbox(content, false, '80%', '80%');
        if(GridEditor.contenteditor){
            GridEditor.contenteditor.setContent(_this.basegrid.lightboxContent, _this.content);
        }
        _this.basegrid.lightboxContent.find('a.' + GridEditor.prefixedCSS('save')).click(function () {
            if(GridEditor.contenteditor){
                _this.setContent(GridEditor.contenteditor.getContent(_this.basegrid.lightboxContent));
            }else{
                var textArea = _this.basegrid.lightboxContent.find('textarea');
                _this.setContent(textArea.val());
            }
            if(GridEditor.columnClasses){
                var extraClass = _this.basegrid.lightboxContent.find('#' + GridEditor.prefixedCSS('styleselect')).val();
                if(extraClass != 'none'){
                    _this.setExtraClass(extraClass);
                }else{
                    _this.setExtraClass('');
                }
            }
            _this.basegrid.hideLightbox();
            return false;
        });
        _this.basegrid.lightboxContent.find('a.' + GridEditor.prefixedCSS('cancel')).click(function () {
            _this.basegrid.hideLightbox();
            return false;
        });
        return false;
    }

    /*EXPORT OBJECT*/
    this.getExportObject = function () {
        var output = {};
        var rows = [];
        jQuery(_this.rows).each(function (index, element) {
            rows.push(element.getExportObject());
        });
        output.type = 'column';
        output.content = _this.content;
        output.width = _this.width;
        output.class = GridEditor.widthToClass(_this.width);
        output.columnname = GridEditor.widthToKey(_this.width);
        output.extraclass = _this.extraClass;
        output.numrows = rows.length;
        output.rows = rows;
        return output;
    }

    /*INIT*/
    if (content) {
        this.setContent(content);
    } else {
        this.setContent(GridEditor.getText('default-content'));
    }
    if(extraclass){
        this.setExtraClass(extraclass);
    }
    this.checkAddRowButton();
    this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('remove')).click(this.remove);
    this.domElement.find('> .' + GridEditor.prefixedCSS('toolbar') + ' .' + GridEditor.prefixedCSS('edit')).click(this.showContentEditor);
    this.domElement.find('> .' + GridEditor.prefixedCSS('content')).click(this.showContentEditor);
    this.addRowButton.click(this.addRow);
    this.widthButton.click(this.showWidthOptions);
}