'use strict';

(function () {
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var ImageParams = {
    WIDTH: 70,
    HEIGHT: 70,
    BORDER_RADIUS: '5px'
  };

  var photoContainer = document.querySelector('.ad-form__photo-container');
  var avatarUpload = document.querySelector('#avatar');
  var imagesUpload = document.querySelector('#images');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imagesPreview = document.querySelector('.ad-form__photo');

  var setAvatar = function () {
    var file = avatarUpload.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var setDefault = function () {
    avatarPreview.src = DEFAULT_AVATAR;
    removePreviews();
  };

  var removePreviews = function () {
    var previews = photoContainer.querySelectorAll('.ad-form__photo:not(:last-of-type)');
    previews.forEach(function (preview) {
      preview.remove();
    });
  };

  var createPreview = function (image) {
    var node = imagesPreview.cloneNode(true);
    var img = document.createElement('img');
    img.src = image;
    img.width = ImageParams.WIDTH;
    img.height = ImageParams.HEIGHT;
    img.style.borderRadius = ImageParams.BORDER_RADIUS;
    node.appendChild(img);
    photoContainer.insertBefore(node, imagesPreview);
  };

  var uploadImages = function () {
    var files = Array.from(imagesUpload.files);

    files.forEach(function (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          createPreview(reader.result);
        });

        reader.readAsDataURL(file);
      }
    });
  };

  window.upload = {
    avatar: avatarUpload,
    images: imagesUpload,
    reset: setDefault,
    setAvatar: setAvatar,
    setImages: uploadImages,
  };
})();
