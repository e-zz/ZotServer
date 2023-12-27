import Get from './endpoints/Get';
import Search from './endpoints/Search';
import Selected from './endpoints/Selected';

export default class ZotServer {

    public start() {
        Zotero.Server.Endpoints['/zotserver/get'] = Get
        Zotero.Server.Endpoints['/zotserver/search'] = Search
        Zotero.Server.Endpoints['/zotserver/selected'] = Selected
    }

}
