
import EndpointInterface from '../types/EndpointInterface';
import { Zotero as ZoteroModel } from '../types/zotero-datamodel';
// import {getAttachmentPath} from '../utils';

type integer = number;

export interface RequestType {
    libraryID: integer
    keys: string[]
}

type ZoteroModelWithFilePath = ZoteroModel.Item.Any & {
    filepath?: string
};

export type ResponseType = {
    [key: string]: ZoteroModelWithFilePath[]
};

// @todo: consider auth login through abstract class
export default class getNote implements EndpointInterface {
    // @todo: move those into either decorators or interface
    supportedMethods = ['POST'];
    supportedDataTypes = ['application/json'];
    permitBookmarklet = false;

    public async init(request: any) {
        // @todo: validate request data
        const searchResults = await this.search(request.data);
        // const items = await Zotero.Items.getAsync(searchResults);
        // @todo: improve response handing
        return [200, 'application/json', JSON.stringify(searchResults)];
    }

    private async search(keys: any[]) {
        // const s = new Zotero.Search();
        const libraryID = Zotero.Libraries.userLibraryID;

        // @todo: make all "everything" queries be "contains"
        // @todo: docs on possible conditions and operators wouldn't hurt here
        // conditions.forEach(({ condition, operator = 'contains', value, required = true}) => {
        //     s.addCondition(condition, operator, value, required)
        // });

        // return s.search();

        const attachmentsMap: ResponseType = {};
        for (const key of keys) {
            console.log("in search", key);

            const item = await Zotero.Items.getByLibraryAndKeyAsync(libraryID, key);
            console.log("in search", item);

            if (!item) {
                throw new Error(`No item with key ${key} exists.`);
            }
            attachmentsMap[key] = [];

            for (const id of item.getNotes()) {
                //     console.log("in search", id);

                const attachment = await Zotero.Items.get(id);
                const noteHTML = attachment.getNote();
                attachmentsMap[key].push(noteHTML);
            }
        }
        return attachmentsMap;

    }
}


/**
 * Return the item data of the attachments of items identified by their key, with the
 * absolute path to the stored attachment files added, so that citation-mining software can extract
 * reference data from them.
 * Expects POST data containing an object with properties `libraryID` and `keys`. Returns  a map of
 * keys and attachment item data.
 */
// export async function endpoint(data: RequestType): Promise<ResponseType> {
// 	const {libraryID, keys} = data;
// 	const attachmentsMap: ResponseType = {};
// 	for (const key of keys) {
// 		const item = await Zotero.Items.getByLibraryAndKeyAsync(libraryID, key);
// 		if (!item) {
// 			throw new Error(`No item with key ${key} exists.`);
// 		}
// 		attachmentsMap[key] = [];
// 		for (const id of item.getAttachments()) {
// 			const attachment = Zotero.Items.get(id);
// 			const itemData = attachment.toJSON() as ZoteroModelWithFilePath;
// 			if (attachment.isFileAttachment()) {
// 				itemData.filepath = await getAttachmentPath(attachment as { getFilePath: () => string });
// 			}
// 			attachmentsMap[key].push(itemData);
// 		}
// 	}
// 	return attachmentsMap;
// }