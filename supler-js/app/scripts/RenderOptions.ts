interface RenderSingleChoiceField {
    (label: string, id: string, validationId: string, name: string, value: any, options: any, compact: boolean): string
}

interface RenderMultiChoiceField {
    (label: string, id: string, validationId: string, name: string, value: any, possibleValues: any[], options: any, compact: boolean): string
}

interface RenderOptions {
    // main field rendering entry points
    // basic types
    renderStringField: RenderSingleChoiceField
    renderIntegerField: RenderSingleChoiceField
    renderDoubleField: RenderSingleChoiceField
    renderBooleanField: RenderSingleChoiceField
    renderPasswordField: RenderSingleChoiceField
    renderTextareaField: RenderSingleChoiceField
    renderMultiChoiceCheckboxField: RenderMultiChoiceField
    renderMultiChoiceSelectField: RenderMultiChoiceField
    renderSingleChoiceRadioField: RenderMultiChoiceField
    renderSingleChoiceSelectField: RenderMultiChoiceField

    // templates
    // Rhs - [label] [input] [validation] (input on the right from the label)
    renderRhsField: (input: string, label: string, id: string, validationId: string, compact: boolean) => string
    renderLabel: (forId: string, label: string) => string
    renderValidation: (validationId: string) => string

    renderSubformDecoration: (subform: string, label: string, id: string, name: string) => string
    renderSubformListElement: (subformElement: string, options: any) => string;
    renderSubformTable: (tableHeaders: string[], cells: string[][]) => string;

    // html form elements
    renderHtmlInput: (inputType: string, id: string, name: string, value: any, options: any) => string
    renderHtmlSelect: (id: string, name: string, value: string, possibleValues: any[], options: any) => string

    // misc
    defaultFieldOptions: () => any
}

class DefaultRenderOptions implements RenderOptions {
    constructor() {
    }

    renderStringField(label, id, validationId, name, value, options, compact) {
        return this.renderRhsField(this.renderHtmlInput('text', id, name, value, options), label, id, validationId, compact);
    }

    renderIntegerField(label, id, validationId, name, value, options, compact) {
        return this.renderRhsField(this.renderHtmlInput('number', id, name, value, options), label, id, validationId, compact);
    }

    renderDoubleField(label, id, validationId, name, value, options, compact) {
        return this.renderRhsField(this.renderHtmlInput('number', id, name, value, options), label, id, validationId, compact);
    }

    renderBooleanField(label, id, validationId, name, value, options, compact) {
        return '';
    }

    // text field render hints
    renderPasswordField(label, id, validationId, name, value, options, compact) {
        return this.renderRhsField(this.renderHtmlInput('password', id, name, value, options), label, id, validationId, compact);
    }

    renderTextareaField(label, id, validationId, name, value, options, compact) {
        return '';
    }

    renderMultiChoiceCheckboxField(label, id, validationId, name, values, possibleValues, options, compact) {
        return '';
    }

    renderMultiChoiceSelectField(label, id, validationId, name, values, possibleValues, options, compact) {
        return '';
    }

    renderSingleChoiceRadioField(label, id, validationId, name, value, possibleValues, options, compact) {
        return '';
    }

    renderSingleChoiceSelectField(label, id, validationId, name, value, possibleValues, options, compact) {
        return this.renderRhsField(this.renderHtmlSelect(id, name, value, possibleValues, options), label, id, validationId, compact);
    }

    //

    renderRhsField(input, label, id, validationId, compact) {
        var labelPart;
        if (compact) {
            labelPart = '';
        } else {
            labelPart = this.renderLabel(id, label) + '\n';
        }

        return '<div class="form-group">' +
            labelPart +
            input +
            '\n' +
            this.renderValidation(validationId) +
            '\n' +
            '</div>';
    }

    renderLabel(forId, label) {
        return '<label for="' + forId + '">' + label + '</label>';
    }

    renderValidation(validationId) {
        return '<div class="text-danger" id="' + validationId + '"></div>';
    }

    renderSubformDecoration(subform, label, id, name) {
        var html = '';
        html += HtmlUtil.renderTag('fieldset', {'id': id, 'name': name }, false);
        html += '\n';
        html += '<legend>' + label + '</legend>\n';

        html += subform;

        html += '</fieldset>\n';
        return html;
    }

    renderSubformListElement(subformElement, options) {
        var html = '';
        var optionsWithClass = Util.copyProperties({ 'class': 'well'}, options);
        html += HtmlUtil.renderTag('div', optionsWithClass, false);
        html += subformElement;
        html += '</div>\n';
        return html;
    }

    renderSubformTable(tableHeaders, cells) {
        var html = '';
        html += '<table class="table">\n';

        html += '<tr>';
        tableHeaders.forEach((header) => html += '<th>' + header + '</th>');
        html += '</tr>\n';

        for (var i=0; i<cells.length; i++) {
            var row = cells[i];
            html += '<tr>\n';
            for (var j=0; j<row.length; j++) {
                html += '<td>' + row[j] + '</td>\n';
            }
            html += '</tr>\n';
        }

        html += '</table>\n';

        return html;
    }

    //

    renderHtmlInput(inputType, id, name, value, options) {
        return HtmlUtil.renderTag('input', Util.copyProperties({ 'id': id, 'type': inputType, 'name': name, 'value': value }, options), true);
    }

    renderHtmlSelect(id, name, value, possibleValues, options) {
        var html = '';
        html += HtmlUtil.renderTag('select', Util.copyProperties({ 'id': id, 'name': name }, options), false);
        html += '\n';
        Util.foreach(possibleValues, (i, v) => {
            var selected = '';
            if (v === value) {
                selected = ' selected ';
            }

            html += '<option value="' + v + '"' + selected + '>';
            html += v;
            html += '</option>\n';
        });
        html += '</select>\n';
        return html;
    }

    //

    defaultFieldOptions() {
        return { 'class': 'form-control' };
    }
}