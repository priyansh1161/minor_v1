

$('document').ready(function () {
    $(".button-collapse").sideNav();
    $(document).ready(function() {
        $('#signUp-form').submit(function(e) {
            e.preventDefault();
            var $input = $(this)[0];
            var formData = {};
           for(var i=0; i < $input.length - 1; i++){
               formData[$input[i].id] = $input[i].value;
           }
           console.log(formData);
           $.ajax({
               method: 'POST',
               url : '/signup',
               data : formData,
               success : function (res) {
                   $('#xhr-response').text(res.msg);
               },
               error : function (xhr) {
                   // console.log(xhr);
                   $('#xhr-response').text(xhr.responseText);
               }
           })
        });
    });
});