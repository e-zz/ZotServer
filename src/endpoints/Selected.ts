
import EndpointInterface from '../types/EndpointInterface';

// @todo: consider auth login through abstract class
export default class Selected implements EndpointInterface {
    // @todo: move those into either decorators or interface
    supportedMethods = ['GET'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init(request: any) {
        // @todo: validate request data
        const items = await this.getSelected(request.data);

        // @todo: improve response handing
        return [200, 'application/json', JSON.stringify(items)];
    }

    private getSelected(conditions: any[]) {

        // Get the Zotero Pane to interact with the Zotero UI
        var ZoteroPane = Zotero.getActiveZoteroPane();

        // Then grab the currently selected items from the Zotero pane:
        var selectedItems = ZoteroPane.getSelectedItems();

        // Map each selected item to a new object that includes the attachment paths
        var itemsWithAttachments = selectedItems.map(item => {
            // Skip notes
            if (item.isNote()) {
                return null;
            }

            // Get attachment paths
            var attachmentPaths = [];
            if (item.isRegularItem()) {
                let attachmentIDs = item.getAttachments();
                let attachmentObjects = attachmentIDs.map(id => {
                    let attachment = Zotero.Items.get(id);
                    return attachment ? { [id]: attachment.attachmentPath } : null;
                }).filter(path => path !== null); // Remove any null paths
                attachmentPaths = Object.assign({}, ...attachmentObjects);
            }

            return { item, attachmentPaths };

        }).filter(item => item !== null); // Remove any null items

        console.log("Items with attachments: ", itemsWithAttachments);

        // Return the new array
        return itemsWithAttachments;
    }
}
