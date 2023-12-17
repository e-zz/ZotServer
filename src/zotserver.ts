import Search from './endpoints/Search';
import Selected from './endpoints/Selected';
import Fsearch from './endpoints/Collection';
import getAtta from './endpoints/Attachment';

export default class ZotServer {

    public start() {
        Zotero.Server.Endpoints['/zotserver/search'] = Search
        Zotero.Server.Endpoints['/zotserver/fsearch'] = Fsearch
        Zotero.Server.Endpoints['/zotserver/getFile'] = getAtta
        Zotero.Server.Endpoints['/zotserver/selected'] = Selected
    }

}
