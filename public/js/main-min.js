var DataViz=function(){var e=10,t={loading:"Saving ...",eventSuccess:"The event has been successfully saved. Please check your mail and click on the link to publish this post",nomore:"No more results to load.",error:"Oh snap!. We got an error. Can you try again!"},n=function(e,t,n,a){$(".fixed.alert").remove(),$("body").append("<div class='"+(a?a+" ":"")+(t?"top ":"")+"fixed alert alert-success alert-dismissible fade in' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><span class='msg'>"+e+"</span></div>"),n&&setTimeout(function(){$(".fixed.alert").remove()},3e3)},a=function(){$(".form form").submit(function(e){e.preventDefault(),n(t.loading,!0,!1,"alert-info");var a={};$("form .form-control").each(function(e,t){t=$(t);var n=t.val();"datetime-local"==t.attr("type")&&(n=new Date(n)),a[t.attr("id")]=n}),$("form .form-check-input").each(function(e,t){t=$(t),a[t.attr("id")]=t.is(":checked")}),console.log(a),$(".btn-primary").addClass("disabled");var o=$("form").data("type");$.ajax({method:"POST",data:JSON.stringify(a),contentType:"application/json",url:"/save"+o}).done(function(e){$(".contentSpace .form").slideToggle(),e.indexOf("error")>-1?n(t.error,!0):n(t.eventSuccess,!0)})})},o=function(){window.location.pathname.indexOf("verify")>-1?n("The post is successfully published!"):(10==$(".contentSpace .items .item").length&&$(".contentSpace .items").append("<div class='pagingControl'> LOAD MORE...</div>"),10==$(".list .feed_item").length&&$(".list").append("<div class='pagingControl'> LOAD MORE...</div>"),$(".pagingControl").on("click",function(){var e=$(this),a,o;e.parent().hasClass("events")?(a="events",o=$(".item",e.parent()).length+1):e.parent().hasClass("opps")?(a="opps",o=$(".item",e.parent()).length+1):e.parent().hasClass("wallposts")?(a="wallposts",o=$(".item",e.parent()).length+1):e.parent().hasClass("list")&&(a="feed",o=$(".feed_item",e.parent()).length+1),o&&$.ajax({method:"POST",data:JSON.stringify({index:o}),contentType:"application/json",url:"feed"==a?"/feed":"/items/"+a}).done(function(a){a?(e.parent().append(a),$(".pagingControl",e.parent()).appendTo(e.parent())):(n(t.nomore,!1,!0,"alert-info"),$(".pagingControl",e.parent()).remove())})}))};return{init:function(){o(),a()}}}();DataViz.init();