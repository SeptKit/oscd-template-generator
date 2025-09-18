/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { MdOutlinedTextField } from '@scopedelement/material-web/textfield/MdOutlinedTextField.js';
import { MdDialog } from '@scopedelement/material-web/dialog/dialog.js';
import { MdTextButton } from '@scopedelement/material-web/button/text-button.js';

export class DescriptionDialog extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'md-dialog': MdDialog,
    'md-text-button': MdTextButton,
    'md-outlined-text-field': MdOutlinedTextField,
  };

  @property({ type: Array })
  cdClasses: string[] = [];

  @property({ type: Function })
  onConfirm!: (description: string, id?: string) => void;

  @property({ type: Function })
  onCancel!: () => void;

  @property({ attribute: false })
  doc?: XMLDocument;

  @query('md-dialog')
  dialog!: MdDialog;

  @query('#lnode-type-description')
  description!: MdOutlinedTextField;

  @query('#lnode-type-id')
  idField?: MdOutlinedTextField;

  @state()
  private showIdField = false;

  get open() {
    return this.dialog?.open ?? false;
  }

  show() {
    this.showIdField =
      localStorage.getItem('template-generator-lnodetype-id-setting') ===
      'user';
    this.dialog?.show();
  }

  close() {
    if (this.description) {
      this.description.errorText = '';
      this.description.error = false;
      this.description.value = '';
    }
    if (this.idField) {
      this.idField.errorText = '';
      this.idField.error = false;
      this.idField.value = '';
    }
    this.dialog?.close();
  }

  private validate(): boolean {
    let isValid = true;

    if (!this.description?.checkValidity()) {
      this.description.errorText = 'Not a valid description.';
      this.description.error = true;
      isValid = false;
    } else {
      this.description.errorText = '';
      this.description.error = false;
    }

    if (this.idField) {
      if (!this.idField.checkValidity()) {
        this.idField.errorText = 'Not a valid id.';
        this.idField.error = true;
        isValid = false;
      } else if (this.doc && this.idExists(this.idField.value)) {
        this.idField.errorText = 'LNodeType id already in use.';
        this.idField.error = true;
        isValid = false;
      } else {
        this.idField.errorText = '';
        this.idField.error = false;
      }
    }

    return isValid;
  }

  private idExists(id: string): boolean {
    if (!this.doc || !id) return false;
    const existingLNodeType = this.doc.querySelector(`LNodeType[id="${id}"]`);
    return existingLNodeType !== null;
  }

  /* eslint-disable class-methods-use-this */
  private resetErrorText(e: Event): void {
    const target = e.target as MdOutlinedTextField;
    if (target && target.errorText && target.checkValidity()) {
      target.errorText = '';
      target.error = false;
    }
  }

  private handleConfirm() {
    if (!this.validate()) return;
    const id =
      this.showIdField && this.idField ? this.idField.value : undefined;
    this.onConfirm(this.description.value, id);
    this.close();
  }

  render() {
    return html`
      <md-dialog @closed=${() => this.close()}>
        <div slot="headline">Add LNodeType Description</div>
        <div slot="content" class="dialog-content">
          <md-outlined-text-field
            id="lnode-type-description"
            label="LNodeType Description"
            required
            @input=${this.resetErrorText}
          ></md-outlined-text-field>
          ${this.showIdField
            ? html`
                <md-outlined-text-field
                  id="lnode-type-id"
                  label="LNodeType id"
                  required
                  minlength="1"
                  maxlength="255"
                  pattern="\\S+"
                  @input=${this.resetErrorText}
                ></md-outlined-text-field>
              `
            : ''}
        </div>
        <div slot="actions">
          <md-text-button id="cancel-button" @click=${this.close} type="button"
            >Cancel</md-text-button
          >
          <md-text-button
            id="confirm-button"
            @click=${this.handleConfirm}
            type="button"
            >Add</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  static styles = css`
    md-text-button {
      text-transform: uppercase;
    }
    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `;
}
