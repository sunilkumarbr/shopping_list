$('#item').focus();

$(window).resize(function() {
    $('.header').css('width', $(window).width());
    $('.headText').css('margin', 'auto');
});

/**********************add-to-cart button functionality*****************/

$('#submit').on('click', function() {
    var item = $('#item');
    quantity = $('#quantity');
    if (!item.val().match(/^[a-zA-Z][a-zA-Z ]*$/) || !quantity.val().match(/^[1-9][0-9]*$/)) {
        if (!item.val().match(/^[a-zA-Z][a-zA-Z ]*$/)) {
            $('.valid').css('display', 'block');
            $('#massage').text('Item name should not contain number or special charecter or empty');
            item.focus();
            return false;
        } else {
            $('.valid').css('display', 'block');
            $('#massage').text('quantity  should not contain alphabets or special charecter or empty');
            quantity.focus();
            return false;
        }

        return false;
    }
    else
    $('.valid').css('display', 'none');
});

$('.close1').on('click',function(){
	$('.valid').css('display', 'none');
});

var delid;

/**********************alert for delete*****************/

function Alert(content) {

    windowWidth = $(window).width();
    windowHeight = $(window).height();
    $('#alert').css('top', '20px').css('left', windowWidth / 2 - 150);
    $('#alertText').text(content);

}

/**********************alert for update*****************/

function Alert2(content) {

    windowWidth = $(window).width();
    windowHeight = $(window).height();
    $('#alert2').css('top', '20px').css('left', windowWidth / 2 - 150);
    $('#alertText2').text(content);

}

/**********************delete button functionality*****************/

$('button.delete').on('click', function() {
    delid = $(this)[0].id;
    Alert('Do you want to delet this item from list..?');
    $('#alertbackground').css('display', 'block');
    $('#alert').css('display', 'block');

    $('#alertYse').on('click', function() {
        $('#alert').css('display', 'none');
        $('#alertbackground').css('display', 'none');
        $.post("/modify", {
            deleteid: delid
        }, function(d, s) {
            if (s === 'success')
                window.location.href = '/';
        });

    });

    $('#alertNo').on('click', function() {
        $('#alert').css('display', 'none');
        $('#alertbackground').css('display', 'none');

    });
    return false;

});

/**********************remove all button functionality*****************/

$('button#deleteall').on('click', function(e) {
    Alert2('Do you want to remove everything from list..?');
    $('#alertbackground2').css('display', 'block');
    $('#alert2').css('display', 'block');

    $('button#alertYse2').on('click', function() {
        $('#alert2').css('display', 'none');
        $('#alertbackground2').css('display', 'none');
        $.post("/removeall", function(d, s) {
            if (s === 'success')
                window.location.href = '/';
        });
    });

    $('button#alertNo2').on('click', function() {
        $('#alert2').css('display', 'none');
        $('#alertbackground2').css('display', 'none');

    });

    return false;
});

/**********************update button functionality*****************/

up1id = $('.up1')[0].id;

$('button.update').on('click', function() {

    if ($(this)[0].id === up1id) {


        if (!$('#tableitem')[0].value.match(/^[a-zA-Z][a-zA-Z ]*$/) || !$('#tablequantity')[0].value.match(/^[1-9][0-9]*$/)) {
            if (!$('#tableitem')[0].value.match(/^[a-zA-Z][a-zA-Z ]*$/)) {
                $('.valid').css('display', 'block');
                $('#massage').text('Item name should not contain number or special charecter or empty');
                // $('#tableitem')[0].focus();
                return false;
            } else if (!$('#tablequantity')[0].value.match(/^[1-9]+$/)) {
                $('.valid').css('display', 'block');
                $('#massage').text('quantity  should not contain alphabets or special charecter or empty');
                // $('#tablequantity')[0].focus();
                return false;
            }

            
        } else {
            $('.valid').css('display', 'none');
            $.post("/update", {
                item: $('#tableitem')[0].value,
                quantity: $('#tablequantity')[0].value,
                hidden: up1id,
                row: '1'
            }, function(d, s) {
                if (s === 'success')
                    window.location.href = '/';
            });
            return false;
        }
    } else {

        item = $(this).parent().parent().children()[0].item;
        quantity = $(this).parent().parent().children()[0].quantity;


        if (!item.value.match(/^[a-zA-Z][a-zA-Z ]*$/) || !quantity.value.match(/^[1-9][0-9]*$/)) {
            if (!item.value.match(/^[a-zA-Z][a-zA-Z ]*$/)) {
                $('.valid').css('display', 'block');
                $('#massage').text('Item name should not contain number or special charecter or empty');
                // item.focus();
                return false;
            } else {
                $('.valid').css('display', 'block');
                $('#massage').text('quantity should not contain alphabets or special charecter or empty');
                // quantity.focus();
                return false;
            }

        
        }
        else
        $('.valid').css('display', 'none');

    }
});