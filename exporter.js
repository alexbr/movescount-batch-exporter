// ==UserScript==
// @name       Movescount Batch Exporter
// @namespace  http://alexbr.com
// @version    0.1
// @description  Batch export moves from Movescount. Based on http://userscripts-mirror.org/scripts/show/155662
// @match      http://*.movescount.com/summary
// @include    htt*://*.movescount.com/summary
// @copyright  2015, AlexR
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @require https://raw.github.com/lodash/lodash/3.10.0/lodash.min.js
// ==/UserScript==
function exportMoves(format) {
    var moveIds = [];
    var wins = [];
    $('a[data-id^="move-"] i.active').each(function() {
        moveIds.push($(this).parent().attr('data-id').substring(5));
    });

    if (confirm("This will export " + moveIds.length + " in format: " + format + ". Press Ok to export or Cancel to abort.")) {
        _.each(moveIds, function(moveId) {
            var urlstring = 'http://www.movescount.com/move/export?id=' + moveId + '&format=';
            if (format === 'all') {                              
                _.forOwn(formats, function(f) {
                    if (f !== 'all') {
                        try {                    
                            wins.push(window.open(urlstring + f));
                        } catch (err) {
                            window.alert("Error: " + err.toString );
                        }
                    }
                });
            } else {     
                try {
                    wins.push(window.open(urlstring + format));
                } catch (err) {
                    window.alert("Error: " + err.toString);
                }
            }
        });
    } else {
        window.alert("Cancelled!");
    }
}

var formats = {
    GPX: 'gpx',
    KML: 'kml',
    XLSX: 'xlsx',
    FIT: 'fit',
    TCX: 'tcx',
    'All Formats': 'all',
};

setInterval(function() {    
    var toolsItem = $('a[data-action="toggleShowPastPlannedMoves"]');
    var sentinel = toolsItem.closest('ul').children('li.batchExporter');
    if (!sentinel || sentinel.length === 0) {
        _.forOwn(formats, function(format, name) {    
            var li = $('<li class="batchExporter"></li>');
            var link = $('<a style="text-align: left;">Export selected as ' + name + '.</a>');
            link.click(function() {
                exportMoves(format);
                return false; 
            });
            li.append(link);
            toolsItem.closest('li').before(li);
        });
    }
}, 1000);
