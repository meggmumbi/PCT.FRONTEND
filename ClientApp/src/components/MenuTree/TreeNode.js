export default class TreeNode {
    constructor(props) {
        this.root = props.root;
        this.id = props.id;
        this.name = props.name;
        this.children = props.children || [];
    }

    traverse(callback) {
        function goThrough(node) {
            callback(node);
            node.children.forEach((child) => {
                goThrough(child);
            });
        }
        if (this.root) {
            goThrough(this.root);
        } else {
            goThrough(this);
        }
    }

    hasChild(id) {
        return this.children.reduce((prev, curr) => prev && curr.id === id, false);
    }

    addNode(value, parentId) {
        if (this.search(value.id) !== null) return this;

        const newNode = new TreeNode({
            ...value,
            root: this.root || this
        });

        if (this.root === null) {
            this.root = newNode;
            return this;
        }

        this.traverse((node) => {
            if (node.id === parentId) {
                node.children.push(newNode);
            }
        });
        return this;
    }

    addChildren(values, parentId) {
        values.map((value) => this.addNode(value, parentId));
        return this;
    }

    removeNode(value) {
        this.traverse((node) => {
            node.children.forEach((childNode, index) => {
                if (childNode.id === value.id) {
                    node.children.splice(index, 1);
                }
            });
        });
        return this;
    }

    search(id) {
        let returnNode = null;
        this.traverse((node) => {
            if (node.id === id) {
                returnNode = node;
            }
        });
        return returnNode;
    }

    searchByName(name) {
        let returnNode = null;
        this.traverse((node) => {
            if (node.name.includes(name)) {
                returnNode = node;
            }
        });
        return returnNode;
    }

    displayLeafs(parent) {
        const parentNode =
            typeof parent === "string" ? this.search(parent) : parent;
        if (!parentNode) return [];

        const leafsRet = [];

        if (parentNode.children && !parentNode.children.length) {
            return [parentNode];
        }

        parentNode.children.forEach((child) => leafsRet.push(child));

        return leafsRet.flat();
    }
}
