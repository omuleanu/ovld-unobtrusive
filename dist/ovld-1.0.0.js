window.ovld = /* @__PURE__ */ function($) {
  const inputFilter = "[name]:not(:checkbox)";
  const changeEvents = "change input";
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
  function validateCont({ opt, cont, event }) {
    let result = {};
    $(cont).find(inputFilter).each(function() {
      const input = $(this);
      const checkRes = chkInp(opt, input, event);
      if (checkRes && Object.keys(checkRes).length > 0) {
        result = { ...result, ...checkRes };
      }
    });
    return result;
  }
  function chkInp(opt, input, event) {
    if (opt.ignore && opt.ignore(input) || ovld.ignore(input)) return;
    const name = input.attr("name");
    if (!name) return;
    const res = {};
    if (opt.tched) {
      opt.tched[name] = input;
    }
    res[name] = { input, rules: chkRulesFor({ opt, name, event, input }) };
    const related = opt.related;
    if (opt.tched && related) {
      $.each(related[name], function(_, rname) {
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
    $.each(rls, function(_, rule) {
      var checkRes = rule.chk({ v: input.val(), event, input, name });
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
      msgc.empty();
      if (!rules2 || !rules2.length) ;
      else if (msgc.is("[data-valmsg-replace]")) {
        msgc.addClass("field-validation-error").removeClass("field-validation-valid");
        msgc.html(rules2[0].msg);
      } else {
        msgc.append('<div class="field-validation-error">' + rules2[0].msg + "</div>");
      }
    });
  }
  function isResValid(res) {
    return !Object.values(res).some(({ rules: rules2 }) => rules2.length);
  }
  return {
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
      const conts = opt.cont || $(opt.selector);
      conts.on(changeEvents, inputFilter, onInput);
      if (opt.subev) {
        conts.on(opt.subev, onSubmit);
      }
      function onInput(e) {
        const input = $(this);
        const type = input.attr("type");
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
          conts.off(changeEvents, onInput);
          conts.off(opt.subev, onSubmit);
        }
      };
    }
  };
}(jQuery);
