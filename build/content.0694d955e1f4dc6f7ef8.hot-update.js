webpackHotUpdate("content",{

/***/ "./src/js/snippet_tooltip.js":
/*!***********************************!*\
  !*** ./src/js/snippet_tooltip.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _Users_yusenwang_Desktop_DejaWu_node_modules_redbox_react_lib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/redbox-react/lib/index.js */ \"./node_modules/redbox-react/lib/index.js\");\n/* harmony import */ var _Users_yusenwang_Desktop_DejaWu_node_modules_redbox_react_lib_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_yusenwang_Desktop_DejaWu_node_modules_redbox_react_lib_index_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_catch_errors_lib_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/react-transform-catch-errors/lib/index.js */ \"./node_modules/react-transform-catch-errors/lib/index.js\");\n/* harmony import */ var _Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_catch_errors_lib_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_catch_errors_lib_index_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_hmr_lib_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/react-transform-hmr/lib/index.js */ \"./node_modules/react-transform-hmr/lib/index.js\");\n/* harmony import */ var _Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_hmr_lib_index_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_hmr_lib_index_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! reactstrap */ \"./node_modules/reactstrap/es/index.js\");\n/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-icons/fa */ \"./node_modules/react-icons/fa/index.js\");\n/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_icons_fa__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\nvar _jsxFileName = '/Users/yusenwang/Desktop/DejaWu/src/js/snippet_tooltip.js';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar _components = {\n    Tooltip: {\n        displayName: 'Tooltip'\n    }\n};\n\nvar _UsersYusenwangDesktopDejaWuNode_modulesReactTransformHmrLibIndexJs2 = _Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_hmr_lib_index_js__WEBPACK_IMPORTED_MODULE_3___default()({\n    filename: '/Users/yusenwang/Desktop/DejaWu/src/js/snippet_tooltip.js',\n    components: _components,\n    locals: [module],\n    imports: [react__WEBPACK_IMPORTED_MODULE_2___default.a]\n});\n\nvar _UsersYusenwangDesktopDejaWuNode_modulesReactTransformCatchErrorsLibIndexJs2 = _Users_yusenwang_Desktop_DejaWu_node_modules_react_transform_catch_errors_lib_index_js__WEBPACK_IMPORTED_MODULE_1___default()({\n    filename: '/Users/yusenwang/Desktop/DejaWu/src/js/snippet_tooltip.js',\n    components: _components,\n    locals: [],\n    imports: [react__WEBPACK_IMPORTED_MODULE_2___default.a, _Users_yusenwang_Desktop_DejaWu_node_modules_redbox_react_lib_index_js__WEBPACK_IMPORTED_MODULE_0___default.a]\n});\n\nfunction _wrapComponent(id) {\n    return function (Component) {\n        return _UsersYusenwangDesktopDejaWuNode_modulesReactTransformHmrLibIndexJs2(_UsersYusenwangDesktopDejaWuNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);\n    };\n}\n\n\n\n\n\nfunction saveSnippet() {\n    console.log(\"save snippet\");\n}\n\nfunction cancel() {\n    console.log(\"cancel\");\n}\n\nvar Tooltip = _wrapComponent('Tooltip')(function (_React$Component) {\n    _inherits(Tooltip, _React$Component);\n\n    function Tooltip(props) {\n        _classCallCheck(this, Tooltip);\n\n        // Setting `active` state property from props.\n        var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, props));\n\n        _this.state = {\n            active: props.active\n        };\n\n        // As we are passing this function as event handler, we need bind context,\n        // to get access to `this` inside this function.\n        _this.handleCloseClick = _this.handleCloseClick.bind(_this);\n        return _this;\n    }\n\n    _createClass(Tooltip, [{\n        key: 'componentWillReceiveProps',\n        value: function componentWillReceiveProps(nextProps) {\n            // When we will provide `active` variable via props, we will automatically set it to state.\n            if (nextProps.active !== this.props.active) {\n                this.setState({\n                    active: nextProps.active\n                });\n            }\n        }\n    }, {\n        key: 'handleCloseClick',\n        value: function handleCloseClick() {\n            // On clicking `close` button, setting `active` state variable to `false`,\n            // it forces component to rerender with new state.\n            this.setState({\n                active: false\n            });\n        }\n    }, {\n        key: 'render',\n        value: function render() {\n            console.log(\"rendered\");\n            var active = this.state.active;\n\n            return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\n                reactstrap__WEBPACK_IMPORTED_MODULE_4__[\"ButtonGroup\"],\n                {\n                    __source: {\n                        fileName: _jsxFileName,\n                        lineNumber: 51\n                    },\n                    __self: this\n                },\n                react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\n                    reactstrap__WEBPACK_IMPORTED_MODULE_4__[\"Button\"],\n                    { onClick: saveSnippet, __source: {\n                            fileName: _jsxFileName,\n                            lineNumber: 52\n                        },\n                        __self: this\n                    },\n                    react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_5__[\"FaCheck\"], {\n                        __source: {\n                            fileName: _jsxFileName,\n                            lineNumber: 52\n                        },\n                        __self: this\n                    })\n                ),\n                react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\n                    reactstrap__WEBPACK_IMPORTED_MODULE_4__[\"Button\"],\n                    { onClick: this.handleCloseClick, __source: {\n                            fileName: _jsxFileName,\n                            lineNumber: 53\n                        },\n                        __self: this\n                    },\n                    react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_5__[\"FaTimes\"], {\n                        __source: {\n                            fileName: _jsxFileName,\n                            lineNumber: 53\n                        },\n                        __self: this\n                    })\n                )\n            );\n        }\n    }]);\n\n    return Tooltip;\n}(react__WEBPACK_IMPORTED_MODULE_2___default.a.Component));\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Tooltip);\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvc25pcHBldF90b29sdGlwLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9qcy9zbmlwcGV0X3Rvb2x0aXAuanM/N2QzYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25Hcm91cCB9IGZyb20gJ3JlYWN0c3RyYXAnO1xuaW1wb3J0IHsgRmFDaGVjayAsIEZhVGltZXN9IGZyb20gJ3JlYWN0LWljb25zL2ZhJztcblxuZnVuY3Rpb24gc2F2ZVNuaXBwZXQoKXtcbiAgICBjb25zb2xlLmxvZyhcInNhdmUgc25pcHBldFwiKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKCl7XG4gICAgY29uc29sZS5sb2coXCJjYW5jZWxcIik7XG59XG5cblxuXG5cbmNsYXNzIFRvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICAvLyBTZXR0aW5nIGBhY3RpdmVgIHN0YXRlIHByb3BlcnR5IGZyb20gcHJvcHMuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBhY3RpdmU6IHByb3BzLmFjdGl2ZSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcyB3ZSBhcmUgcGFzc2luZyB0aGlzIGZ1bmN0aW9uIGFzIGV2ZW50IGhhbmRsZXIsIHdlIG5lZWQgYmluZCBjb250ZXh0LFxuICAgICAgICAvLyB0byBnZXQgYWNjZXNzIHRvIGB0aGlzYCBpbnNpZGUgdGhpcyBmdW5jdGlvbi5cbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZUNsaWNrID0gdGhpcy5oYW5kbGVDbG9zZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8gV2hlbiB3ZSB3aWxsIHByb3ZpZGUgYGFjdGl2ZWAgdmFyaWFibGUgdmlhIHByb3BzLCB3ZSB3aWxsIGF1dG9tYXRpY2FsbHkgc2V0IGl0IHRvIHN0YXRlLlxuICAgICAgICBpZiAobmV4dFByb3BzLmFjdGl2ZSAhPT0gdGhpcy5wcm9wcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGFjdGl2ZTogbmV4dFByb3BzLmFjdGl2ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBoYW5kbGVDbG9zZUNsaWNrKCkge1xuICAgICAgICAvLyBPbiBjbGlja2luZyBgY2xvc2VgIGJ1dHRvbiwgc2V0dGluZyBgYWN0aXZlYCBzdGF0ZSB2YXJpYWJsZSB0byBgZmFsc2VgLFxuICAgICAgICAvLyBpdCBmb3JjZXMgY29tcG9uZW50IHRvIHJlcmVuZGVyIHdpdGggbmV3IHN0YXRlLlxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyZWRcIilcbiAgICAgICAgY29uc3QgeyBhY3RpdmUgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8QnV0dG9uR3JvdXA+XG4gICAgICAgICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtzYXZlU25pcHBldH0+PEZhQ2hlY2sgLz48L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xvc2VDbGlja30+PEZhVGltZXMgLz48L0J1dHRvbj5cbiAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XG4gICAgICAgIClcbiAgICAgICAgO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG9vbHRpcDsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFLQTtBQUFBO0FBQ0E7QUFFQTtBQUhBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQVZBO0FBV0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7OztBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZBO0FBTUE7Ozs7QUF6Q0E7QUFDQTtBQTJDQTtBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/snippet_tooltip.js\n");

/***/ })

})