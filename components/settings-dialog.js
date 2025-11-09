import { __decorate } from "tslib";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html, css } from 'lit';
import { query, state } from 'lit/decorators.js';
import { MdDialog } from '@scopedelement/material-web/dialog/dialog.js';
import { MdTextButton } from '@scopedelement/material-web/button/text-button.js';
import { MdRadio } from '@scopedelement/material-web/radio/radio.js';
import { STORAGE_KEY_LNODETYPE_ID_SETTING } from '../constants.js';
// eslint-disable-next-line no-shadow
var IdHandlingOption;
(function (IdHandlingOption) {
    IdHandlingOption["Random"] = "random";
    IdHandlingOption["User"] = "user";
    IdHandlingOption["ContentHash"] = "content-hash";
})(IdHandlingOption || (IdHandlingOption = {}));
export class SettingsDialog extends ScopedElementsMixin(LitElement) {
    constructor() {
        super(...arguments);
        this.selectedIdHandling = IdHandlingOption.Random;
    }
    connectedCallback() {
        super.connectedCallback();
        this.loadSettings();
    }
    loadSettings() {
        const stored = localStorage.getItem(STORAGE_KEY_LNODETYPE_ID_SETTING);
        if (stored &&
            Object.values(IdHandlingOption).includes(stored)) {
            this.selectedIdHandling = stored;
        }
        else {
            this.selectedIdHandling = IdHandlingOption.Random;
        }
    }
    saveSettings() {
        localStorage.setItem(STORAGE_KEY_LNODETYPE_ID_SETTING, this.selectedIdHandling);
    }
    get open() {
        var _a, _b;
        return (_b = (_a = this.dialog) === null || _a === void 0 ? void 0 : _a.open) !== null && _b !== void 0 ? _b : false;
    }
    show() {
        var _a;
        this.loadSettings();
        (_a = this.dialog) === null || _a === void 0 ? void 0 : _a.show();
    }
    close() {
        var _a;
        (_a = this.dialog) === null || _a === void 0 ? void 0 : _a.close();
    }
    handleRadioChange(event) {
        const target = event.target;
        if (target.checked) {
            this.selectedIdHandling = target.value;
        }
    }
    handleConfirm() {
        this.saveSettings();
        this.close();
    }
    handleCancel() {
        this.loadSettings();
        this.close();
    }
    render() {
        return html `
      <md-dialog @closed=${() => { var _a; return (_a = this.dialog) === null || _a === void 0 ? void 0 : _a.close(); }}>
        <div slot="headline">LNodeType id handling</div>
        <div slot="content">
          <div class="radio-group">
            <label class="radio-item">
              <md-radio
                name="id-handling"
                value="random"
                .checked=${this.selectedIdHandling === 'random'}
                @change=${this.handleRadioChange}
              ></md-radio>
              <span class="radio-label">
                <strong>Random id</strong>
                <span class="radio-description"
                  >Generate a random unique id</span
                >
              </span>
            </label>

            <label class="radio-item">
              <md-radio
                name="id-handling"
                value="user"
                .checked=${this.selectedIdHandling === 'user'}
                @change=${this.handleRadioChange}
              ></md-radio>
              <span class="radio-label">
                <strong>User id</strong>
                <span class="radio-description"
                  >Allow user to specify custom id</span
                >
              </span>
            </label>

            <label class="radio-item">
              <md-radio
                name="id-handling"
                value="content-hash"
                .checked=${this.selectedIdHandling === 'content-hash'}
                @change=${this.handleRadioChange}
              ></md-radio>
              <span class="radio-label">
                <strong>Content hash</strong>
                <span class="radio-description"
                  >Generate id based on content hash</span
                >
              </span>
            </label>
          </div>
        </div>
        <div slot="actions">
          <md-text-button @click=${this.handleCancel} type="button">
            Cancel
          </md-text-button>
          <md-text-button @click=${this.handleConfirm} type="button">
            Save
          </md-text-button>
        </div>
      </md-dialog>
    `;
    }
}
SettingsDialog.scopedElements = {
    'md-dialog': MdDialog,
    'md-text-button': MdTextButton,
    'md-radio': MdRadio,
};
SettingsDialog.styles = css `
    md-dialog {
      --md-dialog-container-max-width: 400px;
    }

    [slot='content'] {
      padding: 16px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .radio-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      padding: 8px;
    }

    .radio-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .radio-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .radio-description {
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.875rem;
      line-height: 1.4;
    }

    md-text-button {
      text-transform: uppercase;
    }
  `;
__decorate([
    query('md-dialog')
], SettingsDialog.prototype, "dialog", void 0);
__decorate([
    state()
], SettingsDialog.prototype, "selectedIdHandling", void 0);
//# sourceMappingURL=settings-dialog.js.map