/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "e3cbef5df1615af99779"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(107)(__webpack_require__.s = 107);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(77);

var _typeof3 = _interopRequireDefault(_typeof2);

var _Event = __webpack_require__(68);

var _Event2 = _interopRequireDefault(_Event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DataSet
 *
 * A data set can:
 * - add/remove/update data
 * - gives triggers upon changes in the data
 * - can  import/export data in various data formats
 * @param {Array} [data]    Optional array with initial data
 * the field geometry is like geojson, it can be:
 * {
 *     "type": "Point",
 *     "coordinates": [125.6, 10.1]
 * }
 * {
 *     "type": "LineString",
 *     "coordinates": [
 *         [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
 *     ]
 * }
 * {
 *     "type": "Polygon",
 *     "coordinates": [
 *         [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
 *           [100.0, 1.0], [100.0, 0.0] ]
 *     ]
 * }
 * @param {Object} [options]   Available options:
 * 
 */
function DataSet(data, options) {

    this._options = options || {};
    this._data = []; // map with data indexed by id

    // add initial data when provided
    if (data) {
        this.add(data);
    }
} /**
   * @author kyle / http://nikai.us/
   */

DataSet.prototype = new _Event2.default();

/**
 * Add data.
 */
DataSet.prototype.add = function (data, senderId) {
    if (Array.isArray(data)) {
        // Array
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].time && data[i].time.length == 14 && data[i].time.substr(0, 2) == '20') {
                var time = data[i].time;
                data[i].time = new Date(time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)).getTime();
            }
            this._data.push(data[i]);
        }
    } else if (data instanceof Object) {
        // Single item
        this._data.push(data);
    } else {
        throw new Error('Unknown dataType');
    }
};

/**
 * get data.
 */
DataSet.prototype.get = function (args) {
    args = args || {};

    //console.time('copy data time')
    var start = new Date();
    // TODO: 不修改原始数据，在数据上挂载新的名称，每次修改数据直接修改新名称下的数据，可以省去deepCopy
    // var data = deepCopy(this._data);
    var data = this._data;

    // console.timeEnd('copy data time')

    // console.time('transferCoordinate time')

    var start = new Date();

    if (args.filter) {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            if (args.filter(data[i])) {
                newData.push(data[i]);
            }
        }
        data = newData;
    }

    if (args.transferCoordinate) {
        data = this.transferCoordinate(data, args.transferCoordinate, args.fromColumn, args.toColumn);
    }

    // console.timeEnd('transferCoordinate time')

    return data;
};

/**
 * set data.
 */
DataSet.prototype.set = function (data) {
    this._set(data);
    this._trigger('change');
};

/**
 * set data.
 */
DataSet.prototype._set = function (data) {
    this.clear();
    this.add(data);
};

/**
 * clear data.
 */
DataSet.prototype.clear = function (args) {
    this._data = []; // map with data indexed by id
};

/**
 * remove data.
 */
DataSet.prototype.remove = function (args) {};

/**
 * update data.
 */
DataSet.prototype.update = function (args) {};

/**
 * transfer coordinate.
 */
DataSet.prototype.transferCoordinate = function (data, transferFn, fromColumn, toColumnName) {

    toColumnName = toColumnName || '_coordinates';
    fromColumn = fromColumn || 'coordinates';

    for (var i = 0; i < data.length; i++) {

        var item = data[i];

        if (data[i].geometry) {

            if (data[i].geometry.type === 'Point') {
                var coordinates = data[i].geometry[fromColumn];
                data[i].geometry[toColumnName] = transferFn(coordinates);
            }

            if (data[i].geometry.type === 'Polygon' || data[i].geometry.type === 'MultiPolygon') {

                var coordinates = data[i].geometry[fromColumn];

                if (data[i].geometry.type === 'Polygon') {

                    var newCoordinates = getPolygon(coordinates);
                    data[i].geometry[toColumnName] = newCoordinates;
                } else if (data[i].geometry.type === 'MultiPolygon') {
                    var newCoordinates = [];
                    for (var c = 0; c < coordinates.length; c++) {
                        var polygon = coordinates[c];
                        var polygon = getPolygon(polygon);
                        newCoordinates.push(polygon);
                    }

                    data[i].geometry[toColumnName] = newCoordinates;
                }
            }

            if (data[i].geometry.type === 'LineString') {
                var coordinates = data[i].geometry[fromColumn];
                var newCoordinates = [];
                for (var j = 0; j < coordinates.length; j++) {
                    newCoordinates.push(transferFn(coordinates[j]));
                }
                data[i].geometry[toColumnName] = newCoordinates;
            }
        }
    }

    function getPolygon(coordinates) {
        var newCoordinates = [];
        for (var c = 0; c < coordinates.length; c++) {
            var coordinate = coordinates[c];
            var newcoordinate = [];
            for (var j = 0; j < coordinate.length; j++) {
                newcoordinate.push(transferFn(coordinate[j]));
            }
            newCoordinates.push(newcoordinate);
        }
        return newCoordinates;
    }

    return data;
};

DataSet.prototype.initGeometry = function (transferFn) {
    if (transferFn) {
        this._data.forEach(function (item) {
            item.geometry = transferFn(item);
        });
    } else {
        this._data.forEach(function (item) {
            if (!item.geometry && item.lng && item.lat) {
                item.geometry = {
                    type: 'Point',
                    coordinates: [item.lng, item.lat]
                };
            }
        });
    }
};

/**
 * 获取当前列的最大值
 */
DataSet.prototype.getMax = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var max = parseFloat(data[0][columnName]);

    for (var i = 1; i < data.length; i++) {
        var value = parseFloat(data[i][columnName]);
        if (value > max) {
            max = value;
        }
    }

    return max;
};

/**
 * 获取当前列的总和
 */
DataSet.prototype.getSum = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var sum = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i][columnName]) {
            sum += parseFloat(data[i][columnName]);
        }
    }

    return sum;
};

/**
 * 获取当前列的最小值
 */
DataSet.prototype.getMin = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var min = parseFloat(data[0][columnName]);

    for (var i = 1; i < data.length; i++) {
        var value = parseFloat(data[i][columnName]);
        if (value < min) {
            min = value;
        }
    }

    return min;
};

function deepCopy(obj) {
    var newObj;
    if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) == 'object') {
        newObj = obj instanceof Array ? [] : {};
        for (var i in obj) {
            newObj[i] = obj[i] instanceof HTMLElement ? obj[i] : deepCopy(obj[i]);
        }
    } else {
        newObj = obj;
    }
    return newObj;
}

exports.default = DataSet;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * @author kyle / http://nikai.us/
 */

/**
 * Category
 * @param {Object} [options]   Available options:
 *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
 */
function Intensity(options) {

    options = options || {};
    this.gradient = options.gradient || {
        0.25: "rgba(0, 0, 255, 1)",
        0.55: "rgba(0, 255, 0, 1)",
        0.85: "rgba(255, 255, 0, 1)",
        1.0: "rgba(255, 0, 0, 1)"
    };
    this.maxSize = options.maxSize || 35;
    this.minSize = options.minSize || 0;
    this.max = options.max || 100;
    this.initPalette();
}

Intensity.prototype.initPalette = function () {

    var gradient = this.gradient;

    if (typeof document === 'undefined') {
        // var Canvas = require('canvas');
        // var paletteCanvas = new Canvas(256, 1);
    } else {
        var paletteCanvas = document.createElement('canvas');
    }

    paletteCanvas.width = 256;
    paletteCanvas.height = 1;

    var paletteCtx = this.paletteCtx = paletteCanvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, 256, 1);
};

Intensity.prototype.getColor = function (value) {

    var max = this.max;

    if (value > max) {
        value = max;
    }

    var index = Math.floor(value / max * (256 - 1)) * 4;

    var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

    return "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", " + imageData[index + 3] / 256 + ")";
};

/**
 * @param Number value 
 * @param Number max of value
 * @param Number max of size
 * @param Object other options
 */
Intensity.prototype.getSize = function (value) {

    var size = 0;
    var max = this.max;
    var maxSize = this.maxSize;
    var minSize = this.minSize;

    if (value > max) {
        value = max;
    }

    size = minSize + value / max * (maxSize - minSize);

    return size;
};

Intensity.prototype.getLegend = function (options) {
    var gradient = this.gradient;

    var paletteCanvas = document.createElement('canvas');

    var width = options.width || 20;
    var height = options.height || 180;

    paletteCanvas.width = width;
    paletteCanvas.height = height;

    var paletteCtx = paletteCanvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, width, height);

    return paletteCanvas;
};

exports.default = Intensity;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(86)
  , defined = __webpack_require__(27);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    drawDataSet: function drawDataSet(context, dataSet, options) {

        var data = dataSet instanceof _DataSet2.default ? dataSet.get() : dataSet;

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            this.draw(context, item, options);
        }
    },
    draw: function draw(context, data, options) {
        var type = data.geometry.type;
        var coordinates = data.geometry._coordinates || data.geometry.coordinates; //
        var symbol = options.symbol || 'circle';
        switch (type) {
            case 'Point':
                var size = data._size || data.size || options._size || options.size || 5;
                if (options.symbol === 'rect') {
                    context.rect(coordinates[0] - size / 2, coordinates[1] - size / 2, size, size);
                } else {
                    context.moveTo(coordinates[0], coordinates[1]);
                    context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
                }
                break;
            case 'LineString':
                for (var j = 0; j < coordinates.length; j++) {
                    var x = coordinates[j][0];
                    var y = coordinates[j][1];
                    if (j == 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                }
                break;
            case 'Polygon':
                this.drawPolygon(context, coordinates);
                break;
            case 'MultiPolygon':
                for (var i = 0; i < coordinates.length; i++) {
                    var polygon = coordinates[i];
                    this.drawPolygon(context, polygon);
                }
                context.closePath();
                break;
            default:
                console.log('type' + type + 'is not support now!');
                break;
        }
    },

    drawPolygon: function drawPolygon(context, coordinates) {

        for (var i = 0; i < coordinates.length; i++) {

            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
        }
    }

}; /**
    * @author kyle / http://nikai.us/
    */

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(19)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(8)
  , createDesc = __webpack_require__(22);
module.exports = __webpack_require__(6) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(18)
  , IE8_DOM_DEFINE = __webpack_require__(48)
  , toPrimitive    = __webpack_require__(36)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(34)('wks')
  , uid        = __webpack_require__(23)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (context) {
    context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //context.canvas.width = context.canvas.width;
    //context.canvas.height = context.canvas.height;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    draw: function draw(context, dataSet, options) {

        context.save();

        var data = dataSet.get();

        var grids = {};

        var size = options._size || options.size || 50;

        var offset = options.offset || {
            x: 0,
            y: 0
        };

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            var gridKey = Math.floor((coordinates[0] - offset.x) / size) + "," + Math.floor((coordinates[1] - offset.y) / size);
            if (!grids[gridKey]) {
                grids[gridKey] = 0;
            }
            grids[gridKey] += ~~(data[i].count || 1);
        }

        for (var gridKey in grids) {
            gridKey = gridKey.split(",");

            var intensity = new _Intensity2.default({
                max: options.max || 100,
                gradient: options.gradient
            });

            context.beginPath();
            context.rect(gridKey[0] * size + .5 + offset.x, gridKey[1] * size + .5 + offset.y, size, size);
            context.fillStyle = intensity.getColor(grids[gridKey]);
            context.fill();
            if (options.showText) {
                context.fillStyle = 'white';
                context.fillText(grids[gridKey], gridKey[0] * size + .5 + offset.x + size / 2, gridKey[1] * size + .5 + offset.y + size / 2);
            }
            if (options.strokeStyle && options.lineWidth) {
                context.stroke();
            }
        }

        context.restore();
    }
}; /**
    * @author kyle / http://nikai.us/
    */

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _colorPalette = __webpack_require__(61);

var _colorPalette2 = _interopRequireDefault(_colorPalette);

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

var _simple = __webpack_require__(5);

var _simple2 = _interopRequireDefault(_simple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCircle(size) {

    if (typeof document === 'undefined') {
        // var Canvas = require('canvas');
        // var circle = new Canvas();
    } else {
        var circle = document.createElement('canvas');
    }
    var context = circle.getContext('2d');
    var shadowBlur = size / 2;
    var r2 = size + shadowBlur;
    var offsetDistance = 10000;

    circle.width = circle.height = r2 * 2;

    context.shadowBlur = shadowBlur;
    context.shadowColor = 'black';
    context.shadowOffsetX = context.shadowOffsetY = offsetDistance;

    context.beginPath();
    context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    return circle;
} /**
   * @author kyle / http://nikai.us/
   */

function colorize(pixels, gradient, options) {

    var maxOpacity = options.maxOpacity || 0.8;
    for (var i = 3, len = pixels.length, j; i < len; i += 4) {
        j = pixels[i] * 4; // get gradient color from opacity value

        if (pixels[i] / 256 > maxOpacity) {
            pixels[i] = 256 * maxOpacity;
        }

        pixels[i - 3] = gradient[j];
        pixels[i - 2] = gradient[j + 1];
        pixels[i - 1] = gradient[j + 2];
    }
}

function drawGray(context, dataSet, options) {

    var max = options.max || 100;
    // console.log(max)
    var size = options._size;
    if (size == undefined) {
        size = options.size;
        if (size == undefined) {
            size = 13;
        }
    }

    var color = new _Intensity2.default({
        gradient: options.gradient,
        max: max
    });

    var circle = createCircle(size);

    var data = dataSet;

    var dataOrderByAlpha = {};

    data.forEach(function (item, index) {
        var count = item.count === undefined ? 1 : item.count;
        var alpha = Math.min(1, count / max).toFixed(2);
        dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
        dataOrderByAlpha[alpha].push(item);
    });

    for (var i in dataOrderByAlpha) {
        if (isNaN(i)) continue;
        var _data = dataOrderByAlpha[i];
        context.beginPath();
        if (!options.withoutAlpha) {
            context.globalAlpha = i;
        }
        _data.forEach(function (item, index) {
            if (!item.geometry) {
                return;
            }

            var coordinates = item.geometry._coordinates || item.geometry.coordinates;
            var type = item.geometry.type;
            if (type === 'Point') {
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circle.width / 2, coordinates[1] - circle.height / 2);
            } else if (type === 'LineString') {
                _simple2.default.draw(context, item, options);
            } else if (type === 'Polygon') {}
        });
        // console.warn(i, i * max, color.getColor(i * max))
        context.strokeStyle = color.getColor(i * max);
        context.stroke();
    }
}

function draw(context, dataSet, options) {
    var strength = options.strength || 0.3;
    context.strokeStyle = 'rgba(0,0,0,' + strength + ')';

    options = options || {};

    var data = dataSet.get();

    context.save();
    //console.time('drawGray')
    drawGray(context, data, options);
    //console.timeEnd('drawGray');
    // return false;
    if (!options.absolute) {
        //console.time('changeColor');
        var colored = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        colorize(colored.data, _colorPalette2.default.getImageData({
            defaultGradient: options.gradient || {
                0.25: "rgba(0, 0, 255, 1)",
                0.55: "rgba(0, 255, 0, 1)",
                0.85: "rgba(255, 255, 0, 1)",
                1.0: "rgba(255, 0, 0, 1)"
            }
        }), options);
        //console.timeEnd('changeColor');
        context.putImageData(colored, 0, 0);

        context.restore();
    }
}

exports.default = {
    draw: draw
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hex_corner(center, size, i) {
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
} /**
   * @author kyle / http://nikai.us/
   */

exports.default = {
    draw: function draw(context, dataSet, options) {

        context.save();

        var data = dataSet.get();

        for (var key in options) {
            context[key] = options[key];
        }

        var grids = {};

        var offset = options.offset || {
            x: 10,
            y: 10
        };

        //
        var r = options._size || options.size || 40;
        r = r / 2 / Math.sin(Math.PI / 3);
        var dx = r * 2 * Math.sin(Math.PI / 3);
        var dy = r * 1.5;

        var binsById = {};

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            var py = (coordinates[1] - offset.y) / dy,
                pj = Math.round(py),
                px = (coordinates[0] - offset.x) / dx - (pj & 1 ? .5 : 0),
                pi = Math.round(px),
                py1 = py - pj;

            if (Math.abs(py1) * 3 > 1) {
                var px1 = px - pi,
                    pi2 = pi + (px < pi ? -1 : 1) / 2,
                    pj2 = pj + (py < pj ? -1 : 1),
                    px2 = px - pi2,
                    py2 = py - pj2;
                if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
            }

            var id = pi + "-" + pj,
                bin = binsById[id];
            if (bin) {
                bin.push(data[i]);
            } else {
                bin = binsById[id] = [data[i]];
                bin.i = pi;
                bin.j = pj;
                bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                bin.y = pj * dy;
            }
        }

        var intensity = new _Intensity2.default({
            max: options.max || 100,
            maxSize: r,
            gradient: options.gradient
        });

        for (var key in binsById) {

            var item = binsById[key];

            context.beginPath();

            for (var j = 0; j < 6; j++) {

                var radius = r;

                var result = hex_corner({
                    x: item.x + offset.x,
                    y: item.y + offset.y
                }, radius, j);
                context.lineTo(result[0], result[1]);
            }
            context.closePath();

            var count = 0;
            for (var i = 0; i < item.length; i++) {
                count += item[i].count || 1;
            }

            context.fillStyle = intensity.getColor(count);
            context.fill();
            if (options.strokeStyle && options.lineWidth) {
                context.stroke();
            }
        }

        context.restore();
    }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _simple = __webpack_require__(5);

var _simple2 = _interopRequireDefault(_simple);

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author kyle / http://nikai.us/
 */

exports.default = {
                draw: function draw(context, dataSet, options) {
                                var data = dataSet instanceof _DataSet2.default ? dataSet.get() : dataSet;
                                // console.log('xxxx',options)
                                context.save();

                                for (var key in options) {
                                                context[key] = options[key];
                                }

                                // console.log(data);
                                if (options.bigData) {
                                                context.save();
                                                context.beginPath();

                                                for (var i = 0, len = data.length; i < len; i++) {

                                                                var item = data[i];

                                                                _simple2.default.draw(context, item, options);
                                                };

                                                var type = options.bigData;

                                                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                                                                context.fill();

                                                                if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                                                                                context.stroke();
                                                                }
                                                } else if (type == 'LineString') {
                                                                context.stroke();
                                                }

                                                context.restore();
                                } else {
                                                for (var i = 0, len = data.length; i < len; i++) {

                                                                var item = data[i];

                                                                context.save();

                                                                if (item.fillStyle) {
                                                                                context.fillStyle = item.fillStyle;
                                                                }

                                                                if (item.strokeStyle) {
                                                                                context.strokeStyle = item.strokeStyle;
                                                                }

                                                                var type = item.geometry.type;

                                                                context.beginPath();

                                                                _simple2.default.draw(context, item, options);

                                                                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                                                                                context.fill();

                                                                                if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                                                                                                context.stroke();
                                                                                }
                                                                } else if (type == 'LineString') {
                                                                                context.stroke();
                                                                }

                                                                context.restore();
                                                };
                                }

                                context.restore();
                }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _Tween = __webpack_require__(24);

var _Tween2 = _interopRequireDefault(_Tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Abstract handler for animator steps
 */

var global = typeof window === 'undefined' ? {} : window;

var requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
    return global.setTimeout(callback, 1000 / 60);
};

var cancelAnimationFrame = global.cancelAnimationFrame || global.mozCancelAnimationFrame || global.webkitCancelAnimationFrame || global.msCancelAnimationFrame || function (id) {
    clearTimeout(id);
};

/**
 * options:
 *    duration in seconds
 *    delay in seconds
 */
function Animator(callback, options) {

    this.running = false;
    this.callback = callback;

    this.setOptions(options);

    this._tick = this._tick.bind(this);
}

Animator.prototype = {

    setOptions: function setOptions(options) {
        this.options = options;
        options.stepsRange = options.stepsRange || {
            start: 0,
            end: 100
        };

        this.duration = options.duration || 10; // 单位秒

        this.stepsRange = options.stepsRange;
        this._add = (this.stepsRange.end - this.stepsRange.start) / (this.duration * 60);
        this._time = this.stepsRange.start;
    },

    start: function start() {

        this.running = true;
        requestAnimationFrame(this._tick);
        this.options.onStart && this.options.onStart();
    },

    _tick: function _tick() {
        this._time += this._add;
        if (this._time > this.stepsRange.end) {
            this._time = this.stepsRange.start;
        }
        this.callback && this.callback(this._time);
        if (this.running) {
            requestAnimationFrame(this._tick);
        }
    },

    isRunning: function isRunning() {
        return this.running;
    },

    stop: function stop() {
        this.pause();
        this._time = this.stepsRange.start;
        this.options.onStop && this.options.onStop();
    },

    toggle: function toggle() {
        if (this.running) {
            this.pause();
        } else {
            this.start();
        }
    },

    pause: function pause() {
        this.running = false;
        cancelAnimationFrame(this._tick);
        this.options.onPause && this.options.onPause();
    }

};

exports.default = Animator;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * @author kyle / http://nikai.us/
 */

/**
 * Category
 * @param {Object} splitList:
 *   { 
 *       other: 1,
 *       1: 2,
 *       2: 3,
 *       3: 4,
 *       4: 5,
 *       5: 6,
 *       6: 7
 *   }
 */
function Category(splitList) {
    this.splitList = splitList || {
        other: 1
    };
}

Category.prototype.get = function (count) {

    var splitList = this.splitList;

    var value = splitList['other'];

    for (var i in splitList) {
        if (count == i) {
            value = splitList[i];
            break;
        }
    }

    return value;
};

/**
 * 根据DataSet自动生成对应的splitList
 */
Category.prototype.generateByDataSet = function (dataSet) {
    var colors = ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var data = dataSet.get();
    this.splitList = {};
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (this.splitList[data[i].count] === undefined) {
            this.splitList[data[i].count] = colors[count];
            count++;
        }
        if (count >= colors.length - 1) {
            break;
        }
    }

    this.splitList['other'] = colors[colors.length - 1];
};

exports.default = Category;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * @author kyle / http://nikai.us/
 */

/**
 * Choropleth
 * @param {Object} splitList:
 *       [
 *           {
 *               start: 0,
 *               end: 2,
 *               value: randomColor()
 *           },{
 *               start: 2,
 *               end: 4,
 *               value: randomColor()
 *           },{
 *               start: 4,
 *               value: randomColor()
 *           }
 *       ];
 *
 */
function Choropleth(splitList) {
    this.splitList = splitList || [{
        start: 0,
        value: 'red'
    }];
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;

    var value = false;

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined || splitList[i].start !== undefined && count >= splitList[i].start) && (splitList[i].end === undefined || splitList[i].end !== undefined && count < splitList[i].end)) {
            value = splitList[i].value;
            break;
        }
    }

    return value;
};

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByDataSet = function (dataSet) {

    var min = dataSet.getMin('count');
    var max = dataSet.getMax('count');

    this.generateByMinMax(min, max);
};

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByMinMax = function (min, max) {
    var colors = ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var splitNum = (max - min) / 7;
    var index = min;
    this.splitList = [];
    var count = 0;
    while (index < max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            value: colors[count]
        });
        count++;
        index += splitNum;
    }
};

exports.default = Choropleth;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(20);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(53)
  , enumBugKeys = __webpack_require__(28);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || function () {

		var _tweens = [];

		return {

				getAll: function getAll() {

						return _tweens;
				},

				removeAll: function removeAll() {

						_tweens = [];
				},

				add: function add(tween) {

						_tweens.push(tween);
				},

				remove: function remove(tween) {

						var i = _tweens.indexOf(tween);

						if (i !== -1) {
								_tweens.splice(i, 1);
						}
				},

				update: function update(time, preserve) {

						if (_tweens.length === 0) {
								return false;
						}

						var i = 0;

						time = time !== undefined ? time : TWEEN.now();

						while (i < _tweens.length) {

								if (_tweens[i].update(time) || preserve) {
										i++;
								} else {
										_tweens.splice(i, 1);
								}
						}

						return true;
				}
		};
}();

// Include a performance.now polyfill
(function () {
		// In a browser, use window.performance.now if it is available.
		if (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {

				// This must be bound, because directly assigning this function
				// leads to an invocation exception in Chrome.
				TWEEN.now = window.performance.now.bind(window.performance);
		}
		// Use Date.now if it is available.
		else if (Date.now !== undefined) {
						TWEEN.now = Date.now;
				}
				// Otherwise, use 'new Date().getTime()'.
				else {
								TWEEN.now = function () {
										return new Date().getTime();
								};
						}
})();

TWEEN.Tween = function (object) {

		var _object = object;
		var _valuesStart = {};
		var _valuesEnd = {};
		var _valuesStartRepeat = {};
		var _duration = 1000;
		var _repeat = 0;
		var _yoyo = false;
		var _isPlaying = false;
		var _reversed = false;
		var _delayTime = 0;
		var _startTime = null;
		var _easingFunction = TWEEN.Easing.Linear.None;
		var _interpolationFunction = TWEEN.Interpolation.Linear;
		var _chainedTweens = [];
		var _onStartCallback = null;
		var _onStartCallbackFired = false;
		var _onUpdateCallback = null;
		var _onCompleteCallback = null;
		var _onStopCallback = null;

		// Set all starting values present on the target object
		for (var field in object) {
				_valuesStart[field] = parseFloat(object[field], 10);
		}

		this.to = function (properties, duration) {

				if (duration !== undefined) {
						_duration = duration;
				}

				_valuesEnd = properties;

				return this;
		};

		this.start = function (time) {

				TWEEN.add(this);

				_isPlaying = true;

				_onStartCallbackFired = false;

				_startTime = time !== undefined ? time : TWEEN.now();
				_startTime += _delayTime;

				for (var property in _valuesEnd) {

						// Check if an Array was provided as property value
						if (_valuesEnd[property] instanceof Array) {

								if (_valuesEnd[property].length === 0) {
										continue;
								}

								// Create a local copy of the Array with the start value at the front
								_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
						}

						// If `to()` specifies a property that doesn't exist in the source object,
						// we should not set that property in the object
						if (_valuesStart[property] === undefined) {
								continue;
						}

						_valuesStart[property] = _object[property];

						if (_valuesStart[property] instanceof Array === false) {
								_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
						}

						_valuesStartRepeat[property] = _valuesStart[property] || 0;
				}

				return this;
		};

		this.stop = function () {

				if (!_isPlaying) {
						return this;
				}

				TWEEN.remove(this);
				_isPlaying = false;

				if (_onStopCallback !== null) {
						_onStopCallback.call(_object);
				}

				this.stopChainedTweens();
				return this;
		};

		this.stopChainedTweens = function () {

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
						_chainedTweens[i].stop();
				}
		};

		this.delay = function (amount) {

				_delayTime = amount;
				return this;
		};

		this.repeat = function (times) {

				_repeat = times;
				return this;
		};

		this.yoyo = function (yoyo) {

				_yoyo = yoyo;
				return this;
		};

		this.easing = function (easing) {

				_easingFunction = easing;
				return this;
		};

		this.interpolation = function (interpolation) {

				_interpolationFunction = interpolation;
				return this;
		};

		this.chain = function () {

				_chainedTweens = arguments;
				return this;
		};

		this.onStart = function (callback) {

				_onStartCallback = callback;
				return this;
		};

		this.onUpdate = function (callback) {

				_onUpdateCallback = callback;
				return this;
		};

		this.onComplete = function (callback) {

				_onCompleteCallback = callback;
				return this;
		};

		this.onStop = function (callback) {

				_onStopCallback = callback;
				return this;
		};

		this.update = function (time) {

				var property;
				var elapsed;
				var value;

				if (time < _startTime) {
						return true;
				}

				if (_onStartCallbackFired === false) {

						if (_onStartCallback !== null) {
								_onStartCallback.call(_object);
						}

						_onStartCallbackFired = true;
				}

				elapsed = (time - _startTime) / _duration;
				elapsed = elapsed > 1 ? 1 : elapsed;

				value = _easingFunction(elapsed);

				for (property in _valuesEnd) {

						// Don't update properties that do not exist in the source object
						if (_valuesStart[property] === undefined) {
								continue;
						}

						var start = _valuesStart[property] || 0;
						var end = _valuesEnd[property];

						if (end instanceof Array) {

								_object[property] = _interpolationFunction(end, value);
						} else {

								// Parses relative end values with start as base (e.g.: +10, -3)
								if (typeof end === 'string') {

										if (end.charAt(0) === '+' || end.charAt(0) === '-') {
												end = start + parseFloat(end, 10);
										} else {
												end = parseFloat(end, 10);
										}
								}

								// Protect against non numeric properties.
								if (typeof end === 'number') {
										_object[property] = start + (end - start) * value;
								}
						}
				}

				if (_onUpdateCallback !== null) {
						_onUpdateCallback.call(_object, value);
				}

				if (elapsed === 1) {

						if (_repeat > 0) {

								if (isFinite(_repeat)) {
										_repeat--;
								}

								// Reassign starting values, restart by making startTime = now
								for (property in _valuesStartRepeat) {

										if (typeof _valuesEnd[property] === 'string') {
												_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
										}

										if (_yoyo) {
												var tmp = _valuesStartRepeat[property];

												_valuesStartRepeat[property] = _valuesEnd[property];
												_valuesEnd[property] = tmp;
										}

										_valuesStart[property] = _valuesStartRepeat[property];
								}

								if (_yoyo) {
										_reversed = !_reversed;
								}

								_startTime = time + _delayTime;

								return true;
						} else {

								if (_onCompleteCallback !== null) {
										_onCompleteCallback.call(_object);
								}

								for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
										// Make the chained tweens start exactly at the time they should,
										// even if the `update()` method was called way past the duration of the tween
										_chainedTweens[i].start(_startTime + _duration);
								}

								return false;
						}
				}

				return true;
		};
};

TWEEN.Easing = {

		Linear: {

				None: function None(k) {

						return k;
				}

		},

		Quadratic: {

				In: function In(k) {

						return k * k;
				},

				Out: function Out(k) {

						return k * (2 - k);
				},

				InOut: function InOut(k) {

						if ((k *= 2) < 1) {
								return 0.5 * k * k;
						}

						return -0.5 * (--k * (k - 2) - 1);
				}

		},

		Cubic: {

				In: function In(k) {

						return k * k * k;
				},

				Out: function Out(k) {

						return --k * k * k + 1;
				},

				InOut: function InOut(k) {

						if ((k *= 2) < 1) {
								return 0.5 * k * k * k;
						}

						return 0.5 * ((k -= 2) * k * k + 2);
				}

		},

		Quartic: {

				In: function In(k) {

						return k * k * k * k;
				},

				Out: function Out(k) {

						return 1 - --k * k * k * k;
				},

				InOut: function InOut(k) {

						if ((k *= 2) < 1) {
								return 0.5 * k * k * k * k;
						}

						return -0.5 * ((k -= 2) * k * k * k - 2);
				}

		},

		Quintic: {

				In: function In(k) {

						return k * k * k * k * k;
				},

				Out: function Out(k) {

						return --k * k * k * k * k + 1;
				},

				InOut: function InOut(k) {

						if ((k *= 2) < 1) {
								return 0.5 * k * k * k * k * k;
						}

						return 0.5 * ((k -= 2) * k * k * k * k + 2);
				}

		},

		Sinusoidal: {

				In: function In(k) {

						return 1 - Math.cos(k * Math.PI / 2);
				},

				Out: function Out(k) {

						return Math.sin(k * Math.PI / 2);
				},

				InOut: function InOut(k) {

						return 0.5 * (1 - Math.cos(Math.PI * k));
				}

		},

		Exponential: {

				In: function In(k) {

						return k === 0 ? 0 : Math.pow(1024, k - 1);
				},

				Out: function Out(k) {

						return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
				},

				InOut: function InOut(k) {

						if (k === 0) {
								return 0;
						}

						if (k === 1) {
								return 1;
						}

						if ((k *= 2) < 1) {
								return 0.5 * Math.pow(1024, k - 1);
						}

						return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
				}

		},

		Circular: {

				In: function In(k) {

						return 1 - Math.sqrt(1 - k * k);
				},

				Out: function Out(k) {

						return Math.sqrt(1 - --k * k);
				},

				InOut: function InOut(k) {

						if ((k *= 2) < 1) {
								return -0.5 * (Math.sqrt(1 - k * k) - 1);
						}

						return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
				}

		},

		Elastic: {

				In: function In(k) {

						if (k === 0) {
								return 0;
						}

						if (k === 1) {
								return 1;
						}

						return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
				},

				Out: function Out(k) {

						if (k === 0) {
								return 0;
						}

						if (k === 1) {
								return 1;
						}

						return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
				},

				InOut: function InOut(k) {

						if (k === 0) {
								return 0;
						}

						if (k === 1) {
								return 1;
						}

						k *= 2;

						if (k < 1) {
								return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
						}

						return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
				}

		},

		Back: {

				In: function In(k) {

						var s = 1.70158;

						return k * k * ((s + 1) * k - s);
				},

				Out: function Out(k) {

						var s = 1.70158;

						return --k * k * ((s + 1) * k + s) + 1;
				},

				InOut: function InOut(k) {

						var s = 1.70158 * 1.525;

						if ((k *= 2) < 1) {
								return 0.5 * (k * k * ((s + 1) * k - s));
						}

						return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
				}

		},

		Bounce: {

				In: function In(k) {

						return 1 - TWEEN.Easing.Bounce.Out(1 - k);
				},

				Out: function Out(k) {

						if (k < 1 / 2.75) {
								return 7.5625 * k * k;
						} else if (k < 2 / 2.75) {
								return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
						} else if (k < 2.5 / 2.75) {
								return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
						} else {
								return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
						}
				},

				InOut: function InOut(k) {

						if (k < 0.5) {
								return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
						}

						return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
				}

		}

};

TWEEN.Interpolation = {

		Linear: function Linear(v, k) {

				var m = v.length - 1;
				var f = m * k;
				var i = Math.floor(f);
				var fn = TWEEN.Interpolation.Utils.Linear;

				if (k < 0) {
						return fn(v[0], v[1], f);
				}

				if (k > 1) {
						return fn(v[m], v[m - 1], m - f);
				}

				return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},

		Bezier: function Bezier(v, k) {

				var b = 0;
				var n = v.length - 1;
				var pw = Math.pow;
				var bn = TWEEN.Interpolation.Utils.Bernstein;

				for (var i = 0; i <= n; i++) {
						b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
				}

				return b;
		},

		CatmullRom: function CatmullRom(v, k) {

				var m = v.length - 1;
				var f = m * k;
				var i = Math.floor(f);
				var fn = TWEEN.Interpolation.Utils.CatmullRom;

				if (v[0] === v[m]) {

						if (k < 0) {
								i = Math.floor(f = m * (1 + k));
						}

						return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
				} else {

						if (k < 0) {
								return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
						}

						if (k > 1) {
								return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
						}

						return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
				}
		},

		Utils: {

				Linear: function Linear(p0, p1, t) {

						return (p1 - p0) * t + p0;
				},

				Bernstein: function Bernstein(n, i) {

						var fc = TWEEN.Interpolation.Utils.Factorial;

						return fc(n) / fc(i) / fc(n - i);
				},

				Factorial: function () {

						var a = [1];

						return function (n) {

								var s = 1;

								if (a[n]) {
										return a[n];
								}

								for (var i = n; i > 1; i--) {
										s *= i;
								}

								a[n] = s;
								return s;
						};
				}(),

				CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {

						var v0 = (p2 - p0) * 0.5;
						var v1 = (p3 - p1) * 0.5;
						var t2 = t * t;
						var t3 = t * t2;

						return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
				}

		}

};

exports.default = TWEEN;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 31 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).f
  , has = __webpack_require__(3)
  , TAG = __webpack_require__(9)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(34)('keys')
  , uid    = __webpack_require__(23);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(20);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(26)
  , LIBRARY        = __webpack_require__(30)
  , wksExt         = __webpack_require__(38)
  , defineProperty = __webpack_require__(8).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(9);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _simple = __webpack_require__(5);

var _simple2 = _interopRequireDefault(_simple);

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

exports.default = {
    draw: function draw(context, dataSet, options) {
        var data = dataSet instanceof _DataSet2.default ? dataSet.get() : dataSet;

        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        var offset = options.offset || {
            x: 0,
            y: 0
        };

        // set from options
        // for (var key in options) {
        //     context[key] = options[key];
        // }
        // console.log(data)
        for (var i = 0, len = data.length; i < len; i++) {

            if (data[i].geometry) {
                var icon = data[i].icon;
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                context.drawImage(icon, coordinates[0] - icon.width / 2 + offset.x, coordinates[1] - icon.height / 2 + offset.y);
            }
        };
    }
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _simple = __webpack_require__(5);

var _simple2 = _interopRequireDefault(_simple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    draw: function draw(context, dataSet, options) {
        var data = dataSet.get();
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // set from options
        for (var key in options) {
            context[key] = options[key];
        }

        var offset = options.offset || {
            x: 0,
            y: 0
        };

        var textKey = options.textKey || 'text';

        for (var i = 0, len = data.length; i < len; i++) {
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            context.fillText(data[i][textKey], coordinates[0] + offset.x, coordinates[1] + offset.y);
        };
    }
}; /**
    * @author Mofei Zhu<mapv@zhuwenlong.com>
    * This file is to draw text
    */

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * 一直覆盖在当前地图视野的Canvas对象
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param 
 * {
 *     map 地图实例对象
 * }
 */

function CanvasLayer(options) {
    this.options = options || {};
    this.paneName = this.options.paneName || 'mapPane';
    this.context = this.options.context || '2d';
    this.zIndex = this.options.zIndex || 0;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this._map = options.map;
    this._lastDrawTime = null;
    this.show();
}

var global = typeof window === 'undefined' ? {} : window;

if (global.BMap) {

    CanvasLayer.prototype = new BMap.Overlay();

    CanvasLayer.prototype.initialize = function (map) {
        this._map = map;
        var canvas = this.canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + this.zIndex + ";user-select:none;";
        canvas.style.mixBlendMode = this.mixBlendMode;
        this.adjustSize();
        map.getPanes()[this.paneName].appendChild(canvas);
        var that = this;
        map.addEventListener('resize', function () {
            that.adjustSize();
            that._draw();
        });
        return this.canvas;
    };

    CanvasLayer.prototype.adjustSize = function () {
        var size = this._map.getSize();
        var canvas = this.canvas;

        var devicePixelRatio = this.devicePixelRatio = global.devicePixelRatio;

        canvas.width = size.width * devicePixelRatio;
        canvas.height = size.height * devicePixelRatio;
        if (this.context == '2d') {
            canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio);
        }

        canvas.style.width = size.width + "px";
        canvas.style.height = size.height + "px";
    };

    CanvasLayer.prototype.draw = function () {
        var self = this;
        clearTimeout(self.timeoutID);
        self.timeoutID = setTimeout(function () {
            self._draw();
        }, 15);
    };

    CanvasLayer.prototype._draw = function () {
        var map = this._map;
        var size = map.getSize();
        var center = map.getCenter();
        if (center) {
            var pixel = map.pointToOverlayPixel(center);
            this.canvas.style.left = pixel.x - size.width / 2 + 'px';
            this.canvas.style.top = pixel.y - size.height / 2 + 'px';
            this.dispatchEvent('draw');
            this.options.update && this.options.update.call(this);
        }
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    CanvasLayer.prototype.show = function () {
        if (!this.canvas) {
            this._map.addOverlay(this);
        }
        this.canvas.style.display = "block";
    };

    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = "none";
        //this._map.removeOverlay(this);
    };

    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    };

    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };
}

exports.default = CanvasLayer;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Extends OverlayView to provide a canvas "Layer".
 * @author Brendan Kenny
 */

/**
 * A map layer that provides a canvas over the slippy map and a callback
 * system for efficient animation. Requires canvas and CSS 2D transform
 * support.
 * @constructor
 * @extends google.maps.OverlayView
 * @param {CanvasLayerOptions=} opt_options Options to set in this CanvasLayer.
 */
function CanvasLayer(opt_options) {
  /**
   * If true, canvas is in a map pane and the OverlayView is fully functional.
   * See google.maps.OverlayView.onAdd for more information.
   * @type {boolean}
   * @private
   */
  this.isAdded_ = false;

  /**
   * If true, each update will immediately schedule the next.
   * @type {boolean}
   * @private
   */
  this.isAnimated_ = false;

  /**
   * The name of the MapPane in which this layer will be displayed.
   * @type {string}
   * @private
   */
  this.paneName_ = CanvasLayer.DEFAULT_PANE_NAME_;

  /**
   * A user-supplied function called whenever an update is required. Null or
   * undefined if a callback is not provided.
   * @type {?function=}
   * @private
   */
  this.updateHandler_ = null;

  /**
   * A user-supplied function called whenever an update is required and the
   * map has been resized since the last update. Null or undefined if a
   * callback is not provided.
   * @type {?function}
   * @private
   */
  this.resizeHandler_ = null;

  /**
   * The LatLng coordinate of the top left of the current view of the map. Will
   * be null when this.isAdded_ is false.
   * @type {google.maps.LatLng}
   * @private
   */
  this.topLeft_ = null;

  /**
   * The map-pan event listener. Will be null when this.isAdded_ is false. Will
   * be null when this.isAdded_ is false.
   * @type {?function}
   * @private
   */
  this.centerListener_ = null;

  /**
   * The map-resize event listener. Will be null when this.isAdded_ is false.
   * @type {?function}
   * @private
   */
  this.resizeListener_ = null;

  /**
   * If true, the map size has changed and this.resizeHandler_ must be called
   * on the next update.
   * @type {boolean}
   * @private
   */
  this.needsResize_ = true;

  /**
   * A browser-defined id for the currently requested callback. Null when no
   * callback is queued.
   * @type {?number}
   * @private
   */
  this.requestAnimationFrameId_ = null;

  var canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = 'none';

  /**
   * The canvas element.
   * @type {!HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * The CSS width of the canvas, which may be different than the width of the
   * backing store.
   * @private {number}
   */
  this.canvasCssWidth_ = 300;

  /**
   * The CSS height of the canvas, which may be different than the height of
   * the backing store.
   * @private {number}
   */
  this.canvasCssHeight_ = 150;

  /**
   * A value for scaling the CanvasLayer resolution relative to the CanvasLayer
   * display size.
   * @private {number}
   */
  this.resolutionScale_ = 1;

  /**
   * Simple bind for functions with no args for bind-less browsers (Safari).
   * @param {Object} thisArg The this value used for the target function.
   * @param {function} func The function to be bound.
   */
  function simpleBindShim(thisArg, func) {
    return function () {
      func.apply(thisArg);
    };
  }

  /**
   * A reference to this.repositionCanvas_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.repositionFunction_ = simpleBindShim(this, this.repositionCanvas_);

  /**
   * A reference to this.resize_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.resizeFunction_ = simpleBindShim(this, this.resize_);

  /**
   * A reference to this.update_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.requestUpdateFunction_ = simpleBindShim(this, this.update_);

  // set provided options, if any
  if (opt_options) {
    this.setOptions(opt_options);
  }
}

var global = typeof window === 'undefined' ? {} : window;

if (global.google && global.google.maps) {

  CanvasLayer.prototype = new google.maps.OverlayView();

  /**
   * The default MapPane to contain the canvas.
   * @type {string}
   * @const
   * @private
   */
  CanvasLayer.DEFAULT_PANE_NAME_ = 'overlayLayer';

  /**
   * Transform CSS property name, with vendor prefix if required. If browser
   * does not support transforms, property will be ignored.
   * @type {string}
   * @const
   * @private
   */
  CanvasLayer.CSS_TRANSFORM_ = function () {
    var div = document.createElement('div');
    var transformProps = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
    for (var i = 0; i < transformProps.length; i++) {
      var prop = transformProps[i];
      if (div.style[prop] !== undefined) {
        return prop;
      }
    }

    // return unprefixed version by default
    return transformProps[0];
  }();

  /**
   * The requestAnimationFrame function, with vendor-prefixed or setTimeout-based
   * fallbacks. MUST be called with window as thisArg.
   * @type {function}
   * @param {function} callback The function to add to the frame request queue.
   * @return {number} The browser-defined id for the requested callback.
   * @private
   */
  CanvasLayer.prototype.requestAnimFrame_ = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
    return global.setTimeout(callback, 1000 / 60);
  };

  /**
   * The cancelAnimationFrame function, with vendor-prefixed fallback. Does not
   * fall back to clearTimeout as some platforms implement requestAnimationFrame
   * but not cancelAnimationFrame, and the cost is an extra frame on onRemove.
   * MUST be called with window as thisArg.
   * @type {function}
   * @param {number=} requestId The id of the frame request to cancel.
   * @private
   */
  CanvasLayer.prototype.cancelAnimFrame_ = global.cancelAnimationFrame || global.webkitCancelAnimationFrame || global.mozCancelAnimationFrame || global.oCancelAnimationFrame || global.msCancelAnimationFrame || function (requestId) {};

  /**
   * Sets any options provided. See CanvasLayerOptions for more information.
   * @param {CanvasLayerOptions} options The options to set.
   */
  CanvasLayer.prototype.setOptions = function (options) {
    if (options.animate !== undefined) {
      this.setAnimate(options.animate);
    }

    if (options.paneName !== undefined) {
      this.setPaneName(options.paneName);
    }

    if (options.updateHandler !== undefined) {
      this.setUpdateHandler(options.updateHandler);
    }

    if (options.resizeHandler !== undefined) {
      this.setResizeHandler(options.resizeHandler);
    }

    if (options.resolutionScale !== undefined) {
      this.setResolutionScale(options.resolutionScale);
    }

    if (options.map !== undefined) {
      this.setMap(options.map);
    }
  };

  /**
   * Set the animated state of the layer. If true, updateHandler will be called
   * repeatedly, once per frame. If false, updateHandler will only be called when
   * a map property changes that could require the canvas content to be redrawn.
   * @param {boolean} animate Whether the canvas is animated.
   */
  CanvasLayer.prototype.setAnimate = function (animate) {
    this.isAnimated_ = !!animate;

    if (this.isAnimated_) {
      this.scheduleUpdate();
    }
  };

  /**
   * @return {boolean} Whether the canvas is animated.
   */
  CanvasLayer.prototype.isAnimated = function () {
    return this.isAnimated_;
  };

  /**
   * Set the MapPane in which this layer will be displayed, by name. See
   * {@code google.maps.MapPanes} for the panes available.
   * @param {string} paneName The name of the desired MapPane.
   */
  CanvasLayer.prototype.setPaneName = function (paneName) {
    this.paneName_ = paneName;

    this.setPane_();
  };

  /**
   * @return {string} The name of the current container pane.
   */
  CanvasLayer.prototype.getPaneName = function () {
    return this.paneName_;
  };

  /**
   * Adds the canvas to the specified container pane. Since this is guaranteed to
   * execute only after onAdd is called, this is when paneName's existence is
   * checked (and an error is thrown if it doesn't exist).
   * @private
   */
  CanvasLayer.prototype.setPane_ = function () {
    if (!this.isAdded_) {
      return;
    }

    // onAdd has been called, so panes can be used
    var panes = this.getPanes();
    if (!panes[this.paneName_]) {
      throw new Error('"' + this.paneName_ + '" is not a valid MapPane name.');
    }

    panes[this.paneName_].appendChild(this.canvas);
  };

  /**
   * Set a function that will be called whenever the parent map and the overlay's
   * canvas have been resized. If opt_resizeHandler is null or unspecified, any
   * existing callback is removed.
   * @param {?function=} opt_resizeHandler The resize callback function.
   */
  CanvasLayer.prototype.setResizeHandler = function (opt_resizeHandler) {
    this.resizeHandler_ = opt_resizeHandler;
  };

  /**
   * Sets a value for scaling the canvas resolution relative to the canvas
   * display size. This can be used to save computation by scaling the backing
   * buffer down, or to support high DPI devices by scaling it up (by e.g.
   * window.devicePixelRatio).
   * @param {number} scale
   */
  CanvasLayer.prototype.setResolutionScale = function (scale) {
    if (typeof scale === 'number') {
      this.resolutionScale_ = scale;
      this.resize_();
    }
  };

  /**
   * Set a function that will be called when a repaint of the canvas is required.
   * If opt_updateHandler is null or unspecified, any existing callback is
   * removed.
   * @param {?function=} opt_updateHandler The update callback function.
   */
  CanvasLayer.prototype.setUpdateHandler = function (opt_updateHandler) {
    this.updateHandler_ = opt_updateHandler;
  };

  /**
   * @inheritDoc
   */
  CanvasLayer.prototype.onAdd = function () {
    if (this.isAdded_) {
      return;
    }

    this.isAdded_ = true;
    this.setPane_();

    this.resizeListener_ = google.maps.event.addListener(this.getMap(), 'resize', this.resizeFunction_);
    this.centerListener_ = google.maps.event.addListener(this.getMap(), 'center_changed', this.repositionFunction_);

    this.resize_();
    this.repositionCanvas_();
  };

  /**
   * @inheritDoc
   */
  CanvasLayer.prototype.onRemove = function () {
    if (!this.isAdded_) {
      return;
    }

    this.isAdded_ = false;
    this.topLeft_ = null;

    // remove canvas and listeners for pan and resize from map
    this.canvas.parentElement.removeChild(this.canvas);
    if (this.centerListener_) {
      google.maps.event.removeListener(this.centerListener_);
      this.centerListener_ = null;
    }
    if (this.resizeListener_) {
      google.maps.event.removeListener(this.resizeListener_);
      this.resizeListener_ = null;
    }

    // cease canvas update callbacks
    if (this.requestAnimationFrameId_) {
      this.cancelAnimFrame_.call(global, this.requestAnimationFrameId_);
      this.requestAnimationFrameId_ = null;
    }
  };

  /**
   * The internal callback for resize events that resizes the canvas to keep the
   * map properly covered.
   * @private
   */
  CanvasLayer.prototype.resize_ = function () {
    if (!this.isAdded_) {
      return;
    }

    var map = this.getMap();
    var mapWidth = map.getDiv().offsetWidth;
    var mapHeight = map.getDiv().offsetHeight;

    var newWidth = mapWidth * this.resolutionScale_;
    var newHeight = mapHeight * this.resolutionScale_;
    var oldWidth = this.canvas.width;
    var oldHeight = this.canvas.height;

    // resizing may allocate a new back buffer, so do so conservatively
    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;

      this.needsResize_ = true;
      this.scheduleUpdate();
    }

    // reset styling if new sizes don't match; resize of data not needed
    if (this.canvasCssWidth_ !== mapWidth || this.canvasCssHeight_ !== mapHeight) {
      this.canvasCssWidth_ = mapWidth;
      this.canvasCssHeight_ = mapHeight;
      this.canvas.style.width = mapWidth + 'px';
      this.canvas.style.height = mapHeight + 'px';
    }
  };

  /**
   * @inheritDoc
   */
  CanvasLayer.prototype.draw = function () {
    this.repositionCanvas_();
  };

  /**
   * Internal callback for map view changes. Since the Maps API moves the overlay
   * along with the map, this function calculates the opposite translation to
   * keep the canvas in place.
   * @private
   */
  CanvasLayer.prototype.repositionCanvas_ = function () {
    // TODO(bckenny): *should* only be executed on RAF, but in current browsers
    //     this causes noticeable hitches in map and overlay relative
    //     positioning.

    var map = this.getMap();

    // topLeft can't be calculated from map.getBounds(), because bounds are
    // clamped to -180 and 180 when completely zoomed out. Instead, calculate
    // left as an offset from the center, which is an unwrapped LatLng.
    var top = map.getBounds().getNorthEast().lat();
    var center = map.getCenter();
    var scale = Math.pow(2, map.getZoom());
    var left = center.lng() - this.canvasCssWidth_ * 180 / (256 * scale);
    this.topLeft_ = new google.maps.LatLng(top, left);

    // Canvas position relative to draggable map's container depends on
    // overlayView's projection, not the map's. Have to use the center of the
    // map for this, not the top left, for the same reason as above.
    var projection = this.getProjection();
    var divCenter = projection.fromLatLngToDivPixel(center);
    var offsetX = -Math.round(this.canvasCssWidth_ / 2 - divCenter.x);
    var offsetY = -Math.round(this.canvasCssHeight_ / 2 - divCenter.y);
    this.canvas.style[CanvasLayer.CSS_TRANSFORM_] = 'translate(' + offsetX + 'px,' + offsetY + 'px)';

    this.scheduleUpdate();
  };

  /**
   * Internal callback that serves as main animation scheduler via
   * requestAnimationFrame. Calls resize and update callbacks if set, and
   * schedules the next frame if overlay is animated.
   * @private
   */
  CanvasLayer.prototype.update_ = function () {
    this.requestAnimationFrameId_ = null;

    if (!this.isAdded_) {
      return;
    }

    if (this.isAnimated_) {
      this.scheduleUpdate();
    }

    if (this.needsResize_ && this.resizeHandler_) {
      this.needsResize_ = false;
      this.resizeHandler_();
    }

    if (this.updateHandler_) {
      this.updateHandler_();
    }
  };

  /**
   * A convenience method to get the current LatLng coordinate of the top left of
   * the current view of the map.
   * @return {google.maps.LatLng} The top left coordinate.
   */
  CanvasLayer.prototype.getTopLeft = function () {
    return this.topLeft_;
  };

  /**
   * Schedule a requestAnimationFrame callback to updateHandler. If one is
   * already scheduled, there is no effect.
   */
  CanvasLayer.prototype.scheduleUpdate = function () {
    if (this.isAdded_ && !this.requestAnimationFrameId_) {
      this.requestAnimationFrameId_ = this.requestAnimFrame_.call(global, this.requestUpdateFunction_);
    }
  };
}

exports.default = CanvasLayer;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * Created by Administrator on 2017/2/9/009.
 */
/**
 * 一直覆盖在当前地图视野的Canvas对象
 *
 * @author wake (wuec0917@gmail.com)
 *
 * @param
 * {
 *     map 地图实例对象
 * }
 */

function CanvasLayer(options) {
    this.options = options || {};
    this.paneName = this.options.paneName || 'overlayPane';
    this.context = this.options.context || '2d';
    this.zIndex = this.options.zIndex || 0;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this._map = options.map;
    this._lastDrawTime = null;

    this.show();
}

var global = typeof window === 'undefined' ? {} : window;

if (global.IMAP) {

    CanvasLayer.prototype = new LDVector();

    CanvasLayer.prototype.initialize = function () {
        this._id = "_ld_mapv_" + LD.Function.createUniqueID();
        this._element = null;
        var mapSize = this._map.getSize();
        this._width = mapSize.width;
        this._height = mapSize.height;
    };

    CanvasLayer.prototype._createElement = function () {
        var map = this._map;
        if (!this._element && map) {
            var height = this._height,
                width = this._width,
                canvasLayer = LD.Function.createElement({
                name: "div",
                cssText: "position:relative;left:0px;top:0px;border:0px;z-index:1000;width:" + (width - 1) + "px;height:" + (height - 1) + "px;"
            }),
                canvas = LD.Function.createElement({
                name: "canvas",
                cssText: "position:absolute;left:0;top:0;"
            });
            canvasLayer.width = this._width;
            canvasLayer.height = this._height;
            this.canvas = canvas;
            canvas.width = canvasLayer.width;
            canvas.height = canvasLayer.height;
            this._element = canvasLayer;
            this._element.appendChild(canvas);

            canvasLayer.style.height = height + 1 + "px";
            canvasLayer.style.width = width + 1 + "px";
            LD.Function.isInDocument(canvasLayer) || map.getOverlayLayer().getElement().appendChild(canvasLayer);

            this._redraw();
        }

        //this.adjustSize();
    };

    CanvasLayer.prototype.adjustSize = function () {
        var self = this;
        var size = this._map.getSize();
        var canvas = this.canvas;

        var devicePixelRatio = this.devicePixelRatio = global.devicePixelRatio;

        canvas.width = size.width * devicePixelRatio;
        canvas.height = size.height * devicePixelRatio;
        if (this.context == '2d') {
            canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio);
        }
        canvas.style.width = size.width + "px";
        canvas.style.height = size.height + "px";
        this._canvasLayer.style.width = size.width + "px";
        this._canvasLayer.style.height = size.height + "px";
    };

    CanvasLayer.prototype._redraw = function () {
        var map = this._map;
        var size = map.getSize();
        var center = map.getCenter();
        if (center) {
            var bound = map.getBounds();
            var sw = bound.getSouthWest();
            var ne = bound.getNorthEast();
            var left_top = map.lnglatToLayerPixel(new IMAP.LngLat(sw.lng, ne.lat));
            this._element.style.left = left_top.x + 'px';
            this._element.style.top = left_top.y + 'px';
            //this.dispatchEvent('draw');
            this.options.update && this.options.update.call(this);
        }
    };

    CanvasLayer.prototype._draw = function () {
        var self = this;
        self.bindEvent();
        clearTimeout(self.timeoutID);
        self.timeoutID = setTimeout(function () {
            self._createElement();
        }, 15);
    };

    CanvasLayer.prototype.bindEvent = function () {
        var map = this._map;
        this._mEvtz = map.addEventListener(LD.Constants.ZOOM_END, this._redraw, this);
        this._mEvtd = map.addEventListener(LD.Constants.DRAG_END, this._redraw, this);
        this._mEvtm = map.addEventListener(LD.Constants.MOVE_END, this._redraw, this);
        this._mEvtr = map.addEventListener(LD.Constants.RESIZE, function () {
            this.adjustSize();
            this.draw();
        }, this);
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    CanvasLayer.prototype.show = function () {
        if (!this.canvas) {
            this.initialize();
            this._map.getOverlayLayer().addOverlay(this);
        }
        // this.canvas.style.display = "block";
    };

    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = "none";
        //this._map.removeOverlay(this);
    };

    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    };

    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };
}

exports.default = CanvasLayer;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

var _line = __webpack_require__(73);

var _line2 = _interopRequireDefault(_line);

var _point = __webpack_require__(74);

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    draw: function draw(gl, dataSet, options) {
        var data = dataSet instanceof _DataSet2.default ? dataSet.get() : dataSet;
        if (data.length > 0) {
            if (data[0].geometry.type == "LineString") {
                _line2.default.draw(gl, data, options);
            } else {
                _point2.default.draw(gl, data, options);
            }
        }
    }
}; /**
    * @author kyle / http://nikai.us/
    */

/***/ }),
/* 45 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(20)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(26)
  , ctx       = __webpack_require__(83)
  , hide      = __webpack_require__(7)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(19)(function(){
  return Object.defineProperty(__webpack_require__(46)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(30)
  , $export        = __webpack_require__(47)
  , redefine       = __webpack_require__(54)
  , hide           = __webpack_require__(7)
  , has            = __webpack_require__(3)
  , Iterators      = __webpack_require__(29)
  , $iterCreate    = __webpack_require__(88)
  , setToStringTag = __webpack_require__(32)
  , getPrototypeOf = __webpack_require__(95)
  , ITERATOR       = __webpack_require__(9)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(18)
  , dPs         = __webpack_require__(92)
  , enumBugKeys = __webpack_require__(28)
  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(46)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(85).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(53)
  , hiddenKeys = __webpack_require__(28).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 52 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(3)
  , toIObject    = __webpack_require__(4)
  , arrayIndexOf = __webpack_require__(82)(false)
  , IE_PROTO     = __webpack_require__(33)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _version = __webpack_require__(56);

Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _version.version;
  }
});

var _index = __webpack_require__(57);

Object.defineProperty(exports, "x", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});
Object.defineProperty(exports, "X", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

var _Flate = __webpack_require__(59);

Object.defineProperty(exports, "Flate", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Flate).default;
  }
});

var _Earth = __webpack_require__(58);

Object.defineProperty(exports, "Earth", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Earth).default;
  }
});

var _clear = __webpack_require__(10);

Object.defineProperty(exports, "canvasClear", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_clear).default;
  }
});

var _resolutionScale = __webpack_require__(60);

Object.defineProperty(exports, "canvasResolutionScale", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_resolutionScale).default;
  }
});

var _simple = __webpack_require__(14);

Object.defineProperty(exports, "canvasDrawSimple", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_simple).default;
  }
});

var _heatmap = __webpack_require__(12);

Object.defineProperty(exports, "canvasDrawHeatmap", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_heatmap).default;
  }
});

var _grid = __webpack_require__(11);

Object.defineProperty(exports, "canvasDrawGrid", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_grid).default;
  }
});

var _honeycomb = __webpack_require__(13);

Object.defineProperty(exports, "canvasDrawHoneycomb", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_honeycomb).default;
  }
});

var _cityCenter = __webpack_require__(70);

Object.defineProperty(exports, "utilCityCenter", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cityCenter).default;
  }
});

var _curve = __webpack_require__(71);

Object.defineProperty(exports, "utilCurve", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_curve).default;
  }
});

var _forceEdgeBundling = __webpack_require__(72);

Object.defineProperty(exports, "utilForceEdgeBundling", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_forceEdgeBundling).default;
  }
});

var _Intensity = __webpack_require__(1);

Object.defineProperty(exports, "utilDataRangeIntensity", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Intensity).default;
  }
});

var _Category = __webpack_require__(16);

Object.defineProperty(exports, "utilDataRangeCategory", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Category).default;
  }
});

var _Choropleth = __webpack_require__(17);

Object.defineProperty(exports, "utilDataRangeChoropleth", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Choropleth).default;
  }
});

var _Timer = __webpack_require__(69);

Object.defineProperty(exports, "Timer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Timer).default;
  }
});

var _Animator = __webpack_require__(15);

Object.defineProperty(exports, "Animator", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Animator).default;
  }
});

var _mapHelper = __webpack_require__(67);

Object.defineProperty(exports, "Map", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_mapHelper).default;
  }
});

var _CanvasLayer = __webpack_require__(41);

Object.defineProperty(exports, "baiduMapCanvasLayer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasLayer).default;
  }
});

var _Layer = __webpack_require__(64);

Object.defineProperty(exports, "baiduMapLayer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Layer).default;
  }
});

var _CanvasLayer2 = __webpack_require__(42);

Object.defineProperty(exports, "googleMapCanvasLayer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasLayer2).default;
  }
});

var _Layer2 = __webpack_require__(65);

Object.defineProperty(exports, "googleMapLayer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Layer2).default;
  }
});

var _CanvasLayer3 = __webpack_require__(43);

Object.defineProperty(exports, "ishowMapCanvasLayer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CanvasLayer3).default;
  }
});

var _Layer3 = __webpack_require__(66);

Object.defineProperty(exports, "ishowMapLayer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Layer3).default;
  }
});

var _DataSet = __webpack_require__(0);

Object.defineProperty(exports, "DataSet", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DataSet).default;
  }
});

var _geojson = __webpack_require__(63);

Object.defineProperty(exports, "geojson", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geojson).default;
  }
});

var _csv = __webpack_require__(62);

Object.defineProperty(exports, "csv", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_csv).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var version = exports.version = "2.0.10";

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _classCallCheck2 = __webpack_require__(25);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var X = function () {
    function X(dom, opt) {
        (0, _classCallCheck3.default)(this, X);

        this.dom = dom;
        this.opt = opt;
        this.init();
    }

    X.prototype.init = function init() {
        var zoom = 1;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10e7);
        var renderer = new THREE.WebGLRenderer();

        // add controls
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        // controls.enableZoom = false;
        renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
        this.dom.appendChild(renderer.domElement);

        var geometry = new THREE.PlaneGeometry(80 * zoom, 50 * zoom, 10, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0x585858,
            wireframe: true
        });
        var cube = window.cube = new THREE.Mesh(geometry, material);
        cube.rotateX(-Math.PI / 2);
        scene.add(cube);
        camera.position.y = 50 * zoom;
        camera.position.z = 50 * zoom;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            controls.update();
        }
        render();

        var sizeZoom = this.opt.grid.size * zoom;

        var gradeData = {};
        var min = Infinity;
        var max = -Infinity;
        for (var i in data) {
            var x = parseInt(data[i].lng * zoom / sizeZoom) * sizeZoom;
            var y = parseInt(data[i].lat * zoom / sizeZoom) * sizeZoom;
            gradeData[x + '_' + y] = gradeData[x + '_' + y] || 0;
            gradeData[x + '_' + y]++;
            max = Math.max(max, gradeData[x + '_' + y]);
            min = Math.min(min, gradeData[x + '_' + y]);
        }

        // color~
        var color = getColor();

        var lines = new THREE.Object3D();
        for (var i in gradeData) {
            var colorPersent = max == min ? 0 : (gradeData[i] - min) / (max - min);
            var colorInedx = parseInt(colorPersent * (color.length / 4)) - 1;
            colorInedx = colorInedx < 0 ? 0 : colorInedx;
            var r = color[colorInedx * 4].toString(16);
            r = r.length < 2 ? '0' + r : r;
            var g = color[colorInedx * 4 + 1].toString(16);
            g = g.length < 2 ? '0' + g : g;
            var b = color[colorInedx * 4 + 2].toString(16);
            b = b.length < 2 ? '0' + b : b;

            var height = gradeData[i] * 1.5;
            var geometry = new THREE.BoxGeometry(sizeZoom * 0.9, height, sizeZoom * 0.9);
            var material = new THREE.MeshBasicMaterial({
                color: '#' + r + g + b
            });
            var cube = new THREE.Mesh(geometry, material);
            var pos = i.split('_');
            cube.position.x = pos[0] - this.opt.center.lng * zoom;
            cube.position.y = height / 2;
            cube.position.z = this.opt.center.lat * zoom - pos[1];
            lines.add(cube);
        }
        scene.add(lines);
    };

    return X;
}();

function getColor() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(1, "#F00");
    gradient.addColorStop(0.6, "#FFFC00");
    gradient.addColorStop(0.3, "#00FF1D");
    gradient.addColorStop(0, "#000BFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);
    var data = ctx.getImageData(0, 0, 256, 1);
    return data.data;
}

exports.default = X;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var flights = [[43.061306, 74.477556, 40.608989, 72.793269]];

var index = 100;
while (index--) {
    flights.push([19.670399 + Math.random() * 35, 78.895343 + Math.random() * 50, 19.670399 + Math.random() * 35, 78.895343 + Math.random() * 50]);
}

var positions, sizes;
var start_flight_idx = 0;
var end_flight_idx = flights.length;
var flight_path_splines = [];
var flight_distance = [];
var flight_path_lines;
var flight_track_opacity = 0.32;
var flight_point_cloud_geom;
var flight_point_start_time = [];
var flight_point_end_time = [];
var flight_point_speed_changed = false;
var flight_point_speed_scaling = 5.0;
var flight_point_speed_min_scaling = 1.0;
var flight_point_speed_max_scaling = 25.0;

function Earth(container) {

    this.container = container;
    this.init();

    var that = this;

    function animate(time) {
        requestAnimationFrame(animate);
        that.render();
    }

    requestAnimationFrame(animate);
}

Earth.prototype.init = function () {
    var WIDTH = this.container.offsetWidth;
    var HEIGHT = this.container.offsetHeight;
    var camera = this.camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.01, 9000);
    camera.position.z = 1.0;

    var scene = this.scene = new THREE.Scene();

    var renderer = this.renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    // renderer.setClearColor('rgb(1, 11, 21)', 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    this.container.appendChild(renderer.domElement);

    // LIGHT
    /*
    var light = new THREE.PointLight('rgb(50, 50, 250)');
    light.position.set(0, 0, 35);
    scene.add(light);
    */

    scene.add(new THREE.AmbientLight(0x777777));

    var light1 = new THREE.DirectionalLight(0xffffff, 0.2);
    light1.position.set(5, 3, 5);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, 0.2);
    light2.position.set(5, 3, -5);
    scene.add(light2);

    var earth_img, elevation_img, water_img;
    var radius = 0.5;
    var segments = 64;
    earth_img = THREE.ImageUtils.loadTexture('images/earth_airports.png', THREE.UVMapping, function () {
        elevation_img = THREE.ImageUtils.loadTexture('images/elevation.jpg', THREE.UVMapping, function () {
            water_img = THREE.ImageUtils.loadTexture('images/water.png', THREE.UVMapping, function () {
                var earth = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshPhongMaterial({
                    map: earth_img,
                    bumpMap: elevation_img,
                    bumpScale: 0.01,
                    specularMap: water_img,
                    specular: new THREE.Color('grey')
                }));
                earth.rotation.y = 170 * (Math.PI / 180);
                earth.rotation.x = 30 * (Math.PI / 180);
                scene.add(earth);

                generateControlPoints(radius);

                flight_path_lines = flightPathLines();
                earth.add(flight_path_lines);

                earth.add(flightPointCloud());
            });
        });
    });
};

Earth.prototype.render = function () {
    update_flights();

    this.renderer.render(this.scene, this.camera);
};

Earth.prototype.setDataSet = function (dataSet) {
    console.log(dataSet.get());
};

function generateControlPoints(radius) {
    for (var f = start_flight_idx; f < end_flight_idx; ++f) {

        var start_lat = flights[f][0];
        var start_lng = flights[f][1];
        var end_lat = flights[f][2];
        var end_lng = flights[f][3];

        var max_height = Math.random() * 0.04;

        var points = [];
        var spline_control_points = 8;
        for (var i = 0; i < spline_control_points + 1; i++) {
            var arc_angle = i * 180.0 / spline_control_points;
            var arc_radius = radius + Math.sin(arc_angle * Math.PI / 180.0) * max_height;
            var latlng = latlngInterPoint(start_lat, start_lng, end_lat, end_lng, i / spline_control_points);

            var pos = xyzFromLatLng(latlng.lat, latlng.lng, arc_radius);

            points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }

        var spline = new THREE.SplineCurve3(points);

        flight_path_splines.push(spline);

        var arc_length = spline.getLength();
        flight_distance.push(arc_length);

        setFlightTimes(f);
    }
}

function latlngInterPoint(lat1, lng1, lat2, lng2, offset) {
    lat1 = lat1 * Math.PI / 180.0;
    lng1 = lng1 * Math.PI / 180.0;
    lat2 = lat2 * Math.PI / 180.0;
    lng2 = lng2 * Math.PI / 180.0;

    var d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng1 - lng2) / 2), 2)));
    var A = Math.sin((1 - offset) * d) / Math.sin(d);
    var B = Math.sin(offset * d) / Math.sin(d);
    var x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    var y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    var z = A * Math.sin(lat1) + B * Math.sin(lat2);
    var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180 / Math.PI;
    var lng = Math.atan2(y, x) * 180 / Math.PI;

    return {
        lat: lat,
        lng: lng
    };
}

function xyzFromLatLng(lat, lng, radius) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (360 - lng) * Math.PI / 180;

    return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
    };
}

function flightPathLines() {

    var num_control_points = 32;

    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        vertexColors: THREE.VertexColors,
        transparent: true,
        opacity: flight_track_opacity,
        depthTest: true,
        depthWrite: false,
        linewidth: 1.0001
    });
    var line_positions = new Float32Array(flights.length * 3 * 2 * num_control_points);
    var colors = new Float32Array(flights.length * 3 * 2 * num_control_points);

    for (var i = start_flight_idx; i < end_flight_idx; ++i) {

        for (var j = 0; j < num_control_points - 1; ++j) {

            var start_pos = flight_path_splines[i].getPoint(j / (num_control_points - 1));
            var end_pos = flight_path_splines[i].getPoint((j + 1) / (num_control_points - 1));

            line_positions[(i * num_control_points + j) * 6 + 0] = start_pos.x;
            line_positions[(i * num_control_points + j) * 6 + 1] = start_pos.y;
            line_positions[(i * num_control_points + j) * 6 + 2] = start_pos.z;
            line_positions[(i * num_control_points + j) * 6 + 3] = end_pos.x;
            line_positions[(i * num_control_points + j) * 6 + 4] = end_pos.y;
            line_positions[(i * num_control_points + j) * 6 + 5] = end_pos.z;

            colors[(i * num_control_points + j) * 6 + 0] = 1.0;
            colors[(i * num_control_points + j) * 6 + 1] = 0.4;
            colors[(i * num_control_points + j) * 6 + 2] = 1.0;
            colors[(i * num_control_points + j) * 6 + 3] = 1.0;
            colors[(i * num_control_points + j) * 6 + 4] = 0.4;
            colors[(i * num_control_points + j) * 6 + 5] = 1.0;
        }
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(line_positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    return new THREE.Line(geometry, material, THREE.LinePieces);
}

function flightPointCloud() {
    flight_point_cloud_geom = new THREE.BufferGeometry();

    var num_points = flights.length;

    positions = new Float32Array(num_points * 3);
    var colors = new Float32Array(num_points * 3);
    var sizes = new Float32Array(num_points);

    for (var i = 0; i < num_points; i++) {
        positions[3 * i + 0] = 0;
        positions[3 * i + 1] = 0;
        positions[3 * i + 2] = 0;

        colors[3 * i + 0] = Math.random();
        colors[3 * i + 1] = Math.random();
        colors[3 * i + 2] = Math.random();

        sizes[i] = 0.1;
    }

    flight_point_cloud_geom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    flight_point_cloud_geom.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    flight_point_cloud_geom.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    flight_point_cloud_geom.computeBoundingBox();

    var attributes = {
        size: {
            type: 'f',
            value: null
        },
        customColor: {
            type: 'c',
            value: null
        }
    };

    var uniforms = {
        color: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        texture: {
            type: "t",
            value: THREE.ImageUtils.loadTexture("images/point.png")
        }
    };

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        //attributes: attributes,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true
    });

    return new THREE.Points(flight_point_cloud_geom, shaderMaterial);
}

function update_flights() {
    if (!flight_point_cloud_geom) {
        return;
    }
    flight_point_cloud_geom.attributes.position.needsUpdate = true;

    for (var i = start_flight_idx; i < end_flight_idx; ++i) {

        if (Date.now() > flight_point_start_time[i]) {
            var ease_val = easeOutQuadratic(Date.now() - flight_point_start_time[i], 0, 1, flight_point_end_time[i] - flight_point_start_time[i]);

            if (ease_val < 0 || flight_point_speed_changed) {
                ease_val = 0;
                setFlightTimes(i);
            }

            var pos = flight_path_splines[i].getPoint(ease_val);
            positions[3 * i + 0] = pos.x;
            positions[3 * i + 1] = pos.y;
            positions[3 * i + 2] = pos.z;
        }
    }
}

function setFlightTimes(index) {
    var scaling_factor = (flight_point_speed_scaling - flight_point_speed_min_scaling) / (flight_point_speed_max_scaling - flight_point_speed_min_scaling);
    var duration = (1 - scaling_factor) * flight_distance[index] * 80000;

    var start_time = Date.now() + Math.random() * 5000;
    flight_point_start_time[index] = start_time;
    flight_point_end_time[index] = start_time + duration;
}

function easeOutQuadratic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * (--t * (t - 2) - 1) + b;
}

exports.default = Earth;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Flate(container) {

    this.container = container;
    this.init();

    var that = this;

    this.group = new THREE.Group();

    this.center = [105, 33];

    function animate(time) {
        requestAnimationFrame(animate);

        //that.controls.update();

        that.render();
    }

    requestAnimationFrame(animate);
}

Flate.prototype.init = function () {
    this.intensity = new _Intensity2.default({
        gradient: {
            0: '#006bab',
            1: '#002841'
        },
        max: 100
    });

    var WIDTH = this.container.offsetWidth;
    var HEIGHT = this.container.offsetHeight;
    var camera = this.camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.01, 9000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 85;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var scene = this.scene = new THREE.Scene();

    var renderer = this.renderer = new THREE.WebGLRenderer({
        alpha: true
    });

    /*
    var controls = this.controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    */

    // renderer.setClearColor('rgb(1, 11, 21)', 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    this.container.appendChild(renderer.domElement);

    var floorTexture = THREE.ImageUtils.loadTexture('images/china.png');
    var floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.x = 0;
    floor.position.y = 0;
    floor.position.z = 0;
    //scene.add(floor);

    // LIGHT
    var light = new THREE.PointLight('rgb(50, 50, 250)');
    light.position.set(0, 0, 35);
    scene.add(light);

    var SUBDIVISIONS = 20;
    var geometry = new THREE.Geometry();
    var curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = new THREE.Vector3(0, 0, 0);
    curve.v1 = new THREE.Vector3(20, 20, 0);
    curve.v2 = new THREE.Vector3(40, 40, 0);
    for (var j = 0; j < SUBDIVISIONS; j++) {
        geometry.vertices.push(curve.getPoint(j / SUBDIVISIONS));
    }

    var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 95 });
    var line = this.line = new THREE.Line(geometry, material);
    //scene.add(line);

    this.current = 0;
};

Flate.prototype.render = function () {

    var SUBDIVISIONS = 50;
    var geometry = new THREE.Geometry();
    var curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = new THREE.Vector3(0, 0, 0);
    curve.v1 = new THREE.Vector3(25, 25, 50);
    curve.v2 = new THREE.Vector3(50, 50, 0);
    this.current += 0.01;
    if (this.current > 1) {
        this.current = 0;
    }

    for (var j = 0; j < SUBDIVISIONS; j++) {
        var percent = j / SUBDIVISIONS;
        if (percent < this.current) {
            geometry.vertices.push(curve.getPoint(percent));
        }
    }

    //this.line.geometry = geometry;

    this.renderer.render(this.scene, this.camera);
};

Flate.prototype.setDataSet = function (dataSet) {
    // create a canvas element
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 50;
    context.fillStyle = "rgba(255,255,50,0.75)";
    //context.shadowColor = "rgba(255,255,255,0.95)";
    //context.shadowBlur = 0;
    context.arc(25, 25, 10, 0, Math.PI * 2);
    context.fill();

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    material.transparent = true;

    var rs = dataSet.get();
    var features = rs;
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (feature.geometry.type == 'Polygon') {
            var coords = this.getCoordinates(feature.geometry.coordinates[0]);
            this.addShape(coords);
        } else if (feature.geometry.type == 'MultiPolygon') {
            for (var j = 0; j < feature.geometry.coordinates.length; j++) {
                var coords = this.getCoordinates(feature.geometry.coordinates[j][0]);
                this.addShape(coords);
            }
        } else if (feature.geometry.type == 'Point') {

            var size = canvas.width / 15 + Math.random() * 4;
            var mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
            mesh.position.set(feature.geometry.coordinates[0] - this.center[0], feature.geometry.coordinates[1] - this.center[1], 1);
            this.scene.add(mesh);
        }

        var cityname = feature.name;
        var center = feature.cp;
    }
    this.scene.add(this.group);
};

Flate.prototype.getCoordinates = function (coordinates) {
    var coords = [];
    for (var j = 0; j < coordinates.length; j++) {
        coords.push(new THREE.Vector2(coordinates[j][0] - this.center[0], coordinates[j][1] - this.center[1]));
    }
    return coords;
};

Flate.prototype.addShape = function (coords) {
    var shape = new THREE.Shape(coords);
    var geometry = new THREE.ShapeGeometry(shape);

    var color = 'rgb(' + ~~(Math.random() * 256) + ', ' + ~~(Math.random() * 256) + ', ' + ~~(Math.random() * 256) + ')';
    color = this.intensity.getColor(Math.random() * 100);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
    mesh.position.set(0, 0, 0);
    this.group.add(mesh);

    var points = shape.createPointsGeometry();
    var line = new THREE.Line(points, new THREE.LineBasicMaterial({ color: 'rgb(0, 137, 191)', linewidth: 1 }));
    line.position.set(0, 0, 0.1);
    this.group.add(line);
};

exports.default = Flate;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (context) {
    var devicePixelRatio = window.devicePixelRatio;
    context.canvas.width = context.canvas.width * devicePixelRatio;
    context.canvas.height = context.canvas.height * devicePixelRatio;
    context.canvas.style.width = context.canvas.width / devicePixelRatio + 'px';
    context.canvas.style.height = context.canvas.height / devicePixelRatio + 'px';
    context.scale(devicePixelRatio, devicePixelRatio);
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * @author kyle / http://nikai.us/
 */

exports.default = {
    getImageData: function getImageData(config) {
        var gradientConfig = config.gradient || config.defaultGradient;
        if (typeof document === 'undefined') {
            // var Canvas = require('canvas');
            // var paletteCanvas = new Canvas(256, 1);
        } else {
            var paletteCanvas = document.createElement('canvas');
        }
        var paletteCtx = paletteCanvas.getContext('2d');

        paletteCanvas.width = 256;
        paletteCanvas.height = 1;

        var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
        for (var key in gradientConfig) {
            // gradient 对象中的颜色和位置。  key 开始和结束之间的位置  gradientConfig[key] 结束位置显示的css颜色值
            gradient.addColorStop(parseFloat(key), gradientConfig[key]);
        }

        paletteCtx.fillStyle = gradient; // gradient 用于 fillStyle 或者 strokeStyle
        paletteCtx.fillRect(0, 0, 256, 1);

        return paletteCtx.getImageData(0, 0, 256, 1).data;
    }
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    CSVToArray: function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = strDelimiter || ",";

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))", "gi");

        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return arrData;
    },

    getDataSet: function getDataSet(csvStr) {

        var arr = this.CSVToArray(csvStr, ',');

        var data = [];

        var header = arr[0];

        for (var i = 1; i < arr.length - 1; i++) {
            var line = arr[i];
            var item = {};
            for (var j = 0; j < line.length; j++) {
                var value = line[j];
                if (header[j] == 'geometry') {
                    value = JSON.parse(value);
                }
                item[header[j]] = value;
            }
            data.push(item);
        }

        return new _DataSet2.default(data);
    }
}; /**
    * @author kyle / http://nikai.us/
    */

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    getDataSet: function getDataSet(geoJson) {

        var data = [];
        var features = geoJson.features;
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var geometry = feature.geometry;
            var properties = feature.properties;
            var item = {};
            for (var key in properties) {
                item[key] = properties[key];
            }
            item.geometry = geometry;
            data.push(item);
        }
        return new _DataSet2.default(data);
    }
}; /**
    * @author kyle / http://nikai.us/
    */

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _CanvasLayer = __webpack_require__(41);

var _CanvasLayer2 = _interopRequireDefault(_CanvasLayer);

var _clear = __webpack_require__(10);

var _clear2 = _interopRequireDefault(_clear);

var _heatmap = __webpack_require__(12);

var _heatmap2 = _interopRequireDefault(_heatmap);

var _simple = __webpack_require__(14);

var _simple2 = _interopRequireDefault(_simple);

var _simple3 = __webpack_require__(44);

var _simple4 = _interopRequireDefault(_simple3);

var _grid = __webpack_require__(11);

var _grid2 = _interopRequireDefault(_grid);

var _honeycomb = __webpack_require__(13);

var _honeycomb2 = _interopRequireDefault(_honeycomb);

var _text = __webpack_require__(40);

var _text2 = _interopRequireDefault(_text);

var _icon = __webpack_require__(39);

var _icon2 = _interopRequireDefault(_icon);

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

var _Category = __webpack_require__(16);

var _Category2 = _interopRequireDefault(_Category);

var _Choropleth = __webpack_require__(17);

var _Choropleth2 = _interopRequireDefault(_Choropleth);

var _Animator = __webpack_require__(15);

var _Animator2 = _interopRequireDefault(_Animator);

var _Tween = __webpack_require__(24);

var _Tween2 = _interopRequireDefault(_Tween);

var _simple5 = __webpack_require__(5);

var _simple6 = _interopRequireDefault(_simple5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// if (typeof window !== 'undefined') {
//     requestAnimationFrame(animate);
// }
//
// function animate(time) {
//     requestAnimationFrame(animate);
//     TWEEN.update(time);
// }

/**
 * @author kyle / http://nikai.us/
 */

function Layer(map, dataSet, options) {
    if (!(dataSet instanceof _DataSet2.default)) {
        dataSet = new _DataSet2.default(dataSet);
    }

    this.dataSet = dataSet;

    var self = this;
    var data = null;
    options = options || {};

    self.map = map;

    self.init(options);
    self.argCheck(options);

    self.transferToMercator();
    this.dataSet.on('change', function () {
        self.transferToMercator();
    });

    var canvasLayer = this.canvasLayer = new _CanvasLayer2.default({
        map: map,
        context: this.context,
        paneName: options.paneName,
        mixBlendMode: options.mixBlendMode,
        zIndex: options.zIndex,
        update: function update() {
            self._canvasUpdate();
        }
    });

    dataSet.on('change', function () {
        canvasLayer.draw();
    });

    this.clickEvent = this.clickEvent.bind(this);
    this.mousemoveEvent = this.mousemoveEvent.bind(this);

    this.bindEvent();
}

Layer.prototype.clickEvent = function (e) {
    var pixel = e.pixel;
    var context = this.canvasLayer.canvas.getContext(this.context);
    var data = this.dataSet.get();
    for (var i = 0; i < data.length; i++) {
        context.beginPath();
        _simple6.default.draw(context, data[i], this.options);
        if (context.isPointInPath(pixel.x * this.canvasLayer.devicePixelRatio, pixel.y * this.canvasLayer.devicePixelRatio)) {
            this.options.methods.click(data[i], e);
            return;
        }
    }

    this.options.methods.click(null, e);
};

Layer.prototype.mousemoveEvent = function (e) {
    var pixel = e.pixel;
    var context = this.canvasLayer.canvas.getContext(this.context);
    var data = this.dataSet.get();
    for (var i = 0; i < data.length; i++) {
        context.beginPath();
        _simple6.default.draw(context, data[i], this.options);
        if (context.isPointInPath(pixel.x * this.canvasLayer.devicePixelRatio, pixel.y * this.canvasLayer.devicePixelRatio)) {
            this.options.methods.mousemove(data[i], e);
            return;
        }
    }
    this.options.methods.mousemove(null, e);
};

Layer.prototype.bindEvent = function (e) {
    var map = this.map;

    if (this.options.methods) {
        if (this.options.methods.click) {
            map.setDefaultCursor("default");
            map.addEventListener('click', this.clickEvent);
        }
        if (this.options.methods.mousemove) {
            map.addEventListener('mousemove', this.mousemoveEvent);
        }
    }
};

Layer.prototype.unbindEvent = function (e) {
    var map = this.map;

    if (this.options.methods) {
        if (this.options.methods.click) {
            map.removeEventListener('click', this.clickEvent);
        }
        if (this.options.methods.mousemove) {
            map.removeEventListener('mousemove', this.mousemoveEvent);
        }
    }
};

// 经纬度左边转换为墨卡托坐标
Layer.prototype.transferToMercator = function () {
    var projection = this.map.getMapType().getProjection();

    if (this.options.coordType !== 'bd09mc') {
        var data = this.dataSet.get();
        data = this.dataSet.transferCoordinate(data, function (coordinates) {
            var pixel = projection.lngLatToPoint({
                lng: coordinates[0],
                lat: coordinates[1]
            });
            return [pixel.x, pixel.y];
        }, 'coordinates', 'coordinates_mercator');
        this.dataSet._set(data);
    }
};

Layer.prototype._canvasUpdate = function (time) {
    if (!this.canvasLayer) {
        return;
    }

    var self = this;

    var animationOptions = self.options.animation;

    var map = this.canvasLayer._map;

    var zoomUnit = Math.pow(2, 18 - map.getZoom()); // 当前级别 1 像素 代表 多少个 墨卡托单位
    var projection = map.getMapType().getProjection();

    var mcCenter = projection.lngLatToPoint(map.getCenter());
    var nwMc = new BMap.Pixel(mcCenter.x - map.getSize().width / 2 * zoomUnit, mcCenter.y + map.getSize().height / 2 * zoomUnit); //左上角墨卡托坐标

    //console.time('update')
    var context = this.canvasLayer.canvas.getContext(self.context);

    if (self.isEnabledTime()) {
        if (time === undefined) {
            (0, _clear2.default)(context);
            return;
        }
        if (this.context == '2d') {
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = 'rgba(0, 0, 0, .1)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
        }
    } else {
        (0, _clear2.default)(context);
    }

    if (this.context == '2d') {
        for (var key in self.options) {
            context[key] = self.options[key];
        }
    } else {
        context.clear(context.COLOR_BUFFER_BIT);
    }

    var scale = 1;
    if (this.context != '2d') {
        scale = this.canvasLayer.devicePixelRatio;
    }

    var dataGetOptions = {
        fromColumn: self.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
        transferCoordinate: function transferCoordinate(coordinate) {

            // if (self.options.coordType == 'bd09mc') {
            var x = (coordinate[0] - nwMc.x) / zoomUnit * scale; // 距离地图窗口左上角的像素
            var y = (nwMc.y - coordinate[1]) / zoomUnit * scale;
            return [x, y];
            // }

        } // var pixel = map.pointToPixel(new BMap.Point(coordinate[0], coordinate[1]));
        // return [pixel.x, pixel.y];
    };

    if (time !== undefined) {
        dataGetOptions.filter = function (item) {
            var trails = animationOptions.trails || 10;
            if (time && item.time > time - trails && item.time < time) {
                return true;
            } else {
                return false;
            }
        };
    }

    // get data from data set
    var data = self.dataSet.get(dataGetOptions);

    // deal with data based on draw

    // TODO: 部分情况下可以不用循环，比如heatmap
    //console.time('setstyle');

    var draw = self.options.draw;
    if (draw == 'bubble' || draw == 'intensity' || draw == 'category' || draw == 'choropleth' || draw == 'simple') {

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (self.options.draw == 'bubble') {
                data[i]._size = self.intensity.getSize(item.count);
            } else {
                data[i]._size = undefined;
            }

            if (self.options.draw == 'intensity') {
                if (data[i].geometry.type === 'LineString') {
                    data[i].strokeStyle = item.strokeStyle || self.intensity.getColor(item.count);
                } else {
                    data[i].fillStyle = item.fillStyle || self.intensity.getColor(item.count);
                }
            } else if (self.options.draw == 'category') {
                data[i].fillStyle = item.fillStyle || self.category.get(item.count);
            } else if (self.options.draw == 'choropleth') {
                data[i].fillStyle = item.fillStyle || self.choropleth.get(item.count);
            }
        }
    }

    //console.timeEnd('setstyle');

    if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
        return;
    }

    //console.time('draw');
    // draw

    if (self.options.unit == 'm' && self.options.size) {
        self.options._size = self.options.size / zoomUnit;
    } else {
        self.options._size = self.options.size;
    }

    switch (self.options.draw) {
        case 'heatmap':
            _heatmap2.default.draw(context, new _DataSet2.default(data), self.options);
            break;
        case 'grid':
        case 'honeycomb':
            /*
            if (data.length <= 0) {
                break;
            }
              var minx = data[0].geometry.coordinates[0];
            var maxy = data[0].geometry.coordinates[1];
            for (var i = 1; i < data.length; i++) {
                minx = Math.min(data[i].geometry.coordinates[0], minx);
                maxy = Math.max(data[i].geometry.coordinates[1], maxy);
            }
            var nwPixel = map.pointToPixel(new BMap.Point(minx, maxy));
            */
            var nwPixel = map.pointToPixel(new BMap.Point(0, 0));
            self.options.offset = {
                x: nwPixel.x,
                y: nwPixel.y
            };
            if (self.options.draw == 'grid') {
                _grid2.default.draw(context, new _DataSet2.default(data), self.options);
            } else {
                _honeycomb2.default.draw(context, new _DataSet2.default(data), self.options);
            }
            break;
        case 'text':
            _text2.default.draw(context, new _DataSet2.default(data), self.options);
            break;
        case 'icon':
            _icon2.default.draw(context, data, self.options);
            break;
        case 'clip':
            context.save();
            context.fillStyle = self.options.fillStyle || 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            _simple2.default.draw(context, data, self.options);
            context.beginPath();
            _simple6.default.drawDataSet(context, new _DataSet2.default(data), self.options);
            context.clip();
            (0, _clear2.default)(context);
            context.restore();
            break;
        default:
            if (self.options.context == "webgl") {
                _simple4.default.draw(self.canvasLayer.canvas.getContext('webgl'), data, self.options);
            } else {
                _simple2.default.draw(context, data, self.options);
            }
    }
    //console.timeEnd('draw');

    //console.timeEnd('update')
    self.options.updateCallback && self.options.updateCallback(time);
};

Layer.prototype.isEnabledTime = function () {

    var animationOptions = this.options.animation;

    var flag = animationOptions && !(animationOptions.enabled === false);

    return flag;
};

Layer.prototype.argCheck = function (options) {
    if (options.draw == 'heatmap') {
        if (options.strokeStyle) {
            console.warn('[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]');
        }
    }
};

Layer.prototype.init = function (options) {
    var self = this;

    self.options = options;

    this.context = self.options.context || '2d';

    self.intensity = new _Intensity2.default({
        maxSize: self.options.maxSize,
        minSize: self.options.minSize,
        gradient: self.options.gradient,
        max: self.options.max || this.dataSet.getMax('count')
    });

    self.category = new _Category2.default(self.options.splitList);
    self.choropleth = new _Choropleth2.default(self.options.splitList);
    if (self.options.splitList === undefined) {
        self.category.generateByDataSet(this.dataSet);
    }

    if (self.options.zIndex) {
        this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
    }

    if (self.options.splitList === undefined) {
        var min = self.options.min || this.dataSet.getMin('count');
        var max = self.options.max || this.dataSet.getMax('count');
        self.choropleth.generateByMinMax(min, max);
    }

    var animationOptions = self.options.animation;

    if (self.options.draw == 'time' || self.isEnabledTime()) {
        //if (!self.animator) {
        if (!animationOptions.stepsRange) {
            animationOptions.stepsRange = {
                start: this.dataSet.getMin('time') || 0,
                end: this.dataSet.getMax('time') || 0
            };
        }

        var steps = { step: animationOptions.stepsRange.start };
        self.animator = new _Tween2.default.Tween(steps).onUpdate(function () {
            self._canvasUpdate(this.step);
        }).repeat(Infinity);

        self.map.addEventListener('movestart', function () {
            if (self.isEnabledTime() && self.animator) {
                self.animator.stop();
            }
        });

        self.map.addEventListener('moveend', function () {
            if (self.isEnabledTime() && self.animator) {
                self.animator.start();
            }
        });
        //}

        var duration = animationOptions.duration * 1000 || 5000;

        self.animator.to({ step: animationOptions.stepsRange.end }, duration);
        self.animator.start();
    } else {
        self.animator && self.animator.stop();
    }
};

Layer.prototype.show = function () {
    this.map.addOverlay(this.canvasLayer);
};

Layer.prototype.hide = function () {
    this.map.removeOverlay(this.canvasLayer);
};

Layer.prototype.destroy = function () {
    this.unbindEvent();
    this.hide();
};

/**
 * obj.options
 */
Layer.prototype.update = function (obj) {
    var self = this;
    var _options = obj.options;
    var options = self.options;
    for (var i in _options) {
        options[i] = _options[i];
    }
    self.init(options);
    self.canvasLayer.draw();
};

Layer.prototype.setOptions = function (options) {
    var self = this;
    self.init(options);
    self.canvasLayer.draw();
};

Layer.prototype.set = function (obj) {
    var conf = {
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        strokeStyle: '#000000',
        fillStyle: '#000000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        lineDashOffset: 0,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic'
    };
    var self = this;
    var ctx = self.canvasLayer.canvas.getContext(self.context);
    for (var i in conf) {
        ctx[i] = conf[i];
    }
    self.init(obj.options);
    self.canvasLayer.draw();
};

Layer.prototype.getLegend = function (options) {
    var draw = this.options.draw;
    var legend = null;
    if (self.options.draw == 'intensity' || self.options.draw == 'heatmap') {
        return this.intensity.getLegend(options);
    }
};

exports.default = Layer;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _clear = __webpack_require__(10);

var _clear2 = _interopRequireDefault(_clear);

var _heatmap = __webpack_require__(12);

var _heatmap2 = _interopRequireDefault(_heatmap);

var _simple = __webpack_require__(14);

var _simple2 = _interopRequireDefault(_simple);

var _honeycomb = __webpack_require__(13);

var _honeycomb2 = _interopRequireDefault(_honeycomb);

var _grid = __webpack_require__(11);

var _grid2 = _interopRequireDefault(_grid);

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

var _CanvasLayer = __webpack_require__(42);

var _CanvasLayer2 = _interopRequireDefault(_CanvasLayer);

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

var _Category = __webpack_require__(16);

var _Category2 = _interopRequireDefault(_Category);

var _Choropleth = __webpack_require__(17);

var _Choropleth2 = _interopRequireDefault(_Choropleth);

var _Animator = __webpack_require__(15);

var _Animator2 = _interopRequireDefault(_Animator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Layer(map, dataSet, options) {
    var intensity = new _Intensity2.default({
        maxSize: options.maxSize,
        gradient: options.gradient,
        max: options.max
    });

    var category = new _Category2.default(options.splitList);

    var choropleth = new _Choropleth2.default(options.splitList);

    var resolutionScale = window.devicePixelRatio || 1;

    // initialize the canvasLayer
    var canvasLayerOptions = {
        map: map,
        animate: false,
        updateHandler: update,
        resolutionScale: resolutionScale
    };

    var canvasLayer = new _CanvasLayer2.default(canvasLayerOptions);

    function update() {

        var context = canvasLayer.canvas.getContext('2d');

        (0, _clear2.default)(context);

        for (var key in options) {
            context[key] = options[key];
        }

        var pointCount = 0;
        var lineCount = 0;
        var polygonCount = 0;

        /* We need to scale and translate the map for current view.
         * see https://developers.google.com/maps/documentation/javascript/maptypes#MapCoordinates
         */
        var mapProjection = map.getProjection();

        // scale is just 2^zoom
        // If canvasLayer is scaled (with resolutionScale), we need to scale by
        // the same amount to account for the larger canvas.
        var scale = Math.pow(2, map.zoom) * resolutionScale;

        var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());

        var data = dataSet.get({
            transferCoordinate: function transferCoordinate(coordinate) {
                var latLng = new google.maps.LatLng(coordinate[1], coordinate[0]);
                var worldPoint = mapProjection.fromLatLngToPoint(latLng);
                var pixel = {
                    x: (worldPoint.x - offset.x) * scale,
                    y: (worldPoint.y - offset.y) * scale
                };
                return [pixel.x, pixel.y];
            }
        });

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (options.draw == 'bubble') {
                data[i].size = intensity.getSize(item.count);
            } else if (options.draw == 'intensity') {
                if (data[i].geometry.type === 'LineString') {
                    data[i].strokeStyle = intensity.getColor(item.count);
                } else {
                    data[i].fillStyle = intensity.getColor(item.count);
                }
            } else if (options.draw == 'category') {
                data[i].fillStyle = category.get(item.count);
            } else if (options.draw == 'choropleth') {
                data[i].fillStyle = choropleth.get(item.count);
            }
        }

        var maxCount = Math.max(Math.max(pointCount, lineCount), polygonCount);

        if (options.draw == 'heatmap') {
            _heatmap2.default.draw(context, new _DataSet2.default(data), options);
        } else if (options.draw == 'grid' || options.draw == 'honeycomb') {
            var data1 = dataSet.get();
            var minx = data1[0].geometry.coordinates[0];
            var maxy = data1[0].geometry.coordinates[1];
            for (var i = 1; i < data1.length; i++) {
                if (data1[i].geometry.coordinates[0] < minx) {
                    minx = data1[i].geometry.coordinates[0];
                }
                if (data1[i].geometry.coordinates[1] > maxy) {
                    maxy = data1[i].geometry.coordinates[1];
                }
            }

            var latLng = new google.maps.LatLng(minx, maxy);
            var worldPoint = mapProjection.fromLatLngToPoint(latLng);

            options.offset = {
                x: (worldPoint.x - offset.x) * scale,
                y: (worldPoint.y - offset.y) * scale
            };
            if (options.draw == 'grid') {
                _grid2.default.draw(context, new _DataSet2.default(data), options);
            } else {
                _honeycomb2.default.draw(context, new _DataSet2.default(data), options);
            }
        } else {
            console.log('hehe');
            _simple2.default.draw(context, new _DataSet2.default(data), options);
        }
    }
} /**
   * @author kyle / http://nikai.us/
   */

exports.default = Layer;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _CanvasLayer = __webpack_require__(43);

var _CanvasLayer2 = _interopRequireDefault(_CanvasLayer);

var _clear = __webpack_require__(10);

var _clear2 = _interopRequireDefault(_clear);

var _heatmap = __webpack_require__(12);

var _heatmap2 = _interopRequireDefault(_heatmap);

var _simple = __webpack_require__(14);

var _simple2 = _interopRequireDefault(_simple);

var _simple3 = __webpack_require__(44);

var _simple4 = _interopRequireDefault(_simple3);

var _grid = __webpack_require__(11);

var _grid2 = _interopRequireDefault(_grid);

var _honeycomb = __webpack_require__(13);

var _honeycomb2 = _interopRequireDefault(_honeycomb);

var _text = __webpack_require__(40);

var _text2 = _interopRequireDefault(_text);

var _icon = __webpack_require__(39);

var _icon2 = _interopRequireDefault(_icon);

var _DataSet = __webpack_require__(0);

var _DataSet2 = _interopRequireDefault(_DataSet);

var _Intensity = __webpack_require__(1);

var _Intensity2 = _interopRequireDefault(_Intensity);

var _Category = __webpack_require__(16);

var _Category2 = _interopRequireDefault(_Category);

var _Choropleth = __webpack_require__(17);

var _Choropleth2 = _interopRequireDefault(_Choropleth);

var _Animator = __webpack_require__(15);

var _Animator2 = _interopRequireDefault(_Animator);

var _Tween = __webpack_require__(24);

var _Tween2 = _interopRequireDefault(_Tween);

var _simple5 = __webpack_require__(5);

var _simple6 = _interopRequireDefault(_simple5);

var _project = __webpack_require__(108);

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window !== 'undefined') {
    requestAnimationFrame(animate_ishow);
} /**
   * @author wake /
   */

function animate_ishow(time) {
    requestAnimationFrame(animate_ishow);
    _Tween2.default.update(time);
}

function Layer(map, dataSet, options) {
    if (!(dataSet instanceof _DataSet2.default)) {
        dataSet = new _DataSet2.default(dataSet);
    }

    this.dataSet = dataSet;

    var self = this;
    var data = null;
    options = options || {};

    self.map = map;

    self.init(options);
    self.argCheck(options);

    self.transferToMercator();
    this.dataSet.on('change', function () {
        self.transferToMercator();
    });

    var canvasLayer = this.canvasLayer = new _CanvasLayer2.default({
        map: map,
        context: this.context,
        paneName: options.paneName,
        mixBlendMode: options.mixBlendMode,
        zIndex: options.zIndex,
        update: function update() {
            self._canvasUpdate();
        }
    });

    dataSet.on('change', function () {
        canvasLayer._redraw();
    });

    this.clickEvent = this.clickEvent.bind(this);
    this.mousemoveEvent = this.mousemoveEvent.bind(this);

    this.bindEvent();
}

Layer.prototype.clickEvent = function (e) {
    var pixel = e.pixel;
    var context = this.canvasLayer.canvas.getContext(this.context);
    var data = this.dataSet.get();
    for (var i = 0; i < data.length; i++) {
        context.beginPath();
        _simple6.default.draw(context, data[i], this.options);
        if (context.isPointInPath(pixel.x * this.canvasLayer.devicePixelRatio, pixel.y * this.canvasLayer.devicePixelRatio)) {
            this.options.methods.click(data[i], e);
            return;
        }
    }

    this.options.methods.click(null, e);
};

Layer.prototype.mousemoveEvent = function (e) {
    var pixel = e.pixel;
    var context = this.canvasLayer.canvas.getContext(this.context);
    var data = this.dataSet.get();
    for (var i = 0; i < data.length; i++) {
        context.beginPath();
        _simple6.default.draw(context, data[i], this.options);
        if (context.isPointInPath(pixel.x * this.canvasLayer.devicePixelRatio, pixel.y * this.canvasLayer.devicePixelRatio)) {
            this.options.methods.mousemove(data[i], e);
            return;
        }
    }
    this.options.methods.mousemove(null, e);
};

Layer.prototype.bindEvent = function (e) {
    var map = this.map;

    if (this.options.methods) {
        if (this.options.methods.click) {
            //map.setDefaultCursor("default");
            map.addEventListener(IMAP.Constants.CLICK, this.clickEvent);
        }
        if (this.options.methods.mousemove) {
            map.addEventListener(IMAP.Constants.MOUSE_MOVE, this.mousemoveEvent);
        }
    }
};

Layer.prototype.unbindEvent = function (e) {
    var map = this.map;

    if (this.options.methods) {
        if (this.options.methods.click) {
            map.removeEventListener('click', this.clickEvent);
        }
        if (this.options.methods.mousemove) {
            map.removeEventListener('mousemove', this.mousemoveEvent);
        }
    }
};

// 经纬度左边转换为墨卡托坐标
Layer.prototype.transferToMercator = function () {
    var self = this;
    if (this.options.coordType !== 'is09mc') {
        var data = this.dataSet.get();
        data = this.dataSet.transferCoordinate(data, function (coordinates) {

            var pixel = _project2.default.lonLat2Mercator(coordinates[0], coordinates[1]);
            return [pixel[0], pixel[1]];
        }, 'coordinates', 'coordinates_mercator');
        this.dataSet._set(data);
    }
};

Layer.prototype._canvasUpdate = function (time) {
    if (!this.canvasLayer) {
        return;
    }

    var self = this;

    var animationOptions = self.options.animation;

    var map = this.canvasLayer._map;

    //获取左上角墨卡托坐标
    var bounds = self.map.getBounds(),
        zoom = map.getZoom(),
        zoomUnit = _project2.default.scale(zoom);

    //console.time('update')
    var context = this.canvasLayer.canvas.getContext(self.context);

    if (self.isEnabledTime()) {
        if (time === undefined) {
            (0, _clear2.default)(context);
            return;
        }
        if (this.context == '2d') {
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = 'rgba(0, 0, 0, .1)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
        }
    } else {
        (0, _clear2.default)(context);
    }

    if (this.context == '2d') {
        for (var key in self.options) {
            context[key] = self.options[key];
        }
    } else {
        context.clear(context.COLOR_BUFFER_BIT);
    }

    var scale = 1;
    if (this.context != '2d') {
        scale = this.canvasLayer.devicePixelRatio;
    }

    var dataGetOptions = {
        fromColumn: self.options.coordType == 'is09mc' ? 'coordinates' : 'coordinates_mercator',
        //将墨卡托坐标转成 屏幕像素坐标
        transferCoordinate: function transferCoordinate(coordinate) {
            var bounds = map.getBounds(),
                y = map.lnglatToLayerPixel(bounds.northeast).y,
                x = map.lnglatToLayerPixel(bounds.southwest).x;

            coordinate = self.map.mapObj.options.crs.transformation._transform({
                x: coordinate[0],
                y: coordinate[1]
            }, zoomUnit);
            coordinate = _project2.default.round(coordinate);
            coordinate = _project2.default.subtract.call(coordinate, self.map.mapObj.getPixelOrigin());
            return [coordinate.x - x, coordinate.y - y];
        }
    };

    if (time !== undefined) {
        dataGetOptions.filter = function (item) {
            var trails = animationOptions.trails || 10;
            if (time && item.time > time - trails && item.time < time) {
                return true;
            } else {
                return false;
            }
        };
    }

    // get data from data set
    var data = self.dataSet.get(dataGetOptions);

    // deal with data based on draw

    // TODO: 部分情况下可以不用循环，比如heatmap
    //console.time('setstyle');

    var draw = self.options.draw;
    if (draw == 'bubble' || draw == 'intensity' || draw == 'category' || draw == 'choropleth' || draw == 'simple') {

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (self.options.draw == 'bubble') {
                data[i]._size = self.intensity.getSize(item.count);
            } else {
                data[i]._size = undefined;
            }

            if (self.options.draw == 'intensity') {
                if (data[i].geometry.type === 'LineString') {
                    data[i].strokeStyle = item.strokeStyle || self.intensity.getColor(item.count);
                } else {
                    data[i].fillStyle = item.fillStyle || self.intensity.getColor(item.count);
                }
            } else if (self.options.draw == 'category') {
                data[i].fillStyle = item.fillStyle || self.category.get(item.count);
            } else if (self.options.draw == 'choropleth') {
                data[i].fillStyle = item.fillStyle || self.choropleth.get(item.count);
            }
        }
    }

    //console.timeEnd('setstyle');

    if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
        return;
    }

    //console.time('draw');
    // draw

    if (self.options.unit == 'm' && self.options.size) {
        self.options._size = self.options.size / zoomUnit;
    } else {
        self.options._size = self.options.size;
    }

    switch (self.options.draw) {
        case 'heatmap':
            _heatmap2.default.draw(context, new _DataSet2.default(data), self.options);
            break;
        case 'grid':
        case 'honeycomb':
            /*
             if (data.length <= 0) {
             break;
             }
               var minx = data[0].geometry.coordinates[0];
             var maxy = data[0].geometry.coordinates[1];
             for (var i = 1; i < data.length; i++) {
             minx = Math.min(data[i].geometry.coordinates[0], minx);
             maxy = Math.max(data[i].geometry.coordinates[1], maxy);
             }
             var nwPixel = map.pointToPixel(new BMap.Point(minx, maxy));
             */
            var nwPixel = map.lnglatToPixel(new IMAP.LngLat(0, 0));
            self.options.offset = {
                x: nwPixel.x,
                y: nwPixel.y
            };
            if (self.options.draw == 'grid') {
                _grid2.default.draw(context, new _DataSet2.default(data), self.options);
            } else {
                _honeycomb2.default.draw(context, new _DataSet2.default(data), self.options);
            }
            break;
        case 'text':
            _text2.default.draw(context, new _DataSet2.default(data), self.options);
            break;
        case 'icon':
            _icon2.default.draw(context, data, self.options);
            break;
        case 'clip':
            context.save();
            context.fillStyle = self.options.fillStyle || 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            _simple2.default.draw(context, data, self.options);
            context.beginPath();
            _simple6.default.drawDataSet(context, new _DataSet2.default(data), self.options);
            context.clip();
            (0, _clear2.default)(context);
            context.restore();
            break;
        default:
            if (self.options.context == "webgl") {
                _simple4.default.draw(self.canvasLayer.canvas.getContext('webgl'), data, self.options);
            } else {
                _simple2.default.draw(context, data, self.options);
            }
    }
    //console.timeEnd('draw');

    //console.timeEnd('update')
    self.options.updateCallback && self.options.updateCallback(time);
};

Layer.prototype.isEnabledTime = function () {

    var animationOptions = this.options.animation;

    var flag = animationOptions && !(animationOptions.enabled === false);

    return flag;
};

Layer.prototype.argCheck = function (options) {
    if (options.draw == 'heatmap') {
        if (options.strokeStyle) {
            console.warn('[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]');
        }
    }
};

Layer.prototype.init = function (options) {
    var self = this;

    self.options = options;

    this.context = self.options.context || '2d';

    self.intensity = new _Intensity2.default({
        maxSize: self.options.maxSize,
        minSize: self.options.minSize,
        gradient: self.options.gradient,
        max: self.options.max || this.dataSet.getMax('count')
    });

    self.category = new _Category2.default(self.options.splitList);
    self.choropleth = new _Choropleth2.default(self.options.splitList);
    if (self.options.splitList === undefined) {
        self.category.generateByDataSet(this.dataSet);
    }

    if (self.options.zIndex) {
        this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
    }

    if (self.options.splitList === undefined) {
        var min = self.options.min || this.dataSet.getMin('count');
        var max = self.options.max || this.dataSet.getMax('count');
        self.choropleth.generateByMinMax(min, max);
    }

    var animationOptions = self.options.animation;

    if (self.options.draw == 'time' || self.isEnabledTime()) {
        //if (!self.animator) {
        if (!animationOptions.stepsRange) {
            animationOptions.stepsRange = {
                start: this.dataSet.getMin('time') || 0,
                end: this.dataSet.getMax('time') || 0
            };
        }

        var steps = { step: animationOptions.stepsRange.start };
        self.animator = new _Tween2.default.Tween(steps).onUpdate(function () {
            self._canvasUpdate(this.step);
        }).repeat(Infinity);

        self.map.addEventListener(IMAP.Constants.MOVE_START, function () {
            if (self.isEnabledTime() && self.animator) {
                self.animator.stop();
            }
        });

        self.map.addEventListener(IMAP.Constants.MOVE_END, function () {
            if (self.isEnabledTime() && self.animator) {
                self.animator.start();
            }
        });
        //}

        var duration = animationOptions.duration * 1000 || 5000;

        self.animator.to({ step: animationOptions.stepsRange.end }, duration);
        self.animator.start();
    } else {
        self.animator && self.animator.stop();
    }
};

Layer.prototype.show = function () {
    this.map.getOverlayLayer.addOverlay(this.canvasLayer);
};

Layer.prototype.hide = function () {
    this.map.getOverlayLayer.removeOverlay(this.canvasLayer);
};

Layer.prototype.destroy = function () {
    this.unbindEvent();
    this.hide();
};

/**
 * obj.options
 */
Layer.prototype.update = function (obj) {
    var self = this;
    var _options = obj.options;
    var options = self.options;
    for (var i in _options) {
        options[i] = _options[i];
    }
    self.init(options);
    self.canvasLayer.draw();
};

Layer.prototype.setOptions = function (options) {
    var self = this;
    self.init(options);
    self.canvasLayer.draw();
};

Layer.prototype.set = function (obj) {
    var conf = {
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        strokeStyle: '#000000',
        fillStyle: '#000000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        lineDashOffset: 0,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic'
    };
    var self = this;
    var ctx = self.canvasLayer.canvas.getContext(self.context);
    for (var i in conf) {
        ctx[i] = conf[i];
    }
    self.init(obj.options);
    self.canvasLayer.draw();
};

Layer.prototype.getLegend = function (options) {
    var draw = this.options.draw;
    var legend = null;
    if (self.options.draw == 'intensity' || self.options.draw == 'heatmap') {
        return this.intensity.getLegend(options);
    }
};

exports.default = Layer;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _classCallCheck2 = __webpack_require__(25);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author Mofei<http://www.zhuwenlong.com>
 */

var MapHelper = function () {
    function MapHelper(id, type, opt) {
        (0, _classCallCheck3.default)(this, MapHelper);

        if (!id || !type) {
            console.warn('id 和 type 为必填项');
            return false;
        }

        if (type == 'baidu') {
            if (!BMap) {
                console.warn('请先引入百度地图JS API');
                return false;
            }
        } else {
            console.warn('暂不支持你的地图类型');
        }
        this.type = type;
        var center = opt && opt.center ? opt.center : [106.962497, 38.208726];
        var zoom = opt && opt.zoom ? opt.zoom : 5;
        var map = this.map = new BMap.Map(id, {
            enableMapClick: false
        });
        map.centerAndZoom(new BMap.Point(center[0], center[1]), zoom);
        map.enableScrollWheelZoom(true);

        map.setMapStyle({
            style: 'light'
        });
    }

    MapHelper.prototype.addLayer = function addLayer(datas, options) {
        if (this.type == 'baidu') {
            return new mapv.baiduMapLayer(this.map, dataSet, options);
        }
    };

    MapHelper.prototype.getMap = function getMap() {
        return this.map;
    };

    return MapHelper;
}();

// function MapHelper(dom, type, opt) {
//     var map = new BMap.Map(dom, {
//         enableMapClick: false
//     });
//     map.centerAndZoom(new BMap.Point(106.962497, 38.208726), 5);
//     map.enableScrollWheelZoom(true);

//     map.setMapStyle({
//         style: 'light'
//     });
// }

exports.default = MapHelper;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function Event() {
  this._subscribers = {}; // event subscribers
}

/**
 * Subscribe to an event, add an event listener
 * @param {String} event        Event name. Available events: 'put', 'update',
 *                              'remove'
 * @param {function} callback   Callback method. Called with three parameters:
 *                                  {String} event
 *                                  {Object | null} params
 *                                  {String | Number} senderId
 */
Event.prototype.on = function (event, callback) {
  var subscribers = this._subscribers[event];
  if (!subscribers) {
    subscribers = [];
    this._subscribers[event] = subscribers;
  }

  subscribers.push({
    callback: callback
  });
};

/**
 * Unsubscribe from an event, remove an event listener
 * @param {String} event
 * @param {function} callback
 */
Event.prototype.off = function (event, callback) {
  var subscribers = this._subscribers[event];
  if (subscribers) {
    //this._subscribers[event] = subscribers.filter(listener => listener.callback != callback);
    for (var i = 0; i < subscribers.length; i++) {
      if (subscribers[i].callback == callback) {
        subscribers.splice(i, 1);
        i--;
      }
    }
  }
};

/**
 * Trigger an event
 * @param {String} event
 * @param {Object | null} params
 * @param {String} [senderId]       Optional id of the sender.
 * @private
 */
Event.prototype._trigger = function (event, params, senderId) {
  if (event == '*') {
    throw new Error('Cannot trigger event *');
  }

  var subscribers = [];
  if (event in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers[event]);
  }
  if ('*' in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers['*']);
  }

  for (var i = 0, len = subscribers.length; i < len; i++) {
    var subscriber = subscribers[i];
    if (subscriber.callback) {
      subscriber.callback(event, params, senderId || null);
    }
  }
};

exports.default = Event;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _classCallCheck2 = __webpack_require__(25);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Timer
 * @author kyle / http://nikai.us/
 */

var Timer = function () {
    function Timer(callback, options) {
        (0, _classCallCheck3.default)(this, Timer);

        this._call = callback;
        this._runing = false;
        this.start();
    }

    Timer.prototype.start = function start() {
        this._runing = true;
        requestAnimationFrame(this._launch.bind(this));
    };

    Timer.prototype.stop = function stop() {
        this._runing = false;
    };

    Timer.prototype._launch = function _launch(timestamp) {
        if (this._runing) {
            this._call && this._call(timestamp);
            requestAnimationFrame(this._launch.bind(this));
        }
    };

    return Timer;
}();

exports.default = Timer;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * get the center by the city name
 * @author kyle / http://nikai.us/
 */

var citycenter = { municipalities: [{ n: "北京", g: "116.395645,39.929986|12" }, { n: "上海", g: "121.487899,31.249162|12" }, { n: "天津", g: "117.210813,39.14393|12" }, { n: "重庆", g: "106.530635,29.544606|12" }], provinces: [{ n: "安徽", g: "117.216005,31.859252|8", cities: [{ n: "合肥", g: "117.282699,31.866942|12" }, { n: "安庆", g: "117.058739,30.537898|13" }, { n: "蚌埠", g: "117.35708,32.929499|13" }, { n: "亳州", g: "115.787928,33.871211|13" }, { n: "巢湖", g: "117.88049,31.608733|13" }, { n: "池州", g: "117.494477,30.660019|14" }, { n: "滁州", g: "118.32457,32.317351|13" }, { n: "阜阳", g: "115.820932,32.901211|13" }, { n: "淮北", g: "116.791447,33.960023|13" }, { n: "淮南", g: "117.018639,32.642812|13" }, { n: "黄山", g: "118.29357,29.734435|13" }, { n: "六安", g: "116.505253,31.755558|13" }, { n: "马鞍山", g: "118.515882,31.688528|13" }, { n: "宿州", g: "116.988692,33.636772|13" }, { n: "铜陵", g: "117.819429,30.94093|14" }, { n: "芜湖", g: "118.384108,31.36602|12" }, { n: "宣城", g: "118.752096,30.951642|13" }] }, { n: "福建", g: "117.984943,26.050118|8", cities: [{ n: "福州", g: "119.330221,26.047125|12" }, { n: "龙岩", g: "117.017997,25.078685|13" }, { n: "南平", g: "118.181883,26.643626|13" }, { n: "宁德", g: "119.542082,26.656527|14" }, { n: "莆田", g: "119.077731,25.44845|13" }, { n: "泉州", g: "118.600362,24.901652|12" }, { n: "三明", g: "117.642194,26.270835|14" }, { n: "厦门", g: "118.103886,24.489231|12" }, { n: "漳州", g: "117.676205,24.517065|12" }] }, { n: "甘肃", g: "102.457625,38.103267|6", cities: [{ n: "兰州", g: "103.823305,36.064226|12" }, { n: "白银", g: "104.171241,36.546682|13" }, { n: "定西", g: "104.626638,35.586056|13" }, { n: "甘南州", g: "102.917442,34.992211|14" }, { n: "嘉峪关", g: "98.281635,39.802397|13" }, { n: "金昌", g: "102.208126,38.516072|13" }, { n: "酒泉", g: "98.508415,39.741474|13" }, { n: "临夏州", g: "103.215249,35.598514|13" }, { n: "陇南", g: "104.934573,33.39448|14" }, { n: "平凉", g: "106.688911,35.55011|13" }, { n: "庆阳", g: "107.644227,35.726801|13" }, { n: "天水", g: "105.736932,34.584319|13" }, { n: "武威", g: "102.640147,37.933172|13" }, { n: "张掖", g: "100.459892,38.93932|13" }] }, { n: "广东", g: "113.394818,23.408004|8", cities: [{ n: "广州", g: "113.30765,23.120049|12" }, { n: "潮州", g: "116.630076,23.661812|13" }, { n: "东莞", g: "113.763434,23.043024|12" }, { n: "佛山", g: "113.134026,23.035095|13" }, { n: "河源", g: "114.713721,23.757251|12" }, { n: "惠州", g: "114.410658,23.11354|12" }, { n: "江门", g: "113.078125,22.575117|13" }, { n: "揭阳", g: "116.379501,23.547999|13" }, { n: "茂名", g: "110.931245,21.668226|13" }, { n: "梅州", g: "116.126403,24.304571|13" }, { n: "清远", g: "113.040773,23.698469|13" }, { n: "汕头", g: "116.72865,23.383908|13" }, { n: "汕尾", g: "115.372924,22.778731|14" }, { n: "韶关", g: "113.594461,24.80296|13" }, { n: "深圳", g: "114.025974,22.546054|12" }, { n: "阳江", g: "111.97701,21.871517|14" }, { n: "云浮", g: "112.050946,22.937976|13" }, { n: "湛江", g: "110.365067,21.257463|13" }, { n: "肇庆", g: "112.479653,23.078663|13" }, { n: "中山", g: "113.42206,22.545178|12" }, { n: "珠海", g: "113.562447,22.256915|13" }] }, { n: "广西", g: "108.924274,23.552255|7", cities: [{ n: "南宁", g: "108.297234,22.806493|12" }, { n: "百色", g: "106.631821,23.901512|13" }, { n: "北海", g: "109.122628,21.472718|13" }, { n: "崇左", g: "107.357322,22.415455|14" }, { n: "防城港", g: "108.351791,21.617398|15" }, { n: "桂林", g: "110.26092,25.262901|12" }, { n: "贵港", g: "109.613708,23.103373|13" }, { n: "河池", g: "108.069948,24.699521|14" }, { n: "贺州", g: "111.552594,24.411054|14" }, { n: "来宾", g: "109.231817,23.741166|14" }, { n: "柳州", g: "109.422402,24.329053|12" }, { n: "钦州", g: "108.638798,21.97335|13" }, { n: "梧州", g: "111.305472,23.485395|13" }, { n: "玉林", g: "110.151676,22.643974|14" }] }, { n: "贵州", g: "106.734996,26.902826|8", cities: [{ n: "贵阳", g: "106.709177,26.629907|12" }, { n: "安顺", g: "105.92827,26.228595|13" }, { n: "毕节地区", g: "105.300492,27.302612|14" }, { n: "六盘水", g: "104.852087,26.591866|13" }, { n: "铜仁地区", g: "109.196161,27.726271|14" }, { n: "遵义", g: "106.93126,27.699961|13" }, { n: "黔西南州", g: "104.900558,25.095148|11" }, { n: "黔东南州", g: "107.985353,26.583992|11" }, { n: "黔南州", g: "107.523205,26.264536|11" }] }, { n: "海南", g: "109.733755,19.180501|9", cities: [{ n: "海口", g: "110.330802,20.022071|13" }, { n: "白沙", g: "109.358586,19.216056|12" }, { n: "保亭", g: "109.656113,18.597592|12" }, { n: "昌江", g: "109.0113,19.222483|12" }, { n: "儋州", g: "109.413973,19.571153|13" }, { n: "澄迈", g: "109.996736,19.693135|13" }, { n: "东方", g: "108.85101,18.998161|13" }, { n: "定安", g: "110.32009,19.490991|13" }, { n: "琼海", g: "110.414359,19.21483|13" }, { n: "琼中", g: "109.861849,19.039771|12" }, { n: "乐东", g: "109.062698,18.658614|12" }, { n: "临高", g: "109.724101,19.805922|13" }, { n: "陵水", g: "109.948661,18.575985|12" }, { n: "三亚", g: "109.522771,18.257776|12" }, { n: "屯昌", g: "110.063364,19.347749|13" }, { n: "万宁", g: "110.292505,18.839886|13" }, { n: "文昌", g: "110.780909,19.750947|13" }, { n: "五指山", g: "109.51775,18.831306|13" }] }, { n: "河北", g: "115.661434,38.61384|7", cities: [{ n: "石家庄", g: "114.522082,38.048958|12" }, { n: "保定", g: "115.49481,38.886565|13" }, { n: "沧州", g: "116.863806,38.297615|13" }, { n: "承德", g: "117.933822,40.992521|14" }, { n: "邯郸", g: "114.482694,36.609308|13" }, { n: "衡水", g: "115.686229,37.746929|13" }, { n: "廊坊", g: "116.703602,39.518611|13" }, { n: "秦皇岛", g: "119.604368,39.945462|12" }, { n: "唐山", g: "118.183451,39.650531|13" }, { n: "邢台", g: "114.520487,37.069531|13" }, { n: "张家口", g: "114.893782,40.811188|13" }] }, { n: "河南", g: "113.486804,34.157184|7", cities: [{ n: "郑州", g: "113.649644,34.75661|12" }, { n: "安阳", g: "114.351807,36.110267|12" }, { n: "鹤壁", g: "114.29777,35.755426|13" }, { n: "焦作", g: "113.211836,35.234608|13" }, { n: "开封", g: "114.351642,34.801854|13" }, { n: "洛阳", g: "112.447525,34.657368|12" }, { n: "漯河", g: "114.046061,33.576279|13" }, { n: "南阳", g: "112.542842,33.01142|13" }, { n: "平顶山", g: "113.300849,33.745301|13" }, { n: "濮阳", g: "115.026627,35.753298|12" }, { n: "三门峡", g: "111.181262,34.78332|13" }, { n: "商丘", g: "115.641886,34.438589|13" }, { n: "新乡", g: "113.91269,35.307258|13" }, { n: "信阳", g: "114.085491,32.128582|13" }, { n: "许昌", g: "113.835312,34.02674|13" }, { n: "周口", g: "114.654102,33.623741|13" }, { n: "驻马店", g: "114.049154,32.983158|13" }] }, { n: "黑龙江", g: "128.047414,47.356592|6", cities: [{ n: "哈尔滨", g: "126.657717,45.773225|12" }, { n: "大庆", g: "125.02184,46.596709|12" }, { n: "大兴安岭地区", g: "124.196104,51.991789|10" }, { n: "鹤岗", g: "130.292472,47.338666|13" }, { n: "黑河", g: "127.50083,50.25069|14" }, { n: "鸡西", g: "130.941767,45.32154|13" }, { n: "佳木斯", g: "130.284735,46.81378|12" }, { n: "牡丹江", g: "129.608035,44.588521|13" }, { n: "七台河", g: "131.019048,45.775005|14" }, { n: "齐齐哈尔", g: "123.987289,47.3477|13" }, { n: "双鸭山", g: "131.171402,46.655102|13" }, { n: "绥化", g: "126.989095,46.646064|13" }, { n: "伊春", g: "128.910766,47.734685|14" }] }, { n: "湖北", g: "112.410562,31.209316|8", cities: [{ n: "武汉", g: "114.3162,30.581084|12" }, { n: "鄂州", g: "114.895594,30.384439|14" }, { n: "恩施", g: "109.517433,30.308978|14" }, { n: "黄冈", g: "114.906618,30.446109|14" }, { n: "黄石", g: "115.050683,30.216127|13" }, { n: "荆门", g: "112.21733,31.042611|13" }, { n: "荆州", g: "112.241866,30.332591|12" }, { n: "潜江", g: "112.768768,30.343116|13" }, { n: "神农架林区", g: "110.487231,31.595768|13" }, { n: "十堰", g: "110.801229,32.636994|13" }, { n: "随州", g: "113.379358,31.717858|13" }, { n: "天门", g: "113.12623,30.649047|13" }, { n: "仙桃", g: "113.387448,30.293966|13" }, { n: "咸宁", g: "114.300061,29.880657|13" }, { n: "襄阳", g: "112.176326,32.094934|12" }, { n: "孝感", g: "113.935734,30.927955|13" }, { n: "宜昌", g: "111.310981,30.732758|13" }] }, { n: "湖南", g: "111.720664,27.695864|7", cities: [{ n: "长沙", g: "112.979353,28.213478|12" }, { n: "常德", g: "111.653718,29.012149|12" }, { n: "郴州", g: "113.037704,25.782264|13" }, { n: "衡阳", g: "112.583819,26.898164|13" }, { n: "怀化", g: "109.986959,27.557483|13" }, { n: "娄底", g: "111.996396,27.741073|13" }, { n: "邵阳", g: "111.461525,27.236811|13" }, { n: "湘潭", g: "112.935556,27.835095|13" }, { n: "湘西州", g: "109.745746,28.317951|14" }, { n: "益阳", g: "112.366547,28.588088|13" }, { n: "永州", g: "111.614648,26.435972|13" }, { n: "岳阳", g: "113.146196,29.378007|13" }, { n: "张家界", g: "110.48162,29.124889|13" }, { n: "株洲", g: "113.131695,27.827433|13" }] }, { n: "江苏", g: "119.368489,33.013797|8", cities: [{ n: "南京", g: "118.778074,32.057236|12" }, { n: "常州", g: "119.981861,31.771397|12" }, { n: "淮安", g: "119.030186,33.606513|12" }, { n: "连云港", g: "119.173872,34.601549|12" }, { n: "南通", g: "120.873801,32.014665|12" }, { n: "苏州", g: "120.619907,31.317987|12" }, { n: "宿迁", g: "118.296893,33.95205|13" }, { n: "泰州", g: "119.919606,32.476053|13" }, { n: "无锡", g: "120.305456,31.570037|12" }, { n: "徐州", g: "117.188107,34.271553|12" }, { n: "盐城", g: "120.148872,33.379862|12" }, { n: "扬州", g: "119.427778,32.408505|13" }, { n: "镇江", g: "119.455835,32.204409|13" }] }, { n: "江西", g: "115.676082,27.757258|7", cities: [{ n: "南昌", g: "115.893528,28.689578|12" }, { n: "抚州", g: "116.360919,27.954545|13" }, { n: "赣州", g: "114.935909,25.845296|13" }, { n: "吉安", g: "114.992039,27.113848|13" }, { n: "景德镇", g: "117.186523,29.303563|12" }, { n: "九江", g: "115.999848,29.71964|13" }, { n: "萍乡", g: "113.859917,27.639544|13" }, { n: "上饶", g: "117.955464,28.457623|13" }, { n: "新余", g: "114.947117,27.822322|13" }, { n: "宜春", g: "114.400039,27.81113|13" }, { n: "鹰潭", g: "117.03545,28.24131|13" }] }, { n: "吉林", g: "126.262876,43.678846|7", cities: [{ n: "长春", g: "125.313642,43.898338|12" }, { n: "白城", g: "122.840777,45.621086|13" }, { n: "白山", g: "126.435798,41.945859|13" }, { n: "吉林市", g: "126.564544,43.871988|12" }, { n: "辽源", g: "125.133686,42.923303|13" }, { n: "四平", g: "124.391382,43.175525|12" }, { n: "松原", g: "124.832995,45.136049|13" }, { n: "通化", g: "125.94265,41.736397|13" }, { n: "延边", g: "129.485902,42.896414|13" }] }, { n: "辽宁", g: "122.753592,41.6216|8", cities: [{ n: "沈阳", g: "123.432791,41.808645|12" }, { n: "鞍山", g: "123.007763,41.118744|13" }, { n: "本溪", g: "123.778062,41.325838|12" }, { n: "朝阳", g: "120.446163,41.571828|13" }, { n: "大连", g: "121.593478,38.94871|12" }, { n: "丹东", g: "124.338543,40.129023|12" }, { n: "抚顺", g: "123.92982,41.877304|12" }, { n: "阜新", g: "121.660822,42.01925|14" }, { n: "葫芦岛", g: "120.860758,40.74303|13" }, { n: "锦州", g: "121.147749,41.130879|13" }, { n: "辽阳", g: "123.172451,41.273339|14" }, { n: "盘锦", g: "122.073228,41.141248|13" }, { n: "铁岭", g: "123.85485,42.299757|13" }, { n: "营口", g: "122.233391,40.668651|13" }] }, { n: "内蒙古", g: "114.415868,43.468238|5", cities: [{ n: "呼和浩特", g: "111.660351,40.828319|12" }, { n: "阿拉善盟", g: "105.695683,38.843075|14" }, { n: "包头", g: "109.846239,40.647119|12" }, { n: "巴彦淖尔", g: "107.423807,40.76918|12" }, { n: "赤峰", g: "118.930761,42.297112|12" }, { n: "鄂尔多斯", g: "109.993706,39.81649|12" }, { n: "呼伦贝尔", g: "119.760822,49.201636|12" }, { n: "通辽", g: "122.260363,43.633756|12" }, { n: "乌海", g: "106.831999,39.683177|13" }, { n: "乌兰察布", g: "113.112846,41.022363|12" }, { n: "锡林郭勒盟", g: "116.02734,43.939705|11" }, { n: "兴安盟", g: "122.048167,46.083757|11" }] }, { n: "宁夏", g: "106.155481,37.321323|8", cities: [{ n: "银川", g: "106.206479,38.502621|12" }, { n: "固原", g: "106.285268,36.021523|13" }, { n: "石嘴山", g: "106.379337,39.020223|13" }, { n: "吴忠", g: "106.208254,37.993561|14" }, { n: "中卫", g: "105.196754,37.521124|14" }] }, { n: "青海", g: "96.202544,35.499761|7", cities: [{ n: "西宁", g: "101.767921,36.640739|12" }, { n: "果洛州", g: "100.223723,34.480485|11" }, { n: "海东地区", g: "102.085207,36.51761|11" }, { n: "海北州", g: "100.879802,36.960654|11" }, { n: "海南州", g: "100.624066,36.284364|11" }, { n: "海西州", g: "97.342625,37.373799|11" }, { n: "黄南州", g: "102.0076,35.522852|11" }, { n: "玉树州", g: "97.013316,33.00624|14" }] }, { n: "山东", g: "118.527663,36.09929|8", cities: [{ n: "济南", g: "117.024967,36.682785|12" }, { n: "滨州", g: "117.968292,37.405314|12" }, { n: "东营", g: "118.583926,37.487121|12" }, { n: "德州", g: "116.328161,37.460826|12" }, { n: "菏泽", g: "115.46336,35.26244|13" }, { n: "济宁", g: "116.600798,35.402122|13" }, { n: "莱芜", g: "117.684667,36.233654|13" }, { n: "聊城", g: "115.986869,36.455829|12" }, { n: "临沂", g: "118.340768,35.072409|12" }, { n: "青岛", g: "120.384428,36.105215|12" }, { n: "日照", g: "119.50718,35.420225|12" }, { n: "泰安", g: "117.089415,36.188078|13" }, { n: "威海", g: "122.093958,37.528787|13" }, { n: "潍坊", g: "119.142634,36.716115|12" }, { n: "烟台", g: "121.309555,37.536562|12" }, { n: "枣庄", g: "117.279305,34.807883|13" }, { n: "淄博", g: "118.059134,36.804685|12" }] }, { n: "山西", g: "112.515496,37.866566|7", cities: [{ n: "太原", g: "112.550864,37.890277|12" }, { n: "长治", g: "113.120292,36.201664|12" }, { n: "大同", g: "113.290509,40.113744|12" }, { n: "晋城", g: "112.867333,35.499834|13" }, { n: "晋中", g: "112.738514,37.693362|13" }, { n: "临汾", g: "111.538788,36.099745|13" }, { n: "吕梁", g: "111.143157,37.527316|14" }, { n: "朔州", g: "112.479928,39.337672|13" }, { n: "忻州", g: "112.727939,38.461031|12" }, { n: "阳泉", g: "113.569238,37.869529|13" }, { n: "运城", g: "111.006854,35.038859|13" }] }, { n: "陕西", g: "109.503789,35.860026|7", cities: [{ n: "西安", g: "108.953098,34.2778|12" }, { n: "安康", g: "109.038045,32.70437|13" }, { n: "宝鸡", g: "107.170645,34.364081|12" }, { n: "汉中", g: "107.045478,33.081569|13" }, { n: "商洛", g: "109.934208,33.873907|13" }, { n: "铜川", g: "108.968067,34.908368|13" }, { n: "渭南", g: "109.483933,34.502358|13" }, { n: "咸阳", g: "108.707509,34.345373|13" }, { n: "延安", g: "109.50051,36.60332|13" }, { n: "榆林", g: "109.745926,38.279439|12" }] }, { n: "四川", g: "102.89916,30.367481|7", cities: [{ n: "成都", g: "104.067923,30.679943|12" }, { n: "阿坝州", g: "102.228565,31.905763|15" }, { n: "巴中", g: "106.757916,31.869189|14" }, { n: "达州", g: "107.494973,31.214199|14" }, { n: "德阳", g: "104.402398,31.13114|13" }, { n: "甘孜州", g: "101.969232,30.055144|15" }, { n: "广安", g: "106.63572,30.463984|13" }, { n: "广元", g: "105.819687,32.44104|13" }, { n: "乐山", g: "103.760824,29.600958|13" }, { n: "凉山州", g: "102.259591,27.892393|14" }, { n: "泸州", g: "105.44397,28.89593|14" }, { n: "南充", g: "106.105554,30.800965|13" }, { n: "眉山", g: "103.84143,30.061115|13" }, { n: "绵阳", g: "104.705519,31.504701|12" }, { n: "内江", g: "105.073056,29.599462|13" }, { n: "攀枝花", g: "101.722423,26.587571|14" }, { n: "遂宁", g: "105.564888,30.557491|12" }, { n: "雅安", g: "103.009356,29.999716|13" }, { n: "宜宾", g: "104.633019,28.769675|13" }, { n: "资阳", g: "104.63593,30.132191|13" }, { n: "自贡", g: "104.776071,29.359157|13" }] }, { n: "西藏", g: "89.137982,31.367315|6", cities: [{ n: "拉萨", g: "91.111891,29.662557|13" }, { n: "阿里地区", g: "81.107669,30.404557|11" }, { n: "昌都地区", g: "97.185582,31.140576|15" }, { n: "林芝地区", g: "94.349985,29.666941|11" }, { n: "那曲地区", g: "92.067018,31.48068|14" }, { n: "日喀则地区", g: "88.891486,29.269023|14" }, { n: "山南地区", g: "91.750644,29.229027|11" }] }, { n: "新疆", g: "85.614899,42.127001|6", cities: [{ n: "乌鲁木齐", g: "87.564988,43.84038|12" }, { n: "阿拉尔", g: "81.291737,40.61568|13" }, { n: "阿克苏地区", g: "80.269846,41.171731|12" }, { n: "阿勒泰地区", g: "88.137915,47.839744|13" }, { n: "巴音郭楞", g: "86.121688,41.771362|12" }, { n: "博尔塔拉州", g: "82.052436,44.913651|11" }, { n: "昌吉州", g: "87.296038,44.007058|13" }, { n: "哈密地区", g: "93.528355,42.858596|13" }, { n: "和田地区", g: "79.930239,37.116774|13" }, { n: "喀什地区", g: "75.992973,39.470627|12" }, { n: "克拉玛依", g: "84.88118,45.594331|13" }, { n: "克孜勒苏州", g: "76.137564,39.750346|11" }, { n: "石河子", g: "86.041865,44.308259|13" }, { n: "塔城地区", g: "82.974881,46.758684|12" }, { n: "图木舒克", g: "79.198155,39.889223|13" }, { n: "吐鲁番地区", g: "89.181595,42.96047|13" }, { n: "五家渠", g: "87.565449,44.368899|13" }, { n: "伊犁州", g: "81.297854,43.922248|11" }] }, { n: "云南", g: "101.592952,24.864213|7", cities: [{ n: "昆明", g: "102.714601,25.049153|12" }, { n: "保山", g: "99.177996,25.120489|13" }, { n: "楚雄州", g: "101.529382,25.066356|13" }, { n: "大理州", g: "100.223675,25.5969|14" }, { n: "德宏州", g: "98.589434,24.44124|14" }, { n: "迪庆州", g: "99.713682,27.831029|14" }, { n: "红河州", g: "103.384065,23.367718|11" }, { n: "丽江", g: "100.229628,26.875351|13" }, { n: "临沧", g: "100.092613,23.887806|14" }, { n: "怒江州", g: "98.859932,25.860677|14" }, { n: "普洱", g: "100.980058,22.788778|14" }, { n: "曲靖", g: "103.782539,25.520758|12" }, { n: "昭通", g: "103.725021,27.340633|13" }, { n: "文山", g: "104.089112,23.401781|14" }, { n: "西双版纳", g: "100.803038,22.009433|13" }, { n: "玉溪", g: "102.545068,24.370447|13" }] }, { n: "浙江", g: "119.957202,29.159494|8", cities: [{ n: "杭州", g: "120.219375,30.259244|12" }, { n: "湖州", g: "120.137243,30.877925|12" }, { n: "嘉兴", g: "120.760428,30.773992|13" }, { n: "金华", g: "119.652576,29.102899|12" }, { n: "丽水", g: "119.929576,28.4563|13" }, { n: "宁波", g: "121.579006,29.885259|12" }, { n: "衢州", g: "118.875842,28.95691|12" }, { n: "绍兴", g: "120.592467,30.002365|13" }, { n: "台州", g: "121.440613,28.668283|13" }, { n: "温州", g: "120.690635,28.002838|12" }, { n: "舟山", g: "122.169872,30.03601|13" }] }], other: [{ n: "香港", g: "114.186124,22.293586|11" }, { n: "澳门", g: "113.557519,22.204118|13" }, { n: "台湾", g: "120.961454,23.80406|8" }] };

function getCenter(g) {
    var item = g.split("|");
    item[0] = item[0].split(",");
    return {
        lng: parseFloat(item[0][0]),
        lat: parseFloat(item[0][1])
    };
}

exports.default = {
    getCenterByCityName: function getCenterByCityName(name) {
        for (var i = 0; i < citycenter.municipalities.length; i++) {
            if (citycenter.municipalities[i].n == name) {
                return getCenter(citycenter.municipalities[i].g);
            }
        }

        var provinces = citycenter.provinces;
        for (var i = 0; i < provinces.length; i++) {
            if (provinces[i].n == name) {
                return getCenter(provinces[i].g);
            }
            var cities = provinces[i].cities;
            for (var j = 0; j < cities.length; j++) {
                if (cities[j].n == name) {
                    return getCenter(cities[j].g);
                }
            }
        }
        return null;
    }
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
  * 根据弧线的坐标节点数组
  */
function getCurvePoints(points) {
  var curvePoints = [];
  for (var i = 0; i < points.length - 1; i++) {
    var p = getCurveByTwoPoints(points[i], points[i + 1]);
    if (p && p.length > 0) {
      curvePoints = curvePoints.concat(p);
    }
  }
  return curvePoints;
}

/**
 * 根据两点获取曲线坐标点数组
 * @param Point 起点
 * @param Point 终点
 */
function getCurveByTwoPoints(obj1, obj2) {
  if (!obj1 || !obj2) {
    return null;
  }

  var B1 = function B1(x) {
    return 1 - 2 * x + x * x;
  };
  var B2 = function B2(x) {
    return 2 * x - 2 * x * x;
  };
  var B3 = function B3(x) {
    return x * x;
  };

  var curveCoordinates = [];

  var count = 40; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
  var isFuture = false;
  var t, h, h2, lat3, lng3, j, t2;
  var LnArray = [];
  var i = 0;
  var inc = 0;

  if (typeof obj2 == "undefined") {
    if (typeof curveCoordinates != "undefined") {
      curveCoordinates = [];
    }
    return;
  }

  var lat1 = parseFloat(obj1.lat);
  var lat2 = parseFloat(obj2.lat);
  var lng1 = parseFloat(obj1.lng);
  var lng2 = parseFloat(obj2.lng);

  // 计算曲线角度的方法
  if (lng2 > lng1) {
    if (parseFloat(lng2 - lng1) > 180) {
      if (lng1 < 0) {
        lng1 = parseFloat(180 + 180 + lng1);
      }
    }
  }

  if (lng1 > lng2) {
    if (parseFloat(lng1 - lng2) > 180) {
      if (lng2 < 0) {
        lng2 = parseFloat(180 + 180 + lng2);
      }
    }
  }
  j = 0;
  t2 = 0;
  if (lat2 == lat1) {
    t = 0;
    h = lng1 - lng2;
  } else if (lng2 == lng1) {
    t = Math.PI / 2;
    h = lat1 - lat2;
  } else {
    t = Math.atan((lat2 - lat1) / (lng2 - lng1));
    h = (lat2 - lat1) / Math.sin(t);
  }
  if (t2 == 0) {
    t2 = t + Math.PI / 5;
  }
  h2 = h / 2;
  lng3 = h2 * Math.cos(t2) + lng1;
  lat3 = h2 * Math.sin(t2) + lat1;

  for (i = 0; i < count + 1; i++) {
    curveCoordinates.push([lng1 * B1(inc) + lng3 * B2(inc) + lng2 * B3(inc), lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc)]);
    inc = inc + 1 / count;
  }
  return curveCoordinates;
}

function Point(lng, lat) {
  this.lng = lng;
  this.lat = lat;
}

var curve = {
  getPoints: getCurvePoints
};

exports.default = curve;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/* 
FDEB algorithm implementation [www.win.tue.nl/~dholten/papers/forcebundles_eurovis.pdf].

Author:  (github.com/upphiminn)
2013

*/

var ForceEdgeBundling = function ForceEdgeBundling() {
    var data_nodes = {},
        // {'nodeid':{'x':,'y':},..}
    data_edges = [],
        // [{'source':'nodeid1', 'target':'nodeid2'},..]
    compatibility_list_for_edge = [],
        subdivision_points_for_edge = [],
        K = 0.1,
        // global bundling constant controling edge stiffness
    S_initial = 0.1,
        // init. distance to move points
    P_initial = 1,
        // init. subdivision number
    P_rate = 2,
        // subdivision rate increase
    C = 6,
        // number of cycles to perform
    I_initial = 70,
        // init. number of iterations for cycle
    I_rate = 0.6666667,
        // rate at which iteration number decreases i.e. 2/3
    compatibility_threshold = 0.6,
        invers_quadratic_mode = false,
        eps = 1e-8;

    /*** Geometry Helper Methods ***/
    function vector_dot_product(p, q) {
        return p.x * q.x + p.y * q.y;
    }

    function edge_as_vector(P) {
        return { 'x': data_nodes[P.target].x - data_nodes[P.source].x,
            'y': data_nodes[P.target].y - data_nodes[P.source].y };
    }

    function edge_length(e) {
        return Math.sqrt(Math.pow(data_nodes[e.source].x - data_nodes[e.target].x, 2) + Math.pow(data_nodes[e.source].y - data_nodes[e.target].y, 2));
    }

    function custom_edge_length(e) {
        return Math.sqrt(Math.pow(e.source.x - e.target.x, 2) + Math.pow(e.source.y - e.target.y, 2));
    }

    function edge_midpoint(e) {
        var middle_x = (data_nodes[e.source].x + data_nodes[e.target].x) / 2.0;
        var middle_y = (data_nodes[e.source].y + data_nodes[e.target].y) / 2.0;
        return { 'x': middle_x, 'y': middle_y };
    }

    function compute_divided_edge_length(e_idx) {
        var length = 0;
        for (var i = 1; i < subdivision_points_for_edge[e_idx].length; i++) {
            var segment_length = euclidean_distance(subdivision_points_for_edge[e_idx][i], subdivision_points_for_edge[e_idx][i - 1]);
            length += segment_length;
        }
        return length;
    }

    function euclidean_distance(p, q) {
        return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
    }

    function project_point_on_line(p, Q) {
        var L = Math.sqrt((Q.target.x - Q.source.x) * (Q.target.x - Q.source.x) + (Q.target.y - Q.source.y) * (Q.target.y - Q.source.y));
        var r = ((Q.source.y - p.y) * (Q.source.y - Q.target.y) - (Q.source.x - p.x) * (Q.target.x - Q.source.x)) / (L * L);

        return { 'x': Q.source.x + r * (Q.target.x - Q.source.x), 'y': Q.source.y + r * (Q.target.y - Q.source.y) };
    }

    /*** ********************** ***/

    /*** Initialization Methods ***/
    function initialize_edge_subdivisions() {
        for (var i = 0; i < data_edges.length; i++) {
            if (P_initial == 1) subdivision_points_for_edge[i] = []; //0 subdivisions
            else {
                    subdivision_points_for_edge[i] = [];
                    subdivision_points_for_edge[i].push(data_nodes[data_edges[i].source]);
                    subdivision_points_for_edge[i].push(data_nodes[data_edges[i].target]);
                }
        }
    }

    function initialize_compatibility_lists() {
        for (var i = 0; i < data_edges.length; i++) {
            compatibility_list_for_edge[i] = [];
        } //0 compatible edges.
    }

    function filter_self_loops(edgelist) {
        var filtered_edge_list = [];
        for (var e = 0; e < edgelist.length; e++) {
            if (data_nodes[edgelist[e].source].x != data_nodes[edgelist[e].target].x && data_nodes[edgelist[e].source].y != data_nodes[edgelist[e].target].y) {
                //or smaller than eps
                filtered_edge_list.push(edgelist[e]);
            }
        }

        return filtered_edge_list;
    }
    /*** ********************** ***/

    /*** Force Calculation Methods ***/
    function apply_spring_force(e_idx, i, kP) {

        var prev = subdivision_points_for_edge[e_idx][i - 1];
        var next = subdivision_points_for_edge[e_idx][i + 1];
        var crnt = subdivision_points_for_edge[e_idx][i];

        var x = prev.x - crnt.x + next.x - crnt.x;
        var y = prev.y - crnt.y + next.y - crnt.y;

        x *= kP;
        y *= kP;

        return { 'x': x, 'y': y };
    }

    function apply_electrostatic_force(e_idx, i, S) {
        var sum_of_forces = { 'x': 0, 'y': 0 };
        var compatible_edges_list = compatibility_list_for_edge[e_idx];

        for (var oe = 0; oe < compatible_edges_list.length; oe++) {
            var force = { 'x': subdivision_points_for_edge[compatible_edges_list[oe]][i].x - subdivision_points_for_edge[e_idx][i].x,
                'y': subdivision_points_for_edge[compatible_edges_list[oe]][i].y - subdivision_points_for_edge[e_idx][i].y };

            if (Math.abs(force.x) > eps || Math.abs(force.y) > eps) {

                var diff = 1 / Math.pow(custom_edge_length({ 'source': subdivision_points_for_edge[compatible_edges_list[oe]][i],
                    'target': subdivision_points_for_edge[e_idx][i] }), 1);

                sum_of_forces.x += force.x * diff;
                sum_of_forces.y += force.y * diff;
            }
        }
        return sum_of_forces;
    }

    function apply_resulting_forces_on_subdivision_points(e_idx, P, S) {
        var kP = K / (edge_length(data_edges[e_idx]) * (P + 1)); // kP=K/|P|(number of segments), where |P| is the initial length of edge P.
        // (length * (num of sub division pts - 1))
        var resulting_forces_for_subdivision_points = [{ 'x': 0, 'y': 0 }];
        for (var i = 1; i < P + 1; i++) {
            // exclude initial end points of the edge 0 and P+1
            var resulting_force = { 'x': 0, 'y': 0 };

            var spring_force = apply_spring_force(e_idx, i, kP);
            var electrostatic_force = apply_electrostatic_force(e_idx, i, S);

            resulting_force.x = S * (spring_force.x + electrostatic_force.x);
            resulting_force.y = S * (spring_force.y + electrostatic_force.y);

            resulting_forces_for_subdivision_points.push(resulting_force);
        }
        resulting_forces_for_subdivision_points.push({ 'x': 0, 'y': 0 });
        return resulting_forces_for_subdivision_points;
    }
    /*** ********************** ***/

    /*** Edge Division Calculation Methods ***/
    function update_edge_divisions(P) {
        for (var e_idx = 0; e_idx < data_edges.length; e_idx++) {

            if (P == 1) {
                subdivision_points_for_edge[e_idx].push(data_nodes[data_edges[e_idx].source]); // source
                subdivision_points_for_edge[e_idx].push(edge_midpoint(data_edges[e_idx])); // mid point
                subdivision_points_for_edge[e_idx].push(data_nodes[data_edges[e_idx].target]); // target
            } else {

                var divided_edge_length = compute_divided_edge_length(e_idx);
                var segment_length = divided_edge_length / (P + 1);
                var current_segment_length = segment_length;
                var new_subdivision_points = [];
                new_subdivision_points.push(data_nodes[data_edges[e_idx].source]); //source

                for (var i = 1; i < subdivision_points_for_edge[e_idx].length; i++) {
                    var old_segment_length = euclidean_distance(subdivision_points_for_edge[e_idx][i], subdivision_points_for_edge[e_idx][i - 1]);

                    while (old_segment_length > current_segment_length) {
                        var percent_position = current_segment_length / old_segment_length;
                        var new_subdivision_point_x = subdivision_points_for_edge[e_idx][i - 1].x;
                        var new_subdivision_point_y = subdivision_points_for_edge[e_idx][i - 1].y;

                        new_subdivision_point_x += percent_position * (subdivision_points_for_edge[e_idx][i].x - subdivision_points_for_edge[e_idx][i - 1].x);
                        new_subdivision_point_y += percent_position * (subdivision_points_for_edge[e_idx][i].y - subdivision_points_for_edge[e_idx][i - 1].y);
                        new_subdivision_points.push({ 'x': new_subdivision_point_x,
                            'y': new_subdivision_point_y });

                        old_segment_length -= current_segment_length;
                        current_segment_length = segment_length;
                    }
                    current_segment_length -= old_segment_length;
                }
                new_subdivision_points.push(data_nodes[data_edges[e_idx].target]); //target
                subdivision_points_for_edge[e_idx] = new_subdivision_points;
            }
        }
    }
    /*** ********************** ***/

    /*** Edge compatibility measures ***/
    function angle_compatibility(P, Q) {
        var result = Math.abs(vector_dot_product(edge_as_vector(P), edge_as_vector(Q)) / (edge_length(P) * edge_length(Q)));
        return result;
    }

    function scale_compatibility(P, Q) {
        var lavg = (edge_length(P) + edge_length(Q)) / 2.0;
        var result = 2.0 / (lavg / Math.min(edge_length(P), edge_length(Q)) + Math.max(edge_length(P), edge_length(Q)) / lavg);
        return result;
    }

    function position_compatibility(P, Q) {
        var lavg = (edge_length(P) + edge_length(Q)) / 2.0;
        var midP = { 'x': (data_nodes[P.source].x + data_nodes[P.target].x) / 2.0,
            'y': (data_nodes[P.source].y + data_nodes[P.target].y) / 2.0 };
        var midQ = { 'x': (data_nodes[Q.source].x + data_nodes[Q.target].x) / 2.0,
            'y': (data_nodes[Q.source].y + data_nodes[Q.target].y) / 2.0 };
        var result = lavg / (lavg + euclidean_distance(midP, midQ));
        return result;
    }

    function edge_visibility(P, Q) {
        var I0 = project_point_on_line(data_nodes[Q.source], { 'source': data_nodes[P.source],
            'target': data_nodes[P.target] });
        var I1 = project_point_on_line(data_nodes[Q.target], { 'source': data_nodes[P.source],
            'target': data_nodes[P.target] }); //send acutal edge points positions
        var midI = { 'x': (I0.x + I1.x) / 2.0,
            'y': (I0.y + I1.y) / 2.0 };
        var midP = { 'x': (data_nodes[P.source].x + data_nodes[P.target].x) / 2.0,
            'y': (data_nodes[P.source].y + data_nodes[P.target].y) / 2.0 };
        var result = Math.max(0, 1 - 2 * euclidean_distance(midP, midI) / euclidean_distance(I0, I1));
        return result;
    }

    function visibility_compatibility(P, Q) {
        return Math.min(edge_visibility(P, Q), edge_visibility(Q, P));
    }

    function compatibility_score(P, Q) {
        var result = angle_compatibility(P, Q) * scale_compatibility(P, Q) * position_compatibility(P, Q) * visibility_compatibility(P, Q);

        return result;
    }

    function are_compatible(P, Q) {
        // console.log('compatibility ' + P.source +' - '+ P.target + ' and ' + Q.source +' '+ Q.target);
        return compatibility_score(P, Q) >= compatibility_threshold;
    }

    function compute_compatibility_lists() {
        for (var e = 0; e < data_edges.length - 1; e++) {
            for (var oe = e + 1; oe < data_edges.length; oe++) {
                // don't want any duplicates
                if (e == oe) continue;else {
                    if (are_compatible(data_edges[e], data_edges[oe])) {
                        compatibility_list_for_edge[e].push(oe);
                        compatibility_list_for_edge[oe].push(e);
                    }
                }
            }
        }
    }

    /*** ************************ ***/

    /*** Main Bundling Loop Methods ***/
    var forcebundle = function forcebundle() {
        var S = S_initial;
        var I = I_initial;
        var P = P_initial;

        initialize_edge_subdivisions();
        initialize_compatibility_lists();
        update_edge_divisions(P);
        compute_compatibility_lists();
        for (var cycle = 0; cycle < C; cycle++) {
            for (var iteration = 0; iteration < I; iteration++) {
                var forces = [];
                for (var edge = 0; edge < data_edges.length; edge++) {
                    forces[edge] = apply_resulting_forces_on_subdivision_points(edge, P, S);
                }
                for (var e = 0; e < data_edges.length; e++) {
                    for (var i = 0; i < P + 1; i++) {
                        subdivision_points_for_edge[e][i].x += forces[e][i].x;
                        subdivision_points_for_edge[e][i].y += forces[e][i].y;
                    }
                }
            }
            //prepare for next cycle
            S = S / 2;
            P = P * 2;
            I = I_rate * I;

            update_edge_divisions(P);
            // console.log('C' + cycle);
            // console.log('P' + P);
            // console.log('S' + S);
        }
        return subdivision_points_for_edge;
    };
    /*** ************************ ***/

    /*** Getters/Setters Methods ***/
    forcebundle.nodes = function (nl) {
        if (arguments.length == 0) {
            return data_nodes;
        } else {
            data_nodes = nl;
        }
        return forcebundle;
    };

    forcebundle.edges = function (ll) {
        if (arguments.length == 0) {
            return data_edges;
        } else {
            data_edges = filter_self_loops(ll); //remove edges to from to the same point
        }
        return forcebundle;
    };

    forcebundle.bundling_stiffness = function (k) {
        if (arguments.length == 0) {
            return K;
        } else {
            K = k;
        }
        return forcebundle;
    };

    forcebundle.step_size = function (step) {
        if (arguments.length == 0) {
            return S_initial;
        } else {
            S_initial = step;
        }
        return forcebundle;
    };

    forcebundle.cycles = function (c) {
        if (arguments.length == 0) {
            return C;
        } else {
            C = c;
        }
        return forcebundle;
    };

    forcebundle.iterations = function (i) {
        if (arguments.length == 0) {
            return I_initial;
        } else {
            I_initial = i;
        }
        return forcebundle;
    };

    forcebundle.iterations_rate = function (i) {
        if (arguments.length == 0) {
            return I_rate;
        } else {
            I_rate = i;
        }
        return forcebundle;
    };

    forcebundle.subdivision_points_seed = function (p) {
        if (arguments.length == 0) {
            return P;
        } else {
            P = p;
        }
        return forcebundle;
    };

    forcebundle.subdivision_rate = function (r) {
        if (arguments.length == 0) {
            return P_rate;
        } else {
            P_rate = r;
        }
        return forcebundle;
    };

    forcebundle.compatbility_threshold = function (t) {
        if (arguments.length == 0) {
            return compatbility_threshold;
        } else {
            compatibility_threshold = t;
        }
        return forcebundle;
    };

    /*** ************************ ***/

    return forcebundle;
};

exports.default = ForceEdgeBundling;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function draw(gl, data, options) {

    if (!data) {
        return;
    }

    var vs, fs, vs_s, fs_s;

    vs = gl.createShader(gl.VERTEX_SHADER);
    fs = gl.createShader(gl.FRAGMENT_SHADER);

    vs_s = ['attribute vec4 a_Position;', 'void main() {', 'gl_Position = a_Position;', 'gl_PointSize = 30.0;', '}'].join('');

    fs_s = ['precision mediump float;', 'uniform vec4 u_FragColor;', 'void main() {', 'gl_FragColor = u_FragColor;', '}'].join('');

    var program = gl.createProgram();
    gl.shaderSource(vs, vs_s);
    gl.compileShader(vs);
    gl.shaderSource(fs, fs_s);
    gl.compileShader(fs);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = options.strokeStyle || 'red';
    tmpCtx.fillRect(0, 0, 1, 1);
    var colored = tmpCtx.getImageData(0, 0, 1, 1).data;

    gl.uniform4f(uFragColor, colored[0] / 255, colored[1] / 255, colored[2] / 255, colored[3] / 255);

    gl.lineWidth(options.lineWidth || 1);

    for (var i = 0, len = data.length; i < len; i++) {
        var _geometry = data[i].geometry._coordinates;

        var verticesData = [];

        for (var j = 0; j < _geometry.length; j++) {
            var item = _geometry[j];

            var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
            var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;
            verticesData.push(x, y);
        }
        var vertices = new Float32Array(verticesData);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINE_STRIP, 0, _geometry.length);
    }
};

exports.default = {
    draw: draw
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function draw(gl, data, options) {

    if (!data) {
        return;
    }

    var vs, fs, vs_s, fs_s;

    vs = gl.createShader(gl.VERTEX_SHADER);
    fs = gl.createShader(gl.FRAGMENT_SHADER);

    vs_s = ['attribute vec4 a_Position;', 'attribute float a_PointSize;', 'void main() {', 'gl_Position = a_Position;', 'gl_PointSize = a_PointSize;', '}'].join('');

    fs_s = ['precision mediump float;', 'uniform vec4 u_FragColor;', 'void main() {', 'gl_FragColor = u_FragColor;', '}'].join('');

    var program = gl.createProgram();
    gl.shaderSource(vs, vs_s);
    gl.compileShader(vs);
    gl.shaderSource(fs, fs_s);
    gl.compileShader(fs);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    var verticesData = [];
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        var item = data[i].geometry._coordinates;

        var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
        var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;

        if (x < -1 || x > 1 || y < -1 || y > 1) {
            continue;
        }
        verticesData.push(x, y);
        count++;
    }

    var vertices = new Float32Array(verticesData);
    var n = count; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttrib1f(a_PointSize, options._size);

    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = options.fillStyle;
    tmpCtx.fillRect(0, 0, 1, 1);
    var colored = tmpCtx.getImageData(0, 0, 1, 1).data;

    gl.uniform4f(uFragColor, colored[0] / 255, colored[1] / 255, colored[2] / 255, colored[3] / 255);
    gl.drawArrays(gl.POINTS, 0, n);
};

exports.default = {
    draw: draw
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(78), __esModule: true };

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(76);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(75);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(103);
__webpack_require__(101);
__webpack_require__(104);
__webpack_require__(105);
module.exports = __webpack_require__(26).Symbol;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(102);
__webpack_require__(106);
module.exports = __webpack_require__(38).f('iterator');

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(4)
  , toLength  = __webpack_require__(98)
  , toIndex   = __webpack_require__(97);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(80);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(21)
  , gOPS    = __webpack_require__(52)
  , pIE     = __webpack_require__(31);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(45);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(45);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(50)
  , descriptor     = __webpack_require__(22)
  , setToStringTag = __webpack_require__(32)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(9)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(21)
  , toIObject = __webpack_require__(4);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(23)('meta')
  , isObject = __webpack_require__(20)
  , has      = __webpack_require__(3)
  , setDesc  = __webpack_require__(8).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(19)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(8)
  , anObject = __webpack_require__(18)
  , getKeys  = __webpack_require__(21);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(31)
  , createDesc     = __webpack_require__(22)
  , toIObject      = __webpack_require__(4)
  , toPrimitive    = __webpack_require__(36)
  , has            = __webpack_require__(3)
  , IE8_DOM_DEFINE = __webpack_require__(48)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(4)
  , gOPN      = __webpack_require__(51).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(3)
  , toObject    = __webpack_require__(99)
  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(35)
  , defined   = __webpack_require__(27);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(35)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(35)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(27);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(81)
  , step             = __webpack_require__(89)
  , Iterators        = __webpack_require__(29)
  , toIObject        = __webpack_require__(4);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(49)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 101 */
/***/ (function(module, exports) {



/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(96)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(49)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(3)
  , DESCRIPTORS    = __webpack_require__(6)
  , $export        = __webpack_require__(47)
  , redefine       = __webpack_require__(54)
  , META           = __webpack_require__(91).KEY
  , $fails         = __webpack_require__(19)
  , shared         = __webpack_require__(34)
  , setToStringTag = __webpack_require__(32)
  , uid            = __webpack_require__(23)
  , wks            = __webpack_require__(9)
  , wksExt         = __webpack_require__(38)
  , wksDefine      = __webpack_require__(37)
  , keyOf          = __webpack_require__(90)
  , enumKeys       = __webpack_require__(84)
  , isArray        = __webpack_require__(87)
  , anObject       = __webpack_require__(18)
  , toIObject      = __webpack_require__(4)
  , toPrimitive    = __webpack_require__(36)
  , createDesc     = __webpack_require__(22)
  , _create        = __webpack_require__(50)
  , gOPNExt        = __webpack_require__(94)
  , $GOPD          = __webpack_require__(93)
  , $DP            = __webpack_require__(8)
  , $keys          = __webpack_require__(21)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(51).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(31).f  = $propertyIsEnumerable;
  __webpack_require__(52).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(30)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(7)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37)('asyncIterator');

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37)('observable');

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(100);
var global        = __webpack_require__(2)
  , hide          = __webpack_require__(7)
  , Iterators     = __webpack_require__(29)
  , TO_STRING_TAG = __webpack_require__(9)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(55);

var mapv = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.mapv = mapv; /**
                     * Created by Administrator on 2017/2/9/009.
                     */

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/**
 * Created by 25106 on 2017-02-23.
 */

exports.default = {
    lonLat2Mercator: function lonLat2Mercator(lng, lat) {
        var R = 6378137;
        var MAX_LATITUDE = 85.0511287798;
        var e = Math.PI / 180,
            i = MAX_LATITUDE,
            n = Math.max(Math.min(i, lat), -i),
            s = Math.sin(n * e);
        return [R * lng * e, R * Math.log((1 + s) / (1 - s)) / 2];
    },
    round: function round(point) {
        return {
            x: Math.round(point.x),
            y: Math.round(point.y)
        };
    },
    subtract: function subtract(pixelOrigin) {
        return this.x -= pixelOrigin.x, this.y -= pixelOrigin.y, this;
    },
    scale: function scale(zoom) {
        return 256 * Math.pow(2, zoom);
    }
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map