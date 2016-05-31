//Transfers service used to communicate Transfers REST endpoints
(function () {
  'use strict';

  angular
    .module('transfers')
    .factory('BlodTypeResolverService', BlodTypeResolverService);

  BlodTypeResolverService.$inject = [];

  function BlodTypeResolverService() {
  	var names = {};
			names["zero_minus"] = "0-";
			names["zero_plus"] = "0+";
			names["A_plus"] = "A+";
			names["A_minus"] = "A-";
			names["B_plus"] = "B+";
			names["B_minus"] = "B-";
			names["AB_plus"] = "AB+";
			names["AB_minus"] = "AB-";


	var keys = {};
			keys["0+"] = "zero_plus";
			keys["0-"] = "zero_minus";
			keys["A+"] = "A_plus";
			keys["A-"] = "A_minus";
			keys["B+"] = "B_plus";
			keys["B-"] = "B_minus";
			keys["AB+"] = "AB_plus";
			keys["AB-"] = "AB_minus";
    var resolver = {
    	
    		names: names,
    		keys: keys,
			resolve_name: function resolve_name(key){
				return names[key];
			},
			resolve_key:function resolve_key(name){
				return keys[name];
			}
    };
    return resolver;
  }
})();
