function clearForm(e) {
    $("#PINbox").val("");
}

function submitForm(e) {
    if (e.value == "") {
        alert("Enter a PIN");
    } else {
        alert("Your PIN has been sent! - " + e.value);
        data = {
                pin: e.value
            }
            /*		
            apiCall( data, function( r ) {
            	$( "#logo" ).attr( "src", r.site_logo );
            	$( ".title-msg" ).text( r.site_msg );
            	accent = r.accent;
            	$( ".accent-bg" ).css( "background-color", accent );
            });
            */

        $("#PINbox").val("");
    };
};

/*
function apiCall( post, callback ) {	
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "admin/api.php",
		data: JSON.stringify( post ),
		dataType: "json",
		success: function ( r ) {
			callback( r );
		},
		error: function ( response ) {
			console.log( response )
		},
	});
}
*/