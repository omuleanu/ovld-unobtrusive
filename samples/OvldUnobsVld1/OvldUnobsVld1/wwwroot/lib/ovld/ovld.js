(function(global) {
  const inputFilter = '[name]:not([type="checkbox"])';
  const changeEventsArr = ["change", "input"];
  const rules = {
    req: function({ v }) {
      return !v || !v.trim();
    },
    minlen: function(min) {
      return function({ v }) {
        return v && v.length < min;
      };
    },
    maxlen: function(max) {
      return function({ v }) {
        return v && v.length > max;
      };
    },
    len: function({ min, max }) {
      return function(o) {
        return rules.minlen(min)(o) || rules.maxlen(max)(o);
      };
    }
  };
  const core = { find, attr, val, addClass, remClass, append, empty };
  function find(cont, filter) {
    return cont.querySelectorAll(filter);
  }
  function attr(elm, name) {
    return elm.getAttribute(name);
  }
  function val(elm) {
    return elm.value;
  }
  function addClass(elm, name) {
    elm.classList.add(name);
  }
  function remClass(elm, name) {
    elm.classList.remove(name);
  }
  function append(elm, html) {
    elm.insertAdjacentHtml(html);
  }
  function empty(elm) {
    elm && (elm.innerHTML = "");
  }
  function validateCont({ opt, cont, event }) {
    let result = {};
    find(cont, inputFilter).forEach(function(input) {
      const checkRes = chkInp(opt, input, event);
      if (checkRes && Object.keys(checkRes).length > 0) {
        result = { ...result, ...checkRes };
      }
    });
    return result;
  }
  function chkInp(opt, input, event) {
    if (opt.ignore && opt.ignore(input) || ovld.ignore(input)) return;
    const name = attr(input, "name");
    if (!name) return;
    const res = {};
    if (opt.tched) {
      opt.tched[name] = input;
    }
    res[name] = { input, rules: chkRulesFor({ opt, name, event, input }) };
    const related = opt.related;
    if (opt.tched && related && related[name]) {
      related[name].forEach(function(rname) {
        const relInput = opt.tched[rname];
        if (relInput) {
          res[rname] = { input: relInput, rules: chkRulesFor({ opt, name: rname, event, input: relInput }) };
        }
      });
    }
    return res;
  }
  function chkRulesFor({ opt, name, event, input }) {
    let invRules = [];
    let rls = (opt.getRules ? opt.getRules() : opt.rules)[name];
    if (!rls) return invRules;
    if (!Array.isArray(rls)) rls = [rls];
    rls.forEach(function(rule) {
      var checkRes = rule.chk({ v: val(input), event, input, name });
      if (checkRes) {
        invRules.push(checkRes.msg ? checkRes : rule);
        return false;
      }
    });
    return invRules;
  }
  function applyToDoc({ opt, res }) {
    Object.entries(res).forEach(([name, { input, rules: rules2 }]) => {
      const msgc = opt.msgCont({ input, name });
      empty(msgc);
      if (!rules2 || !rules2.length) ;
      else if (msgc.matches("[data-valmsg-replace]")) {
        addClass(msgc, "field-validation-error");
        remClass(msgc, "field-validation-valid");
        msgc.innerHTML = rules2[0].msg;
      } else {
        append(msgc, '<div class="field-validation-error">' + rules2[0].msg + "</div>");
      }
    });
  }
  function isResValid(res) {
    return !Object.values(res).some(({ rules: rules2 }) => rules2.length);
  }
  function bind(nodes, events, handler, flt) {
    const $ = window.jQuery;
    if ($) {
      const ename = events.join(" ");
      $(nodes).on(ename, flt, handler);
      return [() => $(nodes).off(ename, flt, handler)];
    }
    let unbinds = [];
    let fhandler = handler;
    if (flt) {
      fhandler = function(event) {
        if (event.target.matches(flt)) {
          handler.call(this, event);
        }
      };
    }
    if (nodes instanceof NodeList) {
      nodes = [...nodes];
    } else {
      nodes = [nodes];
    }
    nodes.forEach(function(node) {
      events.forEach(function(ev) {
        node.addEventListener(ev, fhandler);
        unbinds.push(() => node.removeEventListener(ev, fhandler));
      });
    });
    return unbinds;
  }
  const ovld = {
    core,
    ignore: function(inp) {
    },
    rules,
    validate: function(opt) {
      return validateCont({ opt, cont: opt.cont });
    },
    /**
     *  Performs an example operation. 
     * @param {Object} opt - options 
     * @param {string} options.selector - container selector 
     * @param {string} options.subev - submit event, check on event         
     */
    bind: function(opt) {
      opt.tched = {};
      const conts = opt.cont || find(document, opt.selector);
      let unbinds = [];
      unbinds.push(...bind(conts, changeEventsArr, onInput, inputFilter));
      if (opt.subev) {
        unbinds.push(...bind(conts, [opt.subev], onSubmit));
      }
      function onInput(e) {
        const input = e.target;
        const type = attr(input, "type");
        if (type == "checkbox" || type == "radio") {
          return;
        }
        const res = chkInp(opt, input, e);
        if (res) {
          applyToDoc({ opt, res });
        }
      }
      function onSubmit(ev, evData) {
        const res = validateCont({ opt, cont: ev.target, event: ev });
        applyToDoc({ opt, res });
        if (!isResValid(res)) {
          ev.preventDefault();
          if (evData) {
            evData.cancel = 1;
            evData.target = this;
          }
        }
      }
      return {
        destroy: function() {
          unbinds.forEach((f) => f());
        }
      };
    }
  };
  global.ovld = ovld;
})(window);
