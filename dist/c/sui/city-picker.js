define("/WEB-UED/fancy/dist/c/sui/city-picker",[],function(require,exports,module){+function($){"use strict";var format=function(data){for(var result=[],i=0;i<data.length;i++){var d=data[i];"请选择"!==d.name&&result.push(d.name)}return result.length?result:[""]},sub=function(data){return data.sub?format(data.sub):[""]},getCities=function(d){for(var i=0;i<raw.length;i++)if(raw[i].name===d)return sub(raw[i]);return[""]},getDistricts=function(p,c){for(var i=0;i<raw.length;i++)if(raw[i].name===p)for(var j=0;j<raw[i].sub.length;j++)if(raw[i].sub[j].name===c)return sub(raw[i].sub[j]);return[""]},raw=$.smConfig.rawCitiesData,provinces=raw.map(function(d){return d.name}),initCities=sub(raw[0]),initDistricts=[""],currentProvince=provinces[0],currentCity=initCities[0],defaults=(initDistricts[0],{cssClass:"city-picker",rotateEffect:!1,onChange:function(picker,values,displayValues){var newCity,newProvince=picker.cols[0].value;if(newProvince!==currentProvince){var newCities=getCities(newProvince);newCity=newCities[0];var newDistricts=getDistricts(newProvince,newCity);return picker.cols[1].replaceValues(newCities),picker.cols[2].replaceValues(newDistricts),currentProvince=newProvince,currentCity=newCity,void picker.updateValue()}newCity=picker.cols[1].value,newCity!==currentCity&&(picker.cols[2].replaceValues(getDistricts(newProvince,newCity)),currentCity=newCity,picker.updateValue())},cols:[{values:provinces,cssClass:"col-province"},{values:initCities,cssClass:"col-city"},{values:initDistricts,cssClass:"col-district"}]});$.fn.cityPicker=function(params){return this.each(function(){if(this){var p=$.extend(defaults,params),val=$(this).val();val&&(p.value=val.split(" "),p.value[0]&&(p.cols[1].values=getCities(p.value[0])),p.value[1]?p.cols[2].values=getDistricts(p.value[0],p.value[1]):p.cols[2].values=getDistricts(p.value[0],p.cols[1].values[0])),$(this).picker(p)}})}}(Zepto)});