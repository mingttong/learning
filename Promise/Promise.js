
/**
 * Promise类
 * @param {Function} cb 回调函数
 */

var warn = function (msg) {
  console.warn(msg);
};

var STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

var inBrowser = typeof window !== 'undefined';

var nextTick = function (cb) {
  if (inBrowser) {

  } else {
    process.nextTick(cb);
  }
};

/**
 * 
 * @param {constructor} cb 
 */
var Promise = function (cb) {
  if (!this instanceof Promise) {
    return new Promise(cb);
  }

  cb.call(this, this.resolve.bind(this), this.reject.bind(this));
};

Promise.resolve = function (v) {
  return new Promise(function (resolve) {
    resolve(v);
  });
};
Promise.reject = function (v) {
  return new Promise(function (resolve, reject) {
    reject(v);
  });
};
Promise.all = function (iterable) {
  var counter = 0;
  var len = iterable.length;
  var result = [];
  var _resolve = [null];
  [].forEach.call(iterable, function (p, index) {
    p.then(function (v) {
      counter++;
      result[index] = v;
      if (counter === len) {
        _resolve && _resolve(result);
      }
    });
  });

  return new Promise(function (resolve) {
    _resolve = resolve;
  });
};
Promise.race = function (iterable) {
  var _resolve = null;
  var settled = false;
  [].forEach.call(iterable, function (p, index) {
    p.then(function (v) {
      if (settled) {
        return;
      }
      settled = true;
      _resolve && _resolve(v);
    });
  });
  return new Promise(function (resolve) {
    _resolve = resolve;
  });
}

/**
 * 成功执行
 */
Promise.prototype.resolve = function (result) {
  // TODO: 重复代码
  if (result instanceof Promise) {
    return result.then(this.resolve.bind(this), this.reject.bind(this));
  }
  if (this._isSettled()) {
    warn('promise has already been settled!')
    return;
  }

  this._status = STATUS.FULFILLED;
  this._handleResult(result);
}

/**
 * 失败
 */
Promise.prototype.reject = function (result) {
  // TODO: 重复代码
  if (result instanceof Promise) {
    return result.then(this.resolve, this.reject);
  }

  if (this._isSettled()) {
    warn('promise has already been settled!')
    return;
  }

  this._status = STATUS.REJECTED;
  this._handleResult(result);
}

/**
 * 收集解决回调，放入当前实例解决回调队列，并返回新的promise
 * @param {Function} onFulfilled
 * @param {Function} onRejected 可选
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
  this._resolveHandler = onFulfilled;
  this._rejectHandler = onRejected;

  var that = this;
  return new Promise((function (resolve, reject ) {
    that._nextResolve = resolve;
    that._nextReject = reject;
  }));
};

/**
 * 收集拒绝回调，放入当前实例拒绝回调队列，并返回新的promise
 */
Promise.prototype.catch = function (onRejection) {
  this._rejectHandler = onRejection;

  var that = this;
  return new Promise(function (resolve, reject) {
    that._nextResolve = resolve;
    that._nextReject = reject;
  });
};

Promise.prototype.finally = function (onFinally) {
  this._finalHandler = onFinally;

  var that = this;
  return new Promise(function (resolve, reject) {
    that._nextResolve = resolve;
    that._nextReject = reject;
  });
}

/** 私有方法 */

Promise.prototype._isSettled = function () {
  return this._status === STATUS.FULFILLED || this._status === STATUS.REJECTED;
}
/**
 * 处理结果
 * @param {any | Promise} result 返回的结果
 */
Promise.prototype._handleResult = function (result) {
  var that = this;
  nextTick(function () {
    if (that._status == STATUS.FULFILLED && that._resolveHandler) {
      // 执行成功回调
      var res = that._resolveHandler.call(null, result);
      // 将回调执行结果传递给下一个函数
      that._nextResolve && that._nextResolve(res);
    }
    // 状态rejected，并且有reject回调
    if (that._status == STATUS.REJECTED && that._rejectHandler) {
      var res = that._rejectHandler.call(null, result); 
      // 处理完错误后，将结果返回给下一个函数
      that._nextResolve && that._nextResolve(res);
    }
    // 状态rejected，并且没有reject回调，将结果往后传递
    if (that._status == STATUS.REJECTED && !that._rejectHandler) {
      that._nextReject && that._nextReject(result);
    }

    // finally，保留原结果
    if (that._finalHandler) {
      if (that._status == STATUS.FULFILLED) {
        that._nextResolve && that._nextResolve(result);
      }
      if (that._status == STATUS.REJECTED) {
        that._nextReject && that._nextReject(result);
      }
      that._finalHandler && that._finalHandler();
    }
  })
}

/** 私有属性 */

// 当前promsie状态
Promise.prototype._status = STATUS.PENDING;

// 解决回调
Promise.prototype._resolveHandler = null;
// 拒绝回调
Promise.prototype._rejectHandler = null;
// finally回调
Promise.prototype._finalHandler = null;

// 触发下一个promise解决
Promise.prototype._nextResolve = null;
// 触发下一个promise拒绝
Promise.prototype._nextReject = null;

module.exports = Promise;