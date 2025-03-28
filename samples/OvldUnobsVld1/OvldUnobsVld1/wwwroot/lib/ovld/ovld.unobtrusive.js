(function(vld) {
  let defaults = { autorun: 1 };
  const { find, attr } = vld.core;
  const attachedFlag = "ovldunobs";
  init();
  function data(elm, name, val) {
    if (val === void 0) {
      return elm.dataset[name];
    } else if (val === null) {
      delete elm.dataset[name];
    } else {
      elm.dataset[name] = val;
    }
  }
  function bind({ selector, rules, related } = { selector: "form" }) {
    let destrFuncs = [];
    find(document, selector).forEach(function(cont) {
      if (data(cont, attachedFlag)) {
        return;
      }
      data(cont, attachedFlag, 1);
      const api = vld.bind({
        subev: "submit",
        cont,
        getRules: () => {
          return mergeRules(parseRules(cont), rules);
        },
        msgCont: function({ input, name }) {
          const nodes = find(input.closest(selector), `[data-valmsg-for="${name}"]`);
          if (!nodes.length) return;
          return nodes[0];
        },
        related
      });
      destrFuncs.push(() => {
        api.destroy();
        data(cont, attachedFlag, null);
      });
    });
    return {
      destroy: () => {
        destrFuncs.forEach((f) => f());
      }
    };
  }
  function mergeRules(main, rules) {
    if (rules) {
      for (const key in rules) {
        if (main[key] != null) {
          main[key] = [...main[key], ...rules[key]];
        } else {
          main[key] = rules[key];
        }
      }
    }
    return main;
  }
  function parseRules(form) {
    const rules = {};
    function addRule(key, rule) {
      if (!rules[key]) rules[key] = [];
      rules[key].push(rule);
    }
    var dval = "data-val-";
    var dmaxlen = `${dval}maxlength`;
    var dminlen = `${dval}minlength`;
    var dmaxlenmax = dmaxlen + "-max";
    var dminlenmin = dminlen + "-min";
    find(form, `[${dmaxlenmax}]`).forEach(function(inp) {
      var max = attr(inp, dmaxlenmax);
      addRule(attr(inp, "name"), { chk: vld.rules.maxlen(max), msg: attr(inp, dmaxlen) });
    });
    find(form, `[${dminlenmin}]`).forEach(function(inp) {
      var min = attr(inp, dminlenmin);
      addRule(attr(inp, "name"), { chk: vld.rules.minlen(min), msg: attr(inp, dminlen) });
    });
    find(form, `[${dval}length]`).forEach(function(inp) {
      var min = attr(inp, `${dval}length-min`);
      var max = attr(inp, `${dval}length-max`);
      addRule(
        attr(inp, "name"),
        {
          chk: vld.rules.len({ min, max }),
          msg: attr(inp, `${dval}length`)
        }
      );
    });
    find(form, `[${dval}required]`).forEach(function(inp) {
      var name = attr(inp, "name");
      addRule(name, { chk: vld.rules.req, msg: attr(inp, `${dval}required`) });
    });
    return rules;
  }
  function validate({ cont, rules }) {
    return vld.validate({ cont, rules: mergeRules(parseRules(cont), rules) });
  }
  function setDefaults(opt) {
    defaults = Object.assign({}, defaults, opt);
  }
  function init() {
    document.addEventListener("DOMContentLoaded", function() {
      if (defaults.autorun) {
        bind();
      }
    });
    const $ = window.jQuery;
    if ($) {
      $(document).on("ovldCallBind", () => bind());
    } else {
      document.addEventListener("ovldCallBind", () => bind());
    }
  }
  vld.unobtrusive = {
    bind,
    setDefaults,
    validate
  };
})(window.ovld);
