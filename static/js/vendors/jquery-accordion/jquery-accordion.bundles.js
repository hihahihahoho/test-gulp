/*!
 * jQuery Accordion 0.0.1
 * (c) 2014 Victor Fernandez <victor@vctrfrnndz.com>
 * MIT Licensed.
 */
!function(t,n,e,i){var a={transitionSpeed:300,transitionEasing:"ease",controlElement:"[data-control]",contentElement:"[data-content]",groupElement:"[data-accordion-group]",singleOpen:!0};function o(n,e){this.element=n,this.options=t.extend({},a,e),this._defaults=a,this._name="accordion",this.init()}o.prototype.init=function(){var i,a,o,s,r=this.options,c=t(this.element),d=c.find(r.controlElement+":first"),h=c.find(r.contentElement+":first"),l=c.parents("[data-accordion]").length>0,f={"max-height":0,overflow:"hidden"},m=function(){var t=(e.body||e.documentElement).style,n="transition";if("string"==typeof t[n])return!0;var i=["Moz","webkit","Webkit","Khtml","O","ms"];n="Transition";for(var a=0;a<i.length;a++)if("string"==typeof t[i[a]+n])return!0;return!1}();function g(t,n){n?h.css({"-webkit-transition":"",transition:""}):h.css({"-webkit-transition":"max-height "+r.transitionSpeed+"ms "+r.transitionEasing,transition:"max-height "+r.transitionSpeed+"ms "+r.transitionEasing})}function u(n){var e=0;n.children().each((function(){e+=t(this).outerHeight(!0)})),n.data("oHeight",e)}function p(n,e,i,a){var o,s=n.filter(".open").find("> [data-content]"),c=s.find("[data-accordion].open > [data-content]");r.singleOpen||(c=c.not(e.siblings("[data-accordion].open").find("> [data-content]"))),o=s.add(c),n.hasClass("open")&&o.each((function(){var n=t(this).data("oHeight");switch(a){case"+":t(this).data("oHeight",n+i);break;case"-":t(this).data("oHeight",n-i);break;default:throw"updateParentHeight method needs an operation"}t(this).css("max-height",t(this).data("oHeight"))}))}function v(t){if(t.hasClass("open")){var n=t.find("> [data-content]"),e=n.find("[data-accordion].open > [data-content]"),i=n.add(e);u(i),i.css("max-height",i.data("oHeight"))}}function E(t,n){if(t.trigger("accordion.close"),m){if(l)p(t.parents("[data-accordion]"),t,n.data("oHeight"),"-");n.css(f),t.removeClass("open")}else n.css("max-height",n.data("oHeight")),n.animate(f,r.transitionSpeed),t.removeClass("open")}function H(t,e){if(t.trigger("accordion.open"),m){if(g(),l)p(t.parents("[data-accordion]"),t,e.data("oHeight"),"+");i=function(){e.css("max-height",e.data("oHeight"))},n.requestAnimationFrame?requestAnimationFrame(i):n.webkitRequestAnimationFrame?webkitRequestAnimationFrame(i):n.mozRequestAnimationFrame?mozRequestAnimationFrame(i):setTimeout(i,1e3/60),t.addClass("open")}else e.animate({"max-height":e.data("oHeight")},r.transitionSpeed,(function(){e.css({"max-height":"none"})})),t.addClass("open");var i}function x(){var n=!!r.singleOpen&&c.parents(r.groupElement).length>0;u(h),n&&function(n){n.closest(r.groupElement);var e=n.siblings("[data-accordion]").filter(".open"),i=e.find("[data-accordion]").filter(".open"),a=e.add(i);a.each((function(){var n=t(this),e=n.find(r.contentElement);E(n,e)})),a.removeClass("open")}(c),c.hasClass("open")?E(c,h):H(c,h)}h.each((function(){var n=t(this);0!=n.css("max-height")&&(n.closest("[data-accordion]").hasClass("open")?(g(),u(n),n.css("max-height",n.data("oHeight"))):n.css({"max-height":0,overflow:"hidden"}))})),c.attr("data-accordion")||(c.attr("data-accordion",""),c.find(r.controlElement).attr("data-control",""),c.find(r.contentElement).attr("data-content","")),d.on("click",x),d.on("accordion.toggle",(function(){if(r.singleOpen&&d.length>1)return!1;x()})),d.on("accordion.refresh",(function(){v(c)})),t(n).on("resize",(i=function(){v(c)},function(){var t=this,n=arguments;function e(){o||i.apply(t,n),s=null}s?clearTimeout(s):o&&i.apply(t,n),s=setTimeout(e,a||100)}))},t.fn.accordion=function(n){return this.each((function(){t.data(this,"plugin_accordion")||t.data(this,"plugin_accordion",new o(this,n))}))}}(jQuery,window,document);