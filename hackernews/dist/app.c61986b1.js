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
})({"app.ts":[function(require,module,exports) {
var container = document.getElementById('root');
var ajax = new XMLHttpRequest(); //서버와의 통신-ajax

var content = document.createElement('div');
var NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
var CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'; //@id = 마킹 -> 임의로 적고 나중에 바꿀 부분

var store = {
  currentPage: 1,
  feeds: []
};

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send(); //응답값을 객체로 바꾸기

  return JSON.parse(ajax.response);
} //읽었냐 안읽었냐 확인 함수


function makeFeeds(feeds) {
  for (var i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
} //라우터에서 해당 함수로 글 목록 불러옴


function newsFeed() {
  // const newsFeed= getData(NEWS_URL)
  var newsFeed = store.feeds; //읽음을 나타내기위해 전역변수로 쓰이는 store안에 feeds를 넣음
  //그리고 출력되는애를 store의 feed로 이관했는데 일단 store.feeds는 비어있으니까 안무거도 안뜸
  //최초의 한번은 getData로 불러와야함

  var newsList = []; //template구조로 코드를 짜면 직관적으로 UI구조 파악에 쉬움
  //마킹된 위치로 어떤 데이터가 어디 들어갈지도 파악 가능

  var template = "\n    <div class=\"bg-gray-600 min-h-screen\">\n      <div class=\"bg-white text-xl\">\n        <div class=\"mx-auto px-4\">\n          <div class=\"flex justify-between items-center py-6\">\n            <div class=\"flex justify-start\">\n              <h1 class=\"font-extrabold\">Hacker News</h1>\n            </div>\n            <div class=\"items-center justify-end\">\n              <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n                < Previous\n              </a>\n              <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n                Next >\n              </a>\n            </div>\n          </div> \n        </div>\n      </div>\n      <div class=\"p-4 text-2xl text-gray-700\">\n        {{__news_feed__}}        \n      </div>\n    </div>\n    "; //최초로 피드 읽어오는 코드

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(getData(NEWS_URL));
  } // newsList.push('<ul>')
  //template에는 구조와 데이터 위치만


  for (var i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // const div=document.createElement('div');
    newsList.push("\n        <div class=\"p-6 ".concat(newsFeed[i].read ? 'bg-gray-300' : 'bg-white', " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-blue-50\">\n        <div class=\"flex\">\n          <div class=\"flex-auto\">\n            <a href=\"#/show/").concat(newsFeed[i].id, "\">").concat(newsFeed[i].title, "</a>  \n          </div>\n          <div class=\"text-center text-sm\">\n            <div class=\"w-10 text-white bg-blue-400 rounded-full px-0 py-2\">").concat(newsFeed[i].comments_count, "</div>\n          </div>\n        </div>\n        <div class=\"flex mt-3\">\n          <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n            <div><i class=\"fas fa-user mr-1\"></i>").concat(newsFeed[i].user, "</div>\n            <div><i class=\"fas fa-heart mr-1\"></i>").concat(newsFeed[i].points, "</div>\n            <div><i class=\"far fa-clock mr-1\"></i>").concat(newsFeed[i].time_ago, "</div>\n          </div>  \n        </div>\n      </div>    \n        "));
  } //template를 넣는과정에서 계산코드등 삽입 -> 복잡도를 줄일 수 있음


  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1); // newsList.push('</ul>')
  // newsList.push(`
  //     <div>
  //         <a href="#/page/${store.currentPage > 1 ?store.currentPage-1 :1}">이전 페이지</a>
  //         <a href="#/page/${store.currentPage+1}">다음 페이지</a>
  //     </div>
  // `)
  //배열 형태의 newsList를 join를 이용해 하나의 문자열로 만들어 innerHTML로 넣음
  // container.innerHTML=newsList.join('')

  container.innerHTML = template;
} // const ul=document.createElement('ul');


function newsDetail() {
  var id = location.hash.substr(7);
  var newsContent = getData(CONTENT_URL.replace('@id', id)); // const title=this.document.createElement('h1');

  var template = "\n    <div class=\"bg-gray-600 min-h-screen pb-8\">\n      <div class=\"bg-white text-xl\">\n        <div class=\"mx-auto px-4\">\n          <div class=\"flex justify-between items-center py-6\">\n            <div class=\"flex justify-start\">\n              <h1 class=\"font-extrabold\">Hacker News</h1>\n            </div>\n            <div class=\"items-center justify-end\">\n              <a href=\"#/page/".concat(store.currentPage, "\" class=\"text-gray-500\">\n                <i class=\"fa fa-times\"></i>\n              </a>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n        <h2>").concat(newsContent.title, "</h2>\n        <div class=\"text-gray-400 h-20\">\n          ").concat(newsContent.content, "\n        </div>\n\n        {{__comments__}}\n\n      </div>\n    </div>\n  ");

  for (var i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  function makeComment(comments, called) {
    if (called === void 0) {
      called = 0;
    }

    var commentString = [];

    for (var i = 0; i < comments.length; i++) {
      commentString.push("\n        <div style=\"padding-left: ".concat(called * 40, "px;\" class=\"mt-4\">\n          <div class=\"text-gray-400\">\n            <i class=\"fa fa-sort-up mr-2\"></i>\n            <strong>").concat(comments[i].user, "</strong> ").concat(comments[i].time_ago, "\n          </div>\n          <p class=\"text-gray-700\">").concat(comments[i].content, "</p>\n        </div>      \n      "));

      if (comments[i].comments.length > 0) {
        //대댓글 호출할때마다 called변수+1
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join(''); //재귀호출(댓글에 대댓에 끝을 알 수 없는 구조에서 사용)
  }

  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
} // div.innerHTML=`
// <li>
//     <a href="#${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
// </li>
// `
//=
// a.href=`#${newsFeed[i].id}`;
// a.innerHTML=`${newsFeed[i].title}(${newsFeed[i].comments_count})`;
// a.addEventListener('click',function(){})//여러개의 a태그에 다 걸어줘야함+기술적 문제
//앵커태그에 넣은 # = a태그의 name속성과 같은 해쉬 이름이 들어오면 그 위치로 스크롤링됨
//해당 해시가 바꼈을때 발생하는 이벤트 hashchange
// li.appendChild(a);
// ul.appendChild(li);
//ul태그 하위엔 li가 와야하는데 현재 li는 div 안에 있음
// ul.appendChild(div.children[0]);
// const li=document.createElement('li');
// const a=document.createElement('a');
// container.appendChild(ul);
// container.appendChild(content);


function router() {
  var routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener('hashchange', router);
router();
},{}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52074" + '/');

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
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map