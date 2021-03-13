/*!
floating-scroll v3.1.0
https://amphiluke.github.io/floating-scroll/
(c) 2020 Amphiluke
*/
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],i):i((t=t||self).jQuery)}(this,(function(t){"use strict";var i={init:function(t,i){this.orientationProps=function(t){var i="horizontal"===t;return{ORIENTATION:t,SIZE:i?"width":"height",X_SIZE:i?"height":"width",OFFSET_SIZE:i?"offsetWidth":"offsetHeight",OFFSET_X_SIZE:i?"offsetHeight":"offsetWidth",CLIENT_SIZE:i?"clientWidth":"clientHeight",CLIENT_X_SIZE:i?"clientHeight":"clientWidth",INNER_X_SIZE:i?"innerHeight":"innerWidth",SCROLL_SIZE:i?"scrollWidth":"scrollHeight",SCROLL_POS:i?"scrollLeft":"scrollTop",START:i?"left":"top",X_START:i?"top":"left",X_END:i?"bottom":"right"}}(i);var n=t.closest(".fl-scrolls-body");n.length&&(this.scrollBody=n),this.container=t[0],this.visible=!0,this.initWidget(),this.updateAPI(),this.addEventHandlers(),this.skipSyncContainer=this.skipSyncWidget=!1},initWidget:function(){var i=this.orientationProps,n=i.ORIENTATION,e=i.SIZE,o=i.SCROLL_SIZE,s=this.widget=t('<div class="fl-scrolls" data-orientation="'+n+'"></div>');t("<div></div>").appendTo(s)[e](this.container[o]),s.appendTo(this.container)},addEventHandlers:function(){var i=this;(i.eventHandlers=[{$el:i.scrollBody||t(window),handlers:{scroll:function(){i.updateAPI()},resize:function(){i.updateAPI()}}},{$el:i.widget,handlers:{scroll:function(){i.visible&&!i.skipSyncContainer&&i.syncContainer(),i.skipSyncContainer=!1}}},{$el:t(i.container),handlers:{scroll:function(){i.skipSyncWidget||i.syncWidget(),i.skipSyncWidget=!1},focusin:function(){setTimeout((function(){return i.syncWidget()}),0)},"update.fscroll":function(t){"fscroll"===t.namespace&&i.updateAPI()},"destroy.fscroll":function(t){"fscroll"===t.namespace&&i.destroyAPI()}}}]).forEach((function(t){var i=t.$el,n=t.handlers;return i.bind(n)}))},checkVisibility:function(){var t=this.widget,i=this.container,n=this.scrollBody,e=this.orientationProps,o=e.SCROLL_SIZE,s=e.OFFSET_SIZE,r=e.X_START,c=e.X_END,l=e.INNER_X_SIZE,d=e.CLIENT_X_SIZE,a=t[0][o]<=t[0][s];if(!a){var h=i.getBoundingClientRect(),f=n?n[0].getBoundingClientRect()[c]:window[l]||document.documentElement[d];a=h[c]<=f||h[r]>f}this.visible===a&&(this.visible=!a,t.toggleClass("fl-scrolls-hidden"))},syncContainer:function(){var t=this.orientationProps.SCROLL_POS,i=this.widget[0][t];this.container[t]!==i&&(this.skipSyncWidget=!0,this.container[t]=i)},syncWidget:function(){var t=this.orientationProps.SCROLL_POS,i=this.container[t];this.widget[0][t]!==i&&(this.skipSyncContainer=!0,this.widget[0][t]=i)},updateAPI:function(){var i=this.orientationProps,n=i.SIZE,e=i.X_SIZE,o=i.OFFSET_X_SIZE,s=i.CLIENT_SIZE,r=i.CLIENT_X_SIZE,c=i.SCROLL_SIZE,l=i.START,d=this.widget,a=this.container,h=this.scrollBody,f=a[s],u=a[c];d[n](f),h||d.css(l,a.getBoundingClientRect()[l]+"px"),t("div",d)[n](u),u>f&&d[e](d[0][o]-d[0][r]+1),this.syncWidget(),this.checkVisibility()},destroyAPI:function(){this.eventHandlers.forEach((function(t){var i=t.$el,n=t.handlers;return i.unbind(n)})),this.widget.remove(),this.eventHandlers=this.widget=this.container=this.scrollBody=null}};t.fn.floatingScroll=function(n,e){if(void 0===n&&(n="init"),void 0===e&&(e={}),"init"===n){var o=e.orientation,s=void 0===o?"horizontal":o;if("horizontal"!==s&&"vertical"!==s)throw new Error("Scrollbar orientation should be either “horizontal” or “vertical”");this.each((function(n,e){return Object.create(i).init(t(e),s)}))}else Object.prototype.hasOwnProperty.call(i,n+"API")&&this.trigger(n+".fscroll");return this},t(document).ready((function(){t("body [data-fl-scrolls]").each((function(i,n){var e=t(n);e.floatingScroll("init",e.data("flScrolls")||{})}))}))}));
