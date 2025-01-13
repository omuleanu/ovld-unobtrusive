# ovld unobtrusive validation
Unobtrusive client validation for asp.net core mvc
(can be used instead of jquery.validate + jquery.validate.unobtrusive)

## Installation
Add the [scripts](https://github.com/omuleanu/ovld-unobtrusive/tree/main/dist) to your page:
```
<script src="~/lib/ovld/ovld.js"></script>
<script src="~/lib/ovld/ovld.unobtrusive.js"></script>
```
## Manually call unobtrusive validation
On page load all `form` tags will be bound to automatically, but you can also call the bind manually, for example:
```
ovld.unobtrusive.bind();
```
## Turn off automatic bind on page load
```
ovld.unobtrusive.setDefaults({ autorun: false });
```
## Add additional client rules 
Besides the validation rules parsed from the unobtrusive html attributes, we can add additional validation rules:
```
// turn off automatic binding
ovld.unobtrusive.setDefaults({ autorun: false });`

// bind manually 
const boundApi = ovld.unobtrusive.bind({
      selector: 'form',
      { Name: [{chk: noAsdf, msg:'Name can\'t contain asdf'}] }
  });

// rule: value can't contain 'asdf' string
function noAsdf({v}) {
    return v.indexOf('asdf') !== -1;
}
```
## Unbind client validation
```
const boundApi = ovld.unobtrusive.bind({...});

// call destroy later if necessary
boundApi.destroy();
```
## Related editors
We can make certain editors related, so that when we change the value of one the other is also checked, e.g. Password and ConfirmPassword, example:
```
const boundApi = ovld.unobtrusive.bind({
        selector: '#f1 form',
        rules,

        // when checking `Name`, rules of `Name1` will also be checked
        // when checking NumA, rules of NumC will also be checked
        related: {
            "Name": ["Name1"],
            "NumA": ["NumC"],
            "NumB": ["NumC"],
        }
    });

// value must equal the editor with name=Name
function sameAsName({v, input }) {
    let nameVal = find(input.closest('form'), '[name=Name]')[0].value;
    return v != nameVal;
}

// value must be equal to editor with name=NumA + name=NumB
function sumOfNumbers({v, input}){
    const form = input.closest('form');
    const numA = parseInt(find(form, '[name=NumA]')[0].value, 10);
    const numB = parseInt(find(form, '[name=NumB]')[0].value, 10);

    if (parseInt(v, 10) !== numA + numB){
        return {
            msg: `${numA} + ${numB} != ${v}`
        };
    }
}
```
![CustomRules](https://github.com/user-attachments/assets/08ece984-57c8-463f-b1fd-3ff85f9c1fd2)

see [custom rules page](https://github.com/omuleanu/ovld-unobtrusive/blob/main/samples/OvldUnobsVld1/OvldUnobsVld1/Views/Home/CustomRules.cshtml) for example
## Using ovld directly without unobtrusive attributes
```
ovld.bind({
  subev: 'submit', // submit event, a custom event can be used
  selector: '#mydiv',
  //cont: myElm // alternative to selector
  rules:{
    'Name': [
              { chk:ovld.rules.req, msg:'The Name field is required.' },
              { chk: ovld.rules.len({ max: 50, min: 3 }), msg: 'Length must be between 3 and 50' }
           ],
    'Date': [{ chk: ovld.rules.req, msg: 'The Date field is required.' }, ],
  },

  // container relative to the input where to put or clear the validation message
  msgCont: function(o) {
            const nodes = o.input.closest('.awe-row').querySelector('[vld-for=' + o.name + ']');
            if(nodes.length) return nodes[0];
        }
});
```
## Ignore certain editors
Example, ignore editors whose name starts with 'abc' (add this script after you've referenced ovld.js)
```
ovld.ignore = function(input){
    if(input.getAttribute('name').startsWith('abc')){
        return true;
    }
}
```
---
Live example here: https://demo.aspnetawesome.com/Unobtrusive 
(also reason this was created)

ovld.js used directly (without unobtrusive) for client validation of inline editing grid rows:
https://demo.aspnetawesome.com/GridInlineClientValidation

