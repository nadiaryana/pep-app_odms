conn = new Mongo();
db = conn.getDB("ssc");
db.ticket_tmp.findOne().items[0].objects.forEach(function(doc) {
	db.tickets.update({id:doc.id}, doc, {upsert:true});
})
db.assignee.find({}).forEach(function(doc) {
	//var pa = db.pa.findOne({PERS_AREA:doc.pers_area},{PERS_AREA:1,PERS_AREA_TEXT:1,_id:0});
	//var psa = db.psa.findOne({PERS_AREA:doc.pers_area,PERS_SUBAREA:doc.pers_subarea},{PERS_SUBAREA:1,PERS_SUBAREA_TEXT:1,_id:0});
	var group = db.groups.findOne({name:doc.group},{_id:0});
	if(group != null) {
		db.tickets.update({
			"assignee.loginId":doc.loginId+"@pep.pertamina.com","assignee.customFields.group":{$exists:false}
		},{$set:
			{
			"assignee.customFields.group":{name:group.name,index:group.index}
			}
		},{
			multi:true
		});
		db.tickets.update({
			"assignee.loginId":doc.loginId+"@pertamina.com","assignee.customFields.group":{$exists:false}
		},{$set:
			{
			"assignee.customFields.group":{name:group.name,index:group.index}
			}
		},{
			multi:true
		});
	}
})
db.psa.find({}).forEach(function(psa) {
	var pa = db.pa.findOne({PERS_AREA:psa.PERS_AREA},{PERS_AREA:1,PERS_AREA_TEXT:1,_id:0});
	if(pa != null) {
		db.tickets.update({
			"customer.site.name":psa.PERS_AREA+" - "+psa.PERS_SUBAREA,"customer.customFields.pa":{$exists:false}
		},{$set:
			{
			"customer.customFields.pa":pa,"customer.customFields.psa":{PERS_SUBAREA:psa.PERS_SUBAREA,PERS_SUBAREA_TEXT:psa.PERS_SUBAREA_TEXT}
			}
		},{
			multi:true
		})
	}
})
