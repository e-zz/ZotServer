
import EndpointInterface from '../types/EndpointInterface';


// @todo: consider auth login through abstract class
export default class Selected implements EndpointInterface {
    // @todo: move those into either decorators or interface
    supportedMethods = ['GET'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init() {
        // @todo: validate request data
        const items = await this.getSelected();

        // @todo: improve response handing
        return [200, 'application/json', JSON.stringify(items)];
    }

    private getSelected() {

        // Get the Zotero Pane to interact with the Zotero UI
        const ZoteroPane = Zotero.getActiveZoteroPane();

        // Then grab the currently selected items from the Zotero pane:
        const selectedItems = ZoteroPane.getSelectedItems();

        // Map each selected item to a new object that includes the attachment paths
        const itemsWithAttachments = selectedItems.reduce((acc: any[], item: any) => {
            // Skip notes
            if (item.isNote()) {
                return acc;
            }

            // Get BBT citation key
            const citationKey = item.getField('citationKey');

            // Get baseName
            const baseName = Zotero.Attachments.getFileBaseNameFromItem(item);

            // Get attachment paths
            let attachments = [];
            if (item.isRegularItem()) {
                const attachmentIDs = item.getAttachments();
                attachments = attachmentIDs.map((id: any) => Zotero.Items.get(id)).filter(Boolean);
            }

            // Add item to accumulator
            acc.push({ item, citationKey, attachments, aux: { baseName } });

            return acc;
        }, []);

        console.log("Items with attachments: ", itemsWithAttachments);

        // Return the new array
        return itemsWithAttachments;
    }
}
