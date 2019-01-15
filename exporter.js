// ==UserScript==
// @name       Movescount Batch Exporter
// @namespace  http://alexbr.com
// @version    0.3
// @description  Batch export moves from Movescount. Based on http://userscripts-mirror.org/scripts/show/155662
// @match      http://*.movescount.com/summary
// @include    htt*://*.movescount.com/summary
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js
// ==/UserScript==
(function() {
  'use strict';
  /* global _ */
  /* global $ */

  function exportMoves(format) {
    const moveIds = [];
    const wins = [];

    $('a[data-id^="move-"] i.active').each(function() {
      moveIds.push($(this).parent().attr('data-id').substring(5));
    });

    if (moveIds.length &&
        confirm(`This will export ${moveIds.length} in format ${format}. Press Ok to export or Cancel to abort.`)) {
      _.each(moveIds, function(moveId) {
        const urlstring = `http://www.movescount.com/move/export?id=${moveId}&format=`;
        if (format === 'all') {
          _.forOwn(formats, function(f) {
            if (f !== 'all') {
              try {
                wins.push(window.open(urlstring + f));
              } catch (err) {
                window.alert(`Error: ${err}`);
              }
            }
          });
        } else {
          try {
            wins.push(window.open(urlstring + format));
          } catch (err) {
            window.alert(`Error: ${err}`);
          }
        }
      });
    } else {
      window.alert('Cancelled!');
    }
  }

  const formats = {
    GPX: 'gpx',
    KML: 'kml',
    XLSX: 'xlsx',
    FIT: 'fit',
    TCX: 'tcx',
    'All Formats': 'all',
  };

  const toolsItem = $(`
<div id="batchExporter">
  <ul class="menu--list menu--hover menu--right menu--padding">
    <li>
      <a class="link link--light middle-all"><i class="icon-210 icon-text size-12"></i><span>Tools</span></a>
      <ul class="padding">
        <li id="exportMove" data-toolbar-show="view" class="hidden-phone toolbar-button_export">
          <ul id="exportList" class="grid--with-margins"></ul>
        </li>
      </ul>
    </li>
  </ul>
</div>`);

  setInterval(function() {
    const addMove = $('a[data-action="addPlannedMove"]');
    const sentinel = addMove.closest('div').parent().children('div#batchExporter');
    if (!sentinel || sentinel.length === 0) {
      addMove.closest('div').parent().append(toolsItem);
      _.forOwn(formats, (format, name) => {
        const div = $('<li class="row-margin"></li>');
        const link = $(`<a data-export-format="${format}" class="link exportMove">Export selected as ${name}.</a>`);
        link.click(() => {
          exportMoves(format);
          return false;
        });
        div.append(link);
        toolsItem.find('ul#exportList').append(div);
      });
    }
  }, 1000);
})();
