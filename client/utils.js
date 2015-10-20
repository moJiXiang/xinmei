// export function messageFactory(app) {
//   var clock;
//   var flush = function() {
//     app.messages = [];
//   };
//
//   var clear = function(index) {
//     clearTimeout(clock);
//     app.messages.splice(index, 1);
//     clock = setTimeout(flush, 4000);
//   };
//
//   var show = function(type, text) {
//     var msg = {type: type, text: text};
//     if (!unique(msg, app.messages)) return;
//     app.messages.push(msg);
//     var index = app.messages.length - 1;
//     setTimeout(function() {
//       clear(index);
//     }, 3000);
//   };
//   return {clear: clear, show: show, flush: flush};
// };

const install = (Vue, options)=> {
    let clock
    let messages = Vue.prototype.$messages = []
    let flush = ()=> messages = []
    let clear = (index)=> {
        clearTimeout(clock)
        messages.splice(index, 1)
        clock = setTimeout(()=> flush, 4000)
    }
    Vue.prototype.$show = (type, text)=> {
        let msg = {
            type: type,
            text: text
        }
        if (!unique(msg, messages)) return
        messages.push(msg)
        let index = messages.length - 1
        setTimeout(()=> clear(index), 3000)
    }
}

function unique(item, list) {
  return !list.some(function(data) {
    return JSON.stringify(data) === JSON.stringify(item);
  });
}

export default install
