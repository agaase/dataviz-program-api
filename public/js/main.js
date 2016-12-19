var DataViz = (function(){

	var pagingStep = 10;
	var msgs = {
		"loading" : "Saving ...",
		"eventSuccess" : "The event has been successfully saved. Please check your mail and click on the link to publish this post",
		"nomore" : "No more results to load.",
		"error" : "Oh snap!. We got an error. Can you try again!"
	}

	var showAlert = function(msg,toTop,selfRemove,customClass){
		$(".fixed.alert").remove();
		$("body").append("<div class='"+(customClass ? (customClass+" ") :  "")+(toTop ? "top ": "")+"fixed alert alert-success alert-dismissible fade in' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><span class='msg'>"+msg+"</span></div>");
		if(selfRemove){
			setTimeout(function(){
				$(".fixed.alert").remove();	
			},3000);
			
		}
	}
	var submitEvent = function(){
		$(".form form").submit(function( event ) {
		  event.preventDefault();
		  showAlert(msgs.loading,true,false, "alert-info");
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
		 		showAlert(msgs.error,true);
		 	}else{
		 		showAlert(msgs.eventSuccess,true);
		 	}
		 });
		});
	}

	//This is where I add the load more button to every list.
	var initialisePaging = function(){
		if(window.location.pathname.indexOf("verify")>-1){
			showAlert("The post is successfully published!");
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
				}else if(el.parent().hasClass("wallposts")){
					type="wallposts";
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
					  url: type == "feed" ? "/feed" : "/items/"+type,
					})
					.done(function( html ) {
						if(!html){
							showAlert(msgs.nomore,false,true,"alert-info");
							$(".pagingControl",el.parent()).remove();
						}else{
							el.parent().append(html);
							$(".pagingControl",el.parent()).appendTo(el.parent());
						}
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