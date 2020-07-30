import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // .filter('mentioHighlight', function() {
      function escapeRegexp (queryToEscape) {
          return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
      }

      return function (matchItem, query, hightlightClass) { ////console.log(matchItem, query, hightlightClass);
        // //  if (query) {
        //       const replaceText = hightlightClass ?
        //                        '<span class="' + hightlightClass + '">$&</span>' :
        //                        '<strong>$&</strong>';
        //       return ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), replaceText);
          // } else {
          //     return matchItem;
          // }
      };
  // });
  }

}
