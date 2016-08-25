$(function(){
  $('.file-input').on('change', function(){
    var preview = $('.image-preview')[0];
    var file    = $('.file-input')[0].files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  })

  $('#file-select').on('click', function(){
    $('.file-input').trigger('click');
  })

  $('form').on('submit', function(e){
    e.preventDefault();
    var data = new FormData($('form')[0]);
    $.ajax({
      type: 'POST',
      url: '/upload',
      contentType: false,
      data: data,
      processData: false,
      error: function(err) {
        console.log(err);
      },
      success: function(data) {
        getImages();
      }
    });

  })

  function getImages () {
    $.ajax({
      type: 'GET',
      url: '/images',
      error: function(err) {
        console.log(err);
      },
      success: function(data) {
        if (data.length > 0) {
          var j = 0;
          $('.column').empty();
          if (data.length === 1) {
            $($('.column')[1]).append('<div class="image-frame img-thumbnail"><img src="'+data[0].src+'" class="image"><p class="image-subtext">'+data[0].title+'</p></div>');
          }
          for (var i = data.length - 1; i >= 0; i--) {
            var v = data[i];
            $($('.column')[j % 3]).append('<div class="image-frame img-thumbnail"><img src="'+v.src+'" class="image"><p class="image-subtext">'+v.title+'</p></div>');
            j += 1;
          }
        }
      }
    });
  }
  getImages();
})
