'use strict';

/*!

*/


module.exports = {
    sourceDir: __dirname,
	presentation: {
        lang:          'RU',
		brand:         'brand',
		nl_PID:        'nl_PID',
        presentPrefix: 'P',
		slidePrefix:   'S'
	},
	slides: [
		{num: 1},
		{num: 2},
		{num: 3},
		//{num: 4, assets: [], isFile: false, copy: 1},
        
	],
	template: {
		settings: { 
			// КАРТА ПРЕЗЕНТАЦИИ. "p_pres" и "p_slide" для вертикальных визитов
			map : {
				"1":{
					"slides": [1,2,3,4,5]
				}
			}, 	
			
			// ПРИВЯЗКА ВСЕХ ССЫЛОК К КЛАССАМ. class - классы, к которым цепляются переходы ////////////////////////	
			links : [
			]
			
		}
	}
}