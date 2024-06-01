
import EndpointInterface from '../types/EndpointInterface';
// import * as url from 'url';


// @todo: consider auth login through abstract class
export default class Get implements EndpointInterface {
    // @todo: move those into either decorators or interface
    supportedMethods = ['POST'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init(request: any) {
        // @todo: validate request data

        // REFA support get?keys=...
        // const urlObject = new URL(request.url, 'http://localhost');
        // const key = urlObject.searchParams.get('key');
        // if (key) {
        const items = await this.getByKeys(request.data);
        return [200, 'application/json', JSON.stringify(items)];
        // }
        // @todo: improve response handing
    }

    private async getByKeys(keys: string[]) {

        // TODO test multiple keys
        var s = new Zotero.Search();
        s.libraryID = Zotero.Libraries.userLibraryID;

        if (Array.isArray(keys)) {
            s.addCondition("joinMode", "any");
            for (const key of keys) {
                s.addCondition('key', 'is', key);
            }
            let items = await s.search();
            items = await Zotero.Items.getAsync(items);
            // Map each selected item to a new object that includes the attachment paths
            const itemsWithAttachments = items.reduce((acc: any[], item: any) => {
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
}