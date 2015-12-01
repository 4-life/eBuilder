'use strict';

module.exports = {
    sourceDir: '_source',
	presentation: {
        lang:      "RU",
		brand:     "Infonova",
		nl_PID:    "brandPID",
        presName:  "P",
		slideName: "S"
	},
	slides: [
		{num: 1},
		{num: 2},
		{num: 3},
		{num: 4},
		{num: 5}
        
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