module.exports = {
    "extends": ["standard", "plugin:jest/recommended"],
    "plugins": ["jest"],
    "env": {
        "browser": false,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    }
};
