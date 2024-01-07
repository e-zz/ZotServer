
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
            const itemsWithAttachments = items.map((item: any) => {
                // Skip notes
                if (item.isNote()) {
                    return null;
                }

                // Get BBT citation key
                let citationKey = item.getField('citationKey');

                // Get attachment paths
                let attachments = [];
                if (item.isRegularItem()) {
                    const attachmentIDs = item.getAttachments();
                    attachments = attachmentIDs.map((id: any) => {
                        const attachment = Zotero.Items.get(id);
                        return attachment
                    }).filter((path: any) => path !== null); // Remove any null paths
                }

                return { item, citationKey, attachments };

            }).filter((item: { item: any, citationKey: string | undefined, attachments: any[] }) => item !== null); // Remove any null items

            console.log("Items with attachments: ", itemsWithAttachments);

            // Return the new array
            return itemsWithAttachments;
        }
    }
}