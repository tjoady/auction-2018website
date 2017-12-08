/*  Javascript by an interaction designer. Look, it works for a couple hundred items, okay? */

$(document).ready(function() { /* TRANSITION BETWEEN CONTACTED AND NOT CONTACTED LISTS */
    $("#toggle_to_wishlist").click(function() {
        $(".solicited-container").fadeOut("800", "swing");
        $(".wishlist-container").fadeIn("800", "swing");
    });
    $("#toggle_to_solicited").click(function() {
        $(".solicited-container").fadeIn("800", "swing");
        $(".wishlist-container").fadeOut("800", "swing");
    });
    $.getJSON('https://spreadsheets.google.com/feeds/list/1sNJXzsSzy4g9jM5V7ujahbBggiOedVjBDRuRVVTZgAE/2/public/full?alt=json', function(data) {
        var count_solicited = 0;
        var count_wishlist = 0;
        $.each(data.feed.entry, function(i, v) {
            var status = v.gsx$status.$t;
            var bizname = v.gsx$profilename.$t;
            var item = v.gsx$lastyrdonation.$t;
            var owner = v.gsx$owner.$t;
            var row_style = "";
            /* SET COLOR AND STYLE OF ROW BASED ON STATUS */
            if (status === "Not donating" || status === "No response" || status === "Not taking requests" || status === "Ineligible/too late") {
                row_style = "negative";
            } else if (status === "Received" || status === "Donating" || status === "Might donate") {
                row_style = "positive";
            }
            /* IF NO ITEM, SET CLASS TO HIDE THAT TD IN TABLET SIZES AND BELOW */
            var hidingitem = "";
            if (item === "" || item === "n/a") {
                hidingitem = 'class="hidewhennarrow" ';
            }
            /* IF NO OWNER, SET CLASS TO HIDE THAT TD IN TABLET SIZES AND BELOW */
            var hidingowner = "";
            if (owner === "" || owner === "n/a") {
                hidingowner = 'class="hidewhennarrow" ';
            }
            /* IF DONOR HAS BEEN CONTACTED, WRITE OUT ROW THAT SHOWS ITEM */
            /* IF DONOR HAS NOT BEEN CONTACTED, WRITE OUT ROW THAT FOCUSES ON HOW TO CONTACT */
            if (status != "Not yet contacted") {
                count_solicited++;
                var rowcontentcontacted = '<tr class="' + row_style + '"><td class="text-center">' + count_solicited + '</td><td data-label="#' + count_solicited + '" class="flt-name-sol">' + bizname + '</td><td class="nowrap flt-status" data-label="Status">' + status + '</td><td ' + hidingitem + 'data-label="Item Donated">' + item + '</td></tr>';

                $('#solicited tbody').append(rowcontentcontacted);
            } else if (status === "Not yet contacted") {
                count_wishlist++;
                var rowcontentnotcontacted = '<tr class="' + row_style + '"><td class="text-center">' + count_wishlist + '</td><td data-label="#' + count_wishlist + '" class="flt-name-wish">' + bizname + '</td><td ' + hidingitem + 'data-label="Item Donated Last Year">' + item + '</td><td ' + hidingowner + ' data-label="Owner" class="flt-owner">' + owner + '</td></tr>';
                $('#wishlist tbody').append(rowcontentnotcontacted);
            }
        });
        $(".loader").hide();
        $('[data-toggle="popover"]').popover().click(function() {
            if ($(this).html() === "Show") {
                $(this).html("Hide").toggleClass("btn-warning");
            } else {
                $(this).html("Show").toggleClass("btn-warning");
            }
        });
    }).done(function(json) {
        var options1 = {
            valueNames: ['flt-name-sol', 'flt-status']
        };
        var donorList = new List('flt_solicited', options1);
        var options2 = {
            valueNames: ['flt-name-wish', 'flt-owner', 'flt-contact']
        };
        var wishList = new List('flt_wishlist', options2);
    });
});
