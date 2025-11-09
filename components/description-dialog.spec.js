import { expect, fixture, html } from '@open-wc/testing';
import { DescriptionDialog } from './description-dialog.js';
customElements.define('description-dialog', DescriptionDialog);
describe('DescriptionDialog', () => {
    let element;
    let mockDoc;
    let onConfirmSpy;
    let onCancelSpy;
    beforeEach(async () => {
        localStorage.clear();
        mockDoc = new DOMParser().parseFromString(`
      <SCL>
        <DataTypeTemplates>
          <LNodeType id="existing-id" lnClass="LPHD">
            <DO name="Health" type="ENS"/>
          </LNodeType>
        </DataTypeTemplates>
      </SCL>
    `, 'text/xml');
        onConfirmSpy = (_description, _id) => { };
        onCancelSpy = () => { };
        element = await fixture(html `<description-dialog></description-dialog>`);
        element.doc = mockDoc;
        element.onConfirm = onConfirmSpy;
        element.onCancel = onCancelSpy;
        await element.updateComplete;
        element.show();
        await element.updateComplete;
    });
    afterEach(() => {
        localStorage.clear();
        element.close();
    });
    it('should show only description field when id setting is random', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'random');
        element.show();
        await element.updateComplete;
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        const idField = element.shadowRoot.querySelector('#lnode-type-id');
        expect(descriptionField).to.not.equal(null);
        expect(idField).to.equal(null);
    });
    it('should show both description and id fields when id setting is user', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'user');
        element.show();
        await element.updateComplete;
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        const idField = element.shadowRoot.querySelector('#lnode-type-id');
        expect(descriptionField).to.not.equal(null);
        expect(idField).to.not.equal(null);
    });
    it('should validate required description field', async () => {
        const confirmButton = element.shadowRoot.querySelector('#confirm-button');
        confirmButton.click();
        await element.updateComplete;
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        expect(descriptionField.error).to.equal(true);
        expect(descriptionField.errorText).to.equal('Not a valid description.');
    });
    it('should call onConfirm with description when valid', async () => {
        let capturedDescription;
        let capturedId;
        element.onConfirm = (description, id) => {
            capturedDescription = description;
            capturedId = id;
        };
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        descriptionField.value = 'Test Description';
        const confirmButton = element.shadowRoot.querySelector('#confirm-button');
        confirmButton.click();
        expect(capturedDescription).to.equal('Test Description');
        expect(capturedId).to.equal(undefined);
    });
    it('should validate id field when shown and invalid', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'user');
        element.show();
        await element.updateComplete;
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        const idField = element.shadowRoot.querySelector('#lnode-type-id');
        descriptionField.value = 'Test Description';
        idField.value = 'invalid id with spaces';
        const confirmButton = element.shadowRoot.querySelector('#confirm-button');
        confirmButton.click();
        await element.updateComplete;
        expect(idField.error).to.equal(true);
        expect(idField.errorText).to.equal('Not a valid id.');
    });
    it('should detect duplicate id', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'user');
        element.show();
        await element.updateComplete;
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        const idField = element.shadowRoot.querySelector('#lnode-type-id');
        descriptionField.value = 'Test Description';
        idField.value = 'existing-id';
        const confirmButton = element.shadowRoot.querySelector('#confirm-button');
        confirmButton.click();
        await element.updateComplete;
        expect(idField.error).to.equal(true);
        expect(idField.errorText).to.equal('LNodeType id already in use.');
    });
    it('should call onConfirm with both description and id when valid', async () => {
        localStorage.setItem('template-generator-lnodetype-id-setting', 'user');
        element.show();
        await element.updateComplete;
        let capturedDescription;
        let capturedId;
        element.onConfirm = (description, id) => {
            capturedDescription = description;
            capturedId = id;
        };
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        const idField = element.shadowRoot.querySelector('#lnode-type-id');
        descriptionField.value = 'Test Description';
        idField.value = 'valid-new-id';
        const confirmButton = element.shadowRoot.querySelector('#confirm-button');
        confirmButton.click();
        expect(capturedDescription).to.equal('Test Description');
        expect(capturedId).to.equal('valid-new-id');
    });
    it('should clear fields on cancel', async () => {
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        descriptionField.value = 'Some text';
        const cancelButton = element.shadowRoot.querySelector('#cancel-button');
        cancelButton.click();
        await element.updateComplete;
        expect(descriptionField.value).to.equal('');
    });
    it('should reset error text on input', async () => {
        const confirmButton = element.shadowRoot.querySelector('#confirm-button');
        confirmButton.click();
        await element.updateComplete;
        const descriptionField = element.shadowRoot.querySelector('#lnode-type-description');
        expect(descriptionField.error).to.equal(true);
        descriptionField.value = 'Valid description';
        const inputEvent = new Event('input');
        descriptionField.dispatchEvent(inputEvent);
        await element.updateComplete;
        expect(descriptionField.error).to.equal(false);
        expect(descriptionField.errorText).to.equal('');
    });
});
//# sourceMappingURL=description-dialog.spec.js.map