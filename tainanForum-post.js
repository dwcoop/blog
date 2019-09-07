var editor;

function publish() {
  var insertHTML = `<div class='date-outer'><div class='post' style='margin: 15px 0;'></div></div>`;
  $(".date-outer").remove();
  $(".blog-posts").append(insertHTML);
  $(".post").eq(0).load("/p/publish.html .post-body", function() {
    $("textarea[name='CKeditor']").after(`<div id='editorGif' style='margin: 20px auto;text-align: center;'><span style='vertical-align: middle;'>Please Wait,editor is loading.....</span></div>`);
    $.getScript("https://cdn.ckeditor.com/ckeditor5/12.4.0/classic/ckeditor.js", function() {
      ClassicEditor.create(
        document.querySelector('#CKeditor')
      ).then((editorObject) => {
        editor = editorObject
        $("#CKeditor_is_loading").hide()
      }).catch((error) => {
        alert("CKeditor錯誤:" + String(error))
      })
      $("#submitPost").click(function() {
        submit()
      });
    })
  })
}

function submit() {
  var content = editor.getData(),
    title = $("#inputPostTitle").val(),
    labels = $("#selectLabel").val(),
    publishTime = new Date().toISOString(),
    name = window.AuthedUser.displayName;

  if (!title) {
    alert("請輸入文章標題！");
    return
  }
  if (content.length < 10) {
    alert("字數過少，不合格");
    return
  }

  if (content.indexOf("<img") > 0) {
    content = (
      content.substring(0, content.indexOf("<img")) +
      "<!--more-->" +
      content.substring(content.indexOf("<img"))
    )
  }

  $("#submitPost").after("<div id='submitGif' style='margin: 20px auto;text-align: center;'><img src='https://lh5.googleusercontent.com/-EyVZ0f8J0qQ/UCeEG7aa8nI/AAAAAAAADtY/9sXw53XkYXM/s512/indicator-light.gif' style='vertical-align: middle;' /><span style='vertical-align: middle;'> 傳送中...</span></div>")
  $.post('https://script.google.com/macros/s/AKfycbwq_YryQm6oviwghUxlDNxtHKfNuZmlRfBZ0YHLJ0eVhX6tGTuI/exec', {
    title: title,
    time: publishTime,
    content: content,
    labels: labels,
    name: name
  }).done(function(response) {
    response=JSON.parse(response)
    alert(response.status);
    location.href=response.link;
  }).fail(function(error) {
    alert(String(error))
  })
}
