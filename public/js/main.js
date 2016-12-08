var DataViz = (function(){

	var pagingStep = 10;
	var msgs = {
		"loading" : "Saving ...",
		"eventSuccess" : "The event has been successfully saved. "
	}

	var submitEvent = function(){
		$("#eventForm").submit(function( event ) {
		  event.preventDefault();
		  $(".contentSpace .alert").fadeIn().text(msgs.loading);
		  var obj = {
		  	"title" : $("#title").val(),
		  	"startDate" : $("#startDate").val(),
		  	"endDate" : $("#endDate").val(),
		  	"descr" : $("#descr").val(),
		  	"location" : $("#location").val(),
		  	"link" : $("#link").val(),
		  } 
		  console.log(obj);

		  $(".btn-primary").addClass("disabled");
		   $.ajax({
			  method: "POST",
			  data: JSON.stringify(obj),
			  contentType: 'application/json',
			  url: "/formsubmit",
			})
			.done(function( msg ) {
				$(".contentSpace .form").slideToggle();
				if(msg.indexOf("error")>-1){
					$(".contentSpace .alert").html(msgs.eventSuccess);
				}else{
					$(".contentSpace .alert").html(msgs.eventSuccess+".Please click this  <a href='/event/verify/"+msg+"'>link</a> to verify");
				}
			    
			});
		});
	}

	//This is where I add the load more button to every list.
	var initialisePaging = function(){
		if(window.location.pathname.indexOf("verify")>-1){
			$(".contentSpace .items,.list").append("<div class='alert alert-success alert-dismissible fade in' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>The post is successfully published!</div>");	
		}else{
			$(".contentSpace .items,.list").append("<div class='pagingControl'> LOAD MORE...</div>");	
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