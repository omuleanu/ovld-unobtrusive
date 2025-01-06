(function($, vld) {
  let defaults = { autorun: 1 };
  const attachedFlag = "ovldunobs";
  function bind({ selector, rules, related } = { selector: "form" }) {
    let destrFuncs = [];
    $(selector).each(function() {
      const cont = $(this);
      if (cont.data(attachedFlag)) return;
      cont.data(attachedFlag, 1);
      const api = vld.bind({
        subev: "submit",
        cont,
        getRules: () => {
          return mergeRules(parseRules(cont), rules);
        },
        msgCont: function({ input, name }) {
          return $(input).closest(selector).find(`[data-valmsg-for="${name}"]`);
        },
        related
      });
      destrFuncs.push(() => {
        api.destroy();
        cont.data(attachedFlag, null);
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
    form = $(form);
    function addRule(key, rule) {
      if (!rules[key]) rules[key] = [];
      rules[key].push(rule);
    }
    var dval = "data-val-";
    var dmaxlen = `${dval}maxlength`;
    var dminlen = `${dval}minlength`;
    var dmaxlenmax = dmaxlen + "-max";
    var dminlenmin = dminlen + "-min";
    form.find(`[${dmaxlenmax}]`).each(function() {
      var max = $(this).attr(dmaxlenmax);
      addRule($(this).attr("name"), { chk: vld.rules.maxlen(max), msg: $(this).attr(dmaxlen) });
    });
    form.find(`[${dminlenmin}]`).each(function() {
      var min = $(this).attr(dminlenmin);
      addRule($(this).attr("name"), { chk: vld.rules.minlen(min), msg: $(this).attr(dminlen) });
    });
    form.find(`[${dval}length]`).each(function() {
      var inp = $(this);
      var min = inp.attr(`${dval}length-min`);
      var max = inp.attr(`${dval}length-max`);
      addRule(
        inp.attr("name"),
        {
          chk: vld.rules.len({ min, max }),
          msg: inp.attr(`${dval}length`)
        }
      );
    });
    form.find(`[${dval}required]`).each(function() {
      var name = $(this).attr("name");
      addRule(name, { chk: vld.rules.req, msg: $(this).attr(`${dval}required`) });
    });
    return rules;
  }
  function validate({ cont, rules }) {
    return vld.validate({ cont, rules: mergeRules(parseRules(cont), rules) });
  }
  function setDefaults(opt) {
    defaults = Object.assign({}, defaults, opt);
  }
  $(function() {
    if (defaults.autorun) {
      bind();
    }
  });
  const unobtrusive = {
    bind,
    setDefaults,
    validate
  };
  vld.unobtrusive = unobtrusive;
})(jQuery, ovld);
