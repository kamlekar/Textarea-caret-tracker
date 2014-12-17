function getTextAreaXandY(e) {

    // Don't do anything if key pressed is left arrow
    if (e.which == 37) return;     
    
    // Save selection start
    var selection = $(this).getSelection();
    var index = selection.start;

    //alert(selection.start);
    //alert(selection.end);
    // Copy text to div
    $(this).blur();
    $("div").text($(this).val());

    // Get current character
    $(this).setSelection(index, index + 1);
    currentcharacter = $(this).getSelection().text;

    // Get previous character
    $(this).setSelection(index - 1, index)
    previouscharacter = $(this).getSelection().text;

    // rangy.createRange()
    // function createRange(i){
    //     i=i||document;
    //     return createNativeRange(i);
    // }
    // function createNativeRange(i) {
    //     i = i || document;
    //     return i.createRange()
    // }

    var start, endchar;
    var end = 0;
    var range = rangy.createRange();


    // If current or previous character is a space or a line break, find the next word and wrap it in a span
    var linebreak = previouscharacter.match(/(\r\n|\n|\r)/gm) == undefined ? false : true;
    
    if (previouscharacter == ' ' || currentcharacter == ' ' || linebreak) {
        i = index + 1; // Start at the end of the current space        
        while (endchar != ' ' && end < $(this).val().length) {
            i++;
            $(this).setSelection(i, i + 1)
            var sel = $(this).getSelection();
            endchar = sel.text;
            end = sel.start;
        }

        range.setStart($("div")[0].childNodes[0], index);
        range.setEnd($("div")[0].childNodes[0], end);
        var nextword = range.toHtml();
        range.deleteContents();
        var position = $("<span id='nextword'>" + nextword + "</span>")[0];
        range.insertNode(position);
        var nextwordtop = $("#nextword").position().top;
    }

    // Insert `#caret` at the position of the caret
    range.setStart($("div")[0].childNodes[0], index);
    var caret = $("<span id='caret'></span>")[0];
    range.insertNode(caret);
    var carettop = $("#caret").position().top;

    // If preceding character is a space, wrap it in a span
    if (previouscharacter == ' ') {
        range.setStart($("div")[0].childNodes[0], index - 1);
        range.setEnd($("div")[0].childNodes[0], index);
        var prevchar = $("<span id='prevchar'></span>")[0];
        range.insertNode(prevchar);
        var prevchartop = $("#prevchar").position().top;
    }

    // Set textarea selection back to selection start
    $(this).focus();
    $(this).setSelection(selection.start, selection.end);

    // If the top value of the previous character span is not equal to the top value of the next word,
    // there must have been some wrapping going on, the previous character was a space, so the wrapping
    // would have occured after this space, its safe to assume that the left and top value of `#nextword`
    // indicate the caret position
    if (prevchartop != undefined && prevchartop != nextwordtop) {
        $("label").text('X: ' + $("#nextword").position().left + 'px, Y: ' + $("#nextword").position().top);
        $('ul').css('left', ($("#nextword").position().left) + 'px');
        $('ul').css('top', ($("#nextword").position().top + 13) + 'px');
    }
    // if not, then there was no wrapping, we can take the left and the top value from `#caret`    
    else {
        $("label").text('X: ' + $("#caret").position().left + 'px, Y: ' + $("#caret").position().top);
        $('ul').css('left', ($("#caret").position().left) + 'px');
        $('ul').css('top', ($("#caret").position().top + 14) + 'px');
    }

    $('ul').css('display', 'block');

}

$("textarea").click(getTextAreaXandY);
$("textarea").keyup(getTextAreaXandY);