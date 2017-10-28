var ProductsApp = function (userOptions){

	var options = $.extend({
		"callback" : false,
		"templateEl" :  $("#products-modal .products-list-item.template"),
		"selectedProduct" : false
	}, userOptions);




	var thisApp = this;

	var service = new Service({
		"frontend" :false,
		"backend" :false,
		"printRecived" : false,
		"printFrontendCallback" :false,
		"serviceURL" : 'apps/productsApp/productsApp.php',
		"secure" : false
	});


	thisApp.show = function(showOptions){
	 
	 	$.extend(options, showOptions);



	 	$("#products-modal").modal("show");

	}

/* */
	thisApp.load = function(cats, types){

$( ".fixed, .movable , .other").html("");

		service.post("load", new Array(cats, types), function(recived){
			
			thisApp.products = recived;

			$.each(thisApp.products,function(index, product){


				if(product.category == "2"){
					$( ".fixed").append(thisApp.productTemplate(product, function (){ thisApp.selectedProduct = product; options.callback(); }));
				};
				if(product.category == "3"){
					$( ".movable").append(thisApp.productTemplate(product, function (){ thisApp.selectedProduct = product;options.callback(); }));
				};
				if(product.category == "4"){
					$( ".other").append(thisApp.productTemplate(product, function (){ thisApp.selectedProduct = product;options.callback(); }));
				};

			});

		})

	}



/* */
	thisApp.productTemplate = function(product, callback){

		var t = options.templateEl.clone();

		t.find(".product-name").css("color", product.color);
		t.find(".product-name").text(product.name);
		t.find(".product-long-name").text(product.long_name);
		t.find(".product-price").text(product.price);
		t.find(".product-name").css("background-color",product.color);

	    t.on("click",function(){
	     callback(); 
	    });

		t.removeClass("template");
		return t;

	}

thisApp.save = function(){

	var data = harvestData(".product-data","product-");


		service.post("save", [data], function(rec){
thisApp.load("2,3,4", "1,2,3");

				guiApp.infoAlert(rec);

	});
	}





thisApp.init = function(){

	/* load categories an types
2,3,4 su kategorije fixed, movable... a 1,2,3 su tipovi prouozvoda 
//oni mogu biti 1 usluga 2 proizvod 3 kombinirani, ugl loadamo sve tri vrste
	*/

$("#product-details").hide();
$("#btn-save-new-product").hide();

	guiApp.registerLink("Products", function(){
		productsApp.show( {"callback" : function(){
                                           
                                              guiApp.infoAlert("Clicked on : " + thisApp.selectedProduct.id);
                                           
                                         }});
	}, "app");

  	thisApp.load('2,3,4','1,2,3');

	setTimeout(function(){
		scroll($(".products-dropdown-menu"));
	},1000)
	
scroll($("#product-details"));

thisApp.events();

}

/* */
thisApp.events = function(){

	$("#btn-products-hide").click(function(){

	 	options.callback();
	  	$("#products-modal").modal("hide");

	});
		$("#btn-new-product").click(function(){

	  	$("#products-tabs").hide();
		$("#products-pills").hide();

		$("#product-details").show();
		$("#btn-save-new-product").show();
	});
	
	$("#btn-save-new-product").click(function(){
		
		$("#products-pills").hide();
		$("#product-details").hide();
		$("#btn-save-new-product").hide();
		$("#products-tabs").show();	
		thisApp.save();	
	 

	});

}

thisApp.init();

}