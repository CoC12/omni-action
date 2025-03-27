class ViewBinding {

    /**
     * Creates a new instance of ViewBinding.
     *
     * @param {Element} root - The root element of the view.
     * @returns {ViewBinding} A new instance of ViewBinding.
     */
    constructor(root) {
        this.root = root;
        this.bindingMap = {};
        return new Proxy(this, ViewBinding.proxyHandler);
    }

    /**
     * A proxy handler for the ViewBinding class.
     */
    static proxyHandler = {
        get: (target, prop, receiver) => {
            if (prop in target) {
                return target[prop];
            }

            let element = target.bindingMap[prop];
            if (!element) {
                element = target.root.querySelector(`[data-bind="${prop}"`)
                target.bindingMap[prop] = element;
            }
            return element;
        }
    }
}
