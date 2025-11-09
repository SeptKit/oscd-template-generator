import { expect, fixture, html } from '@open-wc/testing';
import { SettingsDialog } from './settings-dialog.js';
customElements.define('settings-dialog', SettingsDialog);
describe('SettingsDialog', () => {
    let element;
    const getRadio = (value) => element.shadowRoot.querySelector(`md-radio[value="${value}"]`);
    beforeEach(async () => {
        localStorage.clear();
        element = await fixture(html `<settings-dialog></settings-dialog>`);
        element.show();
        await element.updateComplete;
    });
    afterEach(() => {
        localStorage.clear();
        element.close();
    });
    it('should default to "random" setting', async () => {
        expect(element.selectedIdHandling).to.equal('random');
        await element.updateComplete;
        expect(getRadio('random').checked).to.equal(true);
        expect(getRadio('user').checked).to.equal(false);
        expect(getRadio('content-hash').checked).to.equal(false);
    });
    it('should load settings from localStorage', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'user');
        element.connectedCallback();
        expect(element.selectedIdHandling).to.equal('user');
        await element.updateComplete;
        expect(getRadio('random').checked).to.equal(false);
        expect(getRadio('user').checked).to.equal(true);
        expect(getRadio('content-hash').checked).to.equal(false);
    });
    it('should fallback to "random" for invalid localStorage values', () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'invalid');
        element.connectedCallback();
        expect(element.selectedIdHandling).to.equal('random');
    });
    it('should save settings on confirm', async () => {
        const contentHashRadio = getRadio('content-hash');
        contentHashRadio.click();
        await element.updateComplete;
        const confirmButton = element.shadowRoot.querySelector('md-text-button:last-child');
        confirmButton.click();
        expect(localStorage.getItem('template-generator-lnodetype-id-setting')).to.equal('content-hash');
    });
    it('should not save changes on cancel', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'random');
        const userRadio = getRadio('user');
        userRadio.click();
        await element.updateComplete;
        const cancelButton = element.shadowRoot.querySelector('md-text-button:first-child');
        cancelButton.click();
        expect(localStorage.getItem('template-generator-lnodetype-id-setting')).to.equal('random');
    });
});
//# sourceMappingURL=settings-dialog.spec.js.map