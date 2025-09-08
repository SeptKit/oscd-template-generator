/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html, css } from 'lit';
import { query, state } from 'lit/decorators.js';
import { MdDialog } from '@scopedelement/material-web/dialog/dialog.js';
import { MdTextButton } from '@scopedelement/material-web/button/text-button.js';
import { MdRadio } from '@scopedelement/material-web/radio/radio.js';

type IdHandlingType = 'random' | 'user' | 'content-hash';

const STORAGE_KEY = 'template-generator-lnodetype-id-setting';

export class SettingsDialog extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'md-dialog': MdDialog,
    'md-text-button': MdTextButton,
    'md-radio': MdRadio,
  };

  @query('md-dialog')
  dialog!: MdDialog;

  @state()
  private selectedIdHandling: IdHandlingType = 'random';

  connectedCallback() {
    super.connectedCallback();
    this.loadSettings();
  }

  private loadSettings() {
    const stored = localStorage.getItem(STORAGE_KEY) as IdHandlingType;
    if (stored && ['random', 'user', 'content-hash'].includes(stored)) {
      this.selectedIdHandling = stored;
    } else {
      this.selectedIdHandling = 'random';
    }
  }

  private saveSettings() {
    localStorage.setItem(STORAGE_KEY, this.selectedIdHandling);
  }

  get open() {
    return this.dialog?.open ?? false;
  }

  show() {
    this.loadSettings();
    this.dialog?.show();
  }

  close() {
    this.dialog?.close();
  }

  private handleRadioChange(event: Event) {
    const target = event.target as MdRadio;
    if (target.checked) {
      this.selectedIdHandling = target.value as IdHandlingType;
    }
  }

  private handleConfirm() {
    this.saveSettings();
    this.close();
  }

  private handleCancel() {
    this.loadSettings();
    this.close();
  }

  render() {
    return html`
      <md-dialog @closed=${() => this.dialog?.close()}>
        <div slot="headline">LNodeType id Handling</div>
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

  static styles = css`
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
}
