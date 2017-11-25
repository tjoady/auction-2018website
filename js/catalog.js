// Javascript by an interaction designer. Look, it works for a couple hundred items, okay?

$( document ).ready(function() {
	$.getJSON('https://spreadsheets.google.com/feeds/list/12ODBLQHDmHIH8eibuKagguV-sADUePlR5uX7-ddZDVE/1/public/full?alt=json',function(data){
		var count=0;
		if ( $('#confirmed').length ) {
			// Write out the list of confirmed donations
			$.each(data.feed.entry,function(i,v){
				if ( (v.gsx$solicitationstatus.$t == "Donating" || v.gsx$solicitationstatus.$t == "Item received") && (v.gsx$ok4website.$t == "Y") ) {
					var url = v.gsx$website.$t;
					var bizname = v.gsx$businessname.$t;
					var donatedby = v.gsx$donatedby.$t;
					var donatedby_snippet = "";
					var tangiblesnippet = "";
					var bundlesnippet = "";
					var featuredsnippet = "";
					var featuredindicator = "";
					var donbylssnippet = "";
					var donbylsindicator = "";
					// Create the URL
					if ( (url != "") && (url != "n/a") ) {
						var shortUrl = url.replace('http://', '');
						finalUrl = shortUrl.replace('https://', '');
						bizname = "<a href=\"http://"+finalUrl+"\" target=\"_blank\">"+bizname+"</a>";
					}
					// Add an extra line if someone donated something from another business
					if (donatedby != "") {
						donatedby_snippet = '<p class="item-donor">Donor: '+donatedby+'</p>';
					}					
					// Snippet containing boolean data attributes
					if (v.gsx$tangible.$t == 'Y') {tangiblesnippet = ' data-tangible="y"';}
					if (v.gsx$bundle.$t == 'Y') {bundlesnippet = ' data-bundle="y"';}
					if (v.gsx$featured.$t == 'Y') {
						featuredsnippet = ' data-featured="y"';
						featuredindicator = '<span class="sr-only">Live auction item</span><span class="glyphicon glyphicon-star margin-r-5" aria-hidden="true" title="Live auction item"></span>';
					}
					if (v.gsx$donbyls.$t == 'Y') {
						donbylssnippet = ' data-donbyls="y"';
						donbylsindicator = '<span class="sr-only">Donated by Lakeshore community member</span><span class="glyphicon glyphicon-heart" aria-hidden="true" title="Donated by Lakeshore community member"></span>';
					}
					count++;
					// If there is special item status, show it
					var special_item_snippet = "";
					if (featuredindicator != "" || donbylsindicator != "") {
						var special_item_snippet = '<div class="special-items">'+featuredindicator+donbylsindicator+'</div>';
					}
					// If there is a description, show it
					var item_desc_snippet="";
					if (v.gsx$desc.$t != "") {
						item_desc_snippet = '<p class="item-desc">'+v.gsx$desc.$t+'</p>';
					}
					// If there is an expiration date, show it
					var item_expdate_snippet="";
					if (v.gsx$expdate.$t != "") {
						item_expdate_snippet = '<p class="item-expdate"><strong>Expires:</strong> '+v.gsx$expdate.$t+'</p>';
					}
					// If there are restrictions, show them
					var item_restrictions_snippet="";
					if (v.gsx$restrictions.$t != "") {
						item_restrictions_snippet = '<p class="item-restrictions"><strong>Restrictions:</strong> '+v.gsx$restrictions.$t+'</p>';
					}
					// If there is a pic, show it
					var item_pic_snippet="";
					if (v.gsx$picurl.$t != "") {
						item_pic_snippet = '<div class="item-pic margin-t-10"><image class="center-block" src="images/items/'+v.gsx$picurl.$t+'"></div>';
					}
					// Starting bid snippet
					// '<br />Starts at '+v.gsx$startingbid.$t+'
					
					// Write out item and append to item div
					var data = '<div data-cat="'+v.gsx$category.$t+'"'+bundlesnippet+featuredsnippet+tangiblesnippet+donbylssnippet+'>';
					data += '<div class="panel panel-default panel-auctionitem">';
					data += '<div class="panel-heading"><span class="item-num">#'+v.gsx$itemnum.$t+'</span>'+v.gsx$title.$t+'</div>';
					data += '<div class="panel-body">'+ special_item_snippet +'<p class="item-donor">'+bizname+'</p>'+donatedby_snippet+'<p class="item-cat">'+v.gsx$category.$t+'</p>'+item_desc_snippet+item_expdate_snippet+item_restrictions_snippet+item_pic_snippet+'</div>';
					data += '<div class="panel-footer">Worth: '+v.gsx$worth.$t+'</div></div></div>';
					$('#confirmed').append(data);
				}
			});
			$(".loader").hide();
			
			// Initialize the filter dropdown values
			var filter_category="no_filter";
			var filter_tangible="no_filter";
			function reset_filter_values() {
				filter_category="no_filter";
				filter_tangible="no_filter";
			}
			// Reset all filters to default
			function reset_filters() {
				$("#input_filter_cat").val("no_filter");
				$("#input_filter_tangible").val("no_filter");
				$('#is_bundle').prop( "checked", false );
				$('#is_featured').prop( "checked", false );
				$('#is_ls_donation').prop( "checked", false );
				reset_filter_values();
			}
			reset_filters();
			
			// When each filter dropdown changes, set the filter value and call the filter function
			$("#input_filter_cat").change(function() {
				filter_category = $(this).find("option:selected").val();
				filter_the_list();
			});
			$("#input_filter_tangible").change(function() {
				filter_tangible = $(this).find("option:selected").val();
				filter_the_list();
			});
			$('#is_bundle').click(function() {
				filter_the_list();
			});
			$('#is_featured').click(function() {
				filter_the_list();
			});
			$('#is_ls_donation').click(function() {
				filter_the_list();
			});
			
			// Perform the filter
			function filter_the_list() {
				var category_piece="";
				var tangible_piece="";
				var bundle_piece="";
				var featured_piece="";
				var ls_donation_piece="";
				if (filter_category!="no_filter") {
					var category_piece="[data-cat='"+filter_category+"']";
				}
				if (filter_tangible == 'y') {
					var tangible_piece="[data-tangible='y']";
				} else if (filter_tangible == 'n') {
					var tangible_piece="[data-tangible!='y']";
				}
				if ($("#is_bundle").is(':checked')) {
					var bundle_piece="[data-bundle='y']";
				}
				if ($("#is_featured").is(':checked')) {
					var featured_piece="[data-featured='y']";
				}
				if ($("#is_ls_donation").is(':checked')) {
					var ls_donation_piece="[data-donbyls='y']";
				}
				if (category_piece+tangible_piece == "" && !$("#is_bundle").is(':checked') && !$("#is_featured").is(':checked') && !$("#is_ls_donation").is(':checked')) {
					restore_the_list();
				} else {
					$('#confirmed > div').hide();
					var items_to_show = $('#confirmed').find(category_piece+tangible_piece+bundle_piece+featured_piece+ls_donation_piece);
					if (items_to_show.length == 0) {
						$(".empty_list_message").show();
					} else {
						$(".empty_list_message").hide();
						items_to_show.show();
					}
					console.log('Num results: '+items_to_show.length);
				}
			}
			
			// Start over if empty list message is clicked
			$(".empty_list_message a").click(function() {
				reset_filters();
				restore_the_list();
			});
			
			// Restore full list - cancel filter
			function restore_the_list() {
				$(".empty_list_message").hide();
				$('#confirmed > div').show();
			}			
		}
	});
});

