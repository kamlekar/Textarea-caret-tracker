(window.trackCaret = function(Container){
    // log error when element is not passed
    if(!Container) return;


    var createElement = function(type, parent, className){
        var el = document.createElement(type);
        parent.appendChild(el);
        el.className = className;
        return el;
    },

    textarea = createElement('textarea', Container, 'caretTrackingTextarea'),
    textareaMirror = createElement('div', Container, 'textareaMirror'),
    textareaMirrorInline = createElement('span', textareaMirror, ''),
    textareaCaretTracker = createElement('div', Container, 'textareaCaretTracker'),

    update = function () {
        textareaMirrorInline.innerHTML = textarea.value.substr(0, textarea.selectionStart).replace(/\n$/, "\n\001");
        var rects = textareaMirrorInline.getClientRects(),
            lastRect = rects[rects.length - 1],
            top = lastRect.top - textarea.scrollTop,
            left = lastRect.left + lastRect.width;
        textareaCaretTracker.style.top = top + "px";
        textareaCaretTracker.style.left = left + "px";
    },
    addEvent = function(eventType){
        textarea["on" + eventType] = update;
    };

    addEvent('keyup');
    addEvent('mouseup');
    addEvent('scroll');
})();