// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"pages/bot-view.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vuex = require("vuex");

var _axios = _interopRequireDefault(require("axios"));

var _alert = _interopRequireDefault(require("../alert.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  data: function data() {
    return {
      bot: undefined,
      comments: [],
      comment_content: "",
      lastError: "",
      stats: {},
      bot_id: "",
      likeCount: 0,
      likes: []
    };
  },
  mounted: function mounted() {
    this.bot_id = this.$route.params.id;
    this.fetchBot();
    this.fetchComments();
    this.fetchStats();
    this.fetchLikes();
  },
  methods: {
    fetchBot: function fetchBot() {
      var _this = this;

      _axios.default.get("/api/bot/".concat(this.bot_id)).then(function (res) {
        _this.bot = res.data.bot;
      });
    },
    fetchComments: function fetchComments() {
      var _this2 = this;

      _axios.default.get("/api/bot/comments/".concat(this.bot_id)).then(function (res) {
        _this2.comments = res.data.comments;
      });
    },
    fetchStats: function fetchStats() {
      var _this3 = this;

      _axios.default.get("/api/bot/stats/".concat(this.bot_id)).then(function (res) {
        _this3.stats = res.data.stats;
      });
    },
    fetchLikes: function fetchLikes() {
      var _this4 = this;

      _axios.default.get("/api/bot/likes/".concat(this.bot_id)).then(function (res) {
        _this4.likeCount = res.data.likes.length;
        _this4.likes = res.data.likes;
      });
    },
    postComment: function postComment() {
      var _this5 = this;

      _axios.default.post("/api/bot/comments/".concat(this.bot_id), {
        content: this.comment_content
      }).then(function (res) {
        if (res.data.msg) {
          _this5.fetchComments();

          _this5.comment_content = "";
          _this5.lastError = "";
        } else {
          _this5.lastError = res.data.error;
        }
      });
    },
    like: function like() {
      var _this6 = this;

      if (this.hasLiked) {
        _axios.default.delete("/api/bot/likes/".concat(this.bot_id)).then(function (res) {
          _this6.fetchLikes();
        });
      } else {
        _axios.default.post("/api/bot/likes/".concat(this.bot_id)).then(function (res) {
          _this6.fetchLikes();
        });
      }
    }
  },
  computed: _objectSpread({
    hasPermissions: function hasPermissions() {
      return this.session && this.bot ? this.session._id === this.bot.owner_id : false;
    },
    hasLiked: function hasLiked() {
      var _this7 = this;

      return this.likes.filter(function (like) {
        return like.author_id === _this7.session._id;
      })[0];
    }
  }, (0, _vuex.mapState)(["session", "isLoggedIn"]))
};
exports.default = _default;
        var $8d862b = exports.default || module.exports;
      
      if (typeof $8d862b === 'function') {
        $8d862b = $8d862b.options;
      }
    
        /* template */
        Object.assign($8d862b, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container", attrs: { id: "mainBotView" } }, [
    _vm.bot
      ? _c("div", { staticClass: "card is-shadow" }, [
          _c("div", { staticClass: "card-image has-text-centered" }, [
            _c("img", {
              staticClass: "is-rounded",
              attrs: {
                id: "avatar",
                alt: "Bot Avatar",
                src: _vm.bot.user.avatarURL,
                width: "256",
                height: "256"
              }
            })
          ]),
          _c("div", { staticClass: "card-content has-text-centered" }, [
            _c(
              "label",
              { staticClass: "title" },
              [
                _vm._v(
                  _vm._s(_vm.bot.user.username) +
                    " (" +
                    _vm._s(_vm.likeCount) +
                    " likes)  "
                ),
                _vm.isLoggedIn
                  ? [
                      _c(
                        "a",
                        { on: { click: _vm.like } },
                        [
                          _c("font-awesome-icon", {
                            class: { liked: _vm.hasLiked },
                            attrs: { icon: "thumbs-up", id: "likeButton" }
                          })
                        ],
                        1
                      )
                    ]
                  : _vm._e()
              ],
              2
            ),
            _c("br"),
            _c("div", { staticClass: "field is-grouped" }, [
              _c("div", { staticClass: "control" }, [
                _c("br"),
                _c("span", { staticClass: "tag tag-first" }, [_vm._v("Owner")]),
                _c("a", { staticClass: "tag tag-second is-info" }, [
                  _vm._v(_vm._s(_vm.bot.owner.tag))
                ])
              ]),
              _c("div", { staticClass: "control" }, [
                _c("br"),
                _c("span", { staticClass: "tag tag-first" }, [
                  _vm._v("Prefix")
                ]),
                _c("a", { staticClass: "tag is-info tag-second" }, [
                  _vm._v(_vm._s(_vm.bot.prefix))
                ])
              ])
            ]),
            _vm.stats
              ? _c("div", { staticClass: "field is-grouped" }, [
                  _vm.stats.guilds
                    ? _c("div", { staticClass: "control" }, [
                        _c("br"),
                        _c("span", { staticClass: "tag tag-first" }, [
                          _vm._v("Guilds")
                        ]),
                        _c("a", { staticClass: "tag tag-second is-info" }, [
                          _vm._v(_vm._s(_vm.stats.guilds))
                        ])
                      ])
                    : _vm._e(),
                  _vm.stats.channels
                    ? _c("div", { staticClass: "control" }, [
                        _c("br"),
                        _c("span", { staticClass: "tag tag-first" }, [
                          _vm._v("Channels")
                        ]),
                        _c("a", { staticClass: "tag tag-second is-info" }, [
                          _vm._v(_vm._s(_vm.stats.channels))
                        ])
                      ])
                    : _vm._e(),
                  _vm.stats.users
                    ? _c("div", { staticClass: "control" }, [
                        _c("br"),
                        _c("span", { staticClass: "tag tag-first" }, [
                          _vm._v("users")
                        ]),
                        _c("a", { staticClass: "tag tag-second is-info" }, [
                          _vm._v(_vm._s(_vm.stats.users))
                        ])
                      ])
                    : _vm._e()
                ])
              : _vm._e(),
            _c("div", { staticClass: "control" }, [
              _c("br"),
              _c(
                "div",
                { staticClass: "buttons is-centered" },
                [
                  _c(
                    "a",
                    {
                      staticClass: "button is-dark",
                      attrs: { href: _vm.bot.invite_link }
                    },
                    [_vm._v("Invite")]
                  ),
                  _c(
                    "a",
                    {
                      staticClass: "button is-dark",
                      attrs: { href: _vm.bot.website_link }
                    },
                    [_vm._v("Website")]
                  ),
                  _vm.hasPermissions
                    ? _c(
                        "router-link",
                        {
                          staticClass: "button is-dark",
                          attrs: { to: "/bot/" + _vm.bot.bot_id + "/edit" }
                        },
                        [_vm._v("Edit")]
                      )
                    : _vm._e()
                ],
                1
              )
            ]),
            _c("br"),
            _c("div", { staticClass: "message has-text-centered" }, [
              _c("div", { staticClass: "message-header text-center" }, [
                _vm._v("Description")
              ]),
              _c("div", {
                staticClass: "message-body",
                attrs: { id: "description" },
                domProps: { innerHTML: _vm._s(_vm.bot._description) }
              })
            ])
          ])
        ])
      : _vm._e(),
    _c("br"),
    _c("div", { staticClass: "container" }, [
      _c("div", { staticClass: "card is-shadow" }, [
        _vm._m(0),
        _c(
          "div",
          { staticClass: "card-content" },
          [
            _c("div", { staticClass: "field" }, [
              _vm.lastError
                ? _c("div", { staticClass: "notification is-danger" }, [
                    _vm._v(_vm._s(_vm.lastError))
                  ])
                : _vm._e()
            ]),
            _vm.isLoggedIn
              ? _c("div", { staticClass: "field has-addons" }, [
                  _c("div", { staticClass: "control is-expanded" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.comment_content,
                          expression: "comment_content"
                        }
                      ],
                      staticClass: "input",
                      attrs: {
                        type: "text",
                        placeholder: "Message content here."
                      },
                      domProps: { value: _vm.comment_content },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.comment_content = $event.target.value
                        }
                      }
                    })
                  ]),
                  _c("div", { staticClass: "control" }, [
                    _c(
                      "a",
                      {
                        staticClass: "button is-info",
                        on: { click: _vm.postComment }
                      },
                      [_vm._v("Comment")]
                    )
                  ])
                ])
              : _vm._e(),
            _vm._l(_vm.comments, function(comment) {
              return _c("div", { staticClass: "media" }, [
                _c("div", { staticClass: "media-left" }, [
                  _c("label", { staticClass: "image is-64x64" }, [
                    _c("img", {
                      staticClass: "is-rounded",
                      attrs: { src: comment.author.displayAvatarURL }
                    })
                  ])
                ]),
                _c("div", { staticClass: "media-content" }, [
                  _c(
                    "div",
                    { staticClass: "content" },
                    [
                      _c(
                        "router-link",
                        { attrs: { to: "/profile/" + comment.author_id } },
                        [
                          _c("strong", [
                            _vm._v(_vm._s(comment.author.username) + " ")
                          ])
                        ]
                      ),
                      _c("label", [
                        _vm._v(_vm._s(comment.readableCommentDate))
                      ]),
                      _c("br"),
                      _c("label", [_vm._v(_vm._s(comment.content))]),
                      _c("br")
                    ],
                    1
                  )
                ])
              ])
            })
          ],
          2
        )
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "card-header" }, [
      _c("label", { staticClass: "card-header-title" }, [_vm._v("Comments")])
    ])
  }
]
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$8d862b', $8d862b);
          } else {
            api.reload('$8d862b', $8d862b);
          }
        }

        
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
      }
    })();
},{"vuex":"../../../node_modules/vuex/dist/vuex.esm.js","axios":"../../../node_modules/axios/index.js","../alert.js":"alert.js","_css_loader":"../../../../../../../AppData/Roaming/npm/node_modules/parcel/src/builtins/css-loader.js","vue-hot-reload-api":"../../../node_modules/vue-hot-reload-api/dist/index.js","vue":"../../../node_modules/vue/dist/vue.runtime.esm.js"}],"../../../../../../../AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50832" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/bot-view.53b53c37.js.map