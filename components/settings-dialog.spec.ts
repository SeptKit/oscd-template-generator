import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { SettingsDialog } from './settings-dialog.js';

customElements.define('settings-dialog', SettingsDialog);

describe('SettingsDialog', () => {
  let element: SettingsDialog;

  const getRadio = (value: 'random' | 'user' | 'content-hash') =>
    element.shadowRoot!.querySelector(`md-radio[value="${value}"]`) as any;

  beforeEach(async () => {
    localStorage.clear();
    element = await fixture(html`<settings-dialog></settings-dialog>`);
    element.show();
    await element.updateComplete;
  });

  afterEach(() => {
    localStorage.clear();
    element.close();
  });

  it('should default to "random" setting', async () => {
    expect((element as any).selectedIdHandling).to.equal('random');

    await element.updateComplete;

    expect(getRadio('random').checked).to.equal(true);
    expect(getRadio('user').checked).to.equal(false);
    expect(getRadio('content-hash').checked).to.equal(false);
  });

  it('should load settings from localStorage', async () => {
    localStorage.setItem('template-generator-lnodetype-id-setting', 'user');
    element.connectedCallback();
    expect((element as any).selectedIdHandling).to.equal('user');

    await element.updateComplete;

    expect(getRadio('random').checked).to.equal(false);
    expect(getRadio('user').checked).to.equal(true);
    expect(getRadio('content-hash').checked).to.equal(false);
  });

  it('should fallback to "random" for invalid localStorage values', () => {
    localStorage.setItem('template-generator-lnodetype-id-setting', 'invalid');
    element.connectedCallback();
    expect((element as any).selectedIdHandling).to.equal('random');
  });

  it('should save settings and close dialog on confirm', async () => {
    const contentHashRadio = getRadio('content-hash');
    contentHashRadio.click();
    await element.updateComplete;

    const confirmButton = element.shadowRoot!.querySelector(
      'md-text-button:last-child'
    ) as any;
    confirmButton.click();

    expect(
      localStorage.getItem('template-generator-lnodetype-id-setting')
    ).to.equal('content-hash');

    await waitUntil(() => !element.open, undefined, { timeout: 5000 });
    expect(element.open).to.equal(false);
  });

  it('should not save changes on cancel', async () => {
    localStorage.setItem('template-generator-lnodetype-id-setting', 'random');

    const userRadio = getRadio('user');
    userRadio.click();
    await element.updateComplete;

    const cancelButton = element.shadowRoot!.querySelector(
      'md-text-button:first-child'
    ) as any;
    cancelButton.click();

    expect(
      localStorage.getItem('template-generator-lnodetype-id-setting')
    ).to.equal('random');

    await waitUntil(() => !element.open, undefined, { timeout: 5000 });
    expect(element.open).to.equal(false);
  });
});
