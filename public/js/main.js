var DataViz = (function(){

	var pagingStep = 10;
	var msgs = {
		"loading" : "Saving ...",
		"eventSuccess" : "The event has been successfully saved. "
	}

	var submitEvent = function(){
		$(".form form").submit(function( event ) {
		  event.preventDefault();
		  $(".contentSpace .alert").fadeIn().text(msgs.loading);
		  var obj = {};
		  //All input boxes
		  $("form .form-control").each(function(i,el){
		  	el = $(el);
		  	var val = el.val();
		  	if(el.attr("type") == "datetime-local"){
		  		val = new Date(val);
		  	}
		  	obj[el.attr("id")] = val;
		  });
		  //All checkboxes
		  $("form .form-check-input").each(function(i,el){
		  	el = $(el);
		  	obj[el.attr("id")] =  el.is(':checked');
		  });

		  console.log(obj);
		  $(".btn-primary").addClass("disabled");
		  var type = $("form").data("type");
		  $.ajax({
		     method: "POST",
		     data: JSON.stringify(obj),
		     contentType: 'application/json',
		     url: "/save" +type,
		   })
		   .done(function( msg ) {
		 	$(".contentSpace .form").slideToggle();
		 	if(msg.indexOf("error")>-1){
		 		$(".contentSpace .alert").html(msgs.eventSuccess);
		 	}else{
		 		$(".contentSpace .alert").html(msgs.eventSuccess+". Please check your mail to and click on the link to publish this post.");
		 	}
		 });
		});
	}

	//This is where I add the load more button to every list.
	var initialisePaging = function(){
		if(window.location.pathname.indexOf("verify")>-1){
			$(".contentSpace .items,.list").append("<div class='alert alert-success alert-dismissible fade in' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>The post is successfully published!</div>");	
		}else{
			if($(".contentSpace .items .item").length == 10){
				$(".contentSpace .items").append("<div class='pagingControl'> LOAD MORE...</div>");	
			}
			if($(".list .feed_item").length == 10){
				$(".list").append("<div class='pagingControl'> LOAD MORE...</div>");	
			}
			$(".pagingControl").on("click",function(){
				var el = $(this);
				var type, index;
				if(el.parent().hasClass("events")){
					type="events";
					index = $(".item",el.parent()).length+1;
				}else if(el.parent().hasClass("opps")){
					type="opps";
					index = $(".item",el.parent()).length+1;
				}else if(el.parent().hasClass("list")){
					type = "feed";
					index = $(".feed_item",el.parent()).length+1;
				}
				if(index){
					$.ajax({
					  method: "POST",
					  data: JSON.stringify({"index" : index }),
					  contentType: 'application/json',
					  url: "/"+type,
					})
					.done(function( html ) {
						el.parent().append(html);
						$(".pagingControl",el.parent()).appendTo(el.parent());
					});
				}
			});
		}
	};
	return {
		init : function(){
			initialisePaging();
			submitEvent();
		}	
	}
})();

DataViz.init();