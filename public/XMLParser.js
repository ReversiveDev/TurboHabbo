

export class XMLParser {

    static toJSON(xml) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(xml, 'text/xml');
        let children = doc.documentElement.childNodes;
        let root = {};
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let name = child.nodeName;
            if (name == '#text' || name == '#comment') continue;
            if (name === 'asset') {
                let attributes = child.attributes;
                if (!root[name]) {
                    root[name] = {};
                }
                let obj = root[name][child.getAttribute("name")] = {};
                for (let attribute of attributes) {
                    if (attribute.name === 'name') continue;
                    obj[attribute.name] = attribute.value;
                }
            } else if (name == 'graphics') {
                let visualizations = child.childNodes;
                name = "visualization";
                root[name] = {};
                for (let visualization of visualizations) {
                    if(visualization.nodeName == '#text' || visualization.nodeName == '#comment') continue;
                    let obj = root[name][visualization.getAttribute("size")] = {};
                    let attributes = visualization.attributes;
                    for (let attribute of attributes) {
                        if (attribute.name === 'size') continue;
                        obj[attribute.name] = attribute.value;
                    }
                }
            }
        }
        return root;
    }

}